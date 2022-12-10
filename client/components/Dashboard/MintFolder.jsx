import { NFTStorage } from 'nft.storage';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useKopo } from '../../context/KopoContext';

const MintFolder = ({ folderAddress, folderId, folderName }) => {
  const { address } = useAccount();
  const {
    state: { getFolderHandlerContract },
  } = useKopo();
  const [isMinted, setIsMinted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        /* This is a small trick to see if we have minted the token.
           If maxTokenId revert when access it's token URI, then it has been
           reached.
        */
        const contract = await getFolderHandlerContract(folderAddress);
        await contract.tokenURI(process.env.MAX_NFT_BY_FOLDER - 1);
        setIsMinted(true);
        setIsVisible(false);
      } catch (error) {
        setIsMinted(false);
        setIsVisible(true);
      }
    })();
  }, [getFolderHandlerContract, isSuccess]);

  const mintNft = async () => {
    if (!folderId || !folderName) {
      console.log('folderId or folderName not set');
      return;
    }

    setIsLoading(true);
    setIsVisible(false);
    const nft = {
      image: process.env.KOPO_NFT_LOGO,
      external_url: process.env.KOPO_URL,
      description: folderName,
      name: folderId,
    };

    /* Uploading the JSON on IPFS. */
    const jsonse = JSON.stringify(nft);
    const blob = new Blob([jsonse], { type: 'application/json' });
    const client = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY });
    const cid = await client.storeBlob(blob);
    if (cid === '') {
      console.log('Could not upload json.');
      setIsLoading(false);
      setIsVisible(true);
      return;
    }

    console.log(`Json CID: ${cid}`);

    /* Now, minting the NFT. */
    try {
      const contract = await getFolderHandlerContract(folderAddress);
      const tx = await contract.safeMint(address, `ipfs://${cid}`);
      const wait = await tx.wait();
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setIsVisible(true);
    }
  };

  return (
    <div>
      {isMinted && <div>Le nombre maximal de NFT par dossier est atteint.</div>}
      {isSuccess && <div>Succès! Le NFT est maintenant dans votre portefeuille.</div>}
      {!isMinted && isVisible && (
        <button onClick={mintNft} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Créer un NFT du dossier
        </button>
      )}
      {isLoading && <div>Emission du NFT. Merci de valider la transaction.</div>}
    </div>
  );
};

export default MintFolder;