import "source-map-support/register";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import * as AWS from "aws-sdk";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

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
  const body = JSON.parse(event.body);
  if (!body || !body.title) {
    return {
      statusCode: 500,
      body: "title not found",
    };
  }
  const { title } = body;
  const requestId = uuidv4();
  const region = process.env.AWS_REGION;
  try {
    const { Meeting } = await chime
      .createMeeting({
        ClientRequestToken: requestId,
        MediaRegion: region,
        ExternalMeetingId: title,
      })
      .promise();
    await putMeeting(Meeting);
    const meetingId = Meeting.MeetingId; // meeting ID of the new meeting
    return {
      statusCode: 200,
      body: JSON.stringify({
        Meeting,
        meetingId,
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

const putMeeting = async (meeting: AWS.Chime.Meeting): Promise<void> => {
  const command = new PutCommand({
    TableName: meetingTableName,
    Item: { meetingId: meeting.MeetingId, Meeting: meeting },
  });

  docClient.send(command);
};
