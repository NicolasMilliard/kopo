import React from 'react';
import Logo from './Logo';
import Menu from './Menu';

const Navbar = () => {
  return (
    <div className='w-screen py-8 lg:px-40 xl:px-60 shadow-lg'>
      <div className='flex items-center justify-between w-full'>
        <Logo />
        <Menu />
      </div>
    </div>
  )
}

export default Navbar