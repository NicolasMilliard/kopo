const { expect } = require('chai');
const hre = require('hardhat');

describe('Voting Contract', () => {
  beforeEach(async () => {
    const helloContractFactory = await hre.ethers.getContractFactory('HelloWorld');
    helloContract = await helloContractFactory.deploy();
    await helloContract.deployed();
    const [owner, account1, account2, account3, account4] = await hre.ethers.getSigners();
  });

  describe('Test', async () => {
    it('set ahello world message.', async () => {
      let message = 'Hello world';
      await expect(helloContract.setMessage(message)).to.not.be.reverted;
    });
  });
});
