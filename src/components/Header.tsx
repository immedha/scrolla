import { FC } from 'react';

const Header: FC = () => {
  return (
    <header className="flex items-center p-4 text-4xl text-white righteous-regular">
      <img src="logo.png" alt="Logo" className="mr-2 inline-block" style={{ height: '1em' }} />
      <p className="inline-block">Scrolla</p>
    </header>
  );
};

export default Header;
