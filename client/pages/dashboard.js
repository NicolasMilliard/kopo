import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import FoldersList from '../components/Folders/FoldersList';
import EstimateFinancialAid from '../components/Buttons/EstimateFinancialAid';

import { useKopo } from '../context/KopoContext';

const Dashboard = () => {
  const {
    state: { rolesManagerContract, folderFactoryContract },
  } = useKopo();
  const { address, isConnected } = useAccount();
  const [currentAccount, setCurrentAccount] = useState('');
  const [isVerified, setIsVerified] = useState();
  const [folders, setFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const getUserVerifiedStatus = async () => {
    try {
      const contract = rolesManagerContract;
      if (!contract) return;

      setIsLoading(true);

      const tx = await contract.getUserVerifiedStatus(currentAccount);

      setIsLoading(false);
      setIsSuccess(true);

      return tx;

    } catch (error) {
      setIsSuccess(false);
      setIsLoading(false);
      console.log(error);
    }
  }

  const checkUserCreatedFolders = async () => {
    try {
      const contract = folderFactoryContract;
      if (!contract) return;

      setIsLoading(true);

      const eventFilter = contract.filters.NewFolder();
      const events = await contract.queryFilter(eventFilter);
      let allEvents = [];

      for (let i = 0; i < events.length; i++) {
        allEvents.push({ sender: events[i].args[0], newFolder: events[i].args[1], folderId: events[i].args[2] });
      }

      setFolders(allEvents);

    } catch (error) {
      setIsSuccess(false);
      setIsLoading(false);
      console.log(error);
    }
  }

  // If user is connected, check if he's verified
  const checkCurrentAccount = () => {
    if (isConnected) {
      setCurrentAccount(address);
      setIsVerified(getUserVerifiedStatus);
      checkUserCreatedFolders();
    }
  };

  // Check when isConnected and getUserVerifiedStatus are updated
  useEffect(() => {
    checkCurrentAccount();
  }, [rolesManagerContract]);

  const newProject = () => {
    if (isVerified) {
      return 'Vous êtes vérifié';
    }
    return "Vous n'êtes pas vérifié";
  };

  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <Head>
        <title>Tableau de bord</title>
        <meta name="description" content="Tableau de bord - Kopo" />
      </Head>
      <section>
        {
          folders.length === 0 ?
            <>
              <h1 className="text-3xl text-center mb-8">Vous n'avez pas de projet en cours</h1>
              <div className='flex items-center max-w-2md'>
                <Link href="/create-folder" className='bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg'>Créer un nouveau projet</Link>
                <EstimateFinancialAid />
              </div>

            </>
            :
            <>
              <h1 className="text-3xl text-center">Vous avez {folders.length} {folders.length === 1 ? 'projet' : 'projets'} en cours</h1>
              <div className='flex flex-col items-center max-w-2md'>
                <FoldersList folders={folders} />
                <Link href="/create-folder" className='bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg'>Créer un nouveau projet</Link>
              </div>
            </>
        }
      </section>
    </div>
  );
};

export default Dashboard;
