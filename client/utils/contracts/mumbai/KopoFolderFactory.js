import folderFactoryContractArtifact from '../../../artifacts/contracts/KopoFolderFactory.sol/KopoFolderFactory.json';

const folderFactoryContract = {
  address: process.env.KOPO_FOLDER_FACTORY_LOCALHOST,
  abi: folderFactoryContractArtifact.abi,
};

export default folderFactoryContract;
