import { useRef, useState } from "react";
import { Volume2, VolumeX, Pause, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Video } from "../store/storeStates";

interface VideoPlayerProps {
  origVideoIdx: number;
  videos: Video[];
}

const VideoPlayer = ({ videos, origVideoIdx }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPauseIcon, setShowPauseIcon] = useState<'pause' | 'play' | null>(null);
  const [currVideoIdx, setCurrVideoIdx] = useState(origVideoIdx);

  const startX = useRef(0); // Keep track of starting X position for swipe
  const isDragging = useRef(false); // Track if mouse is dragging

  // Mouse down event handler
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    startX.current = 'touches' in e ? e.touches[0].clientX : e.clientX; // Get touch or mouse X position
  };

  // Mouse move event handler
  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return;

    const moveDistance = 'touches' in e ? e.touches[0].clientX - startX.current : e.clientX - startX.current; // Calculate movement distance

    if (moveDistance < -100) {
      // Swipe left
      if (currVideoIdx < videos.length - 1) {
        setCurrVideoIdx(currVideoIdx + 1); // Move to the next video
        isDragging.current = false; // Stop dragging after the swipe
      }
    } else if (moveDistance > 100) {
      // Swipe right
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

      <div className="absolute bottom-6 left-0 right-0 px-4 flex items-center justify-between">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 bg-gray-900 bg-opacity-50 rounded-full"
        >
          {isMuted ? <VolumeX size={24} color="white" /> : <Volume2 size={24} color="white" />}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
