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
      const url = `https://${document.id}.ipfs.nftstorage.link/`;

      await fetch(url)
        .then((response) => response.json())
        .then((result) => {
          setDocumentDetails({ name: result.name, description: result.description, validator: document.validator });
        });
    } catch (error) {
      console.log(error);
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
