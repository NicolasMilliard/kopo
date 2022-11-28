const hre = require('hardhat');

const folderFactoryContractAddress = "0x...";
const folderContractAddress = "0x...";
const rolesContractAddress = "0x...";

const main = async () => {
  const AddressProvider = await hre.ethers.getContractFactory('AddressProvder');

  const addressProvider = await hre.upgrades.deployProxy(AddressProvider, [folderFactoryContractAddress, folderContractAddress, rolesContractAddress], {
    initializer: "initialize",
  });
  await addressProvider.deployed();
  console.log(`AddressProvider is deployed: ${addressProvider.address}`);
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});