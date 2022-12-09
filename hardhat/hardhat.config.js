require('dotenv').config();
require('@nomicfoundation/hardhat-chai-matchers');
require('@nomiclabs/hardhat-ethers');
require('@openzeppelin/hardhat-upgrades');
require('hardhat-gas-reporter');
require('solidity-coverage');
require('@nomiclabs/hardhat-etherscan');

/**
 * Load tasks.
 */
require('./tasks/accounts');
require('./tasks/verifyUser');

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
