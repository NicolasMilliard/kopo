import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import Dashboard from '../components/Dashboard/Dashboard';

import { useKopo } from '../context/KopoContext';

const dashboard = () => {
  const {
    state: { rolesManagerContract },
  } = useKopo();
  const { address } = useAccount();
  const [currentAccount, setCurrentAccount] = useState('');
  const [isVerified, setIsVerified] = useState();
  const [userRole, setUserRole] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check if user is verify
  const getUserVerifiedStatus = async () => {
    try {
      const contract = rolesManagerContract;
      if (!contract) return;
      if (!currentAccount) return;

      setIsLoading(true);

      const verifyStatus = await contract.getUserVerifiedStatus(currentAccount);
      setIsVerified(verifyStatus);

      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      setIsSuccess(false);
      setIsLoading(false);
      console.log(error);
    }
  };

  // Check user role
  const checkUserRole = async () => {
    try {
      const contract = rolesManagerContract;
      if (!contract) return;
      if (!currentAccount) return;

      setIsLoading(true);

      const role = await contract.getUserRole(currentAccount);
      setUserRole(role);

      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      setIsSuccess(false);
      setIsLoading(false);
      console.log(error);
    }
  };

  // If user is connected, check if he's verified and if he has folder(s)
  const checkCurrentAccount = () => {
    if (address) {
      setCurrentAccount(address);
      getUserVerifiedStatus();
      checkUserRole();
    }
  };

  useEffect(() => {
    checkCurrentAccount();
  }, [rolesManagerContract, currentAccount]);

  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <Head>
        <title>Tableau de bord - Kopo</title>
        <meta name="description" content="Tableau de bord - Kopo" />
      </Head>
      <Dashboard currentAccount={currentAccount} isVerified={isVerified} role={userRole} />
    </div>
  );
};

export default dashboard;
