const { expect } = require('chai');
const hre = require('hardhat');

describe('KopoDocumentHandler Contract', () => {
  let owner;
  let verified1;
  let hacker;
  let kopoAddressProvider;
  let kopoDocumentContract;

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
    await kopoAddressProvider.setRolesContractAddress(kopoRolesManager.address);
    await kopoRolesManager.verifyUser(verified1.address);
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
   * Testing minting document NFT.
   */
  describe('Minting NFT', async () => {});

  /**
   * Testing transfering a document NFT.
   */
  describe('Transfering NFT', async () => {});
});
