import React from 'react';
import Link from 'next/link';
import Logo from '../Navbar/Logo';

const Footer = () => {
  return (
    <footer className='w-screen fixed bottom-0 p-8 lg:px-40 xl:px-60 text-white bg-slate-900'>
      <div className='flex justify-between w-full'>
        <div>
          <Logo />
        </div>
        <div>
          <h3 className='text-xl'>Liens utiles</h3>
          <ul>
            <li className='hover:text-green-500'><Link href='/contracts'>Adresses des Smart Contracts</Link></li>
          </ul>
        </div>
      </div>
      <div className='border-t border-green-500 mx-2 my-8'></div>
      <div>
        <p className='text-center'>Copyright © 2022 Kopo.</p>
      </div>
    </footer>
  )
}

export default Footer