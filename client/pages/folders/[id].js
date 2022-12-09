import { useEffect, useState } from 'react';

import { useKopo } from '../../context/KopoContext';

//import { folderHandlerContract } from '../../utils/contracts';

const Folder = ({ id }) => {
  const {
    state: { getFolderHandlerContract },
  } = useKopo();
  const { folderId, setFolderId } = useState();

  const getFolder = async (id) => {
    if (!getFolderHandlerContract) return;
    const contract = await getFolderHandlerContract(id);
    const folderId = await contract.folderId();
    console.log(folderId);
    // setFolderId('a');
  };

  useEffect(() => {
    (async () => {
      getFolder(id);
      console.log(setFolderId);
    })();
  }, [getFolderHandlerContract, id]);

  return <div>Numéro de dossier: {folderId}</div>;
};

export async function getServerSideProps(context) {
  const { id } = context.params;

  return {
    props: {
      id: id,
    },
  };
}

export default Folder;
