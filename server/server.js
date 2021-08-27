const express = require("express");
const app = express();
const cors = require("cors");
const port = 8080;
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const chime = new AWS.Chime({ region: "us-east-1" });

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/meeting", async (req, res) => {
  const params = {
    ClientRequestToken: uuidv4(),
    MediaRegion: "ap-northeast-1",
    ExternalMeetingId: "タイトル",
  };
  const meeting = await chime.createMeeting(params).promise();
  console.log(JSON.stringify(meeting, null, 2));
  // Create new attendee for the meeting
  console.info("Adding new attendee");
  const attendee = await chime
    .createAttendee({
      MeetingId: meeting.Meeting.MeetingId,
      ExternalUserId: "テスト",
    })
    .promise();
  res.send(
    JSON.stringify({
      Meeting: meeting,
      Attendee: attendee,
    })
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
