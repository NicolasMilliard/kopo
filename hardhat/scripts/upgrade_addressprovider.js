const hre = require('hardhat');

const addressProviderContractAddress = "0x...";

const main = async () => {
  const AddressProviderUpgrade = await hre.ethers.getContractFactory('AddressProviderV2');

  await hre.upgrades.upgradeProxy(addressProviderContractAddress, AddressProviderUpgrade);
  console.log('AddressProvider upgraded');
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});