import Link from 'next/link';

import { useEffect, useState } from 'react';

import ReturnToDashboard from '../../components/Buttons/ReturnToDashboard';
import MintFolder from '../../components/Dashboard/MintFolder';
import { useKopo } from '../../context/KopoContext';

const Folder = ({ folderAddress }) => {
  const {
    state: { getFolderHandlerContract, folderFactoryContract },
  } = useKopo();
  const [folderName, setFolderName] = useState(null);
  const [folderId, setFolderId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidFolder, setIsValidFolder] = useState(false);

  /**
   * Set folderId.
   */
  useEffect(() => {
    (async () => {
      if (!getFolderHandlerContract) return;

      try {
        const contract = await getFolderHandlerContract(folderAddress);

        // Retrieve information about the folder.
        setFolderId(await contract.folderId());
        //setFolderName(await contract.folderName());
        // TODO Fix this.
        setFolderName('Test folder name');

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log('Wrong address or wrong contract ABI.');
      }
    })();
  }, [getFolderHandlerContract, folderAddress, setFolderId, setFolderName]);

  /**
   * Check that the folder contract address is a legitimate address.
   */
  useEffect(() => {
    (async () => {
      if (!folderFactoryContract) return;
      if (!folderId) return;

      const addr = await folderFactoryContract.registeredFolders(folderId);
      if (addr === folderAddress) setIsValidFolder(true);
    })();
  }, [folderFactoryContract, folderAddress, folderId]);

  /**
   * Display an alert if this is not a legitimate folder.
   */
  if (!isLoading && !isValidFolder)
    return (
      <div>Attention! Ce n'est pas un dossier Kopo et peut-être une contrefaçon. Merci de le signaler à Kopo.</div>
    );

  return (
    <div>
      <div>
        <ReturnToDashboard />
      </div>
      <div>
        <Link
          href={`/folders/${folderAddress}/create-document`}
          className="bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
        >
          Soumettre un document
        </Link>
      </div>
      <div>Numéro de dossier: {folderId}</div>
      <div>Nom du dossier: {folderName}</div>

      {folderName && <MintFolder folderAddress={folderAddress} folderId={folderId} folderName={folderName} />}
    </div>
  );
};

export async function getServerSideProps(context) {
  // TODO Sanitize folder to avoid non address. There is already a security check though.
  const { folderAddress } = context.params;

  return {
    props: {
      folderAddress: folderAddress,
    },
  };
}

export default Folder;
