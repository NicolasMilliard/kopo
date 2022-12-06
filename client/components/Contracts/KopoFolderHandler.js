import { useEffect, useState } from 'react';
import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { addressProviderContract } from '../../utils/connectKopoAddressProvider';
import { folderHandlerContract } from '../../utils/connectKopoFolderHandler';

const SafeMint = () => {
  const [recipient, setRecipient] = useState('');
  const { config, error } = usePrepareContractWrite({
    address: 'XXX',
    abi: folderHandlerContract.abi,
    args: [recipient],
    functionName: 'safeMint',
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
          id="recipient"
          placeholder="Enter 0x address of recipient"
          onChange={(e) => setRecipient(e.target.value)}
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

const TransferOwnership = () => {
  const [newOwner, setNewOwner] = useState('');
  const { config, error } = usePrepareContractWrite({
    address: 'XXX',
    abi: folderHandlerContract.abi,
    args: [newOwner],
    functionName: 'transferOwnership',
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
          id="owner"
          placeholder="Enter 0x address of new owner"
          onChange={(e) => setRecipient(e.target.value)}
        />
        <button
          type="submit"
          className="mt-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
        >
          transferOwnership
        </button>
      </form>
    </>
  );
};

const OnERC721Received = () => {
  const [operator, setOperator] = useState('');
  const [from, setFrom] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [data, setData] = useState('');
  const { config, error } = usePrepareContractWrite({
    address: 'XXX',
    abi: folderHandlerContract.abi,
    args: [operator, from, tokenId, data],
    functionName: 'onERC721Received',
  });
  const { isLoading, isSuccess, write } = useContractWrite(config);

  const handleSubmit = (event) => {
    event.preventDefault();
    write();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          id="operator"
          placeholder="Enter 0x address of operator"
          onChange={(e) => setOperator(e.target.value)}
        />
        <input
          id="from"
          placeholder="Enter 0x address of from"
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          id="token_id"
          placeholder="Enter tokenId"
          onChange={(e) => setTokenId(e.target.value)}
        />
        <input
          id="data"
          placeholder="Enter data"
          onChange={(e) => setData(e.target.value)}
        />
        <button
          type="submit"
          className="mt-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
        >
          onERC721Received
        </button>
      </form>
    </>
  );
};

const WagmiTest = () => {
  return (
    <>
      <SafeMint />
      <TransferOwnership />
      <OnERC721Received />
    </>
  );
};

export default WagmiTest;