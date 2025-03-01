import { useSelector } from "react-redux";
import { selectUserName, selectVideos } from "../store/user/userSlice";
import { useMemo } from "react";

const Profile = () => {
  const videos = useSelector(selectVideos);
  const userName: string = useSelector(selectUserName) || '';
  const lowercaseUserName = useMemo(() => userName.replace(/\s+/g, '').toLowerCase(), [userName]);

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-6">
      <div className="flex items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden mr-4">
          <img
            src="profile-pic-placeholder.png"
            alt="Profile"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold">{userName}</h1>
          <p className="text-sm text-gray-600">@{lowercaseUserName}</p>
        </div>
      </div>

      <button className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 mb-6">
        Switch to Premium
      </button>

      <div className="w-full mb-6">
        <h2 className="text-2xl font-semibold mb-4">Liked Videos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
          {videos.map((video, index) => (
            <div
              key={index}
              className="bg-gray-300 h-48 w-full rounded-lg flex items-center justify-center text-center text-white"
            >
              {video.title}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Profile;