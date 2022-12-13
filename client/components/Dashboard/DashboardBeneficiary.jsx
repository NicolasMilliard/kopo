import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useKopo } from '../../context/KopoContext';
import EstimateFinancialAid from '../Buttons/EstimateFinancialAid';
import FoldersList from '../Folders/FoldersList';
import CreateFolder from './CreateFolder';

const DashboardBeneficiary = () => {
  const {
    state: { folderFactoryContract, getFolderHandlerContract },
  } = useKopo();
  const [folders, setFolders] = useState([]);
  const { address } = useAccount();

  // Check if user has folder(s)
  const checkUserCreatedFolders = async () => {
    try {
      const contract = folderFactoryContract;
      if (!contract) return;
      if (!getFolderHandlerContract) return;

      if (!address) return;

      // Folders details
      const eventFilter = contract.filters.NewFolder(address, null, null);
      const events = await contract.queryFilter(eventFilter, 0); // Number(process.env.KOPO_GENESIS)

      let allEvents = [];

      for (let i = 0; i < events.length; i++) {
        let sender = events[i].args[0];
        let newFolder = events[i].args[1];
        let folderId = events[i].args[2];

        // Get folder name
        let folderHandlerContract = getFolderHandlerContract(newFolder);
        let folderNameFromContract = await folderHandlerContract.folderName();

        // If folderNameFromContract is empty, it'll we displayed with a basic name
        allEvents.push({ sender: sender, newFolder: newFolder, folderId: folderId, folderName: folderNameFromContract });
      }

      setFolders(allEvents);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkUserCreatedFolders();
  }, [folderFactoryContract, getFolderHandlerContract]);

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
