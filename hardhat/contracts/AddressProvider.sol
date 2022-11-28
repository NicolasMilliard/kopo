// SPDX-License-Identifier: Unlicensed

pragma solidity 0.8.17;

import '../node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '../node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';

/// @title AddressProvider
/// @author Nicolas Milliard - Matthieu Bonetti
/// @notice Provider of all contract addresses used by Kopo
/// @dev AddressProvider allows owner to set and get contracts address used by the dApp

contract AddressProvider is Initializable, OwnableUpgradeable {
  address folderFactoryContractAddress;
  address folderContractAddress;
  address rolesContractAddress;

  event folderFactoryContractUpdated(
    address indexed _from,
    address indexed _previousAddress,
    address indexed _newAddress
  );
  event folderContractUpdated(address indexed _from, address indexed _previousAddress, address indexed _newAddress);
  event rolesContractUpdated(address indexed _from, address indexed _previousAddress, address indexed _newAddress);

  /// @notice AddressProvider must be deployed after others contracts used by Kopo
  /// @dev AddressProvider is upgradeable so initialize is used instead of a constructor
  /// @param _folderFactoryContractAddress is FolderFactory contract address
  /// @param _folderContractAddress is Folder contract address
  /// @param _rolesContractAddress is Roles contract address
  function initialize(
    address _folderFactoryContractAddress,
    address _folderContractAddress,
    address _rolesContractAddress
  ) external initializer {
    require(
      AddressUpgradeable.isContract(_folderFactoryContractAddress) == true,
      '_folderFactoryContractAddress is not a contract'
    );
    require(AddressUpgradeable.isContract(_folderContractAddress) == true, '_folderContractAddress is not a contract');
    require(AddressUpgradeable.isContract(_rolesContractAddress) == true, '_rolesContractAddress is not a contract');

    folderFactoryContractAddress = _folderFactoryContractAddress;
    folderContractAddress = _folderContractAddress;
    rolesContractAddress = _rolesContractAddress;

    __Ownable_init();

    emit folderFactoryContractUpdated(msg.sender, address(0), folderFactoryContractAddress);
    emit folderContractUpdated(msg.sender, address(0), folderContractAddress);
    emit rolesContractUpdated(msg.sender, address(0), rolesContractAddress);
  }

  /// @notice Set FolderFactory contract address
  /// @dev Sender must be the owner
  /// @param _contractAddress must be different thand address(0)
  function setFolderFactoryContractAddress(address _contractAddress) external onlyOwner {
    require(
      _contractAddress != folderFactoryContractAddress,
      'Contract address must be different from the current one'
    );
    require(AddressUpgradeable.isContract(_contractAddress) == true, '_contractAddress is not a contract');

    address previousFolderFactoryContractAddress = folderFactoryContractAddress;
    folderFactoryContractAddress = _contractAddress;

    emit folderFactoryContractUpdated(msg.sender, previousFolderFactoryContractAddress, folderFactoryContractAddress);
  }

  function setFolderContractAddress(address _contractAddress) external onlyOwner {
    require(_contractAddress != folderContractAddress, 'Contract address must be different from the current one');
    require(AddressUpgradeable.isContract(_contractAddress) == true, '_contractAddress is not a contract');

    address previousFolderContractAddress = folderContractAddress;
    folderContractAddress = _contractAddress;

    emit folderContractUpdated(msg.sender, previousFolderContractAddress, folderContractAddress);
  }

  function setRolesContractAddress(address _contractAddress) external onlyOwner {
    require(_contractAddress != rolesContractAddress, 'Contract address must be different from the current one');
    require(AddressUpgradeable.isContract(_contractAddress) == true, '_contractAddress is not a contract');

    address previousRolesContractAddress = rolesContractAddress;
    rolesContractAddress = _contractAddress;

    emit rolesContractUpdated(msg.sender, previousRolesContractAddress, rolesContractAddress);
  }

  function getFolderFactoryContractAddress() external view onlyOwner returns (address) {
    return folderFactoryContractAddress;
  }

  function getFolderContractAddress() external view onlyOwner returns (address) {
    return folderContractAddress;
  }

  function getRolesContractAddress() external view onlyOwner returns (address) {
    return rolesContractAddress;
  }
}
