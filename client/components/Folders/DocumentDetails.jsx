import React from 'react';
import { useKopo } from '../../context/KopoContext';

const DocumentDetails = ({ CID, from, toFolder, name, description }) => {
  const {
    state: { documentHandlerContract },
  } = useKopo();

  // Fetch JSON from _documentCID to get image URI
  const getImageURI = async (CID) => {
    fetch(`https://${CID}.ipfs.nftstorage.link/`)
      .then(res => res.json())
      .then(data => {
        window.open(`https://${data.image}.ipfs.nftstorage.link/`, '_blank');
      });
  }

  // Accept the document to safeMint it
  const acceptDocument = async (CID, _metadataCID) => {
    try {
      const contract = documentHandlerContract;
      if (!contract) return;

      contract.safeMint(CID, _metadataCID);

    } catch (error) {
      console.log(error);
    }
  }

  // Reject the document (rejectTokenRequest)
  const rejectDocument = async (CID) => {
    try {
      const contract = documentHandlerContract;
      if (!contract) return;

      contract.rejectTokenRequest(CID);

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-slate-200 rounded-xl p-4 mr-8">
      <h3 className='font-semibold text-xl mb-2'>Dossier {toFolder.slice(0, 5)}...{toFolder.slice(toFolder.length - 4)}</h3>
      <h4 className='italic text-sm mb-4'>Bénéficiaire : {from.slice(0, 5)}...{from.slice(from.length - 4)}</h4>
      <div>
        <p>{name}</p>
        <p>{description}</p>
        <div className='flex'>
          <button onClick={() => getImageURI(CID)} className='mr-8'>Visualiser</button>
          <button onClick={() => acceptDocument(CID, 'test')} className='mr-8'>Valider</button><br />
          <button onClick={() => rejectDocument(CID)} className='mr-8'>Rejeter</button><br />
        </div>
      </div>
    </div>
  )
}

export default DocumentDetails