const { expect } = require('chai');
const hre = require('hardhat');

describe('KopoFolderHandler Contract', () => {
  let owner;
  let hacker;
  let verified1;
  let verified2;
  let kopoAddressProvider;
  let kopoFolderContract;

  /**
   * @dev To launch every test, the address provider needs to be depoyed
   * and roles set.
   */
  before(async () => {
    [owner, verified1, verified2, hacker] = await hre.ethers.getSigners();
    const kopoRolesManagerProviderFactory = await hre.ethers.getContractFactory('KopoRolesManager');
    const kopoRolesManager = await kopoRolesManagerProviderFactory.deploy();
    await kopoRolesManager.deployed();

    const kopoAddressProviderFactory = await hre.ethers.getContractFactory('KopoAddressProvider');
    kopoAddressProvider = await hre.upgrades.deployProxy(kopoAddressProviderFactory, [], {
      initializer: 'initialize',
    });
    await kopoAddressProvider.setRolesManagerContractAddress(kopoRolesManager.address);
    await kopoRolesManager.verifyUser(verified1.address);
    await kopoRolesManager.verifyUser(verified2.address);
  });

  /**
   * Before each tests, deploy a new fresh folder contract.
   */
  beforeEach(async () => {
    const folderId = ethers.utils.formatBytes32String('0x0');
    const kopoFolderContractFactory = await hre.ethers.getContractFactory('KopoFolderHandler');
    kopoFolderContract = await kopoFolderContractFactory.deploy(kopoAddressProvider.address, folderId);
    await kopoFolderContract.deployed();
  });

  /**
   * Testing ownership.
   */
  describe('Ownership', async () => {
    it('should set the correct owner.', async () => {
      let contractOwner = await kopoFolderContract.owner();
      expect(contractOwner).to.be.equal(owner.address);
    });

    it('should transfer ownership to a new verified user', async () => {
      await expect(kopoFolderContract.transferOwnership(verified1.address))
        .to.emit(kopoFolderContract, 'OwnershipTransferred')
        .withArgs(owner.address, verified1.address);
    });

    it('should prevent transfer to unverified user', async () => {
      await expect(kopoFolderContract.transferOwnership(hacker.address)).to.be.revertedWith('not verified');
    });

    it('should prevent transfer from a malicious user (POV: hacker)', async () => {
      await expect(kopoFolderContract.connect(hacker).transferOwnership(verified2.address)).to.be.revertedWith(
        'Ownable: caller is not the owner',
      );
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
