const { expect } = require('chai');
const hre = require('hardhat');

describe('KopoFolderHandler Contract', () => {
  let owner;
  let hacker;
  let account1;
  let kopoAddressProvider;
  let kopoFolderContract;

  /**
   * @dev To launch every test, the address provider needs to be depoyed.
   * This is common to each scripts.
   */
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
   * Before each tests, deploy a new fresh folder contract.
   */
  beforeEach(async () => {
    const folderId = ethers.utils.formatBytes32String('0x0');
    const kopoFolderContractFactory = await hre.ethers.getContractFactory('KopoFolderHandler');
    kopoFolderContract = await kopoFolderContractFactory.deploy(kopoAddressProvider.address, folderId);
    await kopoFolderContract.deployed();
    [owner, account1, hacker] = await hre.ethers.getSigners();
  });

  /**
   * Testing ownership.
   */
  describe('Ownership', async () => {
    it('should set the correct owner.', async () => {
      let contractOwner = await kopoFolderContract.owner();
      expect(contractOwner).to.be.equal(owner.address);
    });

    it.skip('should transfer ownership to a new verified user', async () => {
      // TODO White list account1 before.
      await expect(kopoFolderContract.transferOwnership(account1.address))
        .to.emit(kopoFolderContract, 'OwnershipTransferred')
        .withArgs(owner.address, account1.address);
    });

    it.skip('should prevent transfer to unverified user', async () => {
      await expect(kopoFolderContract.transferOwnership(hacker.address)).to.be.revertedWith('not verified');
    });
  });

  /**
   * Testing minting Folder NFT.
   */
  describe('Minting NFT', async () => {
    it('should mint a NFT to the contract owner.', async () => {
      await expect(kopoFolderContract.safeMint(owner.address))
        .to.emit(kopoFolderContract, 'Transfer')
        .withArgs(hre.ethers.constants.AddressZero, owner.address, hre.ethers.BigNumber.from(0));
    });

    it('should prevent minting a NFT if not owner (POV: hacker).', async () => {
      await expect(kopoFolderContract.connect(hacker).safeMint(hacker.address)).to.be.revertedWith(
        'Ownable: caller is not the owner',
      );
    });

    it('should prevent minting more NFT than MAX_SUPPLY.', async () => {
      let MAX_SUPPLY = await kopoFolderContract.MAX_SUPPLY();

      for (i = 0; i < MAX_SUPPLY; i++) {
        await kopoFolderContract.safeMint(owner.address);
      }

      /* Trying to mint one too many NFT. */
      await expect(kopoFolderContract.safeMint(hacker.address)).to.be.revertedWith('max supply reached');
    });
  });
});
