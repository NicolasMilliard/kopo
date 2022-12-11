import React, { useState, useEffect } from 'react';
import DocumentsList from '../Folders/DocumentsList';

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
        allEvents.push({
          _from: events[i].args[0],
          _documentCID: events[i].args[1],
          _toOblige: events[i].args[2],
          _toFolder: events[i].args[3],
        })
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
      <DocumentsList documents={documents} />
    </section>
  )
}

export default DashboardObligated