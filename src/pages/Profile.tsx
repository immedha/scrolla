import { useSelector, useDispatch } from "react-redux";
import { selectUserName, selectVideos, selectProfilePic } from "../store/user/userSlice";
import { useMemo, useState, useRef } from "react";
import { BackIcon, CameraIcon } from "../components/Icons";
import VideoPlayer from "../components/VideoPlayer";
import { setProfilePicAction } from "../store/user/userActions";

const Profile = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videos = useSelector(selectVideos);
  const userName: string = useSelector(selectUserName) || '';
  const profilePic = useSelector(selectProfilePic);
  const lowercaseUserName = useMemo(() => userName.replace(/\s+/g, '').toLowerCase(), [userName]);
  const [viewVideoIdx, setViewVideoIdx] = useState<number | null>(null);

  const handleProfilePicClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(setProfilePicAction(reader.result as string));
      };
      reader.readAsDataURL(file);
    }
  };

  if (viewVideoIdx !== null) {
    return (
      <div className="max-w-2xl mx-auto bg-[#1a0942]">
        {/* Header */}
        <div className="bg-[#1a0942]/95 backdrop-blur-sm">
          <div className="flex items-center p-4">
            <button 
              onClick={() => setViewVideoIdx(null)} 
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <BackIcon className="w-6 h-6 text-white" />
            </button>
            <div className="ml-4">
              <h2 className="text-white font-medium">Liked Videos</h2>
              <p className="text-sm text-white/60">
                {viewVideoIdx + 1} of {videos.filter(video => video.liked).length}
              </p>
            </div>
          </div>
        </div>

        {/* Video Container */}
        <div className="relative w-full">
          <VideoPlayer 
            videos={videos.filter(video => video.liked)} 
            origVideoIdx={viewVideoIdx} 
            swipeType="horizontal"
          />

          {/* Navigation Hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
            <div className="px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full">
              <p className="text-white/70 text-sm">
                Swipe left or right to navigate
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0942] to-[#000b3c] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="flex items-center gap-8 mb-12">
          <div 
            className="relative w-28 h-28 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1 cursor-pointer group"
            onClick={handleProfilePicClick}
          >
            <div className="w-full h-full rounded-full bg-black overflow-hidden">
              <img
                src={profilePic || "/default-profile.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <CameraIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePicChange}
            />
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{userName}</h1>
            <p className="text-gray-400">@{lowercaseUserName}</p>
          </div>

          <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:opacity-90 transition-all duration-300 shadow-lg">
            Upgrade to Premium
          </button>
        </div>

        {/* Liked Videos Section */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-8">Liked Videos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {videos.filter(video => video.liked).map((video, index) => (
              <div
                key={index}
                onClick={() => setViewVideoIdx(index)}
                className="group aspect-video bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden cursor-pointer hover:bg-white/20 transition-all duration-300"
              >
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-white/90 text-center group-hover:scale-105 transition-transform">
                    {video.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {videos.filter(video => video.liked).length === 0 && (
            <div className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-purple-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">
                No liked videos yet
              </h3>
              <p className="text-gray-400">
                Videos you like will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;