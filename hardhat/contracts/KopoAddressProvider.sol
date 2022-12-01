// SPDX-License-Identifier: Unlicensed

pragma solidity 0.8.17;

import '../node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '../node_modules/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';

/** @title KopoAddressProvider
 * @author Nicolas Milliard - Matthieu Bonetti
 * @notice Provider of all contract addresses used by Kopo
 * @dev KopoAddressProvider allows owner to set and get contracts address used by the dApp
 */

contract KopoAddressProvider is Initializable, OwnableUpgradeable {
  address kopoFolderFactoryContractAddress;
  address kopoRolesContractAddress;
  // Future variables MUST be added from this line

  event kopoFolderFactoryContractUpdated(address indexed _previousAddress, address indexed _newAddress);
  event kopoRolesContractUpdated(address indexed _previousAddress, address indexed _newAddress);

  /// @notice KopoAddressProvider must be deployed after others contracts used by Kopo
  /// @dev KopoAddressProvider is upgradeable so initialize is used instead of a constructor
  /// @param _kopoFolderFactoryContractAddress is FolderFactory contract address
  /// @param _kopoRolesContractAddress is Roles contract address
  function initialize(address _kopoFolderFactoryContractAddress, address _kopoRolesContractAddress)
    external
    initializer
  {
    require(
      AddressUpgradeable.isContract(_kopoFolderFactoryContractAddress) == true,
      '_kopoFolderFactoryContractAddress is not a contract'
    );
    require(
      AddressUpgradeable.isContract(_kopoRolesContractAddress) == true,
      '_kopoRolesContractAddress is not a contract'
    );

    kopoFolderFactoryContractAddress = _kopoFolderFactoryContractAddress;
    kopoRolesContractAddress = _kopoRolesContractAddress;

    __Ownable_init();

    emit kopoFolderFactoryContractUpdated(address(0), kopoFolderFactoryContractAddress);
    emit kopoRolesContractUpdated(address(0), kopoRolesContractAddress);
  }

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

  /// @notice return KopoFolderFactory contract address
  function getKopoFolderFactoryContractAddress() external view onlyOwner returns (address) {
    return kopoFolderFactoryContractAddress;
  }

  /// @notice return KopoRolesManager contract address
  function getKopoRolesContractAddress() external view onlyOwner returns (address) {
    return kopoRolesContractAddress;
  }
}
