import Router from 'next/router';
import { NFTStorage } from 'nft.storage';
import { useState } from 'react';

import { useKopo } from '../../context/KopoContext';

const uploadNFT = async (nft) => {
  console.log('Uploading Metadata to IPFS ....');
  const client = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY });
  const metadata = await client.store(nft);
  console.log(metadata);
  console.log('Metadata URI: ', metadata.url);

  return metadata;
};

const CreateDocument = () => {
  const [image, setImage] = useState([]);
  const [createObjectURL, setCreateObjectURL] = useState(null);

  /**
   * For the moment we only accept images. PDF and other formats will be accepted
   * in a future release.
   */
  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const inBrowserFile = event.target.files[0];

      // Set the image blob to later mint it in the NFT.
      setImage(inBrowserFile);

      // Creates an inline image to be displayed.
      setCreateObjectURL(URL.createObjectURL(inBrowserFile));
    }
  };

  const uploadToServer = async (event) => {
    event.preventDefault();

    if (!createObjectURL) return;

    const nft = {
      image: image,
      name: 'coucou',
      description: 'coucou',
    };

    await uploadNFT(nft);

    // TODO If successful, send the request to KopoDocumentHandler.
  };

  return (
    <form className='flex flex-col max-w-md mx-auto mt-40'>
      <h1 className='text-3xl mb-8'>Envoyer votre document</h1>
      <label className='block mb-8' htmlFor='document'>
        <span className='block text-sm font-medium mb-2'>Document</span>
        <input
          type="file"
          id="document"
          name="document"
          onChange={uploadToClient}
          accept="image/*"
          className='file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:cursor-pointer file:text-sm file:text-white file:font-bold file:bg-green-500 hover:file:bg-green-700'
        />
      </label>
      <label className='block mb-8' htmlFor="oblige">
        <span className='block text-sm font-medium mb-2'>Obligé</span>
        <select name="oblige" id="oblige">
          <option value="1">0x1 - EDF</option>
          <option value="2">0x2 - Carrefour</option>
          <option value="3">0x3 - Casino</option>
        </select>
      </label>
      <button
        type="submit"
        className="mb-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
        onClick={uploadToServer}
      >
        Soumettre le document
      </button>
      <div className='max-w-md mb-8'>
        <tt>
          ⚠️ Dans cette version de développement, le document sera envoyé sur IPFS en
          clair. Toute personne écoutant la blockchain peut récupérer le document.
        </tt>
      </div>
      <div>
        {createObjectURL && <img src={createObjectURL} alt="Prévisualisation du document" className='rounded-xl mb-8' />}
      </div>
    </form >
  );
};

export default CreateDocument;
