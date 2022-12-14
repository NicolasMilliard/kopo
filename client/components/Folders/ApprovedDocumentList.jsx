import { useEffect, useState } from 'react';

import { useKopo } from '../../context/KopoContext';
import ApprovedDocument from './ApprovedDocument';

const APPROVED = 1;

const ApprovedDocumentList = ({ folderAddress }) => {
  const {
    state: { documentHandlerContract },
  } = useKopo();
  const [approvedDocuments, setApprovedDocuments] = useState({});

  /**
   * Retrieve approved documents and listen for new approved documents.
   */
  useEffect(() => {
    (async () => {
      try {
        const contract = documentHandlerContract;
        if (!contract) return;

        /* Retrieve the list of Tranfer events to our folder contracts. */
        const eventFilter = contract.filters.Transfer(null, folderAddress, null);
        const events = await contract.queryFilter(eventFilter, Number(process.env.KOPO_GENESIS));

        for (let i = 0; i < events.length; i++) {
          /* Update the entry in the dict. */
          setApprovedDocuments((prev) => ({
            ...prev,
            [events[i].args[2].toString()]: {
              id: events[i].args[2].toString(),
              status: APPROVED,
            },
          }));
        }

        /* Now listening on the blockchain to dynamically insert new tokens. */
        contract.on('Transfer', (from, to, tokenId) => {
          /* Filter events not to us. */
          if (to !== folderAddress) return;

          /* Update the entry in the dict. */
          setApprovedDocuments((prev) => ({
            ...prev,
            [tokenId]: {
              id: tokenId.toString(),
              status: APPROVED,
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
      {Object.keys(approvedDocuments).length === 0 && (
        <div>Aucun document n'a été encore approuvé pour ce dossier.</div>
      )}
      {approvedDocuments && Object.keys(approvedDocuments).length > 0 && (
        <div>
          <h1 className="font-bold mb-4">Documents approuvés&nbsp;:</h1>
          <ul>
            {Object.entries(approvedDocuments).map(([key, value]) => (
              <li key={key} className="mb-4 kopo-beneficiaire-document-container">
                <ApprovedDocument document={value} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ApprovedDocumentList;
