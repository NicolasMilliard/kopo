import { useEffect, useState } from 'react';

import { useKopo } from '../../context/KopoContext';

const ApprovedDocument = ({ document }) => {
  const {
    state: { documentHandlerContract },
  } = useKopo();
  const [description, setDescription] = useState('');

  const retrieveDocument = async (document) => {
    try {
      const documentCID = await documentHandlerContract.tokenURI(document.id);
      setDescription(documentCID);
    } catch (error) {
      // Token does not exist.
      return;
    }
  };

  useEffect(() => {
    retrieveDocument(document);
  }, [document, documentHandlerContract]);

  return (
    <>
      <div className="bg-green-500">
        <div>ID: {document.id}</div>
        <div>Documents approuvés: {description}</div>
      </div>
    </>
  );
};

export default ApprovedDocument;
