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
  address kopoFolderFactoryContractAddress;
  address kopoRolesContractAddress;
  address testingContractAddress; // new variable
  // Future variables MUST be added from this line
  uint256[47] __gap;

  event kopoFolderFactoryContractUpdated(address indexed _previousAddress, address indexed _newAddress);
  event kopoRolesContractUpdated(address indexed _previousAddress, address indexed _newAddress);
  event testingContractUpdated(address indexed _previousAddress, address indexed _newAddress); // new event

  /// @notice Set KopoFolderFactory contract address
  /// @dev Sender must be the owner
  /// @param _contractAddress must be a contract at a different address
  function setKopoFolderFactoryContractAddress(address _contractAddress) external onlyOwner {
    require(
      _contractAddress != kopoFolderFactoryContractAddress,
      'Contract address must be different from the current one'
    );
    require(AddressUpgradeable.isContract(_contractAddress) == true, '_contractAddress is not a contract');

    address previousKopoFolderFactoryContractAddress = kopoFolderFactoryContractAddress;
    kopoFolderFactoryContractAddress = _contractAddress;

    emit kopoFolderFactoryContractUpdated(previousKopoFolderFactoryContractAddress, kopoFolderFactoryContractAddress);
  }

  /// @notice Set KopoRolesManager contract address
  /// @dev Sender must be the owner
  /// @param _contractAddress must be a contract at a different address
  function setRolesContractAddress(address _contractAddress) external onlyOwner {
    require(_contractAddress != kopoRolesContractAddress, 'Contract address must be different from the current one');
    require(AddressUpgradeable.isContract(_contractAddress) == true, '_contractAddress is not a contract');

    address previousKopoRolesContractAddress = kopoRolesContractAddress;
    kopoRolesContractAddress = _contractAddress;

    emit kopoRolesContractUpdated(previousKopoRolesContractAddress, kopoRolesContractAddress);
  }

  /// @dev For testing only
  /// @param _contractAddress must be a contract at a different address
  function setTestingContractAddress(address _contractAddress) external onlyOwner {
    require(_contractAddress != testingContractAddress, 'Contract address must be different from the current one');
    require(AddressUpgradeable.isContract(_contractAddress) == true, '_contractAddress is not a contract');

    address previousTestingContractAddress = testingContractAddress;
    testingContractAddress = _contractAddress;

    emit testingContractUpdated(previousTestingContractAddress, testingContractAddress);
  }

  /// @notice return KopoFolderFactory contract address
  function getKopoFolderFactoryContractAddress() external view onlyOwner returns (address) {
    return kopoFolderFactoryContractAddress;
  }

  /// @notice return KopoRolesManager contract address
  function getKopoRolesContractAddress() external view onlyOwner returns (address) {
    return kopoRolesContractAddress;
  }

  /// @notice return TestingContractAddress
  /// @dev For testing only
  function getTestingContractAddress() external view onlyOwner returns (address) {
    return testingContractAddress;
  }
}
