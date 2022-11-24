import { useEffect, useState } from 'react';
import WagmiTest from '../components/WagmiTest';

const Index = () => {
  const [currentAccount, setCurrentAccount] = useState('');

  // // Request wallet connection if an ethereum wallet is detected
  // const connectWallet = async () => {
  //   if (typeof window.ethereum !== 'undefined') {
  //     const currentAccount = await ethereum.request({ method: 'eth_requestAccounts' });
  //     setCurrentAccount(currentAccount);
  //   } else {
  //     console.log('Metamask is not installed');
  //   }
  // };

  // // Check if a wallet is connected
  // const checkConnection = async () => {
  //   if (typeof window.ethereum !== 'undefined') {
  //     const accounts = await ethereum.request({ method: 'eth_accounts' });

  //     if (accounts.length) {
  //       setCurrentAccount(accounts[0]);
  //     }
  //   } else {
  //     console.log('Metamask is not installed');
  //   }
  // };

  // // Check if wallet is connected when currentAccount change
  // useEffect(() => {
  //   checkConnection();
  // }, [currentAccount]);

  return (
    <>
      <h1>Welcome to Kopo</h1>
      <WagmiTest />
    </>
  );
};

export default Index;
