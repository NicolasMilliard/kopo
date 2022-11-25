import helloContractArtifact from '../artifacts/contracts/HelloWorld.sol/HelloWorld.json';

const helloContract = {
  address: process.env.HELLO_CONTRACT_LOCALHOST,
  abi: helloContractArtifact.abi,
};

export { helloContract };
