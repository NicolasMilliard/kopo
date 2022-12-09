import { useEffect, useState } from 'react';
import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { folderFactoryContract } from '../../utils/contracts';

// GETTERS
const RegisteredFolders = () => {
  const [registeredFolders, setRegisteredFolders] = useState('');
  const { data } = useContractRead({
    address: '0x6fE42193dF6a7151CdD1a8EDA11258D3a14E0CE9',
    abi: folderFactoryContract.abi,
    functionName: 'registeredFolders',
    watch: true,
  });

  useEffect(() => {
    if (data) {
      setRegisteredFolders(data);
    }
  }, [data]);

  // pas testé (vide par défaut, faudra surement formatté registeredFolders)
  return <h3 className="text-lg">registeredFolders: {registeredFolders}</h3>;
};

// SETTERS
const CreateFolder = () => {
  const { config, error } = usePrepareContractWrite({
    address: '0x28Ac5e2f5b0065C9b0E69539a9E2f1eAf1fa0625',
    abi: folderFactoryContract.abi,
    functionName: 'createFolder',
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const handleSubmit = (event) => {
    event.preventDefault();
    write();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          className="mt-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
        >
          createFolder
        </button>
      </form>
    </>
  );
};

const CreateFolderWithNonce = () => {
  const [nonce, setNonce] = useState('');
  const { config, error } = usePrepareContractWrite({
    address: '0x28Ac5e2f5b0065C9b0E69539a9E2f1eAf1fa0625',
    abi: folderFactoryContract.abi,
    args: [nonce],
    functionName: 'createFolderWithNonce',
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const handleSubmit = (event) => {
    event.preventDefault();
    write();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input id="nonce" placeholder="Enter nonce" onChange={(e) => setNonce(e.target.value)} />
        <button
          type="submit"
          className="mt-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
        >
          createFolder
        </button>
      </form>
    </>
  );
};

const BatchCreateFolders = () => {
  const [quantity, setQuantity] = useState('');
  const { config, error } = usePrepareContractWrite({
    address: '0x28Ac5e2f5b0065C9b0E69539a9E2f1eAf1fa0625',
    abi: folderFactoryContract.abi,
    args: [quantity],
    functionName: 'batchCreateFolders',
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const handleSubmit = (event) => {
    event.preventDefault();
    write();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input id="quantity" placeholder="Enter quantity" onChange={(e) => setQuantity(e.target.value)} />
        <button
          type="submit"
          className="mt-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
        >
          batchCreateFolders
        </button>
      </form>
    </>
  );
};

const WagmiTest = () => {
  return (
    <>
      <RegisteredFolders />
      <CreateFolder />
      <CreateFolderWithNonce />
      <BatchCreateFolders />
    </>
  );
};

export default WagmiTest;
