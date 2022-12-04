const { expect } = require('chai');
const hre = require('hardhat');

describe('📚 Testing KopoAddressProvider...', async () => {
  // Variables used through all tests
  const folderFactoryContractAddress = '0x1284294ddBD4Fe3D675741c306F2B6Eaa4d6D9A9';
  let kopoAddressProviderProxy;
  let testingNewContractAddress;
  // const zeroAddress = hre.ethers.constants.AddressZero;
  let _owner;
  let _user;

  before(async () => {
    // Deploy KopoRolesContractManger
    const KopoRolesManagerContract = await hre.ethers.getContractFactory('KopoRolesManager');
    const kopoRolesManagerContract = await KopoRolesManagerContract.deploy();
    await kopoRolesManagerContract.deployed();
    kopoRolesContractAddress = kopoRolesManagerContract.address;
    console.log('kopoRolesContractAddress:' + kopoRolesContractAddress);

    // Deploy KopoAddressProvider_testonly
    const KopoAddressProvider_testonly = await hre.ethers.getContractFactory('KopoAddressProvider_testonly');
    const kopoAddressProvider_testonly = await KopoAddressProvider_testonly.deploy();
    await kopoAddressProvider_testonly.deployed();
    testingNewContractAddress = kopoAddressProvider_testonly.address;
    console.log('testingNewContractAddress:' + testingNewContractAddress);
  });

  // Testing KopoAddressProvider
  describe('\n📕 DEPLOY CONTRACT FAILED\n', async () => {
    it('should revert: folderFactoryContractAddress is not a contract', async () => {
      const KopoAddressProvider = await hre.ethers.getContractFactory('KopoAddressProvider');

      const receipt = hre.upgrades.deployProxy(KopoAddressProvider, [zeroAddress, kopoRolesContractAddress], {
        initializer: 'initialize',
      });
      await expect(receipt).to.be.revertedWith('_folderFactoryContractAddress is not a contract');
    });

    it('should revert: kopoRolesContractAddress is not a contract', async () => {
      const KopoAddressProvider = await hre.ethers.getContractFactory('KopoAddressProvider');

      const receipt = hre.upgrades.deployProxy(KopoAddressProvider, [folderFactoryContractAddress, zeroAddress], {
        initializer: 'initialize',
      });
      await expect(receipt).to.be.revertedWith('_rolesContractAddress is not a contract');
    });
  });

  describe('\n📗 DEPLOY CONTRACT', async () => {
    beforeEach(async () => {
      const KopoAddressProvider = await hre.ethers.getContractFactory('KopoAddressProvider');
      kopoAddressProviderProxy = await hre.upgrades.deployProxy(
        KopoAddressProvider,
        [folderFactoryContractAddress, kopoRolesContractAddress],
        { initializer: 'initialize' },
      );
      [_owner, _user] = await hre.ethers.getSigners();
    });

    describe('\n✨ CONTEXT: Test initialize\n', async () => {
      // When contract is deployed, folderFactoryContractAddress is init
      it('should init folderFactoryContractAddress (POV _owner)', async () => {
        const receipt = (await kopoAddressProviderProxy.folderFactoryContractAddress()).toString();
        // const receipt = await kopoAddressProviderProxy.getFolderFactoryContractAddress({ from: _owner.address });
        await expect(receipt).to.be.equal(folderFactoryContractAddress);
      });

      // When contract is deployed, kopoRolesContractAddress is init
      it('should init kopoRolesContractAddress (POV _owner)', async () => {
        const receipt = (await kopoAddressProviderProxy.rolesContractAddress()).toString();
        await expect(receipt).to.be.equal(kopoRolesContractAddress);
      });

      // When contract is deployed, owner address is init
      it('should init owner address (POV _owner)', async () => {
        const receipt = await kopoAddressProviderProxy.owner();
        await expect(receipt).to.be.equal(_owner.address);
      });

      it('should revert: initialize can be call only once (POV _owner)', async () => {
        const receipt = kopoAddressProviderProxy.initialize(folderFactoryContractAddress, kopoRolesContractAddress);
        await expect(receipt).to.be.revertedWith('Initializable: contract is already initialized');
      });
    });

    describe('\n✨ CONTEXT: Test setFolderFactoryContractAddress\n', async () => {
      it('should update folderFactoryContractAddress (POV _owner)', async () => {
        // Update folderFactoryContractAddress
        await kopoAddressProviderProxy.setFolderFactoryContractAddress(testingNewContractAddress, {
          from: _owner.address,
        });

        // Get folderFactoryContractAddress
        const receipt = (await kopoAddressProviderProxy.folderFactoryContractAddress()).toString();
        await expect(receipt).to.be.equal(testingNewContractAddress);
      });

      it('should revert: caller is not the owner (POV _user)', async () => {
        // Update folderFactoryContractAddress
        const receipt = kopoAddressProviderProxy
          .connect(_user)
          .setFolderFactoryContractAddress(testingNewContractAddress, { from: _user.address });
        await expect(receipt).to.be.revertedWith('Ownable: caller is not the owner');
      });

      it('should revert: new contract address is not a contract (POV _owner)', async () => {
        // Update folderFactoryContractAddress
        const receipt = kopoAddressProviderProxy.setFolderFactoryContractAddress(zeroAddress, { from: _owner.address });
        await expect(receipt).to.be.revertedWith('_contractAddress is not a contract');
      });

      it('should emit kopoFolderFactoryContractUpdated event (POV _owner)', async () => {
        // kopoFolderFactoryContractUpdated event is correctly emit
        await expect(
          kopoAddressProviderProxy.setFolderFactoryContractAddress(testingNewContractAddress, { from: _owner.address }),
        ).to.emit(kopoAddressProviderProxy, 'folderFactoryContractUpdated');
      });
    });

    describe('\n✨ CONTEXT: Test setRolesContractAddress\n', async () => {
      it('should update kopoRolesContractAddress (POV _owner)', async () => {
        // Update kopoRolesContractAddress
        await kopoAddressProviderProxy.setRolesContractAddress(testingNewContractAddress, { from: _owner.address });

        // Get folderFactoryContractAddress
        const receipt = (await kopoAddressProviderProxy.rolesContractAddress()).toString();
        await expect(receipt).to.be.equal(testingNewContractAddress);
      });

      it('should revert: caller is not the owner (POV _user)', async () => {
        // Update kopoRolesContractAddress
        const receipt = kopoAddressProviderProxy
          .connect(_user)
          .setRolesContractAddress(testingNewContractAddress, { from: _user.address });
        await expect(receipt).to.be.revertedWith('Ownable: caller is not the owner');
      });

      it('should revert: new contract address is not a contract (POV _owner)', async () => {
        // Update kopoRolesContractAddress
        const receipt = kopoAddressProviderProxy.setRolesContractAddress(zeroAddress, { from: _owner.address });
        await expect(receipt).to.be.revertedWith('_contractAddress is not a contract');
      });

      it('should emit rolesContractUpdated event (POV _owner)', async () => {
        // kopoRolesContractUpdated event is correctly emit
        await expect(
          kopoAddressProviderProxy.setRolesContractAddress(testingNewContractAddress, { from: _owner.address }),
        ).to.emit(kopoAddressProviderProxy, 'rolesContractUpdated');
      });
    });
  });

  // Testing KopoAddressProvider after an upgrade
  describe('\n\n📘 UPGRADE CONTRACT', async () => {
    beforeEach(async () => {
      const KopoAddressProvider = await hre.ethers.getContractFactory('KopoAddressProvider');
      kopoAddressProviderProxy = await hre.upgrades.deployProxy(
        KopoAddressProvider,
        [folderFactoryContractAddress, kopoRolesContractAddress],
        { initializer: 'initialize' },
      );

      const KopoAddressProviderV2 = await hre.ethers.getContractFactory('KopoAddressProvider_testonly');
      kopoAddressProviderProxy = await upgrades.upgradeProxy(kopoAddressProviderProxy, KopoAddressProviderV2);
      [_owner, _user] = await hre.ethers.getSigners();
    });

    describe('\n✨ CONTEXT: Test storage\n', async () => {
      // When contract is upgraded, folderFactoryContractAddress keep its value
      it('should get folderFactoryContractAddress (POV _owner)', async () => {
        const receipt = (await kopoAddressProviderProxy.folderFactoryContractAddress()).toString();
        await expect(receipt).to.be.equal(folderFactoryContractAddress);
      });

      // When contract is upgraded, kopoRolesContractAddress keep its value
      it('should get kopoRolesContractAddress (POV _owner)', async () => {
        const receipt = (await kopoAddressProviderProxy.rolesContractAddress()).toString();
        await expect(receipt).to.be.equal(kopoRolesContractAddress);
      });

      // When contract is upgraded, testingContractAddress is init at 0x000...000
      it('should get testingContractAddress (POV _owner)', async () => {
        const receipt = (await kopoAddressProviderProxy.testingContractAddress()).toString();
        await expect(receipt).to.be.equal(zeroAddress);
      });
    });

    describe('\n✨ CONTEXT: Test setFolderFactoryContractAddress\n', async () => {
      it('should update folderFactoryContractAddress (POV _owner)', async () => {
        // Update folderFactoryContractAddress
        await kopoAddressProviderProxy.setFolderFactoryContractAddress(testingNewContractAddress, {
          from: _owner.address,
        });

        // Get folderFactoryContractAddress
        const receipt = (await kopoAddressProviderProxy.folderFactoryContractAddress()).toString();
        await expect(receipt).to.be.equal(testingNewContractAddress);
      });

      it('should revert: caller is not the owner (POV _user)', async () => {
        // Update folderFactoryContractAddress
        const receipt = kopoAddressProviderProxy
          .connect(_user)
          .setFolderFactoryContractAddress(testingNewContractAddress, { from: _user.address });
        await expect(receipt).to.be.revertedWith('Ownable: caller is not the owner');
      });

      it('should revert: new contract address is not a contract (POV _owner)', async () => {
        // Update folderFactoryContractAddress
        const receipt = kopoAddressProviderProxy.setFolderFactoryContractAddress(zeroAddress, { from: _owner.address });
        await expect(receipt).to.be.revertedWith('_contractAddress is not a contract');
      });

      it('should emit folderFactoryContractUpdated event (POV _owner)', async () => {
        // folderFactoryContractUpdated event is correctly emit
        await expect(
          kopoAddressProviderProxy.setFolderFactoryContractAddress(testingNewContractAddress, { from: _owner.address }),
        ).to.emit(kopoAddressProviderProxy, 'folderFactoryContractUpdated');
      });
    });

    describe('\n✨ CONTEXT: Test setRolesContractAddress\n', async () => {
      it('should update rolesContractAddress (POV _owner)', async () => {
        // Update kopoRolesContractAddress
        await kopoAddressProviderProxy.setRolesContractAddress(testingNewContractAddress, { from: _owner.address });

        // Get folderFactoryContractAddress
        const receipt = (await kopoAddressProviderProxy.rolesContractAddress()).toString();
        await expect(receipt).to.be.equal(testingNewContractAddress);
      });

      it('should revert: caller is not the owner (POV _user)', async () => {
        // Update kopoRolesContractAddress
        const receipt = kopoAddressProviderProxy
          .connect(_user)
          .setRolesContractAddress(testingNewContractAddress, { from: _user.address });
        await expect(receipt).to.be.revertedWith('Ownable: caller is not the owner');
      });

      it('should revert: new contract address is not a contract (POV _owner)', async () => {
        // Update kopoRolesContractAddress
        const receipt = kopoAddressProviderProxy.setRolesContractAddress(zeroAddress, { from: _owner.address });
        await expect(receipt).to.be.revertedWith('_contractAddress is not a contract');
      });

      it('should emit kopoRolesContractUpdated event (POV _owner)', async () => {
        // kopoRolesContractUpdated event is correctly emit
        await expect(
          kopoAddressProviderProxy.setRolesContractAddress(testingNewContractAddress, { from: _owner.address }),
        ).to.emit(kopoAddressProviderProxy, 'rolesContractUpdated');
      });
    });

    describe('\n✨ CONTEXT: Test setTestingContractAddress\n', async () => {
      it('should update testingContractAddress (POV _owner)', async () => {
        // Update testingContractAddress
        await kopoAddressProviderProxy.setTestingContractAddress(testingNewContractAddress, { from: _owner.address });

        // Get testingContractAddress
        const receipt = (await kopoAddressProviderProxy.testingContractAddress()).toString();
        await expect(receipt).to.be.equal(testingNewContractAddress);
      });

      it('should revert: caller is not the owner (POV _user)', async () => {
        // Update testingContractAddress
        const receipt = kopoAddressProviderProxy
          .connect(_user)
          .setTestingContractAddress(testingNewContractAddress, { from: _user.address });
        await expect(receipt).to.be.revertedWith('Ownable: caller is not the owner');
      });

      it('should revert: new contract address is not a contract (POV _owner)', async () => {
        // Update testingContractAddress
        await kopoAddressProviderProxy.setTestingContractAddress(testingNewContractAddress, { from: _owner.address });

        // Update testingContractAddress to zeroAddress
        const receipt = kopoAddressProviderProxy.setTestingContractAddress(zeroAddress, { from: _owner.address });
        await expect(receipt).to.be.revertedWith('_contractAddress is not a contract');
      });

      it('should emit testingContractUpdated event (POV _owner)', async () => {
        // testingContractUpdated event is correctly emit
        await expect(
          kopoAddressProviderProxy.setTestingContractAddress(testingNewContractAddress, { from: _owner.address }),
        ).to.emit(kopoAddressProviderProxy, 'testingContractUpdated');
      });
    });
  });
});
