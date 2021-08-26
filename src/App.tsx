import React from "react";
import { useMeetingManager } from "amazon-chime-sdk-component-library-react";

function App() {
  const meetingManager = useMeetingManager();
  const joinMeeting = async () => {
    // Fetch the meeting and attendee data from your server application
    const response = await fetch("/my-server");
    const data = await response.json();

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
  return <div className="App"></div>;
}

export default App;
