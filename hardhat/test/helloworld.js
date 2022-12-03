const { expect } = require('chai');
const hre = require('hardhat');

describe('Hello World Contract', () => {
  beforeEach(async () => {
    const constructorMessage = 'Hello from constructor';
    const helloContractFactory = await hre.ethers.getContractFactory('HelloWorld');
    helloContract = await helloContractFactory.deploy(constructorMessage);
    await helloContract.deployed();
    const [owner, account1, account2, account3, account4] = await hre.ethers.getSigners();
  });

  describe('Test', async () => {
    it('set a hello world message.', async () => {
      const message = 'Hello world';
      await expect(helloContract.setMessage(message)).to.not.be.reverted;
    });

    it('get the proper message.', async () => {
      const origMessage = 'Hello from constructor';
      let message = await helloContract.getMessage();
      await expect(message).to.be.equal(origMessage);
    });
  });
});
