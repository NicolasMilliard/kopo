import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useKopo } from '../../context/KopoContext';
import EstimateFinancialAid from '../Buttons/EstimateFinancialAid';
import FoldersList from '../Folders/FoldersList';
import CreateFolder from './CreateFolder';

const DashboardBeneficiary = () => {
  const {
    state: { folderFactoryContract },
  } = useKopo();
  const [folders, setFolders] = useState([]);
  const { address } = useAccount();

  // Check if user has folder(s)
  const checkUserCreatedFolders = async () => {
    try {
      const contract = folderFactoryContract;
      if (!contract) return;

      console.log(address);
      const eventFilter = contract.filters.NewFolder(address, null, null);
      const events = await contract.queryFilter(eventFilter, Number(process.env.KOPO_GENESIS));
      let allEvents = [];

      for (let i = 0; i < events.length; i++) {
        allEvents.push({ sender: events[i].args[0], newFolder: events[i].args[1], folderId: events[i].args[2] });
      }

      setFolders(allEvents);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkUserCreatedFolders();
  }, [folderFactoryContract]);

  return (
    <section>
      {folders.length === 0 ? (
        <>
          <h1 className="text-3xl text-center mb-8">Vous n'avez pas de projet en cours</h1>
          <div className="flex items-center max-w-2md">
            <CreateFolder />
            <EstimateFinancialAid />
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl text-center mb-8">
            Vous avez {folders.length} {folders.length === 1 ? 'projet' : 'projets'} en cours
          </h1>
          <div className="flex flex-col items-center max-w-2md">
            <CreateFolder />
            <FoldersList folders={folders} />
          </div>
        </>
      )}
    </section>
  );
};

export default DashboardBeneficiary;
