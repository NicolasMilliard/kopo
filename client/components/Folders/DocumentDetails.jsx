import React from 'react';
import { NFTStorage } from 'nft.storage';
import { toast } from 'react-toastify';

import { useKopo } from '../../context/KopoContext';

const DocumentDetails = ({ CID, from, toFolder, name, description, validator }) => {
  const {
    state: { documentHandlerContract },
  } = useKopo();

  // Fetch JSON from _documentCID to get image URI
  const getImageURI = async () => {
    fetch(`https://${CID}.ipfs.nftstorage.link/`)
      .then((res) => res.json())
      .then((data) => {
        window.open(`https://${data.image}.ipfs.nftstorage.link/`, '_blank');
      });
  };

  // Accept the document to safeMint it
  const acceptDocument = async () => {
    try {
      const contract = documentHandlerContract;
      if (!contract) return;

      const client = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY });

      // Create _metadataCID
      const metadataCID = {
        name: name,
        description: description,
        validator: validator,
      }

      const jsonse = JSON.stringify(metadataCID);

      const blob = new Blob([jsonse], { type: 'application/json' });

      const _metadataCID = await client.storeBlob(blob);

      contract.safeMint(CID, _metadataCID);
    } catch (error) {
      toast.error('La validation du document a échouée.', {
        position: 'top-right',
        autoClose: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
      });
      console.log(error);
    }
  };

  // Reject the document (rejectTokenRequest)
  const rejectDocument = async () => {
    try {
      const contract = documentHandlerContract;
      if (!contract) return;

      contract.rejectTokenRequest(CID);
    } catch (error) {
      toast.error('Le rejet du document a échouée.', {
        position: 'top-right',
        autoClose: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
      });
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-100 rounded-xl p-4 mx-8 mb-8 kopo-oblige-document-container">
      <h3 className="font-semibold text-xl mb-2">
        Dossier {toFolder.slice(0, 5)}...{toFolder.slice(toFolder.length - 4)}
      </h3>
      <h4 className="italic text-sm mb-4">
        Bénéficiaire : {from.slice(0, 5)}...{from.slice(from.length - 4)}
      </h4>
      <div>
        <p>{name}</p>
        <p>{description}</p>
        <div className="flex">
          <button onClick={() => getImageURI()} className="mt-4 mr-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg">
            Visualiser
          </button>
          <button onClick={() => acceptDocument()} className="mt-4 mr-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg">
            Valider
          </button>
          <br />
          <button onClick={() => rejectDocument()} className="mt-4 mr-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg">
            Rejeter
          </button>
          <br />
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
