import {
  VideoTileGrid,
  useLocalVideo,
} from "amazon-chime-sdk-component-library-react";

const MeetingView = () => {
  const { toggleVideo } = useLocalVideo();
  return (
    <>
      <VideoTileGrid />
      <button onClick={toggleVideo}>ボタン</button>
    </>
  );
};

export default MeetingView;
