require('dotenv').config();
require('@nomicfoundation/hardhat-chai-matchers');
require('@nomiclabs/hardhat-ethers');
require('@openzeppelin/hardhat-upgrades');
require('hardhat-gas-reporter');
require('solidity-coverage');
require('@nomiclabs/hardhat-etherscan');
const { utils } = require('ethers');

/**
 * Display the list of accounts.
 * @dev hh accounts
 */
task('accounts', 'Prints the list of accounts', async () => {
  const hdNode = utils.HDNode.fromMnemonic(process.env.WALLET_DEV_MNEMONIC);
  const accounts = await ethers.getSigners();
  let i = 0;
  for (const account of accounts) {
    const wallet = hdNode.derivePath(`m/44'/60'/0'/0/${i++}`);
    const balance = await ethers.provider.getBalance(account.address);
    console.log(
      `- Address: ${account.address}: - Balance: ${ethers.utils.formatEther(balance)} ETH`,
    );
    console.log(`  Private Key: ${wallet.privateKey}`);
  }
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: './contracts',
    artifacts: '../client/artifacts',
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: {
        mnemonic: process.env.WALLET_DEV_MNEMONIC,
        accountsBalance: '1000000000000000000000',
        count: 10,
      },
    },
    localhost: {
      chainId: 1337,
      url: 'http://localhost:8545',
    },
    mumbai: {
      url: process.env.MUMBAI_ENDPOINT,
      accounts: [process.env.DEPLOY_KEY_MUMBAI],
      gas: 2100000,
      gasPrice: 8000000000,
    },
  },
  mocha: {},
  gasReporter: {
    enabled: true,
    currency: 'USD',
  },

  etherscan: {
    apiKey: {
      polygon: process.env.POLYGONSCAN_KEY,
      polygonMumbai: process.env.POLYGONSCAN_KEY,
    },
  },
};
