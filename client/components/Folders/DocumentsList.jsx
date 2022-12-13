import React, { useEffect, useState } from 'react';
import DocumentDetails from './DocumentDetails';

const DocumentsList = ({ documents, currentAccount }) => {
  const [documentDetails, setDocumentDetails] = useState([]);

  // Get all documents names
  const setDocumentsDetails = async () => {
    let allDocuments = [];

    for (let i = 0; i < documents.length; i++) {
      await fetch(`https://${documents[i]._documentCID}.ipfs.nftstorage.link/`)
        .then((response) => response.json())
        .then((result) => {
          allDocuments.push({
            documentCID: documents[i]._documentCID,
            documentName: result.name,
            documentDescription: result.description,
          });
        });
    }
    setDocumentDetails(allDocuments);
  };

  // Get a specific name
  const getName = (_documentCID) => {
    for (let i = 0; i < documentDetails.length; i++) {
      if (documentDetails[i].documentCID == _documentCID) {
        return documentDetails[i].documentName;
      }
    }
  };

  // Get a specific description
  const getDescription = (_documentCID) => {
    for (let i = 0; i < documentDetails.length; i++) {
      if (documentDetails[i].documentCID == _documentCID) {
        return documentDetails[i].documentDescription;
      }
    }
  };

  useEffect(() => {
    setDocumentsDetails();
  }, [documents]);

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-wrap">
        {documents.map((document) => (
          <DocumentDetails
            key={document._documentCID}
            CID={document._documentCID}
            from={document._from}
            toFolder={document._toFolder}
            toOblige={document._toOblige}
            name={getName(document._documentCID)}
            description={getDescription(document._documentCID)}
            validator={currentAccount}
          />
        ))}
      </div>
    </div>
  );
};

export default DocumentsList;
