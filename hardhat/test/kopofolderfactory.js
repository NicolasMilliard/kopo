const { expect } = require('chai');
const hre = require('hardhat');

describe('KopoFolderHandler Contract', () => {
  let owner;
  let hacker;

  /**
   * Deploy a fresh new KopoFolderFactory before each tests.
   */
  beforeEach(async () => {
    const kopoFolderFactoryContractFactory = await hre.ethers.getContractFactory(
      'KopoFolderFactory',
    );
    kopoFolderFactoryContract = await kopoFolderFactoryContractFactory.deploy();
    await kopoFolderFactoryContract.deployed();
    [owner, hacker] = await hre.ethers.getSigners();
  });

  /**
   * Testing the folder factory.
   */
  describe('Factory', async () => {
    it('create a new contract with the proper event.', async () => {
      await expect(kopoFolderFactoryContract.createFolder()).to.emit(
        kopoFolderFactoryContract,
        'NewFolder',
      );
    });

    it('forbid unregistered users from deploying a new contract (POV: hacker).', async () => {
      await expect(kopoFolderFactoryContract.connect(hacker).createFolder()).to.be.revertedWith(
        'not allowed',
      );
    });

    /**
     * Test that the new deployed contract really creates an NFT and
     * sets the proper owner.
     */
    describe('NFT & Owner', async () => {
      let kopoFolderContract;
      let address;

      /**
       * Deploy a new fresh child contract before each tests.
       */
      beforeEach(async () => {
        const tx = await kopoFolderFactoryContract.createFolder();
        let receipt = await tx.wait();
        address = receipt.events[3].args._contract;
        const kopoFolderContractFactory = await hre.ethers.getContractFactory('KopoFolderHandler');
        kopoFolderContract = await kopoFolderContractFactory.attach(address);
      });

      it('mint a new NFT when creating a new contract.', async () => {
        expect(await kopoFolderContract.balanceOf(owner.address)).to.be.equal(1);
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
