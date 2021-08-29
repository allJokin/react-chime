import React from "react";
import { useMeetingManager } from "amazon-chime-sdk-component-library-react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import MeetingsPage from "./routes/meetings/MeetingsPage";
import MeetingNewPage from "./routes/meetings/MeetingNewPage";
import MeetingPage from "./routes/meetings/MeetingPage";

const Div = styled.div`
  width: 100%;
  height: 100%;
`;

function App() {
  const meetingManager = useMeetingManager();
  console.log(process.env.REACT_APP_ENDPOINT);
  const joinMeeting = async () => {
    // Fetch the meeting and attendee data from your server application
    const response = await fetch(`${process.env.REACT_APP_ENDPOINT}meeting`);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
    const joinData = {
      meetingInfo: data.Meeting,
      attendeeInfo: data.Attendee,
    };

    // Use join API to create a MeetingSession using the above data
    await meetingManager.join(joinData);

    // At this point you could let users setup their devices, or by default
    // the SDK will select the first device in the list for the kind indicated
    // by `deviceLabels` (the default value is DeviceLabels.AudioAndVideo)

    // Start the session to join the meeting
    await meetingManager.start();
  };
  return (
    <Router>
      <Switch>
        <Route path="/meetings/:id">
          <MeetingPage />
        </Route>
        <Route path="/meetings/new">
          <MeetingNewPage />
        </Route>
        <Route path="/meetings">
          <MeetingsPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
