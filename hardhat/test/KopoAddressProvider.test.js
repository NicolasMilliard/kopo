const { expect } = require('chai');
const hre = require('hardhat');

describe('📚 Testing KopoAddressProvider...', async () => {
  // Variables used through all tests
  let kopoAddressProviderProxy;
  let folderFactoryContractAddress;
  let rolesManagerContractAddress;
  let documentHandlerAddress;
  let testingContractAddress;
  const zeroAddress = hre.ethers.constants.AddressZero;
  let _owner;
  let _user;

  before(async () => {
    // Deploy KopoAddressProvider
    const KopoAddressProvider = await hre.ethers.getContractFactory('KopoAddressProvider');
    kopoAddressProviderProxy = await hre.upgrades.deployProxy(
      KopoAddressProvider,
      { initializer: 'initialize' },
    );
    [_owner, _user] = await hre.ethers.getSigners();

    // Deploy KopoFolderFactory
    const KopoFolderFactoryFactory = await hre.ethers.getContractFactory('KopoFolderFactory');
    const kopoFolderFactory = await KopoFolderFactoryFactory.deploy(kopoAddressProviderProxy.address);
    await kopoFolderFactory.deployed();
    folderFactoryContractAddress = kopoFolderFactory.address;

    // Deploy KopoRolesContractManger
    const KopoRolesManager = await hre.ethers.getContractFactory('KopoRolesManager');
    const kopoRolesManager = await KopoRolesManager.deploy();
    await kopoRolesManager.deployed();
    rolesManagerContractAddress = kopoRolesManager.address;

    // Deploy KopoDocumentHandler
    const KopoDocumentHandler = await hre.ethers.getContractFactory('KopoDocumentHandler');
    const kopoDocumentHandler = await KopoDocumentHandler.deploy(kopoAddressProviderProxy.address);
    await kopoDocumentHandler.deployed();
    documentHandlerAddress = kopoDocumentHandler.address;

    // Deploy a random contract to have a contract adress
    const KopoAddressProvider_testonly = await hre.ethers.getContractFactory('KopoAddressProvider_testonly');
    const kopoAddressProvider_testonly = await KopoAddressProvider_testonly.deploy();
    await kopoAddressProvider_testonly.deployed();
    testingContractAddress = kopoAddressProvider_testonly.address;
  });

  // Testing KopoAddressProvider
  describe('\n📗 DEPLOY CONTRACT', async () => {
    describe('\n✨ CONTEXT: Test initialize\n', async () => {
      // When contract is deployed, owner address is init
      it('should init owner address (POV _owner)', async () => {
        const receipt = await kopoAddressProviderProxy.owner();
        await expect(receipt).to.be.equal(_owner.address);
      });

      it('should revert: initialize can be call only once (POV _owner)', async () => {
        const receipt = kopoAddressProviderProxy.initialize();
        await expect(receipt).to.be.revertedWith('Initializable: contract is already initialized');
      });
    });

    describe('\n✨ CONTEXT: Test setFolderFactoryContractAddress\n', async () => {
      it('should update folderFactoryContractAddress (POV _owner)', async () => {
        // Update folderFactoryContractAddress
        await kopoAddressProviderProxy.setFolderFactoryContractAddress(folderFactoryContractAddress, {
          from: _owner.address,
        });

        // Get folderFactoryContractAddress
        const receipt = (await kopoAddressProviderProxy.folderFactoryContractAddress()).toString();
        await expect(receipt).to.be.equal(folderFactoryContractAddress);
      });

      it('should revert: caller is not the owner (POV _user)', async () => {
        // Update folderFactoryContractAddress
        const receipt = kopoAddressProviderProxy
          .connect(_user)
          .setFolderFactoryContractAddress(folderFactoryContractAddress);
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
          kopoAddressProviderProxy.setFolderFactoryContractAddress(folderFactoryContractAddress, { from: _owner.address }),
        ).to.emit(kopoAddressProviderProxy, 'folderFactoryContractUpdated');
      });
    });

    describe('\n✨ CONTEXT: Test setRolesManagerContractAddress\n', async () => {
      it('should update rolesManagerContractAddress (POV _owner)', async () => {
        // Update rolesManagerContractAddress
        await kopoAddressProviderProxy.setRolesManagerContractAddress(rolesManagerContractAddress, { from: _owner.address });

        // Get folderFactoryContractAddress
        const receipt = (await kopoAddressProviderProxy.rolesManagerContractAddress()).toString();
        await expect(receipt).to.be.equal(rolesManagerContractAddress);
      });

      it('should revert: caller is not the owner (POV _user)', async () => {
        // Update rolesManagerContractAddress
        const receipt = kopoAddressProviderProxy
          .connect(_user)
          .setRolesManagerContractAddress(rolesManagerContractAddress);
        await expect(receipt).to.be.revertedWith('Ownable: caller is not the owner');
      });

      it('should revert: new contract address is not a contract (POV _owner)', async () => {
        // Update rolesManagerContractAddress
        const receipt = kopoAddressProviderProxy.setRolesManagerContractAddress(zeroAddress, { from: _owner.address });
        await expect(receipt).to.be.revertedWith('_contractAddress is not a contract');
      });

      it('should emit rolesContractUpdated event (POV _owner)', async () => {
        // kopoRolesContractUpdated event is correctly emit
        await expect(
          kopoAddressProviderProxy.setRolesManagerContractAddress(rolesManagerContractAddress, { from: _owner.address }),
        ).to.emit(kopoAddressProviderProxy, 'rolesContractUpdated');
      });
    });

    describe('\n✨ CONTEXT: Test setDocumentHandlerContractAddress\n', async () => {
      it('should update documentHandlerContractAddress (POV _owner)', async () => {
        // Update documentHandlerContractAddress
        await kopoAddressProviderProxy.setDocumentHandlerContractAddress(documentHandlerAddress, { from: _owner.address });

        // Get folderFactoryContractAddress
        const receipt = (await kopoAddressProviderProxy.documentHandlerContractAddress()).toString();
        await expect(receipt).to.be.equal(documentHandlerAddress);
      });

      it('should revert: caller is not the owner (POV _user)', async () => {
        // Update documentHandlerContractAddress
        const receipt = kopoAddressProviderProxy
          .connect(_user)
          .setDocumentHandlerContractAddress(documentHandlerAddress);
        await expect(receipt).to.be.revertedWith('Ownable: caller is not the owner');
      });

      it('should revert: new contract address is not a contract (POV _owner)', async () => {
        // Update documentHandlerContractAddress
        const receipt = kopoAddressProviderProxy.setDocumentHandlerContractAddress(zeroAddress, { from: _owner.address });
        await expect(receipt).to.be.revertedWith('_contractAddress is not a contract');
      });

      it('should emit documentHandlerContractUpdated event (POV _owner)', async () => {
        // documentHandlerContractUpdated event is correctly emit
        await expect(
          kopoAddressProviderProxy.setDocumentHandlerContractAddress(documentHandlerAddress, { from: _owner.address }),
        ).to.emit(kopoAddressProviderProxy, 'documentHandlerContractUpdated');
      });
    });
  });

  // Testing KopoAddressProvider after an upgrade
  describe('\n\n📘 UPGRADE CONTRACT', async () => {
    before(async () => {
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

      // When contract is upgraded, rolesManagerContractAddress keep its value
      it('should get rolesManagerContractAddress (POV _owner)', async () => {
        const receipt = (await kopoAddressProviderProxy.rolesManagerContractAddress()).toString();
        await expect(receipt).to.be.equal(rolesManagerContractAddress);
      });

      // When contract is upgraded, documentHandlerContractAddress keep its value
      it('should get documentHandlerContractAddress (POV _owner)', async () => {
        const receipt = (await kopoAddressProviderProxy.documentHandlerContractAddress()).toString();
        await expect(receipt).to.be.equal(documentHandlerAddress);
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
        await kopoAddressProviderProxy.setFolderFactoryContractAddress(testingContractAddress, {
          from: _owner.address,
        });

        // Get folderFactoryContractAddress
        const receipt = (await kopoAddressProviderProxy.folderFactoryContractAddress()).toString();
        await expect(receipt).to.be.equal(testingContractAddress);
      });

      it('should revert: caller is not the owner (POV _user)', async () => {
        // Update folderFactoryContractAddress
        const receipt = kopoAddressProviderProxy
          .connect(_user)
          .setFolderFactoryContractAddress(testingContractAddress);
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
          kopoAddressProviderProxy.setFolderFactoryContractAddress(testingContractAddress, { from: _owner.address }),
        ).to.emit(kopoAddressProviderProxy, 'folderFactoryContractUpdated');
      });
    });

    describe('\n✨ CONTEXT: Test setRolesManagerContractAddress\n', async () => {
      it('should update rolesManagerContractAddress (POV _owner)', async () => {
        // Update rolesManagerContractAddress
        await kopoAddressProviderProxy.setRolesManagerContractAddress(testingContractAddress, { from: _owner.address });

        // Get folderFactoryContractAddress
        const receipt = (await kopoAddressProviderProxy.rolesManagerContractAddress()).toString();
        await expect(receipt).to.be.equal(testingContractAddress);
      });

      it('should revert: caller is not the owner (POV _user)', async () => {
        // Update rolesManagerContractAddress
        const receipt = kopoAddressProviderProxy
          .connect(_user)
          .setRolesManagerContractAddress(testingContractAddress);
        await expect(receipt).to.be.revertedWith('Ownable: caller is not the owner');
      });

      it('should revert: new contract address is not a contract (POV _owner)', async () => {
        // Update rolesManagerContractAddress
        const receipt = kopoAddressProviderProxy.setRolesManagerContractAddress(zeroAddress, { from: _owner.address });
        await expect(receipt).to.be.revertedWith('_contractAddress is not a contract');
      });

      it('should emit kopoRolesContractUpdated event (POV _owner)', async () => {
        // kopoRolesContractUpdated event is correctly emit
        await expect(
          kopoAddressProviderProxy.setRolesManagerContractAddress(testingContractAddress, { from: _owner.address }),
        ).to.emit(kopoAddressProviderProxy, 'rolesContractUpdated');
      });
    });

    describe('\n✨ CONTEXT: Test setDocumentHandlerContractAddress\n', async () => {
      it('should update documentHandlerContractAddress (POV _owner)', async () => {
        // Update documentHandlerContractAddress
        await kopoAddressProviderProxy.setDocumentHandlerContractAddress(testingContractAddress, { from: _owner.address });

        // Get folderFactoryContractAddress
        const receipt = (await kopoAddressProviderProxy.documentHandlerContractAddress()).toString();
        await expect(receipt).to.be.equal(testingContractAddress);
      });

      it('should revert: caller is not the owner (POV _user)', async () => {
        // Update documentHandlerContractAddress
        const receipt = kopoAddressProviderProxy
          .connect(_user)
          .setDocumentHandlerContractAddress(testingContractAddress);
        await expect(receipt).to.be.revertedWith('Ownable: caller is not the owner');
      });

      it('should revert: new contract address is not a contract (POV _owner)', async () => {
        // Update documentHandlerContractAddress
        const receipt = kopoAddressProviderProxy.setDocumentHandlerContractAddress(zeroAddress, { from: _owner.address });
        await expect(receipt).to.be.revertedWith('_contractAddress is not a contract');
      });

      it('should emit documentHandlerContractUpdated event (POV _owner)', async () => {
        // documentHandlerContractUpdated event is correctly emit
        await expect(
          kopoAddressProviderProxy.setDocumentHandlerContractAddress(testingContractAddress, { from: _owner.address }),
        ).to.emit(kopoAddressProviderProxy, 'documentHandlerContractUpdated');
      });
    });
  });

  describe('\n✨ CONTEXT: Test setTestingContractAddress\n', async () => {
    it('should update testingContractAddress (POV _owner)', async () => {
      // Update testingContractAddress
      await kopoAddressProviderProxy.setTestingContractAddress(testingContractAddress, { from: _owner.address });

      // Get testingContractAddress
      const receipt = (await kopoAddressProviderProxy.testingContractAddress()).toString();
      await expect(receipt).to.be.equal(testingContractAddress);
    });

    it('should revert: caller is not the owner (POV _user)', async () => {
      // Update testingContractAddress
      const receipt = kopoAddressProviderProxy
        .connect(_user)
        .setTestingContractAddress(testingContractAddress);
      await expect(receipt).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('should revert: new contract address is not a contract (POV _owner)', async () => {
      // Update testingContractAddress
      await kopoAddressProviderProxy.setTestingContractAddress(testingContractAddress, { from: _owner.address });

      // Update testingContractAddress to zeroAddress
      const receipt = kopoAddressProviderProxy.setTestingContractAddress(zeroAddress, { from: _owner.address });
      await expect(receipt).to.be.revertedWith('_contractAddress is not a contract');
    });

    it('should emit testingContractUpdated event (POV _owner)', async () => {
      // testingContractUpdated event is correctly emit
      await expect(
        kopoAddressProviderProxy.setTestingContractAddress(testingContractAddress, { from: _owner.address }),
      ).to.emit(kopoAddressProviderProxy, 'testingContractUpdated');
    });
  });
});