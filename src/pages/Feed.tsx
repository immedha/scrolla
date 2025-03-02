import { useSelector } from "react-redux";
import { selectVideos } from "../store/user/userSlice";
import VideoPlayer from "../components/VideoPlayer";

const Feed = () => {
  const videos = useSelector(selectVideos);

  if (!videos.length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Feed</h1>
      <VideoPlayer videos={videos} origVideoIdx={0} swipeType={'vertical'}/>
    </div>
  );
}
export default Feed;