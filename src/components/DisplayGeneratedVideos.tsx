import { useDispatch, useSelector } from "react-redux";
import { selectNewlyGeneratedVideos } from "../store/global/globalSlice";
import { Video } from "../store/storeStates";
import { saveGeneratedVideosAction } from "../store/user/userActions";
import { selectUserId } from "../store/user/userSlice";
import { useNavigate } from "react-router-dom";
import { BackIcon } from "./Icons";

interface DisplayGeneratedVideosProps {
  setGenerationState: (state: 'idle' | 'uploading' | 'generating' | 'generated') => void;
}

const DisplayGeneratedVideos = ({ setGenerationState}: DisplayGeneratedVideosProps) => {
  const newlyGeneratedVideos: Video[] = useSelector(selectNewlyGeneratedVideos);
  const userId = useSelector(selectUserId) || '';
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const saveVideos = () => {
    dispatch(saveGeneratedVideosAction({ userId, videos: newlyGeneratedVideos }));
    navigate('/');
  }

  return (
    <div>
      <button onClick={() => setGenerationState('idle')} className="p-2 rounded-full hover:bg-gray-200">
        <BackIcon />
      </button>
      <div className="w-full mb-6">
        <h2 className="text-2xl font-semibold mb-4">Liked Videos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
          {newlyGeneratedVideos.map((video, index) => (
            <div
              key={index}
              className="bg-gray-300 h-48 w-full rounded-lg flex items-center justify-center text-center text-white"
            >
              {video.title}
            </div>
          ))}
        </div>
      </div>
    <button onClick={saveVideos}>Save</button>
    </div>
  );
}

export default DisplayGeneratedVideos;