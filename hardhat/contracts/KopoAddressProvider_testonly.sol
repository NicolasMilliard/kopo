// SPDX-License-Identifier: Unlicensed

pragma solidity 0.8.17;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';

/** @title KopoAddressProvider
 * @author Nicolas Milliard - Matthieu Bonetti
 * @notice Provider of all contract addresses used by Kopo
 * @dev KopoAddressProvider allows owner to set and get contracts address used by the dApp
 */

contract KopoAddressProvider_testonly is Initializable, OwnableUpgradeable {
  address public folderFactoryContractAddress;
  address public rolesContractAddress;
  address public testingContractAddress; // new variable
  // Future variables MUST be added from this line
  uint256[47] __gap;

  event folderFactoryContractUpdated(address indexed _previousAddress, address indexed _newAddress);
  event rolesContractUpdated(address indexed _previousAddress, address indexed _newAddress);
  event testingContractUpdated(address indexed _previousAddress, address indexed _newAddress); // new event

  /// @notice Set KopoFolderFactory contract address
  /// @dev Sender must be the owner
  /// @param _contractAddress must be a contract at a different address
  function setFolderFactoryContractAddress(address _contractAddress) external onlyOwner {
    require(AddressUpgradeable.isContract(_contractAddress) == true, '_contractAddress is not a contract');

    address previousFolderFactoryContractAddress = folderFactoryContractAddress;
    folderFactoryContractAddress = _contractAddress;

    emit folderFactoryContractUpdated(previousFolderFactoryContractAddress, folderFactoryContractAddress);
  }

  /// @notice Set KopoRolesManager contract address
  /// @dev Sender must be the owner
  /// @param _contractAddress must be a contract at a different address
  function setRolesContractAddress(address _contractAddress) external onlyOwner {
    require(AddressUpgradeable.isContract(_contractAddress) == true, '_contractAddress is not a contract');

    address previousRolesContractAddress = rolesContractAddress;
    rolesContractAddress = _contractAddress;

    emit rolesContractUpdated(previousRolesContractAddress, rolesContractAddress);
  }

  /// @dev For testing only
  /// @param _contractAddress must be a contract at a different address
  function setTestingContractAddress(address _contractAddress) external onlyOwner {
    require(AddressUpgradeable.isContract(_contractAddress) == true, '_contractAddress is not a contract');

    address previousTestingContractAddress = testingContractAddress;
    testingContractAddress = _contractAddress;

    emit testingContractUpdated(previousTestingContractAddress, testingContractAddress);
  }
}
