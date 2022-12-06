import { useEffect, useState } from 'react';
import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { addressProviderContract } from '../../utils/connectKopoAddressProvider';
import { documentHandlerContract } from '../../utils/connectKopoDocumentHandler';

const TokenURI = () => {
  const [tokenURI, setTokenURI] = useState('');
  const { config, error } = usePrepareContractWrite({
    address: '0x935ef94de66874c742432D70d251b8cb0ca4Af9f',
    abi: documentHandlerContract.abi,
    functionName: 'tokenURI',
    args: [tokenURI],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const handleSubmit = (event) => {
    event.preventDefault();
    write();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          id="message"
          placeholder="Enter token URI"
          onChange={(e) => setTokenURI(e.target.value)}
        />
        <button
          type="submit"
          className="mt-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
        >
          tokenURI
        </button>
      </form>
    </>
  );
};

const RequestToken = () => {
  const [documentCID, setDocumentCID] = useState('');
  const [obligeAddress, setObligeAddress] = useState('');
  const [folderAddress, setFolderAddress] = useState('');
  const { config, error } = usePrepareContractWrite({
    address: '0x935ef94de66874c742432D70d251b8cb0ca4Af9f',
    abi: documentHandlerContract.abi,
    functionName: 'requestToken',
    args: [documentCID, obligeAddress, folderAddress],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const handleSubmit = (event) => {
    event.preventDefault();
    write();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          id="document_cid"
          placeholder="Enter document CID"
          onChange={(e) => setDocumentCID(e.target.value)}
        />
        <input
          id="oblige_address"
          placeholder="Enter Ox address oblige"
          onChange={(e) => setObligeAddress(e.target.value)}
        />
        <input
          id="folder_address"
          placeholder="Enter Ox address folder"
          onChange={(e) => setFolderAddress(e.target.value)}
        />
        <button
          type="submit"
          className="mt-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
        >
          requestToken
        </button>
      </form>
    </>
  );
};

const RejectTokenRequest = () => {
  const [documentCID, setDocumentCID] = useState('');
  const { config, error } = usePrepareContractWrite({
    address: '0x935ef94de66874c742432D70d251b8cb0ca4Af9f',
    abi: documentHandlerContract.abi,
    functionName: 'rejectTokenRequest',
    args: [documentCID],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const handleSubmit = (event) => {
    event.preventDefault();
    write();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          id="message"
          placeholder="Enter document CID"
          onChange={(e) => setDocumentCID(e.target.value)}
        />
        <button
          type="submit"
          className="mt-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
        >
          rejectTokenRequest
        </button>
      </form>
    </>
  );
};

const SafeMint = () => {
  const [documentCID, setDocumentCID] = useState('');
  const [metadataCID, setMetadataCID] = useState('');
  const { config, error } = usePrepareContractWrite({
    address: '0x935ef94de66874c742432D70d251b8cb0ca4Af9f',
    abi: documentHandlerContract.abi,
    functionName: 'safeMint',
    args: [documentCID, metadataCID],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const handleSubmit = (event) => {
    event.preventDefault();
    write();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          id="document_cid"
          placeholder="Enter document CID"
          onChange={(e) => setDocumentCID(e.target.value)}
        />
        <input
          id="metadata_cid"
          placeholder="Enter metadata CID"
          onChange={(e) => setMetadataCID(e.target.value)}
        />
        <button
          type="submit"
          className="mt-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
        >
          safeMint
        </button>
      </form>
    </>
  );
};

const WagmiTest = () => {
  return (
    <>
      <TokenURI />
      <RequestToken />
      <RejectTokenRequest />
      <SafeMint />
    </>
  );
};

export default WagmiTest;