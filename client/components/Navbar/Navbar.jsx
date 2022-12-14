import React from 'react';
import Logo from './Logo';
import Menu from './Menu';

const Navbar = () => {
  return (
    <div className="w-full py-8 lg:px-40 xl:px-60 drop-shadow-md">
      <div className="flex items-center justify-between w-full">
        <Logo />
        <Menu />
      </div>
    </div>
  );
};

export default Navbar;
