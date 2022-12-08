import { useEffect, useState } from 'react';
import { chain, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { addressProviderContract } from '../../utils/contracts';

// FolderFactoryContract
const GetFolderFactoryContractAddress = () => {
  const [folderFactory, setFolderFactory] = useState('');

  let { data } = useContractRead({
    address: addressProviderContract.address,
    abi: addressProviderContract.abi,
    functionName: 'folderFactoryContractAddress',
    watch: true,
  });

  useEffect(() => {
    if (data) {
      setFolderFactory(data);
    }
  }, [data]);

  return <h3 className="text-lg">folderFactoryContractAddress: {folderFactory}</h3>;
};

const SetFolderFactoryContractAddress = () => {
  const [folderFactory, setFolderFactory] = useState('');
  const { config, error } = usePrepareContractWrite({
    address: addressProviderContract.address,
    abi: addressProviderContract.abi,
    functionName: 'setFolderFactoryContractAddress',
    args: [folderFactory],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const handleSubmit = (event) => {
    event.preventDefault();
    write();
  };

  // if (isLoading) {
  //   return <div>folderFactory is being sent.</div>;
  // }

  // if (error) {
  //   return <div>Oops: {error.message}</div>;
  // }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input id="message" placeholder="Enter 0x address here" onChange={(e) => setFolderFactory(e.target.value)} />
        <button
          type="submit"
          className="mt-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
        >
          SetFolderFactoryContractAddress
        </button>
      </form>
    </>
  );
};

// RolesManagerContract
const GetRolesManagerContractAddress = () => {
  const [rolesManager, setRolesManager] = useState('');
  const { data } = useContractRead({
    address: addressProviderContract.address,
    abi: addressProviderContract.abi,
    functionName: 'rolesManagerContractAddress',
    watch: true,
  });

  useEffect(() => {
    if (data) {
      setRolesManager(data);
    }
  }, [data]);

  return <h3 className="text-lg">rolesManagerContractAddress: {rolesManager}</h3>;
};

const SetRolesManagerContractAddress = () => {
  const [rolesManager, setRolesManager] = useState('');
  const { config, error } = usePrepareContractWrite({
    address: addressProviderContract.address,
    abi: addressProviderContract.abi,
    functionName: 'setRolesManagerContractAddress',
    args: [rolesManager],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const handleSubmit = (event) => {
    event.preventDefault();
    write();
  };

  // if (isLoading) {
  //   return <div>folderFactory is being sent.</div>;
  // }

  // if (error) {
  //   return <div>Oops: {error.message}</div>;
  // }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input id="message" placeholder="Enter 0x address here" onChange={(e) => setRolesManager(e.target.value)} />
        <button
          type="submit"
          className="mt-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
        >
          SetRolesManagerContractAddress
        </button>
      </form>
    </>
  );
};

// DocumentHandlerContract
const GetDocumentHandlerContractAddress = () => {
  const [documentHandler, setDocumentHandler] = useState('');
  const { data } = useContractRead({
    address: addressProviderContract.address,
    abi: addressProviderContract.abi,
    functionName: 'documentHandlerContractAddress',
    watch: true,
  });

  useEffect(() => {
    if (data) {
      setDocumentHandler(data);
    }
  }, [data]);

  return <h3 className="text-lg">documentHandlerContractAddress: {documentHandler}</h3>;
};

const SetDocumentHandlerContractAddress = () => {
  const [documentHandler, setDocumentHandler] = useState('');
  const { config, error } = usePrepareContractWrite({
    address: addressProviderContract.address,
    abi: addressProviderContract.abi,
    functionName: 'setDocumentHandlerContractAddress',
    args: [documentHandler],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const handleSubmit = (event) => {
    event.preventDefault();
    write();
  };

  // if (isLoading) {
  //   return <div>folderFactory is being sent.</div>;
  // }

  // if (error) {
  //   return <div>Oops: {error.message}</div>;
  // }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input id="message" placeholder="Enter 0x address here" onChange={(e) => setDocumentHandler(e.target.value)} />
        <button
          type="submit"
          className="mt-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
        >
          setDocumentHandlerContractAddress
        </button>
      </form>
    </>
  );
};

const WagmiTest = () => {
  return (
    <>
      <GetFolderFactoryContractAddress />
      <GetRolesManagerContractAddress />
      <GetDocumentHandlerContractAddress />

      <SetFolderFactoryContractAddress />
      <SetRolesManagerContractAddress />
      <SetDocumentHandlerContractAddress />
    </>
  );
};

export default WagmiTest;
