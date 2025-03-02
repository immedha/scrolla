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
  const [currVideoIdx, _setCurrVideoIdx] = useState(origVideoIdx);

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
    <div className="relative w-full h-screen flex items-center justify-center bg-black">
      
      <video
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
