import Link from 'next/link';
import Image from 'next/image';

import { useEffect, useState } from 'react';

import Button from '../../components/Buttons/Button';
import ButtonLoaderMini from '../../components/Buttons/ButtonLoaderMini';
import editIcon from '../../public/images/icons/edit.svg';
import validIcon from '../../public/images/icons/check.svg';
import ReturnToDashboard from '../../components/Buttons/ReturnToDashboard';
import ApprovedDocumentList from '../../components/Folders/ApprovedDocumentList';
import MintFolder from '../../components/Folders/MintFolder';
import PendingDocumentList from '../../components/Folders/PendingDocumentList';
import RejectedDocumentList from '../../components/Folders/RejectedDocumentList';
import { toast } from 'react-toastify';
import { useKopo } from '../../context/KopoContext';

const Folder = ({ folderAddress }) => {
  const {
    state: { getFolderHandlerContract, folderFactoryContract },
  } = useKopo();
  const [folderName, setFolderName] = useState('Votre dossier');
  const [folderId, setFolderId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

        // Check if folder has a name
        const hasName = await contract.folderName();
        if (hasName.length > 0) {
          setFolderName(hasName);
        }

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

  // Handle folder name
  const handleName = (e) => {
    e.preventDefault();
    setFolderName(e.target.value);
  }

  // Update folder name
  const updateFolderName = async () => {
    if (!getFolderHandlerContract) return;

    try {
      setIsLoading(true);

      const contract = await getFolderHandlerContract(folderAddress);

      const tx = await contract.setFolderName(folderName);
      await tx.wait();

      setIsLoading(false);
      setIsEditing(false);
    } catch (error) {
      setIsLoading(false);
      toast.error('Le changement de nom du dossier a échoué.', {
        position: 'top-right',
        autoClose: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
      });
      console.log(error);
    }
  }

  /**
   * Display an alert if this is not a legitimate folder.
   */
  if (!isLoading && !isValidFolder)
    return (
      <div className="mx-4 py-8 lg:px-40 xl:px-60">
        <ReturnToDashboard />
        <div className="flex flex-col items-center">
          <h1 className="text-3xl mb-8">Attention&nbsp;!</h1>
          <h2 className="max-w-md mb-8">
            Vous essayez d'accéder à un dossier qui n'a pas été créé depuis Kopo. Il s'agit peut-être d'une contrefaçon.
          </h2>
          <Button text="Signaler à Kopo" />
        </div>
      </div>
    );

  return (
    <div className="mx-4 py-8 lg:px-40 xl:px-60">
      <ReturnToDashboard />
      <div className="flex flex-col items-center mt-8">
        {
          isEditing &&
          <label className="relative block mb-4">
            <span className="sr-only">{folderName}</span>
            {
              isLoading ?
                <ButtonLoaderMini classNames="absolute inset-y-0 right-0 flex items-center pl-2" />
                :
                <button onClick={updateFolderName} className="absolute inset-y-0 right-2 flex items-center pl-2">
                  <Image src={validIcon} alt="Valider" className='kopo-edit-folder-name' />
                </button>
            }
            <input
              className="text-3xl max-w-md placeholder:text-black block bg-[#fefbf2] w-full border-none rounded-md py-2 pr-9 pl-3 focus:outline-none focus:border-green-500 kopo-folder-name-input"
              defaultValue={folderName}
              type="text"
              name="folderName"
              onChange={handleName}
            />
          </label>
        }
        {
          !isEditing &&
          <div className='flex items-center mb-4'>
            <h1 className='text-3xl max-w-xl'>{folderName}</h1>
            <button onClick={() => setIsEditing(true)} className="inset-y-0 flex items-center ml-2">
              <Image src={editIcon} alt="Edit" className='kopo-edit-folder-name' />
            </button>
          </div>

        }

        <h4 className="mb-8 italic">N° de dossier : {folderId}</h4>
        <Link
          href={`/folders/${folderAddress}/create-document`}
          className="mb-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
        >
          Soumettre un document
        </Link>
        <PendingDocumentList folderAddress={folderAddress} />
        <ApprovedDocumentList folderAddress={folderAddress} />
        <RejectedDocumentList folderAddress={folderAddress} />
      </div>

      <div className="flex flex-col items-center mt-16 bg-green-50 py-8 rounded-3xl drop-shadow">
        <h2 className="text-xl mb-8">Besoin d'un financement pour votre projet&nbsp;?</h2>
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
