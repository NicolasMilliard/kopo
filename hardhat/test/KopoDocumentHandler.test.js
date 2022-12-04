const { expect } = require('chai');
const hre = require('hardhat');

describe('KopoDocumentHandler Contract', () => {
  let owner;
  let hacker;
  let account1;
  let kopoAddressProvider;
  let kopoDocumentContract;

  /**
   * @dev To launch every test, the address provider needs to be depoyed.
   * This is common to each scripts.
   */
  before(async () => {
    // TODO Use the real address provider.
    const kopoRolesManagerProviderFactory = await hre.ethers.getContractFactory(
      'contracts/KopoDocumentHandler.sol:KopoRolesManager',
    );
    const kopoRolesManager = await kopoRolesManagerProviderFactory.deploy();
    await kopoRolesManager.deployed();

    const kopoAddressProviderFactory = await hre.ethers.getContractFactory(
      'contracts/KopoDocumentHandler.sol:KopoAddressProvider',
    );
    kopoAddressProvider = await kopoAddressProviderFactory.deploy(kopoRolesManager.address);
    await kopoAddressProvider.deployed();
  });

  /**
   * Before each tests, deploy a new fresh folder contract.
   */
  beforeEach(async () => {
    const kopoDocumentContractFactory = await hre.ethers.getContractFactory('KopoDocumentHandler');
    kopoDocumentContract = await kopoDocumentContractFactory.deploy(kopoAddressProvider.address);
    await kopoDocumentContract.deployed();
    [owner, account1, hacker] = await hre.ethers.getSigners();
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
