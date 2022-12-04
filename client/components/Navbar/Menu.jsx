import React from 'react'
import WagmiButton from '../Buttons/WagmiButton'

const Menu = () => {
  return (
    <div className='mr-4'>
      <ul className='flex space-between items-center'>
        <li className='ml-8 hover:text-green-500'><a href="#">Lien 1</a></li>
        <li className='ml-8 hover:text-green-500'><a href="#">Lien 2</a></li>
        <li className='ml-8 hover:text-green-500'><a href="#">Vous êtes un professionnel ?</a></li>
        <li className='ml-8'>
          <WagmiButton />
        </li>
      </ul>
    </div>
  )
}

export default Menu