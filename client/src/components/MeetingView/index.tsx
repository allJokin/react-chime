import {
  VideoTileGrid,
  useLocalVideo,
} from "amazon-chime-sdk-component-library-react";
import styled from "styled-components";

const Div = styled.div`
  width: 100%;
  height: 100%;
`;

const MeetingView = () => {
  const { toggleVideo } = useLocalVideo();
  return (
    <Div>
      <VideoTileGrid />
      <button onClick={toggleVideo}>ボタン</button>
    </Div>
  );
};

export default MeetingView;
