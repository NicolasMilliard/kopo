const { expect } = require('chai');
const hre = require('hardhat');

describe('Testing KopoRolesManager...', async () => {
  // Variables used through all tests
  let kopoRolesManagerContract;
  let _owner;
  let _admin;
  let _user;
  let _userNotVerified;
  let _userBlacklisted;

  beforeEach(async () => {
    // Deploy contract and get signers
    const kopoRolesManager = await hre.ethers.getContractFactory('KopoRolesManager');
    kopoRolesManagerContract = await kopoRolesManager.deploy();
    await kopoRolesManagerContract.deployed();
    [_owner, _admin, _user, _userNotVerified, _userBlacklisted] = await hre.ethers.getSigners();
  });

  describe('\n✨ CONTEXT: Deploy contract\n', async () => {
    // When contract is deployed, _owner obtains ADMIN role
    it('should return 4: owner is an ADMIN (POV _owner)', async () => {
      const receipt = await kopoRolesManagerContract.getUserRole(_owner.address);
      await expect(receipt).to.be.equal(4);
    });
  });

  describe('\n✨ CONTEXT: Test setRoleAdmin\n', async () => {
    // Successfully add an ADMIN
    it('should return 4: admin is an ADMIN (POV _owner)', async () => {
      await kopoRolesManagerContract.setRoleAdmin(_admin.address, { from: _owner.address });

      const receipt = await kopoRolesManagerContract.getUserRole(_admin.address);
      await expect(receipt).to.be.equal(4);
    });

    it('should revert: Address 0 can\'t be updated(POV _admin)', async () => {
      // address(0) can't be added
      const receipt = kopoRolesManagerContract.connect(_admin).setRoleAdmin("0x0000000000000000000000000000000000000000", { from: _admin.address });
      await expect(receipt).to.be.revertedWith("Address 0 can't be updated");
    });

    it('should revert: You\'re not an active admin (POV _user)', async () => {
      // Only an ADMIN can add an ADMIN
      const receipt = kopoRolesManagerContract.connect(_user).setRoleAdmin(_user.address, { from: _user.address });
      await expect(receipt).to.be.revertedWith("You're not an active admin");
    });

    it('should revert: This address is already an admin (POV _admin)', async () => {
      // An ADMIN can be added only once
      await kopoRolesManagerContract.setRoleAdmin(_admin.address, { from: _owner.address });

      const receipt = kopoRolesManagerContract.connect(_admin).setRoleAdmin(_admin.address, { from: _admin.address });
      await expect(receipt).to.be.revertedWith("This address is already an admin");
    });

    it('should emit an event (POV _owner)', async () => {
      // AdminAdded event is correctly emit
      await expect(kopoRolesManagerContract.setRoleAdmin(_admin.address, { from: _owner.address })).to.emit(
        kopoRolesManagerContract,
        'AdminAdded',
      );
    });
  });
});