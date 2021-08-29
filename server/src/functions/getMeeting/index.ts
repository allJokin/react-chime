import "source-map-support/register";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

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
  const path = event.pathParameters;
  if (!path || !path.id) {
    return {
      statusCode: 500,
      body: "id not found",
    };
  }
  const id = path.id;
  try {
    const meeting = await getMeeting(id);
    return {
      statusCode: 200,
      body: JSON.stringify(meeting),
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
