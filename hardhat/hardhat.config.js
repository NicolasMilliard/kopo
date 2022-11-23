require('@nomiclabs/hardhat-waffle');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.17',

  defaultNetwork: 'hardhat',
  networks: {
    hardhat: { chainId: 1337 },
  },

  // settings: {
  //   optimizer: {
  //     enabled: true,
  //     runs: 200
  //   }
  // }
};
