import "source-map-support/register";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import * as AWS from "aws-sdk";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const chime = new AWS.Chime({ region: "us-east-1" });
const client = process.env.IS_OFFLINE
  ? new DynamoDBClient({
      region: "localhost",
      endpoint: "http://localhost:8000",
    })
  : new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const meetingTableName = process.env.MEETING_TABLE_NAME;

export const handler: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event.queryStringParameters);
  if (
    !event.queryStringParameters ||
    !event.queryStringParameters.meetingId ||
    !event.queryStringParameters.username
  ) {
    return {
      statusCode: 500,
      body: "meetingId or username not found",
    };
  }
  const { meetingId, username } = event.queryStringParameters;
  try {
    const meetings = await getMeeting(meetingId);
    const attendee = await chime
      .createAttendee({
        MeetingId: meetingId,
        ExternalUserId: username,
      })
      .promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        Meeting: meetings,
        Attendee: attendee,
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify(err, Object.getOwnPropertyNames(err)),
    };
  }
};

const getMeeting = async (meetingId: string): Promise<any> => {
  const command = new GetCommand({
    TableName: meetingTableName,
    Key: { meetingId },
  });

  const item = (await docClient.send(command)).Item;

  return item && { Meeting: item.Meeting };
};
