import React from 'react'
import WagmiButton from '../Buttons/WagmiButton'

const Menu = () => {
  return (
    <ul className='flex space-between items-center'>
      <li className='ml-8 hover:text-green-500'><a href="#">Nos services</a></li>
      <li className='ml-8 hover:text-green-500'><a href="#">Nos conseils</a></li>
      <li className='ml-8 hover:text-green-500'><a href="#">Vous êtes un professionnel ?</a></li>
      <li className='ml-8'>
        <WagmiButton />
      </li>
    </ul>
  )
}

export default Menu