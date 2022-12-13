import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { useKopo } from '../../context/KopoContext';
import PendingDocument from './PendingDocument';

const PendingDocumentList = ({ folderAddress }) => {
  const {
    state: { documentHandlerContract },
  } = useKopo();
  const [pendingDocuments, setPendingDocuments] = useState({});
  const { address } = useAccount();

  /* Retrieve rejected documents. */
  useEffect(() => {
    (async () => {
      try {
        const contract = documentHandlerContract;
        if (!contract) return;
        if (!address) return;

        /* Retrieve the list of TokenRequests to our folder contracts. */
        const eventFilter = contract.filters.TokenRequested(null, null, null, folderAddress);
        const events = await contract.queryFilter(eventFilter, Number(process.env.KOPO_GENESIS));

        for (let i = 0; i < events.length; i++) {
          /* Update the entry in the dict. */
          const documentCID = events[i].args._documentCID.toString();
          if (documentCID) {
            setPendingDocuments((prev) => ({
              ...prev,
              [documentCID]: {
                id: documentCID,
                oblige: events[i].args._toOblige,
              },
            }));
          }
        }

        /* Now listening on the blockchain to dynamically insert new tokens. */
        contract.on('TokenRequested', (from, cid, toOblige, toFolder) => {
          /* Update the entry in the dict. */
          setPendingDocuments((prev) => ({
            ...prev,
            [cid.toString()]: {
              id: cid.toString(),
              oblige: toOblige,
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
      {pendingDocuments && Object.keys(pendingDocuments).length > 0 && (
        <div>
          <h1 className="font-bold mb-4">Documents en attente:</h1>
          <ul>
            {Object.entries(pendingDocuments).map(([key, value]) => (
              <li key={key} className="mb-4">
                <PendingDocument document={value} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PendingDocumentList;
