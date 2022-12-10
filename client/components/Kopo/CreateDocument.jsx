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
   * For the moment we only accept images. PDF and other forms of documents
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
    <div>
      {createObjectURL && <img src={createObjectURL} />}
      <div>
        <input type="file" name="document" onChange={uploadToClient} accept="image/*" />
      </div>
      <div>
        <input type="text" name="documentName" value="Nom du document" />
      </div>
      <div>
        <input type="text" name="oblige" value="Addresse de l'obligé" />
      </div>
      <div>
        <tt>
          Attention, ceci est une maquette. Dans cette version de développement, le document sera envoyé sur IPFS en
          clair. Toute personne écoutant la blockchain peut récupérer le document.
        </tt>
      </div>
      <div>
        <button
          type="submit"
          className="mt-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
          onClick={uploadToServer}
        >
          Soumettre le document
        </button>
      </div>
    </div>
  );
};

export default CreateDocument;
