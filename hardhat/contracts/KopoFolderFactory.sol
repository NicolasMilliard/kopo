// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import './KopoFolderHandler.sol';
import './KopoAddressProvider.sol';
import './KopoRolesManager.sol';

/**
 * @title KopoFolderFactory
 * @author Nicolas Milliard - Matthieu Bonetti
 * @notice Factory for the KopoFolder contract
 * @dev KopoFolderFactory allows allowed address to deploy a new Folder factory
 */
contract KopoFolderFactory {
  KopoAddressProvider private immutable addressProvider;
  mapping(bytes32 => address) public registeredFolders;

  event NewFolder(address indexed _from, address indexed _contract, bytes32 indexed _folderId);

  /** @dev Calls KopoRolesManager to check. */
  modifier isVerified(address _addr) {
    require(KopoRolesManager(addressProvider.rolesManagerContractAddress()).isVerified(_addr) == true, 'not verified');
    _;
  }

  constructor(address _addressProvider) {
    addressProvider = KopoAddressProvider(_addressProvider);
  }

  /**
   * Deploy a new folder contract.
   * @dev Default nonce is 0.
   */
  function createFolder() external isVerified(msg.sender) {
    b_A6Q(0);
  }

  /**
   * Deploy a new contract using a specific nonce.
   * @param _nonce Used to generate the folder id.
   */
  function createFolderWithNonce(uint256 _nonce) external isVerified(msg.sender) {
    b_A6Q(_nonce);
  }

  /**
   * Batch create folders.
   * @param _amount Amount of folders to create.
   * @dev Warning! This function may cost a fair amount of gas. 21 folders is a maximum.
   */
  function batchCreateFolders(uint256 _amount) external isVerified(msg.sender) {
    _amount++;
    while (_amount-- > 1) {
      b_A6Q(_amount);
    }
  }

  /**
   * _createFolder() Each folders are identified with a folderId.
   * @param _nonce The nonce is here to support batch folder creation in one transaction.
   * @dev The name is optimized to be 0x0000e3fa as method id. This will save gas as it is the most called function.
   */
  function b_A6Q(uint256 _nonce) private {
    /* Generate a new folderId */
    bytes32 folderId = keccak256(abi.encodePacked(msg.sender, address(this), block.timestamp, _nonce));
    require(registeredFolders[folderId] == address(0), 'already registered');
    KopoFolderHandler newFolder = new KopoFolderHandler(address(addressProvider), folderId);
    registeredFolders[folderId] = address(newFolder);
    newFolder.transferOwnership(msg.sender);

    emit NewFolder(msg.sender, address(newFolder), folderId);
  }
}
