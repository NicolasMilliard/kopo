const { task } = require('hardhat/config');

/**
 * Verify a user.
 * @dev hh verifyUser
 */
task('verifyUser', 'Veridy a user')
  .addPositionalParam('roleManagerAddress')
  .addPositionalParam('destWallet')
  .setAction(async (args) => {
    const kopoRolesManagerProviderFactory = await hre.ethers.getContractFactory('KopoRolesManager');
    const kopoRolesManager = await kopoRolesManagerProviderFactory.attach(args.roleManagerAddress);
    console.log(`[+] KopoRolesManager: ${kopoRolesManager.address}`);

    const tx = await kopoRolesManager.verifyUser(args.destWallet);
    console.log(tx);
  });
