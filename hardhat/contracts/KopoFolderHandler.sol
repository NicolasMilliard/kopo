// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

/***************************************************************************/
/* DEBUG                                                                   */
/***************************************************************************/
//import './KopoRolesManager.sol';
//import './KopoAddressProvider.sol';

contract KopoRolesManager {
  function isVerified(address _addr) external pure returns (bool) {
    return true;
  }

  function isXXX(address _addr) external pure returns (bool) {
    return true;
  }
}

contract KopoAddressProvider {
  KopoRolesManager private roleManager;

  constructor(address _roleContract) {
    roleManager = new KopoRolesManager();
  }

  function getKopoRolesContractAddress() external returns (address) {
    return address(roleManager);
  }

  function getKopoFolderFactoryContractAddress() external returns (address) {
    address(0);
  }
}

/***************************************************************************/
/* DEBUG                                                                   */
/***************************************************************************/

/** @title KopoFolderHandler
 * @author Nicolas Milliard - Matthieu Bonetti
 * @notice The KopoFolderHandler contracts aims to represent a CEE folder.
 * The contract can receive NFTs that represent a proof of declaration.
 * The contract can mint a single NFT, representing the folder, that can
 * be transfered, set as collateral, or any Defi usage.
 * @dev The contract is Ownable, meaning only the owner has control over it.
 * The ownership is transferable.
 */
contract KopoFolderHandler is ERC721, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private tokenIds;
  bytes32 public folderId;
  /** MAX_SUPPLY
   * @dev The max supply is here for future use. If we need to mint more than
   * one NFT by folder, for instance, for more complex Defi schemes, this
   * will be possible.
   * It's a uint256 because a whole new 256 bits is allocated anyway so why not
   * use it completely.
   */
  uint256 public constant MAX_SUPPLY = 1;
  KopoAddressProvider private immutable addressProvider;

  /** @dev Calls KopoRolesManager to check. */
  modifier isVerified(address _addr) {
    require(KopoRolesManager(addressProvider.getKopoRolesContractAddress()).isVerified(_addr) == true, 'not verified');
    _;
  }

  constructor(address _addressProvider, bytes32 _folderId) ERC721('KopoFolderHandler', 'KFH') {
    folderId = _folderId;
    addressProvider = KopoAddressProvider(_addressProvider);
  }

  /** Mint a token that represents the folder.
   * @param _to The NFT recipient.
   * @dev Only MAX_SUPPLY tokens can be emitted. The NFT minted is then free to
   * travel on the blockchain, no restrictions.
   * Emits a transfer event.
   */
  function safeMint(address _to) external onlyOwner {
    require(tokenIds.current() < MAX_SUPPLY, 'max supply reached');
    uint256 tokenId = tokenIds.current();
    tokenIds.increment();
    _safeMint(_to, tokenId);
  }

  /**
   * Transfer ownership of the folder to a new user.
   * @param _newOwner Address of the new user.
   * @dev The new owner needs to be verified.
   */
  function transferOwnership(address _newOwner) public virtual override isVerified(_newOwner) onlyOwner {
    super.transferOwnership(_newOwner);
  }
}
