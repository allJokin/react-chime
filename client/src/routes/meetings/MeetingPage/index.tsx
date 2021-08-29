import React from "react";
import { useAsync } from "react-async-hook";
import { useParams } from "react-router-dom";

type MeetingPageParams = {
  id: string;
};

type Meeting = {
  Meeting: any;
};

const fetchMeeting = async (id: string) =>
  (await fetch(`${process.env.REACT_APP_ENDPOINT}meetings/${id}`)).json();

const MeetingPage: React.VFC = () => {
  const { id } = useParams<MeetingPageParams>();
  const asyncMeetings = useAsync<Meeting>(fetchMeeting, [id]);
  const meeting = asyncMeetings.result;

  return (
    <div>
      <h1>ミーティング詳細</h1>
      <div>{JSON.stringify(meeting)}</div>
    </div>
  );
};

export default MeetingPage;
