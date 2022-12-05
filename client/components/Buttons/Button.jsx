import React from 'react';

const Button = ({ text, customFunction }) => {
  return (
    <button
      type="button"
      onClick={customFunction}
      className="mt-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
    >
      {text}
    </button>
  )
}

export default Button