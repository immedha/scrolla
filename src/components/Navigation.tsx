import { FC } from 'react';
import { NavHomeIcon, NavPlusIcon, NavProfileIcon } from './Icons';
import { Link, useLocation } from 'react-router-dom';

const Navigation: FC = () => {
  const location = useLocation();
  const activeClass = "text-blue-600";
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center p-4 bg-white border-t">
      <Link to="/" className={`p-2 ${location.pathname === '/' ? activeClass : ''}`}>
        <NavHomeIcon />
      </Link>
      <Link to="/upload" className={`p-2 ${location.pathname === '/upload' ? activeClass : ''}`}>
        <NavPlusIcon />
      </Link>
      <Link to="/profile" className={`p-2 ${location.pathname === '/profile' ? activeClass : ''}`}>
        <NavProfileIcon />
      </Link>
    </nav>
  );
};

export default Navigation; 