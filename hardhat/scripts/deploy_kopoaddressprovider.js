const hre = require('hardhat');

const folderFactoryContractAddress = "0x...";
// const folderContractAddress = "0x...";
const rolesContractAddress = "0x...";

const main = async () => {
  const KopoAddressProvider = await hre.ethers.getContractFactory('KopoAddressProvider');

  const kopoAddressProvider = await hre.upgrades.deployProxy(KopoAddressProvider, [folderFactoryContractAddress, folderContractAddress, rolesContractAddress], {
    initializer: "initialize",
  });
  await kopoAddressProvider.deployed();
  console.log(`KopoAddressProvider is deployed: ${addressProvider.address}`);
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});