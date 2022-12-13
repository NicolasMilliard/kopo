import React from 'react'

const ButtonLoaderMini = ({ classNames }) => {
  return (
    <button className={classNames}>
      <span className='kopo-spin-loader'></span>
    </button>
  )
}

export default ButtonLoaderMini