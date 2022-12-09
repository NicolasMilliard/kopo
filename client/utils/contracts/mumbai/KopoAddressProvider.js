import addressProviderContractArtifact from '../../../artifacts/contracts/KopoAddressProvider.sol/KopoAddressProvider.json';

const addressProviderContract = {
  address: process.env.KOPO_ADDRESS_PROVIDER_LOCALHOST,
  abi: addressProviderContractArtifact.abi,
};

export default addressProviderContract;
