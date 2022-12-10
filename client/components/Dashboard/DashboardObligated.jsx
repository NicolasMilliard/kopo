import React, { useState, useEffect } from 'react';

import { useKopo } from '../../context/KopoContext';

const DashboardObligated = () => {
  const {
    state: { documentHandlerContract },
  } = useKopo();

  const falseEvent = [{
    _from: '0x',
    _documentCID: 'testCID',
    _toOblige: '0x125BA2dC7567990A6b455E2F5dbF95d58b352db5',
    _toFolder: '0x'
  }];

  // Check if obligated has document(s) to check
  const checkDocuments = async () => {
    try {
      const contract = documentHandlerContract;
      if (!contract) return;

      const eventFilter = contract.filters.TokenRequested();
      const events = await contract.queryFilter(eventFilter);

      console.log('eventFilter: ' + JSON.stringify(eventFilter));
      console.log('events: ' + events);

    } catch (error) {
      console.log(error);
    }
  }

  // Accept the document -> safeMint
  const acceptDocument = async () => {
    try {
      const contract = documentHandlerContract;
      if (!contract) return;

      contract.safeMint('_documentCID', '_metadataCID');

    } catch (error) {
      console.log(error);
    }
  }

  // Reject the document -> rejectTokenRequest
  const rejectDocument = async () => {
    try {
      const contract = documentHandlerContract;
      if (!contract) return;

      contract.rejectTokenRequest('_documentCID');

    } catch (error) {
      console.log(error);
    }
  }


  return (
    <section>
      <button onClick={checkDocuments}>Console events</button><br />
      <button onClick={acceptDocument}>Test accept</button><br />
      <button onClick={rejectDocument}>Test reject</button><br />
      <ul>
        {falseEvent.map(event => (
          <li key={event._documentCID}>{event._from} - {event._toOblige} - {event._toFolder}</li>
        ))}
      </ul>


    </section>
  )
}

export default DashboardObligated