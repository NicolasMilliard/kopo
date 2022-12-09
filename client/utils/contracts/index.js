import { ethers } from 'ethers';

import addressProviderContractArtifact from '../../artifacts/contracts/KopoAddressProvider.sol/KopoAddressProvider.json';
import folderFactoryContractArtifact from '../../artifacts/contracts/KopoFolderFactory.sol/KopoFolderFactory.json';
import folderHandlerContractArtifact from '../../artifacts/contracts/KopoFolderHandler.sol/KopoFolderHandler.json';

import documentHandlerContractLocalhost from './localhost/KopoDocumentHandler';
// import folderHandlerContractLocalhost from './localhost/KopoFolderHandler';
import rolesManagerContractLocalhost from './localhost/KopoRolesManager';

const loadContract = (addr, abi) => {
  const contractAddress = addr;
  const contractABI = abi;
  let contract = undefined;
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
    console.log('Contract error:', error);
  }
  return contract;
};

const addressProviderContractLocalhost = loadContract(
  process.env.KOPO_ADDRESS_PROVIDER_LOCALHOST,
  addressProviderContractArtifact.abi,
);
const addressProviderContract = addressProviderContractLocalhost; // TODO Dynamically change this value.

/**
 * Retrieve the folder factory contract.
 * @returns An ethers contract of the folder factory.
 */
const folderFactoryContract = async () => {
  try {
    const address = await addressProviderContract.folderFactoryContractAddress();
    return loadContract(address, folderFactoryContractArtifact.abi);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Retrieve a folder's contract.
 * @param address Address of the folder contract.
 * @returns An ethers contract of the folder.
 */
const folderHandlerContract = async (address) => {
  try {
    return loadContract(address, folderHandlerContractArtifact.abi);
  } catch (error) {
    console.log(error);
  }
};

export {
  addressProviderContract,
  documentHandlerContractLocalhost as documentHandlerContract,
  folderFactoryContract,
  folderHandlerContract,
  rolesManagerContractLocalhost as rolesManagerContract,
};
