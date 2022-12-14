import Link from 'next/link';
import Router from 'next/router';
import Button from '../Buttons/Button';

import { NFTStorage } from 'nft.storage';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { useKopo } from '../../context/KopoContext';

const CreateDocument = ({ folderAddress }) => {
  const {
    state: { documentHandlerContract },
  } = useKopo();
  const [image, setImage] = useState([]);
  const [filename, setFilename] = useState([]);
  const [description, setDescription] = useState('');
  const [oblige, setOblige] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [loadingImageCid, setIsLoadingImageCid] = useState('');
  const [loadingDocumentCid, setIsLoadingDocumentCid] = useState('');

  /**
   * For the moment we only accept images. PDF and other formats will be accepted
   * in a future release.
   */
  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      // Set the image blob to later mint it in the NFT.
      setImage(event.target.files[0]);
      setFilename(event.target.files[0].name);

      // Creates an inline image to be displayed.
      setCreateObjectURL(URL.createObjectURL(event.target.files[0]));
    }
  };

  /**
   * Upload the image on IPFS and the associated JSON.
   * Make a request.
   */
  const tokenRequest = async (event) => {
    event.preventDefault();

    /* Check that all conditions are met before sending the token request. */
    if (!createObjectURL) {
      toast.error('Veuillez sélectionner un document.', {
        position: 'top-right',
        autoClose: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
      });
      return;
    }

    if (!description) {
      toast.error('Veuillez ajouter une description.', {
        position: 'top-right',
        autoClose: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
      });
      return;
    }

    if (!oblige) {
      toast.error('Veuillez sélectionner un obligé.', {
        position: 'top-right',
        autoClose: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
      });
      return;
    }

    setIsLoading(true);

    const client = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY });

    const imageCid = await client.storeBlob(image);
    if (!imageCid) {
      toast.error("L'envoi du document sur Nft.Storage a échoué. Merci de réessayer.", {
        position: 'top-right',
        autoClose: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
      });
      setIsLoading(false);
      return;
    }
    setIsLoadingImageCid(imageCid);

    const nft = {
      image: imageCid,
      external_url: process.env.KOPO_URL,
      description: description,
      name: filename,
    };

    const jsonse = JSON.stringify(nft);
    const blob = new Blob([jsonse], { type: 'application/json' });

    const documentCid = await client.storeBlob(blob);
    if (!documentCid) {
      toast.error("L'envoi du document sur Nft.Storage a échoué. Merci de réessayer.", {
        position: 'top-right',
        autoClose: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
      });
      setIsLoading(false);
      // TODO Refactor the function. It should also delete the previous document from IPFS. No longer needed.
      return;
    }
    setIsLoadingDocumentCid(documentCid);

    /* Now, minting the NFT. */
    try {
      const tx = await documentHandlerContract.requestToken(documentCid, oblige, folderAddress);
      const wait = await tx.wait();
      setIsLoading(false);
      setIsSuccess(true);

      // Redirect to the event's page.
      Router.push(`/folders/${folderAddress}`);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isSuccess && (
        <div className="w-full py-8 lg:px-40 xl:px-60">
          <div className="flex-col items-center flex w-full">
            <h3 className="text-2xl mb-2 text-center">Document envoyé avec succès.</h3>
            <p className="mb-2">Il est maintenant en cours de traitement.</p>
            <Link
              href={`/folders/${folderAddress}`}
              className="max-w-xs bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
            >
              Retour au dossier
            </Link>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="w-full py-8 lg:px-40 xl:px-60">
          <div className="flex-col flex w-full">
            <h3 className="text-2xl mb-8 text-center">Envoi du document en cours...</h3>
            <div className="mb-2">
              <span className="font-semibold">Génération du CID de l'image&nbsp;: </span>
              {loadingImageCid}
              {loadingImageCid.length > 0 && ' ✔️'}
            </div>
            <div>
              <span className="font-semibold">Génération du CID du document&nbsp;: </span>
              {loadingDocumentCid}
              {loadingDocumentCid.length > 0 && ' ✔️'}
            </div>
          </div>
        </div>
      )}
      {!isLoading && !isSuccess && (
        <form className="flex flex-col max-w-md mx-auto mt-20">
          <h1 className="text-3xl mb-8">Envoyer votre document</h1>
          <label className="block mb-8" htmlFor="document">
            <span className="block text-md font-medium mb-2">Document</span>
            <input
              type="file"
              id="document"
              name="document"
              onChange={uploadToClient}
              accept="image/*"
              className="file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:cursor-pointer file:text-sm file:text-white file:font-bold file:bg-green-500 hover:file:bg-green-700"
            />
          </label>
          <label className="block mb-8" htmlFor="description">
            <span className="block text-md font-medium mb-2">Description du fichier</span>
            <input
              className="placeholder:text-slate-400 block bg-white w-full border border-slate-100 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-green-500 focus:ring-green-500 focus:ring-1 sm:text-sm"
              type="text"
              id="description"
              name="description"
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label className="block mb-8" htmlFor="oblige">
            <span className="block text-md font-medium mb-2">Sélection de l'obligé</span>
            <select
              name="oblige"
              id="oblige"
              onChange={(e) => setOblige(e.target.value)}
              className="placeholder:text-slate-400 block bg-white w-full border border-slate-100 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:border-green-500 focus:ring-green-500 focus:ring-1 sm:text-sm"
            >
              <option value="">---</option>
              <option value="0x5C4AcB6f5696f01D41728a2053c8CC26dA19bfB3">Obligé Test</option>
            </select>
          </label>
          {
            !isLoading &&
            <Button text="Soumettre le document" customFunction={tokenRequest} />
          }
          <div className="max-w-md mt-2 mb-8">
            <tt>
              ⚠️ Dans cette version de développement, le document sera envoyé sur IPFS en clair. Toute personne écoutant
              la blockchain peut récupérer le document.
            </tt>
          </div>
          <div>
            {createObjectURL && (
              <img src={createObjectURL} alt="Prévisualisation du document" className="rounded-xl mb-8" />
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateDocument;
