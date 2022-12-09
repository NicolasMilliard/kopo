import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';

import '@rainbow-me/rainbowkit/styles.css';
import 'react-toastify/dist/ReactToastify.css';

import { folderFactoryContract } from '../utils/contracts';

const CreateFolder = () => {
  const { config, error } = usePrepareContractWrite({
    ...folderFactoryContract,
    functionName: 'createFolder',
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(write);
    write();
  };

  return (
    <div>
      <Head>
        <title>Création d'un nouveau dossier</title>
        <meta name="description" content=">Création d'un nouveau dossier" />
      </Head>

      <section>
        {!isLoading && (
          <div>
            <div>Bonjour, c'est ici pour créer un nouveau dossier.</div>
            <form onSubmit={handleSubmit}>
              <button
                type="submit"
                className="mt-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
              >
                createFolder
              </button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
};

export default CreateFolder;
