import { useMeetingManager } from "amazon-chime-sdk-component-library-react";
import React, { useCallback, useState } from "react";
import { useAsyncCallback } from "react-async-hook";
import { useParams } from "react-router-dom";
import MeetingView from "../../../components/MeetingView";

type MeetingPageParams = {
  id: string;
};

const MeetingPage: React.VFC = () => {
  const { id } = useParams<MeetingPageParams>();
  const [state, setState] = useState({
    username: "",
  });
  const meetingManager = useMeetingManager();
  const handleClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void> = useCallback(
    async (event) => {
      event.preventDefault();
      const params = new URLSearchParams({
        meetingId: id,
        username: state.username,
      });
      const url = new URL(`${process.env.REACT_APP_ENDPOINT}join?`);
      url.search = params.toString();

      const data = await (await fetch(url.toString())).json();
      console.log(JSON.stringify(data, null, 2));
      const joinData = {
        meetingInfo: data.Meeting,
        attendeeInfo: data.Attendee,
      };
      await meetingManager.join(joinData);
      await meetingManager.start();
    },
    [state, id, meetingManager]
  );
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setState({
        ...state,
        [event.target.id]: event.target.value,
      });
    },
    [state, setState]
  );
  const asyncOnClick = useAsyncCallback(handleClick);

  const meeting = asyncOnClick.result;

  return (
    <>
      <h1>ミーティング詳細</h1>
      <div>{JSON.stringify(meeting)}</div>
      <form>
        <div>
          <label htmlFor="username">ユーザー名</label>
          <input
            type="text"
            name="username"
            id="username"
            value={state.username}
            onChange={handleChange}
          />
        </div>
        <button onClick={asyncOnClick.execute}>参加</button>
      </form>
      <MeetingView></MeetingView>
    </>
  );
};

export default MeetingPage;
