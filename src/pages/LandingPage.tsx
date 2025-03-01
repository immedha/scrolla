import { useDispatch } from "react-redux";
import { signInAction } from "../store/user/userActions";
import { useNavigate } from "react-router-dom";

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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4 py-6">
      <img
        src="landingpage_image.png"
        alt="Landing Page"
        className="w-48 h-48 object-cover rounded-lg mb-6" // smaller size for the image
      />

      <p className="text-md text-center mb-6 px-6 text-gray-700">
        Description goes here. Make it catchy and explain what your app does.
      </p>

      <button
        onClick={handleSignIn}
        className="px-8 py-3 text-white bg-blue-500 rounded-lg w-full max-w-sm mx-auto hover:bg-blue-600 transition duration-200"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default LandingPage;