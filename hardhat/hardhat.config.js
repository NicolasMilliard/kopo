require('dotenv').config();
require('@nomicfoundation/hardhat-chai-matchers');
require('@nomiclabs/hardhat-ethers');
require('hardhat-gas-reporter');
require('solidity-coverage');
require('@nomiclabs/hardhat-etherscan');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.17',
  paths: {
    sources: './contracts',
    artifacts: '../client/artifacts',
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      chainId: 1337,
      url: 'http://localhost:8545',
    },
    mumbai: {
      url: process.env.MUMBAI_ENDPOINT,
      accounts: [
        process.env.ACCOUNT1,
        process.env.ACCOUNT2,
        process.env.ACCOUNT3,
        process.env.ACCOUNT4,
      ],
      gas: 2100000,
      gasPrice: 8000000000,
    },
  },
  mocha: {},
  gasReporter: {
    enabled: true,
    currency: 'USD',
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  etherscan: {
    apiKey: {
      polygon: process.env.POLYGONSCAN_KEY,
      polygonMumbai: process.env.POLYGONSCAN_KEY,
    },
  },
};
