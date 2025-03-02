import { useRef, useState } from "react";
import { Volume2, VolumeX, Pause, Play, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Video } from "../store/storeStates";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId } from "../store/user/userSlice";
import { setLikedVideoAction } from "../store/user/userActions";

interface VideoPlayerProps {
  origVideoIdx: number;
  videos: Video[];
  swipeType: 'vertical' | 'horizontal';
}

const VideoPlayer = ({ videos, origVideoIdx, swipeType }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPauseIcon, setShowPauseIcon] = useState<'pause' | 'play' | null>(null);
  const [currVideoIdx, setCurrVideoIdx] = useState(origVideoIdx);
  const dispatch = useDispatch();
  const userId: string = useSelector(selectUserId) || '';

  const startX = useRef(0); // Keep track of starting X position for swipe
  const startY = useRef(0); // Keep track of starting Y position for swipe
  const isDragging = useRef(false); // Track if mouse is dragging

  const handleToggleLikeVideo = () => {
    dispatch(setLikedVideoAction({ userId, videoIdx: currVideoIdx, liked: !videos[currVideoIdx].liked }));
  }

  // Mouse down event handler
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    startX.current = 'touches' in e ? e.touches[0].clientX : e.clientX; // Get touch or mouse X position
    startY.current = 'touches' in e ? e.touches[0].clientY : e.clientY; // Get touch or mouse Y position
  };

  // Mouse move event handler
  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return;

    const moveX = 'touches' in e ? e.touches[0].clientX - startX.current : e.clientX - startX.current; // Calculate horizontal movement
    const moveY = 'touches' in e ? e.touches[0].clientY - startY.current : e.clientY - startY.current; // Calculate vertical movement

    // Swipe left
    if (moveX < -100 && swipeType === 'horizontal') {
      if (currVideoIdx < videos.length - 1) {
        setCurrVideoIdx(currVideoIdx + 1);
        isDragging.current = false;
      }
    } 
    // Swipe right
    else if (moveX > 100 && swipeType === 'horizontal') {
      if (currVideoIdx > 0) {
        setCurrVideoIdx(currVideoIdx - 1);
        isDragging.current = false;
      }
    }
    // Swipe down
    else if (moveY > 100 && swipeType === 'vertical') {
      if (currVideoIdx < videos.length - 1) {
        setCurrVideoIdx(currVideoIdx + 1); // Move to the next video
        isDragging.current = false; // Stop dragging after the swipe
      }
    }
    // Swipe up
    else if (moveY < -100 && swipeType === 'vertical') {
      if (currVideoIdx > 0) {
        setCurrVideoIdx(currVideoIdx - 1); // Move to the previous video
        isDragging.current = false; // Stop dragging after the swipe
      }
    }
  };

  // Mouse up event handler
  const handleMouseUp = () => {
    isDragging.current = false; // Stop dragging when mouse or touch is released
  };

  // Mouse leave event handler
  const handleMouseLeave = () => {
    isDragging.current = false; // Stop dragging if mouse leaves the video area
  };

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
      className="relative w-full h-screen flex items-center justify-center bg-black"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown} // Add touch events
      onTouchMove={handleMouseMove}  // Add touch events
      onTouchEnd={handleMouseUp}     // Add touch events
      onTouchCancel={handleMouseUp}  // Add touch events
    >
      <motion.video
        ref={videoRef}
        src={videos[currVideoIdx].videoUrl}
        className="w-full h-full object-cover"
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

      <div className="absolute bottom-6 left-0 right-0 px-4 flex items-center space-x-4">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 border border-white rounded-full cursor-pointer"
        >
          {isMuted ? <VolumeX size={24} color="white" /> : <Volume2 size={24} color="white" />}
        </button>
        <button
          onClick={handleToggleLikeVideo}
          className="p-2 rounded-full cursor-pointer"
        >
          <motion.div
            key={videos[currVideoIdx].liked ? "liked" : "disliked"}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0.5 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
          >
            {videos[currVideoIdx].liked ? (
              <Heart size={24} color="red" fill="red" />
            ) : (
              <Heart size={24} color="white" />
            )}
          </motion.div>
        </button>
        <h3 className="text-lg font-semibold text-white">{videos[currVideoIdx].title}</h3>
        <p className="text-sm text-white">{videos[currVideoIdx].category}</p>
      </div>
    </div>
  );
};

export default VideoPlayer;
