import React from 'react'

const ButtonLoader = () => {
  return (
    // Aspect determine if the button is full rounded or half rounded
    <button className="mt-4 mr-8 bg-gray-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md">
      Transaction en cours...
    </button>
  )
}

export default ButtonLoader