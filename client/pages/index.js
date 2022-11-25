import ContractTest from '../components/ContractTest';
import WagmiTest from '../components/WagmiTest';

const Index = () => {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Welcome to Kopo</h1>
      <WagmiTest />
      <ContractTest />
    </>
  );
};

export default Index;
