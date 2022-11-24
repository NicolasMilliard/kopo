import { useEffect, useState } from 'react';
import WagmiTest from '../components/WagmiTest';

const Index = () => {
  const [currentAccount, setCurrentAccount] = useState('');

  return (
    <>
      <h1>Welcome to Kopo</h1>
      <WagmiTest />
    </>
  );
};

export default Index;
