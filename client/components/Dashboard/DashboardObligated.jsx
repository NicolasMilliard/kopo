import React, { useState, useEffect } from 'react';
import DocumentsList from '../Folders/DocumentsList';
import Link from 'next/link';

import { useKopo } from '../../context/KopoContext';

const DashboardObligated = ({ currentAccount }) => {
  const {
    state: { documentHandlerContract },
  } = useKopo();

  const [documents, setDocuments] = useState([]);

  // Check if obligated has document(s) to check
  const checkDocuments = async () => {
    try {
      const contract = documentHandlerContract;
      if (!contract) return;

      const eventFilter = contract.filters.TokenRequested(null, null, currentAccount, null);
      const events = await contract.queryFilter(eventFilter);
      let allEvents = []

      for (let i = 0; i < events.length; i++) {

        // await checkDocumentsValidated(events[i].args[1]);

        // Check if a document has been rejected
        // if (await checkDocumentsRejected(events[i].args[1])) {
        // if (await checkDocumentsValidated(events[i].args[1])) {
        allEvents.push({
          _from: events[i].args[0],
          _documentCID: events[i].args[1],
          _toOblige: events[i].args[2],
          _toFolder: events[i].args[3],
        })
        // }
        // }
      }

      setDocuments(allEvents);
    } catch (error) {
      console.log(error);
    }
  }

  // Check if a document has been rejected
  const checkDocumentsRejected = async (_documentCID) => {
    const contract = documentHandlerContract;
    if (!contract) return;

    const eventFilter = contract.filters.TokenRejected(null, null, null);
    const events = await contract.queryFilter(eventFilter);

    // This document don't have to be listed (already rejected)
    if (events.length > 0) {
      return false;
    }
    return true;
  }

  // Check if a document has been validated
  const checkDocumentsValidated = async (_documentCID) => {
    const contract = documentHandlerContract;
    if (!contract) return;

    const eventFilter = contract.filters.Transfer(null, null, null);
    const events = await contract.queryFilter(eventFilter);

    for (let i = 0; i < events.length; i++) {
      console.log(events[i]);
    }

    // console.log(tokenId[0].args);

    // console.log(tokenId[0].args[2].toHexString());

    /* Retrieve the list of Tranfer events to our folder contracts. */
    // const eventFilter = contract.filters.Transfer(null, null, null);
    // const events = await contract.queryFilter(eventFilter);

    // for (let i = 0; i < events.length; i++) {
    /* Update the entry in the dict. */
    // console.log(events[i].args[2].toString());
    // setApprovedDocuments((prev) => ({
    //   ...prev,
    //   [events[i].args[2].toString()]: {
    //     id: events[i].args[2].toString(),
    //     status: APPROVED,
    //   },
    // }));
    // }

    // tokenURI(tokenId) -> retourne https + CID (seulement si validated du coup)

    // This document don't have to be listed (already validated)
    // if (events.length > 0) {
    // console.log(_documentCID + ' has been validated');
    // return false;
    // }
    // return true;
  }

  useEffect(() => {
    checkDocuments();
  }, [documentHandlerContract]);

  return (
    <section>
      {documents.length > 0 ?
        <DocumentsList documents={documents} currentAccount={currentAccount} />
        :
        <div className='flex flex-col items-center'>
          <h1 className='text-2xl mb-8'>Vous n'avez pas de documents en attente.</h1>
          <Link
            href="/"
            className="bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
          >
            Retourner à la page d'accueil
          </Link>
        </div>
      }
    </section>
  )
}

export default DashboardObligated