import { useEffect, useState } from 'react';
import ContractTest from '../components/ContractTest';
import WagmiTest from '../components/WagmiTest';

const Index = () => {
  const [currentAccount, setCurrentAccount] = useState('');

  return (
    <>
      <h1>Welcome to Kopo</h1>
      <WagmiTest />
      <ContractTest />
    </>
  );
};

export default Index;
