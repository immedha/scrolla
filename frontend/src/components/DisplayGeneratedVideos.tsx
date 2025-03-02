import { useDispatch, useSelector } from "react-redux";
import { selectNewlyGeneratedVideos } from "../store/global/globalSlice";
import { Video } from "../store/storeStates";
import { saveGeneratedVideosAction } from "../store/user/userActions";
import { selectUserId } from "../store/user/userSlice";
import { useNavigate } from "react-router-dom";
import { BackIcon } from "./Icons";
import { useState } from "react";
import VideoPlayer from "./VideoPlayer";

interface DisplayGeneratedVideosProps {
  setGenerationState: (state: 'idle' | 'uploading' | 'generating' | 'generated') => void;
}

const DisplayGeneratedVideos = ({ setGenerationState }: DisplayGeneratedVideosProps) => {
  const newlyGeneratedVideos = useSelector(selectNewlyGeneratedVideos);
  const userId = useSelector(selectUserId) || '';
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [viewVideoIdx, setViewVideoIdx] = useState<number | null>(null);

  const saveVideos = () => {
    dispatch(saveGeneratedVideosAction({ userId, videos: newlyGeneratedVideos }));
    navigate('/');
  }

  if (viewVideoIdx !== null) {
    return (
      <div>
        <button onClick={() => setViewVideoIdx(null)} className="p-2 rounded-full hover:bg-gray-200">
          <BackIcon />
        </button>
        <VideoPlayer videos={newlyGeneratedVideos} origVideoIdx={viewVideoIdx} swipeType="horizontal"/>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] p-4 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Your Generated Reels
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {newlyGeneratedVideos.map((video, index) => (
            <div
              key={index}
              onClick={() => setViewVideoIdx(index)}
              className="group relative aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <p className="text-gray-800 font-medium text-center group-hover:text-purple-900 transition-colors">
                  {video.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => setGenerationState('idle')}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Generate More
          </button>
          <button
            onClick={saveVideos}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
          >
            Save All Reels
          </button>
        </div>
      </div>
    </div>
  );
}

export default DisplayGeneratedVideos;