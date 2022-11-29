// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import './KopoFolderHandler.sol';

contract KopoFolderFactory is Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private folderCounter;
  mapping(bytes32 => address) public registeredFolders;

  event NewFolder(address _contract, bytes32 _folderId);

  modifier onlyBeneficiary() {
    /* TODO: Implement with KopoRoles */
    require(msg.sender == owner(), 'not allowed');
    _;
  }

  /**
   * Deploy a new folder contract.
   */
  function createFolder() external onlyBeneficiary {
    /* Generate a new folderId */
    bytes32 folderId = keccak256(
      abi.encodePacked(msg.sender, address(this), block.timestamp, folderCounter.current())
    );
    KopoFolderHandler newFolder = new KopoFolderHandler(folderId);
    registeredFolders[folderId] = address(newFolder);

    newFolder.safeMint(msg.sender);
    newFolder.transferOwnership(msg.sender);

    emit NewFolder(address(newFolder), folderId);
  }
}
