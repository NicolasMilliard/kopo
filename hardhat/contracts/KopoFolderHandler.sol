// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

import './KopoAddressProvider.sol';
import './KopoRolesManager.sol';

/** @title KopoFolderHandler
 * @author Nicolas Milliard - Matthieu Bonetti
 * @notice The KopoFolderHandler contracts aims to represent a CEE folder.
 * The contract can receive NFTs that represent a proof of declaration.
 * The contract can mint a single NFT, representing the folder, that can
 * be transfered, set as collateral, or any Defi usage.
 * @dev The contract is Ownable, meaning only the owner has control over it.
 * The ownership is transferable to verified users only.
 */
contract KopoFolderHandler is ERC721, IERC721Receiver, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private tokenIds;
  bytes32 public folderId;
  /** MAX_SUPPLY
   * @dev The max supply is here for future use. If we need to mint more than
   * one NFT by folder, for instance, for more complex Defi schemes, this
   * will be possible.
   */
  uint256 public constant MAX_SUPPLY = 1;
  KopoAddressProvider private immutable addressProvider;
  string public folderName;
  mapping(uint256 => string) tokens;

  event NameChanged(address indexed _from, string _oldname, string indexed _name);

  /** @dev Calls KopoRolesManager to check. */
  modifier isVerified(address _addr) {
    require(KopoRolesManager(addressProvider.rolesManagerContractAddress()).isVerified(_addr) == true, 'not verified');
    _;
  }

  constructor(address _addressProvider, bytes32 _folderId) ERC721('KopoFolderHandler', 'KFH') {
    folderId = _folderId;
    addressProvider = KopoAddressProvider(_addressProvider);
  }

  /**
   * Set the folder's name.
   * @param _newname The name of the volder.
   * Emits a NameChanged event.
   */
  function setFolderName(string calldata _newname) external onlyOwner {
    emit NameChanged(msg.sender, folderName, _newname);
    folderName = _newname;
  }

  /** Mint a token that represents the folder.
   * @param _to The NFT recipient.
   * @dev Only MAX_SUPPLY tokens can be emitted. The NFT minted is then free to
   * travel on the blockchain, no restrictions.
   * Emits a transfer event.
   */
  function safeMint(address _to, string calldata CID) external onlyOwner {
    require(tokenIds.current() < MAX_SUPPLY, 'max supply reached');
    uint256 tokenId = tokenIds.current();
    tokenIds.increment();
    tokens[tokenId] = CID;
    _safeMint(_to, tokenId);
  }

  /**
   * Return the proper URI for the token..
   */
  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    require(tokenIds.current() > _tokenId, 'token does not exist');
    return tokens[_tokenId];
  }

  /**
   * Transfer ownership of the folder to a new user.
   * @param _newOwner Address of the new user.
   * @dev The new owner needs to be verified.
   */
  function transferOwnership(address _newOwner) public virtual override isVerified(_newOwner) onlyOwner {
    super.transferOwnership(_newOwner);
  }

  /**
   * This contracts received the document NFT.
   * TODO Only allow transfer from DocumentHandler.
   */
  function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
    return IERC721Receiver.onERC721Received.selector;
  }
}
