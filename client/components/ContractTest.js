import { useContractRead } from 'wagmi';
import { helloContract } from '../utils/connectContract';

const WagmiTest = () => {
  const { data, isError, isLoading } = useContractRead(helloContract, 'getMessage');

  return <p>Greeting: {data}</p>;
};

export default WagmiTest;
