import { useEffect, useState } from 'react';

import { useKopo } from '../../context/KopoContext';

const RejectedDocument = ({ document }) => {
  const [documentDetails, setDocumentDetails] = useState({});

  // Get document details
  const getDocumentDetails = async () => {
    try {
      const url = `https://${document.id}.ipfs.nftstorage.link/`;

      await fetch(url)
        .then((response) => response.json())
        .then((result) => {
          setDocumentDetails({ name: result.name, description: result.description, oblige: document.oblige });
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
      <div className="bg-yellow-200 p-4 rounded-3xl">
        <div>ID&nbsp;: {document.id}</div>
        <div>Document en attente&nbsp;: {documentDetails.name}</div>
        <div>Description&nbsp;: {documentDetails.description}</div>
        <div>Obligé&nbsp;: {documentDetails.oblige}</div>
      </div>
    </>
  );
};

export default RejectedDocument;
