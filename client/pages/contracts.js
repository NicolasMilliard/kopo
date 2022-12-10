import Head from 'next/head';
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
      <div className="flex flex-col items-center justify-center mt-40">
        <Head>
          <title>Contrats - Kopo</title>
          <meta name="description" content="Tableau de bord - Kopo" />
        </Head>

        <section>
          <h1>Adresses des contracts:</h1>
          <ul>
            <li>AddressProvider: {addressProvider}</li>
            <li>RolesManager: {roleManager}</li>
            <li>FolderFactory: {folderFactory}</li>
            <li>DocumentHandler: {documentHandler}</li>
          </ul>
        </section>
      </div>
    </>
  );
};

export default Contracts;
