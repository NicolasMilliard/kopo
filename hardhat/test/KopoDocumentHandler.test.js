const { expect } = require('chai');
const hre = require('hardhat');

describe('KopoDocumentHandler Contract', () => {
  let owner;
  let oblige1;
  let verified1;
  let verified2;
  let hacker;
  let kopoAddressProvider;
  let kopoDocumentContract;
  let kopoFolderFactoryContract;
  let folderAddress;
  let folderAddress2;
  const documentCID = 'QmcQvCyLAncpEzvmYtKfvVPVayGqFvTQrYpUpPAJeoXGke';
  const metadataCID = 'zb2rhe5P4gXftAwvA4eXQ5HJwsER2owDyS9sKaQRRVQPn93bA';

  /**
   * @dev To launch every test, the address provider needs to be depoyed
   * and roles set.
   */
  before(async () => {
    [owner, oblige1, verified1, verified2, hacker] = await hre.ethers.getSigners();

    /* Deploying a role manager. */
    const kopoRolesManagerProviderFactory = await hre.ethers.getContractFactory('KopoRolesManager');
    const kopoRolesManager = await kopoRolesManagerProviderFactory.deploy();
    await kopoRolesManager.deployed();

    /* Deploying an address provider. */
    const kopoAddressProviderFactory = await hre.ethers.getContractFactory('KopoAddressProvider');
    kopoAddressProvider = await hre.upgrades.deployProxy(kopoAddressProviderFactory, [], {
      initializer: 'initialize',
    });
    await kopoAddressProvider.setRolesManagerContractAddress(kopoRolesManager.address);
    await kopoRolesManager.verifyUser(verified1.address);
    await kopoRolesManager.verifyUser(verified2.address);
    await kopoRolesManager.verifyUser(oblige1.address);
    await kopoRolesManager.updateUserRole(oblige1.address, 2);

    /* Deploying a folder factory for the tests. */
    const kopoFolderFactoryContractFactory = await hre.ethers.getContractFactory('KopoFolderFactory');
    kopoFolderFactoryContract = await kopoFolderFactoryContractFactory.deploy(kopoAddressProvider.address);
    await kopoFolderFactoryContract.deployed();
    await kopoAddressProvider.setFolderFactoryContractAddress(kopoFolderFactoryContract.address);

    /* Creating a new folder for the tests. */
    let tx = await kopoFolderFactoryContract.connect(verified1).createFolder();
    let receipt = await tx.wait();
    folderAddress = receipt.events[2].args._contract;

    tx = await kopoFolderFactoryContract.connect(verified2).createFolder();
    receipt = await tx.wait();
    folderAddress2 = receipt.events[2].args._contract;
  });

  /**
   * Before each tests, deploy a new fresh folder contract.
   */
  beforeEach(async () => {
    const kopoDocumentContractFactory = await hre.ethers.getContractFactory('KopoDocumentHandler');
    kopoDocumentContract = await kopoDocumentContractFactory.deploy(kopoAddressProvider.address);
    await kopoDocumentContract.deployed();
  });

  /**
   * Testing requesting an NFT.
   */
  describe('Token request', async () => {
    it('should request a new token.', async () => {
      await expect(kopoDocumentContract.connect(verified1).requestToken(documentCID, oblige1.address, folderAddress))
        .to.emit(kopoDocumentContract, 'TokenRequested')
        .withArgs(verified1.address, documentCID, oblige1.address, folderAddress);
    });

    it('should revert when requesting a new token when non verified (POV: hacker).', async () => {
      await expect(
        kopoDocumentContract.connect(hacker).requestToken(documentCID, oblige1.address, folderAddress),
      ).to.be.revertedWith('not verified');
    });

    it('should revert when requesting a new token to a non oblige address (POV: verified).', async () => {
      await expect(
        kopoDocumentContract.connect(verified1).requestToken(documentCID, hacker.address, folderAddress),
      ).to.be.revertedWith('not oblige');
    });

    it('should revert when requesting a new token to an invalid folder (POV: verified).', async () => {
      await expect(
        kopoDocumentContract
          .connect(verified1)
          .requestToken(documentCID, oblige1.address, kopoDocumentContract.address),
      ).to.be.reverted;
    });

    it('should revert when requesting a new token to a malicious folder (POV: verified).', async () => {
      /* Deploying a fake Folder contract that did not pass though the factory */
      const folderId = ethers.utils.formatBytes32String('0x0');
      const kopoFolderContractFactory = await hre.ethers.getContractFactory('KopoFolderHandler');
      kopoMaliciousFolderContract = await kopoFolderContractFactory.deploy(kopoAddressProvider.address, folderId);
      await kopoMaliciousFolderContract.deployed();

      await expect(
        kopoDocumentContract
          .connect(verified1)
          .requestToken(documentCID, oblige1.address, kopoMaliciousFolderContract.address),
      ).to.be.revertedWith('invalid folder contract');
    });

    it('should revert when requesting a new token to a folder we do not own (POV: verified).', async () => {
      await expect(
        kopoDocumentContract.connect(verified1).requestToken(documentCID, oblige1.address, folderAddress2),
      ).to.be.revertedWith('not folder owner');
    });

    it('should revert if request already sent (POV: verified).', async () => {
      await expect(kopoDocumentContract.connect(verified1).requestToken(documentCID, oblige1.address, folderAddress))
        .to.emit(kopoDocumentContract, 'TokenRequested')
        .withArgs(verified1.address, documentCID, oblige1.address, folderAddress);

      await expect(
        kopoDocumentContract.connect(verified1).requestToken(documentCID, oblige1.address, folderAddress),
      ).to.be.revertedWith('already requested');
    });
  });

  /**
   * Testing rejecting requests.
   */
  describe('Rejecting request', async () => {
    /**
     * Make a new NFT request before each tests so minting works.
     */
    beforeEach(async () => {
      await kopoDocumentContract.connect(verified1).requestToken(documentCID, oblige1.address, folderAddress);
    });

    it('should properly reject a token request (POV: oblige).', async () => {
      await expect(kopoDocumentContract.connect(oblige1).rejectTokenRequest(documentCID))
        .to.emit(kopoDocumentContract, 'TokenRejected')
        .withArgs(documentCID, oblige1.address, verified1.address, folderAddress);
    });

    it('should revert when rejecting a token request and not oblige (POV: hacker).', async () => {
      await expect(kopoDocumentContract.connect(hacker).rejectTokenRequest(documentCID)).to.be.revertedWith(
        'not proper oblige',
      );
    });

    it('should revert when rejecting a token twice (POV: oblige).', async () => {
      await kopoDocumentContract.connect(oblige1).rejectTokenRequest(documentCID);
      await expect(kopoDocumentContract.connect(oblige1).rejectTokenRequest(documentCID)).to.be.revertedWith(
        'invalid status',
      );
    });
  });

  /**
   * Testing minting document NFT.
   */
  describe('Minting NFT', async () => {
    /**
     * Make a new NFT request before each tests so minting works.
     */
    beforeEach(async () => {
      await kopoDocumentContract.connect(verified1).requestToken(documentCID, oblige1.address, folderAddress);
    });

    it('should mint a new NFT (POV: oblige).', async () => {
      await expect(kopoDocumentContract.connect(oblige1).safeMint(documentCID, metadataCID))
        .to.emit(kopoDocumentContract, 'Transfer')
        .withArgs(hre.ethers.constants.AddressZero, folderAddress, 0);
    });

    it('should rever when minting a new NFT from a non oblige (POV: hacker).', async () => {
      await expect(kopoDocumentContract.connect(hacker).safeMint(documentCID, metadataCID)).to.be.revertedWith(
        'not oblige',
      );
    });

    it('should retrieve a proper IPFS link from an NFT.', async () => {
      await kopoDocumentContract.connect(oblige1).safeMint(documentCID, metadataCID);
      const link = await kopoDocumentContract.tokenURI(0);
      expect(link).to.be.equal(metadataCID);
    });

    it('should revert if token does not exist.', async () => {
      await expect(kopoDocumentContract.tokenURI(0)).to.be.revertedWith('token does not exist');
    });

    it('should revert if token request was rejected.', async () => {
      await kopoDocumentContract.connect(oblige1).rejectTokenRequest(documentCID);
      await expect(kopoDocumentContract.connect(oblige1).safeMint(documentCID, metadataCID)).to.be.revertedWith(
        'invalid status',
      );
    });

    it('should revert if token request was rejected.', async () => {
      await kopoDocumentContract.connect(oblige1).rejectTokenRequest(documentCID);
      await expect(kopoDocumentContract.connect(oblige1).safeMint(documentCID, metadataCID)).to.be.revertedWith(
        'invalid status',
      );
    });
  });
});
