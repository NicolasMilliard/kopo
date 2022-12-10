const { task } = require('hardhat/config');

/**
 * Update a user the role OBLIGE
 * @dev hh updateUserRole
 */
task('updateUserRole', 'Update user role')
  .addPositionalParam('roleManagerAddress')
  .addPositionalParam('destWallet')
  .addPositionalParam('userRole')
  .setAction(async (args) => {
    const kopoRolesManagerProviderFactory = await hre.ethers.getContractFactory('KopoRolesManager');
    const kopoRolesManager = await kopoRolesManagerProviderFactory.attach(args.roleManagerAddress);
    console.log(`[+] KopoRolesManager: ${kopoRolesManager.address}`);

    const tx = await kopoRolesManager.updateUserRole(args.destWallet, args.userRole);
    console.log(tx);
  });