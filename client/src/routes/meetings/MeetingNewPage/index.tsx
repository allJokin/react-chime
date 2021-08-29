import React, { useCallback, useEffect, useState } from "react";
import { useAsyncCallback } from "react-async-hook";

type Meeting = {
  meetingId: string;
};

const postMeeting = async (title: string) =>
  (
    await fetch(`${process.env.REACT_APP_ENDPOINT}meetings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    })
  ).json();

const MeetingNewPage: React.VFC = () => {
  const [state, setState] = useState({
    title: "",
  });
  const handleClick: (event: MouseEvent) => Promise<Meeting> = useCallback(
    async (event) => {
      event.preventDefault();
      return postMeeting(state.title);
    },
    [state]
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
  const asyncOnClick = useAsyncCallback<Meeting>(handleClick);
  console.log(asyncOnClick.result);

  useEffect(() => {});
  return (
    <div>
      <h1>ミーティング作成</h1>
      <form>
        <div>
          <label htmlFor="title">タイトル</label>
          <input
            type="text"
            name="title"
            id="title"
            value={state.title}
            onChange={handleChange}
          />
          <button onClick={asyncOnClick.execute}>登録</button>
        </div>
      </form>
      {asyncOnClick.result && <p>{asyncOnClick.result.meetingId}</p>}
    </div>
  );
};

export default MeetingNewPage;
