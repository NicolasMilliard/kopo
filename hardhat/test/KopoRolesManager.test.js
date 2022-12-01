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
    it('should set the role of the _owner to ADMIN (POV _owner)', async () => {
      const receipt = await kopoRolesManagerContract.getUserRole(_owner.address);
      await expect(receipt).to.be.equal(4);
    });
  });

  describe('\n✨ CONTEXT: Test setRoleAdmin\n', async () => {
    // Successfully add an ADMIN
    it('should set the role of the _admin to ADMIN (POV _owner)', async () => {
      await kopoRolesManagerContract.setRoleAdmin(_admin.address, { from: _owner.address });

      const receipt = await kopoRolesManagerContract.getUserRole(_admin.address);
      await expect(receipt).to.be.equal(4);
    });

    it('should revert: You\'re not an active admin (POV _user)', async () => {
      // Only an ADMIN can add an ADMIN
      const receipt = kopoRolesManagerContract.connect(_user).setRoleAdmin(_user.address, { from: _user.address });
      await expect(receipt).to.be.revertedWith("You're not an active admin");
    });

    it('should revert: Address 0 can\'t be updated(POV _admin)', async () => {
      // Set the role ADMIN to _admin
      await kopoRolesManagerContract.setRoleAdmin(_admin.address, { from: _owner.address });
      // address(0) can't be added
      const receipt = kopoRolesManagerContract.connect(_admin).setRoleAdmin("0x0000000000000000000000000000000000000000", { from: _admin.address });
      await expect(receipt).to.be.revertedWith("Address 0 can't be updated");
    });

    it('should revert: This address is already an admin (POV _admin)', async () => {
      // An ADMIN can be added only once
      await kopoRolesManagerContract.setRoleAdmin(_admin.address, { from: _owner.address });

      const receipt = kopoRolesManagerContract.connect(_admin).setRoleAdmin(_admin.address, { from: _admin.address });
      await expect(receipt).to.be.revertedWith("This address is already an admin");
    });

    it('should emit AdminAdded event (POV _owner)', async () => {
      // AdminAdded event is correctly emit
      await expect(kopoRolesManagerContract.setRoleAdmin(_admin.address, { from: _owner.address })).to.emit(
        kopoRolesManagerContract,
        'AdminAdded',
      );
    });
  });

  describe('\n✨ CONTEXT: Test updateUserRole\n', async () => {
    it('should update the user role to RGE (POV _user)', async () => {
      // Update the role of the _user to 2 (RGE)
      await kopoRolesManagerContract.connect(_user).updateUserRole(2, { from: _user.address });

      const receipt = await kopoRolesManagerContract.getUserRole(_user.address);
      await expect(receipt).to.be.equal(2);
    });

    it('should revert: Sender\'s address is blacklisted (POV _userBlacklisted)', async () => {
      // Set an user blacklisted
      await kopoRolesManagerContract.blacklistUser(_userBlacklisted.address);

      const receipt = kopoRolesManagerContract.connect(_userBlacklisted).updateUserRole(2, { from: _userBlacklisted.address });
      await expect(receipt).to.be.revertedWith("You're blacklisted");
    });

    it('should revert: _user has already this role (POV _user)', async () => {
      // Update the role of the _user to 3 (OBLIGE)
      await kopoRolesManagerContract.connect(_user).updateUserRole(3, { from: _user.address });

      const receipt = kopoRolesManagerContract.connect(_user).updateUserRole(3, { from: _user.address });
      await expect(receipt).to.be.revertedWith("Your address has already this role");
    });

    it('should revert: _user try to get the role ADMIN (POV _user)', async () => {
      // Update the role of the _user to 4 (ADMIN)
      const receipt = kopoRolesManagerContract.connect(_user).updateUserRole(4, { from: _user.address });
      await expect(receipt).to.be.revertedWith("You can't update to this role");
    });

    it('should emit UserRoleUpdated event (POV _user)', async () => {
      // UserRoleUpdated event is correctly emit
      await expect(kopoRolesManagerContract.connect(_user).updateUserRole(2, { from: _user.address })).to.emit(
        kopoRolesManagerContract,
        'UserRoleUpdated',
      );
    });
  });

  describe('\n✨ CONTEXT: Test verifyUser\n', async () => {
    it('should verify an user (POV _admin)', async () => {
      // Set _admin the role ADMIN
      await kopoRolesManagerContract.setRoleAdmin(_admin.address, { from: _owner.address });
      // Verify an user
      await kopoRolesManagerContract.connect(_admin).verifyUser(_user.address, { from: _admin.address });

      const receipt = await kopoRolesManagerContract.connect(_user).getUserVerifiedStatus(_user.address);
      await expect(receipt).to.be.equal(true);
    });

    it('should revert: only an ADMIN can verify an user (POV _user)', async () => {
      // Only an ADMIN can verify an user
      const receipt = kopoRolesManagerContract.connect(_user).verifyUser(_user.address, { from: _user.address });
      await expect(receipt).to.be.revertedWith("You're not an active admin");
    });

    it('should revert: address 0 can\'t be verified (POV _admin)', async () => {
      // Set _admin the role ADMIN
      await kopoRolesManagerContract.setRoleAdmin(_admin.address, { from: _owner.address });

      // address(0) can't be added
      const receipt = kopoRolesManagerContract.connect(_admin).verifyUser("0x0000000000000000000000000000000000000000", { from: _admin.address });
      await expect(receipt).to.be.revertedWith("Address 0 can't be updated");
    });

    it('should revert: user is already verified (POV _admin)', async () => {
      // Set _admin the role ADMIN
      await kopoRolesManagerContract.setRoleAdmin(_admin.address, { from: _owner.address });

      await kopoRolesManagerContract.connect(_admin).verifyUser(_user.address, { from: _admin.address });

      const receipt = kopoRolesManagerContract.connect(_admin).verifyUser(_user.address, { from: _admin.address });
      await expect(receipt).to.be.revertedWith("This address is already verified");
    });

    it('should emit UserVerified event (POV _admin)', async () => {
      // Set _admin the role ADMIN
      await kopoRolesManagerContract.setRoleAdmin(_admin.address, { from: _owner.address });

      // UserVerified event is correctly emit
      await expect(kopoRolesManagerContract.connect(_admin).verifyUser(_user.address, { from: _admin.address })).to.emit(
        kopoRolesManagerContract,
        'UserVerified',
      );
    });
  });

  describe('\n✨ CONTEXT: Test blacklistUser\n', async () => {
    it('should blacklist an user (POV _admin)', async () => {
      // Set _admin the role ADMIN
      await kopoRolesManagerContract.setRoleAdmin(_admin.address, { from: _owner.address });

      // Blacklist an user
      await kopoRolesManagerContract.connect(_admin).blacklistUser(_user.address, { from: _admin.address });

      const receipt = await kopoRolesManagerContract.connect(_user).getUserBlacklistedStatus(_user.address);
      await expect(receipt).to.be.equal(true);
    });

    it('should revert: only an ADMIN can blacklist an user (POV _user)', async () => {
      // Only an ADMIN can blacklist an user
      const receipt = kopoRolesManagerContract.connect(_user).blacklistUser(_user.address, { from: _user.address });
      await expect(receipt).to.be.revertedWith("You're not an active admin");
    });

    it('should revert: address 0 can\'t be blacklisted (POV _admin)', async () => {
      // Set _admin the role ADMIN
      await kopoRolesManagerContract.setRoleAdmin(_admin.address, { from: _owner.address });

      // address(0) can't be added
      const receipt = kopoRolesManagerContract.connect(_admin).blacklistUser("0x0000000000000000000000000000000000000000", { from: _admin.address });
      await expect(receipt).to.be.revertedWith("Address 0 can't be updated");
    });

    it('should revert: user is already blacklisted (POV _admin)', async () => {
      // Set _admin the role ADMIN
      await kopoRolesManagerContract.setRoleAdmin(_admin.address, { from: _owner.address });

      await kopoRolesManagerContract.connect(_admin).blacklistUser(_user.address, { from: _admin.address });

      const receipt = kopoRolesManagerContract.connect(_admin).blacklistUser(_user.address, { from: _admin.address });
      await expect(receipt).to.be.revertedWith("This address is already blacklisted");
    });

    it('should emit UserBlacklisted event (POV _admin)', async () => {
      // Set _admin the role ADMIN
      await kopoRolesManagerContract.setRoleAdmin(_admin.address, { from: _owner.address });

      // UserBlacklisted event is correctly emit
      await expect(kopoRolesManagerContract.connect(_admin).blacklistUser(_user.address, { from: _admin.address })).to.emit(
        kopoRolesManagerContract,
        'UserBlacklisted',
      );
    });
  });

  describe('\n✨ CONTEXT: Test getUserRole\n', async () => {
    it('should return the default role (POV _user)', async () => {
      // Returns the default role
      const receipt = await kopoRolesManagerContract.connect(_user).getUserRole(_user.address);
      await expect(receipt).to.be.equal(0);
    });

    it('should return the updated role (POV _user)', async () => {
      await kopoRolesManagerContract.connect(_user).updateUserRole(1);
      // Returns the updated role
      const receipt = await kopoRolesManagerContract.connect(_user).getUserRole(_user.address);
      await expect(receipt).to.be.equal(1);
    });
  });

  describe('\n✨ CONTEXT: Test getUserVerifiedStatus\n', async () => {
    it('should return false (POV _user)', async () => {
      // Returns isVerified (false)
      const receipt = await kopoRolesManagerContract.connect(_user).getUserVerifiedStatus(_user.address);
      await expect(receipt).to.be.equal(false);
    });

    it('should return true (POV _user)', async () => {
      // Set the role ADMIN to _admin
      await kopoRolesManagerContract.setRoleAdmin(_admin.address, { from: _owner.address });

      // Verify an user
      await kopoRolesManagerContract.connect(_admin).verifyUser(_user.address);

      // Returns isVerified (true)
      const receipt = await kopoRolesManagerContract.connect(_user).getUserVerifiedStatus(_user.address);
      await expect(receipt).to.be.equal(true);
    });
  });

  describe('\n✨ CONTEXT: Test getUserBlacklistedStatus\n', async () => {
    it('should return false (POV _user)', async () => {
      // Returns isBlacklisted (false)
      const receipt = await kopoRolesManagerContract.connect(_user).getUserBlacklistedStatus(_user.address);
      await expect(receipt).to.be.equal(false);
    });

    it('should return true (POV _user)', async () => {
      // Set the role ADMIN to _admin
      await kopoRolesManagerContract.setRoleAdmin(_admin.address, { from: _owner.address });

      // Verify an user
      await kopoRolesManagerContract.connect(_admin).blacklistUser(_user.address);

      // Returns isBlacklisted (true)
      const receipt = await kopoRolesManagerContract.connect(_user).getUserBlacklistedStatus(_user.address);
      await expect(receipt).to.be.equal(true);
    });
  });
});