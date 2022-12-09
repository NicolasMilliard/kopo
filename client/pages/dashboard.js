import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import Button from '../components/Buttons/Button';

import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { rolesManagerContract } from '../utils/contracts';

const dashboard = () => {
  const { address, isConnected } = useAccount();
  const [currentAccount, setCurrentAccount] = useState('');
  const [isVerified, setIsVerified] = useState();

  // Get User verified status from KopoRolesManager SC
  const { getUserVerifiedStatus } = useContractRead({
    address: '0x28Ac5e2f5b0065C9b0E69539a9E2f1eAf1fa0625',
    abi: rolesManagerContract.abi,
    functionName: 'getUserVerifiedStatus',
    args: [currentAccount],
    watch: true,
  });

  // If user is connected, check if he's verified
  const checkCurrentAccount = () => {
    if (isConnected) {
      setCurrentAccount(address);
      setIsVerified(getUserVerifiedStatus);
    }
  };

  // Check when isConnected and getUserVerifiedStatus are updated
  useEffect(() => {
    checkCurrentAccount();
  }, [isConnected, getUserVerifiedStatus]);

  // Testing
  // const { config, error } = usePrepareContractWrite({
  //   address: '0x28Ac5e2f5b0065C9b0E69539a9E2f1eAf1fa0625',
  //   abi: rolesManagerContract.abi,
  //   functionName: 'verifyUser',
  //   args: [currentAccount],
  // });

  // const { data, isLoading, isSuccess, write } = useContractWrite(config);

  // const verifyUser = () => {

  //   write();
  // }

  const newProject = () => {
    if (isVerified) {
    } else {
      alert("You're not verified");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <h1 className="text-3xl">Vous n'avez pas de projet en cours</h1>
      <span>{currentAccount}</span>
      <span>{isVerified}</span>
      <span>{isVerified ? 'Vous êtes vérifié' : "Vous n'êtes pas vérifié"}</span>
      {/* <Button text="Se vérifier (admin)" customFunction={verifyUser} /> */}
      <Button text="Commencer un nouveau projet" customFunction={newProject} />
    </div>
  );
};

export default dashboard;
