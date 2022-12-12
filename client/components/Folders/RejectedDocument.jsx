import { useEffect, useState } from 'react';

import { useKopo } from '../../context/KopoContext';

const RejectedDocument = ({ document }) => {
  const {
    state: { documentHandlerContract },
  } = useKopo();
  const [documentDetails, setDocumentDetails] = useState({});

  // Get document details
  const getDocumentDetails = async () => {
    try {
      const documentCID = await documentHandlerContract.tokenURI(document.id);

      await fetch(`https://${documentCID}.ipfs.nftstorage.link/`)
        .then((response) => response.json())
        .then((result) => {
          setDocumentDetails({ name: result.name, description: result.description, validator: result.validator });
        });
    } catch (error) {
      // Token does not exist.
      return;
    }
  };

  useEffect(() => {
    getDocumentDetails();
  }, [document]);

  return (
    <>
      <div className="bg-red-200 p-4 rounded-3xl">
        <div>ID&nbsp;: {document.id}</div>
        <div>Document refusé&nbsp;: {documentDetails.name}</div>
        <div>Description&nbsp;: {documentDetails.description}</div>
        <div>Refusé par&nbsp;: {documentDetails.validator}</div>
      </div>
    </>
  );
};

export default RejectedDocument;
