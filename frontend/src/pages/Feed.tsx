import { useSelector } from "react-redux";
import { selectVideos } from "../store/user/userSlice";
import VideoPlayer from "../components/VideoPlayer";
import { useState } from "react";

const Feed = () => {
  const videos = useSelector(selectVideos);
  const [currentVideoIndex, _setCurrentVideoIndex] = useState(0);

  if (!videos.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-6xl mb-4">📺</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Videos Yet</h2>
        <p className="text-gray-600">
          Upload some PDFs to start generating engaging video content
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto relative">
      <VideoPlayer 
        videos={videos} 
        origVideoIdx={currentVideoIndex} 
      />
    </div>
  );
};

export default Feed;