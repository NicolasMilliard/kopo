import Link from 'next/link';

import { useEffect, useState } from 'react';

import ReturnToDashboard from '../../components/Buttons/ReturnToDashboard';
import ApprovedDocumentList from '../../components/Folders/ApprovedDocumentList';
import MintFolder from '../../components/Folders/MintFolder';
import RejectedDocumentList from '../../components/Folders/RejectedDocumentList';
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
    <div className='w-screen py-8 lg:px-40 xl:px-60'>
      <ReturnToDashboard />
      <div className='flex flex-col items-center mt-8'>
        <h1 className='text-3xl mb-2'>{folderName}</h1>
        <h4 className='mb-8 italic'>N° de dossier : {folderId}</h4>
        <Link
          href={`/folders/${folderAddress}/create-document`}
          className="mb-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
        >
          Soumettre un document
        </Link>
        <ApprovedDocumentList folderAddress={folderAddress} />
        <RejectedDocumentList folderAddress={folderAddress} />
      </div>

      <div className='flex flex-col items-center mt-16 bg-green-50 py-8 rounded-3xl drop-shadow'>
        <h2 className='text-xl mb-8'>Besoin d'un financement pour votre projet&nbsp;?</h2>
        {folderName && <MintFolder folderAddress={folderAddress} folderId={folderId} folderName={folderName} />}
      </div>
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
