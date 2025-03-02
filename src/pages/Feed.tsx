import { useSelector } from "react-redux";
import { selectVideos } from "../store/user/userSlice";
import VideoPlayer from "../components/VideoPlayer";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const Feed = () => {
  const videos = useSelector(selectVideos);
  const [isMobile, setIsMobile] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

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

  const simulateVerticalSwipe = (direction: 'up' | 'down') => {
    const videoElement = document.querySelector('video');
    if (!videoElement) return;

    const touchStart = new TouchEvent('touchstart', {
      bubbles: true,
      touches: [new Touch({
        identifier: 0,
        target: videoElement,
        clientY: direction === 'up' ? 500 : 100,
        clientX: 200
      })]
    });

    const touchEnd = new TouchEvent('touchend', {
      bubbles: true,
      touches: [new Touch({
        identifier: 0,
        target: videoElement,
        clientY: direction === 'up' ? 100 : 500,
        clientX: 200
      })]
    });

    videoElement.dispatchEvent(touchStart);
    setTimeout(() => videoElement.dispatchEvent(touchEnd), 50);
  };

  return (
    <div className="max-w-2xl mx-auto relative">
      <VideoPlayer 
        videos={videos} 
        origVideoIdx={currentVideoIndex} 
        swipeType="vertical"
      />

      {/* Navigation Arrows - Only shown on desktop */}
      {!isMobile && (
        <>
          {/* Up Arrow */}
          <button
            onClick={() => {simulateVerticalSwipe('up'); setCurrentVideoIndex(currentVideoIndex - 1);}}
            className={`fixed right-8 top-1/2 -translate-y-20 p-3 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all ${
              currentVideoIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer opacity-70 hover:opacity-100'
            }`}
            disabled={currentVideoIndex === 0}
          >
            <ChevronUp className="w-6 h-6 text-white" />
          </button>

          {/* Down Arrow */}
          <button
            onClick={() => {simulateVerticalSwipe('down'); setCurrentVideoIndex(currentVideoIndex + 1);}}
            className={`fixed right-8 top-1/2 translate-y-20 p-3 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all ${
              currentVideoIndex === videos.length - 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer opacity-70 hover:opacity-100'
            }`}
            disabled={currentVideoIndex === videos.length - 1}
          >
            <ChevronDown className="w-6 h-6 text-white" />
          </button>
        </>
      )}
    </div>
  );
};

export default Feed;