import React, { useState, useEffect } from 'react';

import { useKopo } from '../../context/KopoContext';

const DashboardObligated = () => {
  const {
    state: { documentHandlerContract },
  } = useKopo();

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


  return (
    <button onClick={checkDocuments}>Test me</button>
  )
}

export default DashboardObligated