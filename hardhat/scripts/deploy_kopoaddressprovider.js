const hre = require('hardhat');

const main = async () => {
  // Contracts addresses
  const kopoFolderFactoryContractAddress = "0x1284294ddBD4Fe3D675741c306F2B6Eaa4d6D9A9";
  const kopoRolesContractAddress = "0x1284294ddBD4Fe3D675741c306F2B6Eaa4d6D9A9";

  const KopoAddressProvider = await hre.ethers.getContractFactory("KopoAddressProvider");
  console.log("Deploying KopoAddressProvider, ProxyAdmin, and then Proxy...");

  const proxy = await hre.upgrades.deployProxy(KopoAddressProvider, [kopoFolderFactoryContractAddress, kopoRolesContractAddress], { initializer: 'initialize' });
  console.log(`Proxy of KopoAddressProvider deployed to: ${proxy.address}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })