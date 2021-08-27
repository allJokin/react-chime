import "source-map-support/register";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = process.env.IS_OFFLINE
  ? new DynamoDBClient({
      region: "localhost",
      endpoint: "http://localhost:8000",
    })
  : new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const meetingTableName = process.env.MEETING_TABLE_NAME;

export const handler: Handler = async (
  _event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const meetings = await getMeetings();
    return {
      statusCode: 200,
      body: JSON.stringify({
        meetings,
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

const getMeetings = async (): Promise<any> => {
  const command = new ScanCommand({
    TableName: meetingTableName,
  });

  return (await docClient.send(command)).Items;
};
