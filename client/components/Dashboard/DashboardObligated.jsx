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

      // Get all events with currentAccount set as OBLIGE
      const eventFilter = contract.filters.TokenRequested(null, null, currentAccount, null);
      const events = await contract.queryFilter(eventFilter);
      let allEvents = [];

      for (let i = 0; i < events.length; i++) {

        // Check document status: must be at "pending" (1)
        const getStatus = await contract.tokenRequests(events[i].args[1]);

        if (getStatus.status == 1) {
          allEvents.push({
            _from: events[i].args[0],
            _documentCID: events[i].args[1],
            _toOblige: events[i].args[2],
            _toFolder: events[i].args[3],
          });
        }
      }
      setDocuments(allEvents);
    } catch (error) {
      console.log(error);
    }
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