import React from "react";
import { useAsync } from "react-async-hook";

type Meeting = {
  meetingId: string;
};

const fetchMeetings = async () =>
  (await fetch(`${process.env.REACT_APP_ENDPOINT}meetings`)).json();
const MeetingsPage: React.VFC = () => {
  const asyncMeetings = useAsync<Meeting[]>(fetchMeetings, []);
  const meetings = asyncMeetings.result ? asyncMeetings.result : [];
  console.log(meetings);
  return (
    <div>
      <h1>ミーティング一覧</h1>
      <ul>
        {meetings.map((meeting) => {
          return <li key={meeting.meetingId}>{meeting.meetingId}</li>;
        })}
      </ul>
    </div>
  );
};

export default MeetingsPage;
