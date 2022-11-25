require('@nomiclabs/hardhat-waffle');
require('hardhat-gas-reporter');
require('solidity-coverage');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.17',
  paths: {
    sources: './contracts',
    artifacts: '../client/artifacts',
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: { chainId: 1337 },
    localhost: { chainId: 1337, url: 'http://localhost:8545' },
  },
  mocha: {
    parallel: true,
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
  },

  // settings: {
  //   optimizer: {
  //     enabled: true,
  //     runs: 200
  //   }
  // }
};
