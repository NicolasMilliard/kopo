import React from 'react';
import KopoAddressProvider from '../components/Contracts/KopoAddressProvider';
import KopoRolesManager from '../components/Contracts/KopoRolesManager';
import KopoDocumentHandler from '../components/Contracts/KopoDocumentHandler';
import KopoFolderFactory from '../components/Contracts/KopoFolderFactory';
import KopoFolderHandler from '../components/Contracts/KopoFolderHandler';

const testingpage = () => {

  return (
    <div className='flex flex-col items-center justify-center mt-40'>
      <h1 className='text-3xl'>KopoAddressProvider</h1>
      <KopoAddressProvider />
      <h1 className='text-3xl mt-40'>KopoRolesManager</h1>
      <KopoRolesManager />
      <h1 className='text-3xl mt-40'>KopoDocumentHandler</h1>
      <KopoDocumentHandler />
      <h1 className='text-3xl mt-40'>KopoFolderFactory</h1>
      <KopoFolderFactory />
      <h1 className='text-3xl mt-40'>KopoFolderHandler</h1>
      <KopoFolderHandler />
    </div>
  )
}

export default testingpage