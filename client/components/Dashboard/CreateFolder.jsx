import Router from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../Buttons/Button';
import ButtonLoader from '../Buttons/ButtonLoader';

import { useKopo } from '../../context/KopoContext';

const CreateFolder = () => {
  const {
    state: { folderFactoryContract },
  } = useKopo();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const createFolder = async () => {
    try {
      const contract = folderFactoryContract;
      if (!contract) return;

      setIsLoading(true);

      const tx = await contract.createFolder();
      let wait = await tx.wait();

      // Get the folderId from the response event.
      const folderAddress = wait.events[2].args._contract;
      setIsLoading(false);
      setIsSuccess(true);

      // Redirect to the event's page.
      Router.push(`/folders/${folderAddress}`);
    } catch (error) {
      setIsSuccess(false);
      setIsLoading(false);
      toast.error('La création du dossier a échouée.', {
        position: 'top-right',
        autoClose: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
      });
      console.log(error);
    }
  };

  return (
    <>
      <section>
        {!isLoading && !isSuccess && (
          <Button text="Créer un nouveau projet" customFunction={createFolder} />
        )}
        {
          isSuccess &&
          <div className='text-green-700 py-2 px-4 rounded-3xl'>Dossier créé, redirection en cours...</div>
        }
        {
          isLoading &&
          <ButtonLoader text="Création du dossier en cours..." />
        }
      </section>
    </>
  );
};

export default CreateFolder;
