import { useEffect, useState } from 'react';

import { useKopo } from '../../context/KopoContext';

const RejectedDocument = ({ document }) => {
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
      <div className="bg-red-500">
        <div>ID: {document.id}</div>
      </div>
    </>
  );
};

export default RejectedDocument;
