const hre = require('hardhat');
require('dotenv').config();

const main = async () => {
  await hre.ethers.provider.ready;
  const [deployer] = await hre.ethers.getSigners();

  /* Deployer's balance */
  let balance = await deployer.getBalance();
  console.log(`[+] Deployer orig balance: ${hre.ethers.utils.formatEther(balance)}`);
  console.log();

  /* Deploy KopoAddressProvider */
  const kopoAddressProviderFactory = await hre.ethers.getContractFactory('KopoAddressProvider');
  kopoAddressProvider = await hre.upgrades.deployProxy(kopoAddressProviderFactory, [], {
    initializer: 'initialize',
  });
  console.log(`[+] KopoAddressProvider: ${kopoAddressProvider.address}`);

  /* Kopo Roles Manager */
  const kopoRolesManagerProviderFactory = await hre.ethers.getContractFactory('KopoRolesManager');
  const kopoRolesManager = await kopoRolesManagerProviderFactory.deploy();
  await kopoRolesManager.deployed();
  console.log(`[+] KopoRolesManager: ${kopoRolesManager.address}`);
  await kopoAddressProvider.setRolesContractAddress(kopoRolesManager.address);

  /* Kopo Document Handler */
  const kopoDocumentHandlerFactory = await hre.ethers.getContractFactory('KopoDocumentHandler');
  const kopoDocumentHandler = await kopoDocumentHandlerFactory.deploy(kopoAddressProvider.address);
  await kopoDocumentHandler.deployed();
  console.log(`[+] KopoDocumentHandler: ${kopoDocumentHandler.address}`);
  await kopoAddressProvider.setDocumentHandlerContractAddress(kopoDocumentHandler.address);

  /* Kopo Folder Factory. KopoFolderHandler is deployed with. */
  const kopoFolderFactoryFactory = await hre.ethers.getContractFactory('KopoDocumentHandler');
  const kopoFolderFactory = await kopoFolderFactoryFactory.deploy(kopoAddressProvider.address);
  await kopoFolderFactory.deployed();
  console.log(`[+] KopoFolderFactory: ${kopoFolderFactory.address}`);
  await kopoAddressProvider.setFolderFactoryContractAddress(kopoRolesManager.address);

  /* Checking balance again */
  balance = await deployer.getBalance();
  console.log();
  console.log(`[+] Deployer new balance: ${hre.ethers.utils.formatEther(balance)}`);
};

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
