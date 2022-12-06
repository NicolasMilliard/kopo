const { expect } = require('chai');
const hre = require('hardhat');

describe('KopoFolderHandler Contract', () => {
  let owner;
  let verified1;
  let hacker;
  let kopoAddressProvider;

  /**
   * @dev To launch every test, the address provider needs to be depoyed
   * and roles set.
   */
  before(async () => {
    [owner, verified1, hacker] = await hre.ethers.getSigners();
    const kopoRolesManagerProviderFactory = await hre.ethers.getContractFactory('KopoRolesManager');
    const kopoRolesManager = await kopoRolesManagerProviderFactory.deploy();
    await kopoRolesManager.deployed();

    const kopoAddressProviderFactory = await hre.ethers.getContractFactory('KopoAddressProvider');
    kopoAddressProvider = await hre.upgrades.deployProxy(kopoAddressProviderFactory, [], {
      initializer: 'initialize',
    });
    await kopoAddressProvider.setRolesManagerContractAddress(kopoRolesManager.address);
    await kopoRolesManager.verifyUser(verified1.address);
  });

  /**
   * Deploy a fresh new KopoFolderFactory before each tests.
   */
  beforeEach(async () => {
    const kopoFolderFactoryContractFactory = await hre.ethers.getContractFactory('KopoFolderFactory');
    kopoFolderFactoryContract = await kopoFolderFactoryContractFactory.deploy(kopoAddressProvider.address);
    await kopoFolderFactoryContract.deployed();
  });

  /**
   * Testing the folder factory.
   */
  describe('Factory', async () => {
    it('create a new folder contract with the proper event (POV: verified).', async () => {
      await expect(kopoFolderFactoryContract.connect(verified1).createFolder()).to.emit(
        kopoFolderFactoryContract,
        'NewFolder',
      );
    });

    it('create a new folder contract with a specific nonce (POV: verified).', async () => {
      const nonce = 1;
      await expect(kopoFolderFactoryContract.connect(verified1).createFolderWithNonce(nonce)).to.emit(
        kopoFolderFactoryContract,
        'NewFolder',
      );
    });

    it('batch create a new folder contracts (POV: verified).', async () => {
      const amount = 20;
      await kopoFolderFactoryContract.connect(verified1).batchCreateFolders(amount);
    });

    it('forbids unregistered users from deploying a new contract (POV: hacker).', async () => {
      await expect(kopoFolderFactoryContract.connect(hacker).createFolder()).to.be.revertedWith('not verified');
    });

    it('forbids unregistered users from deploying a new contract with nonce (POV: hacker).', async () => {
      const nonce = 1;
      await expect(kopoFolderFactoryContract.connect(hacker).createFolderWithNonce(nonce)).to.be.revertedWith(
        'not verified',
      );
    });

    it('forbids unregistered users from deploying a new contract with batch (POV: hacker).', async () => {
      const amount = 2;
      await expect(kopoFolderFactoryContract.connect(hacker).batchCreateFolders(amount)).to.be.revertedWith(
        'not verified',
      );
    });

    /**
     * Test that the new deployed contract really creates an NFT and
     * sets the proper owner.
     */
    describe('Owner & Folder Id', async () => {
      let kopoFolderContract;
      let address;

      /**
       * Deploy a new fresh child contract before each tests.
       */
      beforeEach(async () => {
        const tx = await kopoFolderFactoryContract.connect(verified1).createFolder();
        let receipt = await tx.wait();
        address = receipt.events[2].args._contract;
        const kopoFolderContractFactory = await hre.ethers.getContractFactory('KopoFolderHandler');
        kopoFolderContract = await kopoFolderContractFactory.attach(address);
      });

      it('sets the correct owner when creating a new contract.', async () => {
        expect(await kopoFolderContract.owner()).to.be.equal(verified1.address);
      });

      it("get the contract's address from a folderId.", async () => {
        let folderId = await kopoFolderContract.folderId();
        let returnedAddress = await kopoFolderFactoryContract.registeredFolders(folderId);
        expect(returnedAddress).to.be.equal(address);
      });
    });
  });
});
