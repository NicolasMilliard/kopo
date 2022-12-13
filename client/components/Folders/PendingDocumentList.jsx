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

  /**
   * Retrieve pending documents and listen for new documents.
   */
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
          /* Get status and skip the one not pending. */
          const tokenRequest = await contract.tokenRequests(events[i].args[1]);
          if (tokenRequest.status !== 1) continue;

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
        contract.on(eventFilter, async (from, cid, toOblige, toFolder) => {
          const tokenRequest = await contract.tokenRequests(cid);
          if (tokenRequest.status !== 1) return;

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

  /**
   * Wait for a token to be rejected, and remove it from pending.
   */
  useEffect(() => {
    (async () => {
      try {
        const contract = documentHandlerContract;
        if (!contract) return;
        if (!address) return;

        const eventFilter = contract.filters.TokenRejected(null, null, null, folderAddress);
        contract.on(eventFilter, (documentCID, fromOblige, from, toFolder) => {
          if (documentCID.toString() in pendingDocuments) {
            let prev = { ...PendingDocument };
            delete prev[documentCID.toString()];
            setPendingDocuments(prev);
          }
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, [documentHandlerContract, folderAddress, pendingDocuments]);

  /**
   * Wait for a token to be accepted, and remove it from pending.
   */
  useEffect(() => {
    (async () => {
      try {
        const contract = documentHandlerContract;
        if (!contract) return;
        if (!address) return;

        const eventFilter = contract.filters.TokenApproved(null, null, null, folderAddress);
        contract.on(eventFilter, (documentCID, fromOblige, from, toFolder) => {
          if (documentCID.toString() in pendingDocuments) {
            let prev = { ...PendingDocument };
            delete prev[documentCID.toString()];
            setPendingDocuments(prev);
          }
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, [documentHandlerContract, folderAddress, pendingDocuments]);

  return (
    <div>
      {pendingDocuments && Object.keys(pendingDocuments).length > 0 && (
        <div>
          <h1 className="font-bold mb-4">Documents en attente&nbsp;:</h1>
          <ul>
            {Object.entries(pendingDocuments).map(([key, value]) => (
              <li key={key} className="mb-4 kopo-beneficiaire-document-container">
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
