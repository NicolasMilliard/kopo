import React from 'react'

const ButtonLoader = ({ text, additionalClasses }) => {
  console.log(additionalClasses);
  return (
    <div className={`bg-green-700 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md ${additionalClasses}`}>
      <span className='flex items-center'>
        <span className='kopo-spin-loader'></span>{text}
      </span>
    </div>
  )
}

export default ButtonLoader