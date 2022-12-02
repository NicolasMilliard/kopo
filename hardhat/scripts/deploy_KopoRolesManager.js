const hre = require('hardhat');
require('dotenv').config();

const main = async () => {
  await hre.ethers.provider.ready;
  const [deployer] = await hre.ethers.getSigners();
  let balance = await deployer.getBalance();
  console.log(`[+] Deployer balance: ${balance.toString()}`);

  /* Deploying contract */
  const KopoRolesManager = await hre.ethers.getContractFactory('KopoRolesManager');
  const kopoRolesManager = await KopoRolesManager.deploy();
  await kopoRolesManager.deployed();
  // console.log(`HelloWorld is deployed: ${helloWorld.address}`);

  /* Checking balance again */
  balance = await deployer.getBalance();
  console.log(`[+] Deployer balance: ${balance.toString()}`);
};

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
