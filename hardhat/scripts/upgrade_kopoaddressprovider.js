const hre = require('hardhat');

const kopoAddressProviderContractAddress = "0x...";

const main = async () => {
  const KopoAddressProviderUpgrade = await hre.ethers.getContractFactory('KopoAddressProviderV2');

  await hre.upgrades.upgradeProxy(kopoAddressProviderContractAddress, KopoAddressProviderUpgrade);
  console.log('KopoAddressProviderUpgrade upgraded');
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});