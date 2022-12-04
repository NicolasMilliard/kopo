// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

import './KopoFolderHandler.sol';
import './KopoFolderFactory.sol';
import './KopoAddressProvider.sol';
import './KopoRolesManager.sol';

/** @title KopoDocumentHandler
 * @author Nicolas Milliard - Matthieu Bonetti
 * @notice The KopoDocumentHandler contract generates NFTs to be attached to folder.
 * @dev NFTs cannot be transfered without the recipient to approve the transfer.
 */
contract KopoDocumentHandler is ERC721 {
  using Counters for Counters.Counter;
  Counters.Counter private tokenIds;
  KopoAddressProvider private immutable addressProvider;

  struct Token {
    string metadata; /// CID of the json metadata.
  }

  mapping(uint256 => Token) tokens;

  event TokenRequested(address _from, string CID, address _to);

  /** @dev Calls KopoRolesManager to check. */
  modifier isVerified(address _addr) {
    require(KopoRolesManager(addressProvider.rolesContractAddress()).isVerified(_addr) == true, 'not verified');
    _;
  }

  /** @dev Calls KopoRolesManager to check. */
  modifier isOblige(address _addr) {
    require(KopoRolesManager(addressProvider.rolesContractAddress()).isOblige(_addr) == true, 'not oblige');
    _;
  }

  /** @dev Calls KopoFolderFactory to check. */
  modifier isValidFolder(address _addr) {
    bytes32 folderId = KopoFolderHandler(_addr).folderId();
    // TODO USE the real address provider.
    // require(
    //   KopoFolderFactory(addressProvider.getKopoFolderFactoryContractAddress()).registeredFolders(folderId) == _addr,
    //   'invalid folder contract'
    // );
    _;
  }

  constructor(address _addressProvider) ERC721('KopoDocumentHandler', 'KDH') {
    addressProvider = KopoAddressProvider(_addressProvider);
  }

  /** Mint a token that represents the document.
   * @param _to The NFT recipient (the recipient KopoFolder address).
   * Emits a transfer event.
   */
  function safeMint(address _to, string calldata metadata) external isOblige(msg.sender) isValidFolder(_to) {
    uint256 tokenId = tokenIds.current();
    tokenIds.increment();
    // Add the document CID and metadata to the NFT.
    tokens[tokenId].metadata = metadata;
    _safeMint(_to, tokenId);
  }

  /**
   * Return the NFT metadata.
   */
  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    return string(abi.encodePacked(tokens[_tokenId].metadata));
  }

  function requestToken(string calldata CID, address _to) external isVerified(msg.sender) isValidFolder(_to) {
    emit TokenRequested(msg.sender, CID, _to);
  }

  function approve(address _to, uint256 _tokenId) public override isVerified(msg.sender) isVerified(_to) {
    // TODO require a valid NFT
    super.approve(_to, _tokenId);
  }
}
