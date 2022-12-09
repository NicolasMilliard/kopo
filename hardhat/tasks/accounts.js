const { task } = require('hardhat/config');

/**
 * Display the list of accounts.
 * @dev hh accounts
 */
task('accounts', 'Prints the list of accounts', async () => {
  const hdNode = ethers.utils.HDNode.fromMnemonic(process.env.WALLET_DEV_MNEMONIC);
  const accounts = await ethers.getSigners();
  let i = 0;
  for (const account of accounts) {
    const wallet = hdNode.derivePath(`m/44'/60'/0'/0/${i++}`);
    const balance = await ethers.provider.getBalance(account.address);
    console.log(`- Address: ${account.address}: - Balance: ${ethers.utils.formatEther(balance)} ETH`);
    console.log(`  Private Key: ${wallet.privateKey}`);
  }
});
