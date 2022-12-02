const { expect } = require('chai');
const hre = require('hardhat');

describe('📚 Testing KopoAddressProvider...', async () => {
  // Variables used through all tests
  let kopoAddressProviderProxy;
  const kopoFolderFactoryContractAddress = "0x1284294ddBD4Fe3D675741c306F2B6Eaa4d6D9A9";
  const kopoRolesContractAddress = "0x1284294ddBD4Fe3D675741c306F2B6Eaa4d6D9A9";
  const zeroAddress = "0x0000000000000000000000000000000000000000";
  const testingNewContractAddress = "0xA56f1A7b95D5C2E01A97fE6c17103822cc191E0E";
  let _owner;
  let _user;

  // Testing KopoAddressProvider
  describe('\n📕 DEPLOY CONTRACT FAILED\n', async () => {
    it('should revert: kopoFolderFactoryContractAddress is not a contract', async () => {
      const KopoAddressProvider = await hre.ethers.getContractFactory("KopoAddressProvider");

      const receipt = hre.upgrades.deployProxy(KopoAddressProvider, [zeroAddress, kopoRolesContractAddress], { initializer: 'initialize' });
      await expect(receipt).to.be.revertedWith("_kopoFolderFactoryContractAddress is not a contract");
    });

    it('should revert: kopoRolesContractAddress is not a contract', async () => {
      const KopoAddressProvider = await hre.ethers.getContractFactory("KopoAddressProvider");

      const receipt = hre.upgrades.deployProxy(KopoAddressProvider, [kopoFolderFactoryContractAddress, zeroAddress], { initializer: 'initialize' });
      await expect(receipt).to.be.revertedWith("_kopoRolesContractAddress is not a contract");
    });
  });

  describe('\n📗 DEPLOY CONTRACT', async () => {
    beforeEach(async () => {
      const KopoAddressProvider = await hre.ethers.getContractFactory("KopoAddressProvider");
      kopoAddressProviderProxy = await hre.upgrades.deployProxy(KopoAddressProvider, [kopoFolderFactoryContractAddress, kopoRolesContractAddress], { initializer: 'initialize' });
      [_owner, _user] = await hre.ethers.getSigners();
    });

    describe('\n✨ CONTEXT: Test initialize\n', async () => {
      // When contract is deployed, kopoFolderFactoryContractAddress is init
      it('should init kopoFolderFactoryContractAddress (POV _owner)', async () => {
        const receipt = await kopoAddressProviderProxy.getKopoFolderFactoryContractAddress({ from: _owner.address });
        await expect(receipt).to.be.equal(kopoFolderFactoryContractAddress);
      });

      // When contract is deployed, kopoRolesContractAddress is init
      it('should init kopoRolesContractAddress (POV _owner)', async () => {
        const receipt = await kopoAddressProviderProxy.getKopoRolesContractAddress({ from: _owner.address });
        await expect(receipt).to.be.equal(kopoRolesContractAddress);
      });

      // When contract is deployed, owner address is init
      it('should init owner address (POV _owner)', async () => {
        const receipt = await kopoAddressProviderProxy.owner();
        await expect(receipt).to.be.equal(_owner.address);
      });

      it('should revert: initialize can be call only once (POV _owner)', async () => {
        const receipt = kopoAddressProviderProxy.initialize(kopoFolderFactoryContractAddress, kopoRolesContractAddress);
        await expect(receipt).to.be.revertedWith("Initializable: contract is already initialized");
      });
    });

    describe('\n✨ CONTEXT: Test setKopoFolderFactoryContractAddress\n', async () => {
      it('should update kopoFolderFactoryContractAddress (POV _owner)', async () => {
        // Update kopoFolderFactoryContractAddress
        await kopoAddressProviderProxy.setKopoFolderFactoryContractAddress(testingNewContractAddress, { from: _owner.address });

        // Get kopoFolderFactoryContractAddress
        const receipt = await kopoAddressProviderProxy.getKopoFolderFactoryContractAddress({ from: _owner.address });
        await expect(receipt).to.be.equal(testingNewContractAddress);
      });

      it('should revert: caller is not the owner (POV _user)', async () => {
        // Update kopoFolderFactoryContractAddress
        const receipt = kopoAddressProviderProxy.connect(_user).setKopoFolderFactoryContractAddress(testingNewContractAddress, { from: _user.address });
        await expect(receipt).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it('should revert: new contract address is identical to the current one (POV _owner)', async () => {
        // Update kopoFolderFactoryContractAddress
        const receipt = kopoAddressProviderProxy.setKopoFolderFactoryContractAddress(kopoFolderFactoryContractAddress, { from: _owner.address });
        await expect(receipt).to.be.revertedWith("Contract address must be different from the current one");
      });

      it('should revert: new contract address is not a contract (POV _owner)', async () => {
        // Update kopoFolderFactoryContractAddress
        const receipt = kopoAddressProviderProxy.setKopoFolderFactoryContractAddress(zeroAddress, { from: _owner.address });
        await expect(receipt).to.be.revertedWith("_contractAddress is not a contract");
      });

      it('should emit kopoFolderFactoryContractUpdated event (POV _owner)', async () => {
        // kopoFolderFactoryContractUpdated event is correctly emit
        await expect(kopoAddressProviderProxy.setKopoFolderFactoryContractAddress(testingNewContractAddress, { from: _owner.address })).to.emit(
          kopoAddressProviderProxy,
          'kopoFolderFactoryContractUpdated',
        );
      });
    });

    describe('\n✨ CONTEXT: Test setRolesContractAddress\n', async () => {
      it('should update kopoRolesContractAddress (POV _owner)', async () => {
        // Update kopoRolesContractAddress
        await kopoAddressProviderProxy.setRolesContractAddress(testingNewContractAddress, { from: _owner.address });

        // Get kopoFolderFactoryContractAddress
        const receipt = await kopoAddressProviderProxy.getKopoRolesContractAddress({ from: _owner.address });
        await expect(receipt).to.be.equal(testingNewContractAddress);
      });

      it('should revert: caller is not the owner (POV _user)', async () => {
        // Update kopoRolesContractAddress
        const receipt = kopoAddressProviderProxy.connect(_user).setRolesContractAddress(testingNewContractAddress, { from: _user.address });
        await expect(receipt).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it('should revert: new contract address is identical to the current one (POV _owner)', async () => {
        // Update kopoRolesContractAddress
        const receipt = kopoAddressProviderProxy.setRolesContractAddress(kopoRolesContractAddress, { from: _owner.address });
        await expect(receipt).to.be.revertedWith("Contract address must be different from the current one");
      });

      it('should revert: new contract address is not a contract (POV _owner)', async () => {
        // Update kopoRolesContractAddress
        const receipt = kopoAddressProviderProxy.setRolesContractAddress(zeroAddress, { from: _owner.address });
        await expect(receipt).to.be.revertedWith("_contractAddress is not a contract");
      });

      it('should emit kopoRolesContractUpdated event (POV _owner)', async () => {
        // kopoRolesContractUpdated event is correctly emit
        await expect(kopoAddressProviderProxy.setRolesContractAddress(testingNewContractAddress, { from: _owner.address })).to.emit(
          kopoAddressProviderProxy,
          'kopoRolesContractUpdated',
        );
      });
    });

    describe('\n✨ CONTEXT: Test getKopoFolderFactoryContractAddress\n', async () => {
      it('should get kopoFolderFactoryContractAddress (POV _owner)', async () => {
        const receipt = await kopoAddressProviderProxy.getKopoFolderFactoryContractAddress({ from: _owner.address });
        await expect(receipt).to.be.equal(kopoFolderFactoryContractAddress);
      });

      it('should get kopoFolderFactoryContractAddress updated (POV _owner)', async () => {
        // Update kopoFolderFactoryContractAddress
        await kopoAddressProviderProxy.setKopoFolderFactoryContractAddress(testingNewContractAddress, { from: _owner.address });

        // Get kopoFolderFactoryContractAddress
        const receipt = await kopoAddressProviderProxy.getKopoFolderFactoryContractAddress({ from: _owner.address });
        await expect(receipt).to.be.equal(testingNewContractAddress);
      });

      it('should revert: caller is not the owner (POV _user)', async () => {
        // Get kopoFolderFactoryContractAddress
        const receipt = kopoAddressProviderProxy.connect(_user).getKopoFolderFactoryContractAddress({ from: _user.address });
        await expect(receipt).to.be.revertedWith("Ownable: caller is not the owner");
      });
    });

    describe('\n✨ CONTEXT: Test getKopoRolesContractAddress\n', async () => {
      it('should get kopoRolesContractAddress (POV _owner)', async () => {
        const receipt = await kopoAddressProviderProxy.getKopoRolesContractAddress({ from: _owner.address });
        await expect(receipt).to.be.equal(kopoRolesContractAddress);
      });

      it('should get kopoRolesContractAddress updated (POV _owner)', async () => {
        // Update kopoRolesContractAddress
        await kopoAddressProviderProxy.setRolesContractAddress(testingNewContractAddress, { from: _owner.address });

        // Get kopoRolesContractAddress
        const receipt = await kopoAddressProviderProxy.getKopoRolesContractAddress({ from: _owner.address });
        await expect(receipt).to.be.equal(testingNewContractAddress);
      });

      it('should revert: caller is not the owner (POV _user)', async () => {
        // Get kopoRolesContractAddress
        const receipt = kopoAddressProviderProxy.connect(_user).getKopoRolesContractAddress({ from: _user.address });
        await expect(receipt).to.be.revertedWith("Ownable: caller is not the owner");
      });
    });
  });

  // Testing KopoAddressProvider after an upgrade
  describe('\n\n📘 UPGRADE CONTRACT', async () => {
    beforeEach(async () => {
      const KopoAddressProvider = await hre.ethers.getContractFactory("KopoAddressProvider");
      kopoAddressProviderProxy = await hre.upgrades.deployProxy(KopoAddressProvider, [kopoFolderFactoryContractAddress, kopoRolesContractAddress], { initializer: 'initialize' });

      const KopoAddressProviderV2 = await hre.ethers.getContractFactory("KopoAddressProvider_testonly");
      kopoAddressProviderProxy = await upgrades.upgradeProxy(kopoAddressProviderProxy, KopoAddressProviderV2);
      // console.log(`Your upgraded proxy id done! Proxy address: ${kopoAddressProviderProxy.address}`);
      [_owner, _user] = await hre.ethers.getSigners();
    });

    describe('\n✨ CONTEXT: Test storage\n', async () => {
      // When contract is upgraded, kopoFolderFactoryContractAddress keep its value
      it('should get kopoFolderFactoryContractAddress (POV _owner)', async () => {
        const receipt = await kopoAddressProviderProxy.getKopoFolderFactoryContractAddress({ from: _owner.address });
        await expect(receipt).to.be.equal(kopoFolderFactoryContractAddress);
      });

      // When contract is upgraded, kopoRolesContractAddress keep its value
      it('should get kopoRolesContractAddress (POV _owner)', async () => {
        const receipt = await kopoAddressProviderProxy.getKopoRolesContractAddress({ from: _owner.address });
        await expect(receipt).to.be.equal(kopoRolesContractAddress);
      });

      // When contract is upgraded, testingContractAddress is init at 0x000...000
      it('should get testingContractAddress (POV _owner)', async () => {
        const receipt = await kopoAddressProviderProxy.getTestingContractAddress({ from: _owner.address });
        await expect(receipt).to.be.equal(zeroAddress);
      });
    });

    describe('\n✨ CONTEXT: Test setKopoFolderFactoryContractAddress\n', async () => {
      it('should update kopoFolderFactoryContractAddress (POV _owner)', async () => {
        // Update kopoFolderFactoryContractAddress
        await kopoAddressProviderProxy.setKopoFolderFactoryContractAddress(testingNewContractAddress, { from: _owner.address });

        // Get kopoFolderFactoryContractAddress
        const receipt = await kopoAddressProviderProxy.getKopoFolderFactoryContractAddress({ from: _owner.address });
        await expect(receipt).to.be.equal(testingNewContractAddress);
      });

      it('should revert: caller is not the owner (POV _user)', async () => {
        // Update kopoFolderFactoryContractAddress
        const receipt = kopoAddressProviderProxy.connect(_user).setKopoFolderFactoryContractAddress(testingNewContractAddress, { from: _user.address });
        await expect(receipt).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it('should revert: new contract address is identical to the current one (POV _owner)', async () => {
        // Update kopoFolderFactoryContractAddress
        const receipt = kopoAddressProviderProxy.setKopoFolderFactoryContractAddress(kopoFolderFactoryContractAddress, { from: _owner.address });
        await expect(receipt).to.be.revertedWith("Contract address must be different from the current one");
      });

      it('should revert: new contract address is not a contract (POV _owner)', async () => {
        // Update kopoFolderFactoryContractAddress
        const receipt = kopoAddressProviderProxy.setKopoFolderFactoryContractAddress(zeroAddress, { from: _owner.address });
        await expect(receipt).to.be.revertedWith("_contractAddress is not a contract");
      });

      it('should emit kopoFolderFactoryContractUpdated event (POV _owner)', async () => {
        // kopoFolderFactoryContractUpdated event is correctly emit
        await expect(kopoAddressProviderProxy.setKopoFolderFactoryContractAddress(testingNewContractAddress, { from: _owner.address })).to.emit(
          kopoAddressProviderProxy,
          'kopoFolderFactoryContractUpdated',
        );
      });
    });

    describe('\n✨ CONTEXT: Test setRolesContractAddress\n', async () => {
      it('should update kopoRolesContractAddress (POV _owner)', async () => {
        // Update kopoRolesContractAddress
        await kopoAddressProviderProxy.setRolesContractAddress(testingNewContractAddress, { from: _owner.address });

        // Get kopoFolderFactoryContractAddress
        const receipt = await kopoAddressProviderProxy.getKopoRolesContractAddress({ from: _owner.address });
        await expect(receipt).to.be.equal(testingNewContractAddress);
      });

      it('should revert: caller is not the owner (POV _user)', async () => {
        // Update kopoRolesContractAddress
        const receipt = kopoAddressProviderProxy.connect(_user).setRolesContractAddress(testingNewContractAddress, { from: _user.address });
        await expect(receipt).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it('should revert: new contract address is identical to the current one (POV _owner)', async () => {
        // Update kopoRolesContractAddress
        const receipt = kopoAddressProviderProxy.setRolesContractAddress(kopoRolesContractAddress, { from: _owner.address });
        await expect(receipt).to.be.revertedWith("Contract address must be different from the current one");
      });

      it('should revert: new contract address is not a contract (POV _owner)', async () => {
        // Update kopoRolesContractAddress
        const receipt = kopoAddressProviderProxy.setRolesContractAddress(zeroAddress, { from: _owner.address });
        await expect(receipt).to.be.revertedWith("_contractAddress is not a contract");
      });

      it('should emit kopoRolesContractUpdated event (POV _owner)', async () => {
        // kopoRolesContractUpdated event is correctly emit
        await expect(kopoAddressProviderProxy.setRolesContractAddress(testingNewContractAddress, { from: _owner.address })).to.emit(
          kopoAddressProviderProxy,
          'kopoRolesContractUpdated',
        );
      });
    });

    describe('\n✨ CONTEXT: Test setTestingContractAddress\n', async () => {
      it('should update testingContractAddress (POV _owner)', async () => {
        // Update testingContractAddress
        await kopoAddressProviderProxy.setTestingContractAddress(testingNewContractAddress, { from: _owner.address });

        // Get testingContractAddress
        const receipt = await kopoAddressProviderProxy.getTestingContractAddress({ from: _owner.address });
        await expect(receipt).to.be.equal(testingNewContractAddress);
      });

      it('should revert: caller is not the owner (POV _user)', async () => {
        // Update testingContractAddress
        const receipt = kopoAddressProviderProxy.connect(_user).setTestingContractAddress(testingNewContractAddress, { from: _user.address });
        await expect(receipt).to.be.revertedWith("Ownable: caller is not the owner");
      });

      it('should revert: new contract address is identical to the current one (POV _owner)', async () => {
        // Update testingContractAddress
        await kopoAddressProviderProxy.setTestingContractAddress(testingNewContractAddress, { from: _owner.address });

        const receipt = kopoAddressProviderProxy.setTestingContractAddress(testingNewContractAddress, { from: _owner.address });
        await expect(receipt).to.be.revertedWith("Contract address must be different from the current one");
      });

      it('should revert: new contract address is not a contract (POV _owner)', async () => {
        // Update testingContractAddress
        await kopoAddressProviderProxy.setTestingContractAddress(testingNewContractAddress, { from: _owner.address });

        // Update testingContractAddress to zeroAddress
        const receipt = kopoAddressProviderProxy.setTestingContractAddress(zeroAddress, { from: _owner.address });
        await expect(receipt).to.be.revertedWith("_contractAddress is not a contract");
      });

      it('should emit testingContractUpdated event (POV _owner)', async () => {
        // testingContractUpdated event is correctly emit
        await expect(kopoAddressProviderProxy.setTestingContractAddress(testingNewContractAddress, { from: _owner.address })).to.emit(
          kopoAddressProviderProxy,
          'testingContractUpdated',
        );
      });
    });

    describe('\n✨ CONTEXT: Test getKopoFolderFactoryContractAddress\n', async () => {
      it('should get kopoFolderFactoryContractAddress (POV _owner)', async () => {
        const receipt = await kopoAddressProviderProxy.getKopoFolderFactoryContractAddress({ from: _owner.address });
        await expect(receipt).to.be.equal(kopoFolderFactoryContractAddress);
      });

      it('should get kopoFolderFactoryContractAddress updated (POV _owner)', async () => {
        // Update kopoFolderFactoryContractAddress
        await kopoAddressProviderProxy.setKopoFolderFactoryContractAddress(testingNewContractAddress, { from: _owner.address });

        // Get kopoFolderFactoryContractAddress
        const receipt = await kopoAddressProviderProxy.getKopoFolderFactoryContractAddress({ from: _owner.address });
        await expect(receipt).to.be.equal(testingNewContractAddress);
      });

      it('should revert: caller is not the owner (POV _user)', async () => {
        // Get kopoFolderFactoryContractAddress
        const receipt = kopoAddressProviderProxy.connect(_user).getKopoFolderFactoryContractAddress({ from: _user.address });
        await expect(receipt).to.be.revertedWith("Ownable: caller is not the owner");
      });
    });

    describe('\n✨ CONTEXT: Test getKopoRolesContractAddress\n', async () => {
      it('should get kopoRolesContractAddress (POV _owner)', async () => {
        const receipt = await kopoAddressProviderProxy.getKopoRolesContractAddress({ from: _owner.address });
        await expect(receipt).to.be.equal(kopoRolesContractAddress);
      });

      it('should get kopoRolesContractAddress updated (POV _owner)', async () => {
        // Update kopoRolesContractAddress
        await kopoAddressProviderProxy.setRolesContractAddress(testingNewContractAddress, { from: _owner.address });

        // Get kopoRolesContractAddress
        const receipt = await kopoAddressProviderProxy.getKopoRolesContractAddress({ from: _owner.address });
        await expect(receipt).to.be.equal(testingNewContractAddress);
      });

      it('should revert: caller is not the owner (POV _user)', async () => {
        // Get kopoRolesContractAddress
        const receipt = kopoAddressProviderProxy.connect(_user).getKopoRolesContractAddress({ from: _user.address });
        await expect(receipt).to.be.revertedWith("Ownable: caller is not the owner");
      });
    });

    describe('\n✨ CONTEXT: Test getTestingContractAddress\n', async () => {
      it('should get testingContractAddress (POV _owner)', async () => {
        // Update testingContractAddress
        await kopoAddressProviderProxy.setTestingContractAddress(testingNewContractAddress, { from: _owner.address });

        // Get testingContractAddress
        const receipt = await kopoAddressProviderProxy.getTestingContractAddress({ from: _owner.address });
        await expect(receipt).to.be.equal(testingNewContractAddress);
      });

      it('should revert: caller is not the owner (POV _user)', async () => {
        // Get testingContractAddress
        const receipt = kopoAddressProviderProxy.connect(_user).getTestingContractAddress({ from: _user.address });
        await expect(receipt).to.be.revertedWith("Ownable: caller is not the owner");
      });
    });
  });
});