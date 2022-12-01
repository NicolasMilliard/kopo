const { expect } = require('chai');
const hre = require('hardhat');

const folderFactoryContractAddress = "0x0000000000000000000000000000000000000000";
const folderContractAddress = "0x0000000000000000000000000000000000000000";
const rolesContractAddress = "0x0000000000000000000000000000000000000000";

describe('KopoAddressProvider', function () {




  // it('works', async () => {
  //   const KopoAddressProvider = await hre.ethers.getContractFactory('KopoAddressProvider');
  //   const KopoAddressProviderV2 = await hre.ethers.getContractFactory('KopoAddressProvider');

  //   const instance = await hre.upgrades.deployProxy(KopoAddressProvider, [folderFactoryContractAddress, folderContractAddress, rolesContractAddress]);
  //   const upgraded = await hre.upgrades.upgradeProxy(instance.address, KopoAddressProviderV2);

  //   const value = await upgraded.value();
  //   expect(value[0].toString()).to.equal('0x0000000000000000000000000000000000000000');
  // });
});