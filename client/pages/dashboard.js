import React from 'react';
import Button from '../components/Buttons/Button';

const dashboard = () => {

  const test = () => {
    console.log('ok');
  }

  return (
    <div className='flex flex-col items-center justify-center mt-40'>
      <h1 className='text-3xl'>Vous n'avez pas de projet en cours</h1>
      <Button text="Commencer un nouveau projet" customFunction={test} />
    </div>
  )
}

export default dashboard