import { useEffect, useState } from 'react';

import { useKopo } from '../../context/KopoContext';
import ApprovedDocument from './ApprovedDocument';

const APPROVED = 1;

const ApprovedDocumentList = ({ folderAddress }) => {
  const {
    state: { documentHandlerContract },
  } = useKopo();
  const [approvedDocuments, setApprovedDocuments] = useState({});

  /* Retrieve approved documents. */
  useEffect(() => {
    (async () => {
      try {
        const contract = documentHandlerContract;
        if (!contract) return;

        /* Retrieve the list of Tranfer events to our folder contracts. */
        const eventFilter = contract.filters.Transfer(null, folderAddress, null);
        const events = await contract.queryFilter(eventFilter);

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
          <h1 className="font-bold">Documents approuvés</h1>
          <ul>
            {Object.entries(approvedDocuments).map(([key, value]) => (
              <li key={key}>
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
