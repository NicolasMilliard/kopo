const { expect } = require('chai');
const hre = require('hardhat');

const folderFactoryContractAddress = "0x...";
const folderContractAddress = "0x...";
const rolesContractAddress = "0x...";

describe('AddressProvider', function () {
  it('works', async () => {
    const AddressProvider = await hre.ethers.getContractFactory('AddressProvider');
    const AddressProviderV2 = await hre.ethers.getContractFactory('AddressProviderV2');

    const instance = await hre.upgrades.deployProxy(AddressProvider, [folderFactoryContractAddress, folderContractAddress, rolesContractAddress]);
    const upgraded = await hre.upgrades.upgradeProxy(instance.address, AddressProviderV2);

    const value = await upgraded.value();
    expect(value[0].toString()).to.equal('0x...');
  });
});