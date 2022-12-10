import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useKopo } from '../context/KopoContext';

const Contracts = () => {
  const {
    state: { addressProviderContract, rolesManagerContract, folderFactoryContract, documentHandlerContract },
  } = useKopo();
  const [addressProvider, setAddressProvider] = useState('');
  const [roleManager, setRoleManager] = useState('');
  const [folderFactory, setFolderFactory] = useState('');
  const [documentHandler, setDocumentHandler] = useState('');

  useEffect(() => {
    (async () => {
      if (!addressProviderContract) return;
      setAddressProvider(addressProviderContract.address);
    })();
  }, [addressProviderContract]);

  useEffect(() => {
    (async () => {
      if (!rolesManagerContract) return;
      setRoleManager(rolesManagerContract.address);
    })();
  }, [rolesManagerContract]);

  useEffect(() => {
    (async () => {
      if (!folderFactoryContract) return;
      setFolderFactory(folderFactoryContract.address);
    })();
  }, [folderFactoryContract]);

  useEffect(() => {
    (async () => {
      if (!documentHandlerContract) return;
      setDocumentHandler(documentHandlerContract.address);
    })();
  }, [documentHandlerContract]);

  return (
    <>
      <Head>
        <title>Smart Contrats - Kopo</title>
        <meta name="description" content="Smart Contracts - Kopo" />
      </Head>

      <section className='flex flex-col items-center justify-center mt-40'>
        <h1 className='text-3xl mb-8'>Adresses des Smarts Contract</h1>
        <p className='max-w-md mb-8'>Dans un soucis de transparence, nous souhaitons mettre à votre disposition le code source de nos Smart Contracts ainsi que leurs adresses.</p>
        <div className='flex'>
          {/* AddressProvider */}
          <Link href="https://mumbai.polygonscan.com/address/0xf014A82beA2F3716456A9Ea4512E82326d5b0C74" target="_blank">
            <div className='kopo-smart-contract hover:drop-shadow-md'>
              <p className='font-semibold'>AddressProvider</p>
              <p>{addressProvider.slice(0, 5)}...{addressProvider.slice(addressProvider.length - 4)}</p>
            </div>
          </Link>
          {/* RolesManager */}
          <Link href="#" target="_blank">
            <div className='kopo-smart-contract hover:drop-shadow-md'>
              <p className='font-semibold'>RolesManager</p>
              <p>{roleManager.slice(0, 5)}...{roleManager.slice(roleManager.length - 4)}</p>
            </div>
          </Link>
          {/* FolderFactory */}
          <Link href="#" target="_blank">
            <div className='kopo-smart-contract hover:drop-shadow-md'>
              <p className='font-semibold'>FolderFactory</p>
              <p>{folderFactory.slice(0, 5)}...{folderFactory.slice(folderFactory.length - 4)}</p>
            </div>
          </Link>
          {/* DocumentHandler */}
          <Link href="#" target="_blank">
            <div className='kopo-smart-contract hover:drop-shadow-md'>
              <p className='font-semibold'>DocumentHandler</p>
              <p>{documentHandler.slice(0, 5)}...{documentHandler.slice(documentHandler.length - 4)}</p>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Contracts;
