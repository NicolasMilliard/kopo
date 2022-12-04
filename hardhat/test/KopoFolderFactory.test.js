const { expect } = require('chai');
const hre = require('hardhat');

describe('KopoFolderHandler Contract', () => {
  let owner;
  let account1;
  let hacker;
  let kopoAddressProvider;

  before(async () => {
    // TODO Use the real address provider.
    const kopoRolesManagerProviderFactory = await hre.ethers.getContractFactory(
      'contracts/KopoFolderHandler.sol:KopoRolesManager',
    );
    const kopoRolesManager = await kopoRolesManagerProviderFactory.deploy();
    await kopoRolesManager.deployed();

    const kopoAddressProviderFactory = await hre.ethers.getContractFactory(
      'contracts/KopoFolderHandler.sol:KopoAddressProvider',
    );
    kopoAddressProvider = await kopoAddressProviderFactory.deploy(kopoRolesManager.address);
    await kopoAddressProvider.deployed();
  });

  /**
   * Deploy a fresh new KopoFolderFactory before each tests.
   */
  beforeEach(async () => {
    const kopoFolderFactoryContractFactory = await hre.ethers.getContractFactory('KopoFolderFactory');
    kopoFolderFactoryContract = await kopoFolderFactoryContractFactory.deploy(kopoAddressProvider.address);
    await kopoFolderFactoryContract.deployed();
    [owner, hacker] = await hre.ethers.getSigners();
  });

  /**
   * Testing the folder factory.
   */
  describe('Factory', async () => {
    it('create a new folder contract with the proper event.', async () => {
      await expect(kopoFolderFactoryContract.createFolder()).to.emit(kopoFolderFactoryContract, 'NewFolder');
    });

    it('create a new folder contract with a specific nonce.', async () => {
      const nonce = 1;
      await expect(kopoFolderFactoryContract.createFolderWithNonce(nonce)).to.emit(
        kopoFolderFactoryContract,
        'NewFolder',
      );
    });

    it('batch create a new folder contracts.', async () => {
      const amount = 21;
      await kopoFolderFactoryContract.batchCreateFolders(amount);
    });

    it.skip('forbids unregistered users from deploying a new contract (POV: hacker).', async () => {
      await expect(kopoFolderFactoryContract.connect(hacker).createFolder()).to.be.revertedWith('not verified');
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
        const tx = await kopoFolderFactoryContract.createFolder();
        let receipt = await tx.wait();
        address = receipt.events[2].args._contract;
        const kopoFolderContractFactory = await hre.ethers.getContractFactory('KopoFolderHandler');
        kopoFolderContract = await kopoFolderContractFactory.attach(address);
      });

      it('sets the correct owner when creating a new contract.', async () => {
        expect(await kopoFolderContract.owner()).to.be.equal(owner.address);
      });

      it("get the contract's address from a folderId.", async () => {
        let folderId = await kopoFolderContract.folderId();
        let returnedAddress = await kopoFolderFactoryContract.registeredFolders(folderId);
        expect(returnedAddress).to.be.equal(address);
      });
    });
  });
});
