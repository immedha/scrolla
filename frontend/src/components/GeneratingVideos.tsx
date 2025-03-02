const GeneratingVideos = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 text-center">
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Animated circles */}
          <div className="absolute inset-0 rounded-full border-4 border-purple-200 animate-ping"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 animate-spin"></div>
          <div className="absolute inset-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full opacity-20 blur-xl"></div>
        </div>

        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Generating Your Reels
        </h2>
        
        <p className="text-gray-600 text-lg mb-8">
          We're transforming your PDFs into engaging video content. This might take a few moments...
        </p>

        <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-600 to-blue-600 w-3/4 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
export default GeneratingVideos;