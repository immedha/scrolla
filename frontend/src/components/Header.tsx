import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { signOutAction } from '../store/user/userActions';

interface HeaderProps {
  isLoggedIn: boolean;
}

const Header: FC<HeaderProps> = ({ isLoggedIn }) => {
  const dispatch = useDispatch();

  return (
    <header className="flex items-center justify-between p-6 text-white">
      <div className="flex items-center">
        <img src="logo.png" alt="Logo" className="w-8 h-8 mr-3" />
        <h1 className="text-3xl righteous-regular">Scrolla</h1>
      </div>
      {isLoggedIn && (
        <button 
          onClick={() => dispatch(signOutAction())}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Sign Out
        </button>
      )}
    </header>
  );
};

export default Header;
