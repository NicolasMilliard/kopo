import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';

import { useKopo } from '../../context/KopoContext';
import RejectedDocument from './RejectedDocument';

const REJECTED = 0;

const RejectedDocumentList = ({ folderAddress }) => {
  const {
    state: { documentHandlerContract },
  } = useKopo();
  const [rejectedDocuments, setRejectedDocuments] = useState({});

  /* Retrieve rejected documents. */
  useEffect(() => {
    (async () => {
      try {
        const contract = documentHandlerContract;
        if (!contract) return;

        /* Retrieve the list of Tranfer events to our folder contracts. */
        const eventFilter = contract.filters.TokenRejected(null, null, folderAddress);
        const events = await contract.queryFilter(eventFilter, Number(process.env.KOPO_GENESIS));

        for (let i = 0; i < events.length; i++) {
          /* Update the entry in the dict. */
          const documentCID = events[i].args._documentCID['hash'];
          if (documentCID) {
            setRejectedDocuments((prev) => ({
              ...prev,
              [documentCID.toString()]: {
                id: documentCID.toString(),
                status: REJECTED,
              },
            }));
          }
        }

        /* Now listening on the blockchain to dynamically insert new tokens. */
        contract.on('TokenRejected', (cid, from, to) => {
          /* Update the entry in the dict. */
          console.log(cid);
          setRejectedDocuments((prev) => ({
            ...prev,
            [cid.toString()]: {
              id: cid.toString(),
              status: REJECTED,
            },
          }));
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, [documentHandlerContract, folderAddress]);

  return (
    <div>
      {rejectedDocuments && Object.keys(rejectedDocuments).length > 0 && (
        <div>
          <h1 className="font-bold mb-4">Documents rejetés:</h1>
          <ul>
            {Object.entries(rejectedDocuments).map(([key, value]) => (
              <li key={key} className="mb-4">
                <RejectedDocument document={value} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RejectedDocumentList;
