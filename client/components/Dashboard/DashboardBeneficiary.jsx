import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import EstimateFinancialAid from '../Buttons/EstimateFinancialAid';
import FoldersList from '../Folders/FoldersList';

import { useKopo } from '../../context/KopoContext';

const DashboardBeneficiary = () => {
  const {
    state: { folderFactoryContract },
  } = useKopo();
  const [folders, setFolders] = useState([]);

  // Check if user has folder(s)
  const checkUserCreatedFolders = async () => {
    try {
      const contract = folderFactoryContract;
      if (!contract) return;

      const eventFilter = contract.filters.NewFolder();
      const events = await contract.queryFilter(eventFilter);
      let allEvents = [];

      for (let i = 0; i < events.length; i++) {
        allEvents.push({ sender: events[i].args[0], newFolder: events[i].args[1], folderId: events[i].args[2] });
      }

      setFolders(allEvents);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkUserCreatedFolders();
  }, [folderFactoryContract]);

  return (
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
            <h1 className="text-3xl text-center mb-8">Vous avez {folders.length} {folders.length === 1 ? 'projet' : 'projets'} en cours</h1>
            <div className='flex flex-col items-center max-w-2md'>
              <Link href="/create-folder" className='bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg'>Créer un nouveau projet</Link>
              <FoldersList folders={folders} />
            </div>
          </>
      }
    </section>
  )
}

export default DashboardBeneficiary