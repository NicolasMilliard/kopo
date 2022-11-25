import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { helloContract } from '../utils/connectContract';

const WagmiTestRead = () => {
  const [message, setMessage] = useState('');
  const { data } = useContractRead({
    ...helloContract,
    functionName: 'getMessage',
    watch: true,
  });

  useEffect(() => {
    if (data) {
      setMessage(data);
    }
  }, [data]);

  return <h3 className="text-lg ">Message: {message}</h3>;
};

const WagmiTestWrite = () => {
  const [message, setMessage] = useState('');
  const { config, error } = usePrepareContractWrite({
    ...helloContract,
    functionName: 'setMessage',
    args: [message],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const handleSubmit = (event) => {
    event.preventDefault();
    write();
  };

  if (isLoading) {
    return <div>Message is being sent.</div>;
  }

  if (error) {
    return <div>Oops: {error.message}</div>;
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          id="message"
          placeholder="enter message here"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Send
        </button>
      </form>
    </>
  );
};

const WagmiTest = () => {
  return (
    <>
      <WagmiTestRead />
      <WagmiTestWrite />
    </>
  );
};

export default WagmiTest;
