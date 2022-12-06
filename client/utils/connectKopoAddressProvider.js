import addressProviderContractArtifact from '../artifacts/contracts/KopoAddressProvider.sol/KopoAddressProvider.json';

const addressProviderContract = {
  address: process.env.KOPOADDRESSPROVIDER_LOCALHOST,
  abi: addressProviderContractArtifact.abi,
};

export { addressProviderContract };
