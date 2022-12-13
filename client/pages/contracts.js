import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useKopo } from '../context/KopoContext';

const Contracts = () => {
  const {
    state: { addressProviderContract, rolesManagerContract, folderFactoryContract, documentHandlerContract },
  } = useKopo();
  const [addressProvider, setAddressProvider] = useState('0x2a9f306104FC072B55a92873C27E22b342e4142F');
  const [roleManager, setRoleManager] = useState('0x87E99a8C2Df539Ae604c96617154922cf5559721');
  const [folderFactory, setFolderFactory] = useState('0xd6DDEbb683FD409235790D70CCE0F2012A44C48D');
  const [documentHandler, setDocumentHandler] = useState('0xF5Fb4d374D82E17178e4222160eAAF49c4bdD4fE');

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

      <section className="flex flex-col items-center justify-center mt-40">
        <h1 className="text-3xl mb-8">Adresses des Smarts Contract</h1>
        <p className="max-w-md mb-8">
          Dans un soucis de transparence, nous souhaitons mettre à votre disposition le code source de nos Smart
          Contracts ainsi que leurs adresses.
        </p>
        <div className="flex">
          {/* AddressProvider */}
          <Link href={`https://mumbai.polygonscan.com/address/${addressProvider}`} target="_blank">
            <div className="kopo-smart-contract hover:drop-shadow-md">
              <p className="font-semibold">AddressProvider</p>
              <p>
                {addressProvider.slice(0, 5)}...{addressProvider.slice(addressProvider.length - 4)}
              </p>
            </div>
          </Link>
          {/* RolesManager */}
          <Link href={`https://mumbai.polygonscan.com/address/${roleManager}`} target="_blank">
            <div className="kopo-smart-contract hover:drop-shadow-md">
              <p className="font-semibold">RolesManager</p>
              <p>
                {roleManager.slice(0, 5)}...{roleManager.slice(roleManager.length - 4)}
              </p>
            </div>
          </Link>
          {/* FolderFactory */}
          <Link href={`https://mumbai.polygonscan.com/address/${folderFactory}`} target="_blank">
            <div className="kopo-smart-contract hover:drop-shadow-md">
              <p className="font-semibold">FolderFactory</p>
              <p>
                {folderFactory.slice(0, 5)}...{folderFactory.slice(folderFactory.length - 4)}
              </p>
            </div>
          </Link>
          {/* DocumentHandler */}
          <Link href={`https://mumbai.polygonscan.com/address/${documentHandler}`} target="_blank">
            <div className="kopo-smart-contract hover:drop-shadow-md">
              <p className="font-semibold">DocumentHandler</p>
              <p>
                {documentHandler.slice(0, 5)}...{documentHandler.slice(documentHandler.length - 4)}
              </p>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Contracts;
