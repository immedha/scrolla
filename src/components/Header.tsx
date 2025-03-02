import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { signOutAction } from '../store/user/userActions';


interface HeaderProps {
  isLoggedIn: boolean;
}
const Header = ({ isLoggedIn }: HeaderProps) => {
  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(signOutAction());
  }

  return (
    <header className="flex items-center p-4 text-white righteous-regular">
      <img src="logo.png" alt="Logo" className="mr-2 inline-block" style={{ height: '1em' }} />
      <p className="inline-block text-4xl">Scrolla</p>
      {isLoggedIn && <div className="ml-auto">
        <button className="text-1xl bg-gray-500 cursor-pointer" onClick={handleSignOut}>Sign Out</button>
      </div>}
    </header>
  );
};

export default Header;
