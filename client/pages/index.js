import { useEffect, useState } from 'react';
import WagmiTest from '../components/WagmiTest';

const Index = () => {
  const [currentAccount, setCurrentAccount] = useState('');

  return (
    <>
      <h1 className='text-3xl font-bold underline'>Welcome to Kopo</h1>
      <WagmiTest />
    </>
  );
};

export default Index;
