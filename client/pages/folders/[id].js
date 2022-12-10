import { useEffect, useState } from 'react';

import { useKopo } from '../../context/KopoContext';
import ReturnToDashboard from '../../components/Buttons/ReturnToDashboard';

//import { folderHandlerContract } from '../../utils/contracts';

const Folder = ({ id }) => {
  const {
    state: { getFolderHandlerContract, folderFactoryContract },
  } = useKopo();
  const [folderId, setFolderId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidFolder, setIsValidFolder] = useState(false);

  /**
   * Set folderId.
   */
  useEffect(() => {
    (async () => {
      if (!getFolderHandlerContract) return;

      setIsLoading(false);

      try {
        const contract = await getFolderHandlerContract(id);
        const folderId = await contract.folderId();
        setFolderId(folderId);
      } catch (error) {
        console.log('Wrong address or wrong contract ABI.');
      }
    })();
  }, [getFolderHandlerContract, id, setFolderId]);

  /**
   * Check that the folder contract address is a legitimate address.
   */
  useEffect(() => {
    (async () => {
      if (!folderFactoryContract) return;
      if (!folderId) return;

      const addr = await folderFactoryContract.registeredFolders(folderId);
      if (addr === id) setIsValidFolder(true);
    })();
  }, [folderFactoryContract, id, folderId]);

  const mintNft = () => {
    console.log(1);
  };

  if (!isLoading && !isValidFolder)
    return (
      <div>Attention! Ce n'est pas un dossier Kopo et peut-être une contrefaçon. Merci de le signaler à Kopo.</div>
    );

  return (
    <div>
      <ReturnToDashboard />
      <div>Numéro de dossier: {folderId}</div>

      <div>
        Création d'un NFT de ce dossier pour la finance décentralisée
        <button onClick={mintNft} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Créer le NFT
        </button>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.params; // TODO Sanitize id to avoid non address.

  return {
    props: {
      id: id,
    },
  };
}

export default Folder;
