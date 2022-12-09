import folderFactoryContractArtifact from '../../../artifacts/contracts/KopoFolderFactory.sol/KopoFolderFactory.json';

import { ethers } from 'ethers';

function folderFactoryContract() {
  const contractAddress = process.env.KOPO_FOLDER_FACTORY_LOCALHOST;
  const contractABI = folderFactoryContractArtifact.abi;
  let contract;
  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      contract = new ethers.Contract(contractAddress, contractABI, signer);
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log('ERROR:', error);
  }
  return contract;
}

export default folderFactoryContract;
