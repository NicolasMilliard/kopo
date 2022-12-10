import Router from 'next/router';
import { useState } from 'react';

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
      console.log(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await createFolder();
  };

  return (
    <>
      <section>
        {!isLoading && !isSuccess && (
          <div>
            <form onSubmit={handleSubmit}>
              <button
                type="submit"
                className="mt-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
              >
                Nouveau dossier
              </button>
            </form>
          </div>
        )}
        {isSuccess && <div>Dossier créé, redirection...</div>}
        {isLoading && <div>En attente de la requête...</div>}
      </section>
    </>
  );
};

export default CreateFolder;