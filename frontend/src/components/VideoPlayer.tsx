import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Pause, Play, Heart, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Video } from "../store/storeStates";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId } from "../store/user/userSlice";
import { setLikedVideoAction } from "../store/user/userActions";

interface VideoPlayerProps {
  origVideoIdx: number;
  videos: Video[];
  allowModify?: boolean;
}

const VideoPlayer = ({ videos, origVideoIdx, allowModify }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPauseIcon, setShowPauseIcon] = useState<'pause' | 'play' | null>(null);
  const [currVideoIdx, setCurrVideoIdx] = useState(origVideoIdx);
  const dispatch = useDispatch();
  const userId: string = useSelector(selectUserId) || '';

  const handleToggleLikeVideo = () => {
    dispatch(setLikedVideoAction({ userId, videoIdx: currVideoIdx, liked: !videos[currVideoIdx].liked }));
  }
  console.log('rerending');

  const isScrolling = useRef(false); // Prevents excessive scroll events

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      if (isScrolling.current) return; // Prevent spam scrolling

      // Set a cooldown time to prevent rapid scrolls
      isScrolling.current = true;
      setTimeout(() => {
        isScrolling.current = false;
      }, 800); // Adjust the cooldown time (in ms) to control sensitivity

      // Scroll sensitivity threshold (prevents tiny scrolls from triggering)
      // if (Math.abs(event.deltaY) < 20) return;

      if (event.deltaY > 0 && currVideoIdx < videos.length - 1) {
        setCurrVideoIdx((prev) => prev + 1);
      } else if (event.deltaY < 0 && currVideoIdx > 0) {
        setCurrVideoIdx((prev) => prev - 1);
      }
    };

    const feedEl = feedRef.current;
    if (feedEl) feedEl.addEventListener("wheel", handleScroll);

    return () => {
      if (feedEl) feedEl.removeEventListener("wheel", handleScroll);
    };
  }, [currVideoIdx]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    let pauseOrPlay: 'pause' | 'play' = 'pause';

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
      pauseOrPlay = 'play';
    }
    setIsPlaying(!isPlaying);

    setShowPauseIcon(pauseOrPlay);
    setTimeout(() => setShowPauseIcon(null), 500);
  };

  return (
    <div
      className="relative w-full h-full bg-black rounded-xl overflow-hidden"
      ref={feedRef}
    >
      <motion.video
        ref={videoRef}
        src={videos[currVideoIdx].videoUrl}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay={true}
        loop
        muted={isMuted}
        playsInline
        onClick={togglePlayPause}
      />

      <AnimatePresence>
        {showPauseIcon !== null && (
          <motion.div
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {showPauseIcon === 'play' ? (
              <Play size={80} className="text-white bg-black bg-opacity-50 rounded-full p-4" />
            ) : (
              <Pause size={80} className="text-white bg-black bg-opacity-50 rounded-full p-4" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls overlay */}
      <div className="absolute left-0 bottom-0 right-0 p-4 flex flex-col gap-4">
        {/* Video info */}
        <div className="flex-1 text-white">
          <h3 className="text-lg font-semibold">{videos[currVideoIdx].title}</h3>
          <p className="text-sm opacity-90">{videos[currVideoIdx].category}</p>
        </div>

        {/* Bottom controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 hover:bg-white/10 rounded-full cursor-pointer"
          >
            {isMuted ? <VolumeX size={24} color="white" /> : <Volume2 size={24} color="white" />}
          </button>
          <button
            onClick={handleToggleLikeVideo}
            disabled={allowModify === false}
            className="p-2 hover:bg-white/10 rounded-full cursor-pointer"
          >
            <motion.div
              key={videos[currVideoIdx].liked ? "liked" : "unliked"}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {videos[currVideoIdx].liked ? (
                <Heart size={24} color="red" fill="red" />
              ) : (
                <Heart size={24} color="white" />
              )}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        <button
          onClick={() => setCurrVideoIdx(currVideoIdx - 1)}
          className={`p-2 rounded-full bg-black/20 backdrop-blur-sm transition-all ${
            currVideoIdx === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-black/40'
          }`}
          disabled={currVideoIdx === 0}
        >
          <ChevronUp className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={() => setCurrVideoIdx(currVideoIdx + 1)}
          className={`p-2 rounded-full bg-black/20 backdrop-blur-sm transition-all ${
            currVideoIdx === videos.length - 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-black/40'
          }`}
          disabled={currVideoIdx === videos.length - 1}
        >
          <ChevronDown className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
