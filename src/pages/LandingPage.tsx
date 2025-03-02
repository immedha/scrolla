import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInAction } from "../store/user/userActions";

interface LandingPageProps {
  page?: string;
}

const LandingPage = ({ page }: LandingPageProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignIn = () => {
    dispatch(signInAction());
    navigate("/" + page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0942] to-[#000b3c] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col items-center">
        {/* Phone Image */}
        <div className="relative w-full max-w-md mb-12">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-3xl"></div>
          <img
            src="landingpage_image.png"
            alt="Scrolla App"
            className="relative w-full h-auto"
          />
        </div>

        {/* Content */}
        <div className="text-center max-w-2xl">
          <h1 className="text-[2.75rem] leading-tight font-bold text-white mb-6">
            Welcome to <span className="text-[#a855f7]">Scrolla</span>
          </h1>

          <p className="text-[#94a3b8] text-lg mb-10">
            Transform your PDFs into engaging video content with just a few clicks.
            Sign in to begin your creative journey.
          </p>

          <button
            onClick={handleSignIn}
            className="inline-flex items-center px-8 py-3 bg-[#7e22ce] text-white rounded-full hover:bg-[#6b21a8] transition-colors"
          >
            <img src="google-icon.png" alt="Google" className="w-5 h-5 mr-3" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;