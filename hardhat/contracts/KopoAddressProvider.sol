// SPDX-License-Identifier: Unlicensed

pragma solidity 0.8.17;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';

/** @title KopoAddressProvider
 * @author Nicolas Milliard - Matthieu Bonetti
 * @notice Provider of all contract addresses used by Kopo
 * @dev KopoAddressProvider allows owner to set and get contracts address used by the dApp
 */

contract KopoAddressProvider is Initializable, OwnableUpgradeable {
  address public folderFactoryContractAddress;
  address public rolesContractAddress;
  // Future variables MUST be added from this line
  uint256[48] __gap;

  event folderFactoryContractUpdated(address indexed _previousAddress, address indexed _newAddress);
  event rolesContractUpdated(address indexed _previousAddress, address indexed _newAddress);

  /// @notice KopoAddressProvider must be deployed after others contracts used by Kopo
  /// @dev KopoAddressProvider is upgradeable so initialize is used instead of a constructor
  /// @param _folderFactoryContractAddress is FolderFactory contract address
  /// @param _rolesContractAddress is Roles contract address
  function initialize(address _folderFactoryContractAddress, address _rolesContractAddress) external initializer {
    require(
      AddressUpgradeable.isContract(_folderFactoryContractAddress) == true,
      '_folderFactoryContractAddress is not a contract'
    );
    require(AddressUpgradeable.isContract(_rolesContractAddress) == true, '_rolesContractAddress is not a contract');

    folderFactoryContractAddress = _folderFactoryContractAddress;
    rolesContractAddress = _rolesContractAddress;

    __Ownable_init();

    emit folderFactoryContractUpdated(address(0), folderFactoryContractAddress);
    emit rolesContractUpdated(address(0), rolesContractAddress);
  }

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
}
