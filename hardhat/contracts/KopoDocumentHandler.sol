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

  /**
   * CID will be a bytes32 and the base58 conversion to get the CID will
   * be done offchain. Because of time constraints, this is handled as a string
   * at the moment.
   */
  mapping(uint256 => string) tokens;

  enum RequestStatus {
    zero,
    pending,
    rejected,
    approved
  }

  struct TokenRequest {
    address from;
    address to;
    address folder;
    RequestStatus status;
  }

  /**
   *  This mapping handles tokens requests. This to avoid the same request being
   * sent multiple times.
   */
  mapping(string => TokenRequest) public tokenRequests;

  event TokenRequested(address _from, string _documentCID, address indexed _toOblige, address indexed _toFolder);
  event TokenRejected(string _documentCID, address _fromOblige, address indexed _from, address indexed _toFolder);
  event TokenApproved(string _documentCID, address _fromOblige, address indexed _from, address indexed _toFolder);

  /**
   * @dev Calls KopoRolesManager to check.
   * @param _addr Address to check.
   */
  modifier isVerified(address _addr) {
    require(KopoRolesManager(addressProvider.rolesManagerContractAddress()).isVerified(_addr) == true, 'not verified');
    _;
  }

  /**
   * @dev Calls KopoRolesManager to check.
   * @param _addr Address to check.
   */
  modifier isOblige(address _addr) {
    require(KopoRolesManager(addressProvider.rolesManagerContractAddress()).isOblige(_addr) == true, 'not oblige');
    _;
  }

  /**
   * @dev Calls KopoFolderFactory to check if the folder was produced by our factory.
   * @param _addr Address of the folder to check.
   */
  modifier isValidFolder(address _addr) {
    bytes32 folderId = KopoFolderHandler(_addr).folderId();
    require(
      KopoFolderFactory(addressProvider.folderFactoryContractAddress()).registeredFolders(folderId) == _addr,
      'invalid folder contract'
    );
    _;
  }

  /**
   * Check of _addr is the folder owner.
   * @param _folder Address of the folder contract.
   * @param _addr Address to check.
   */
  modifier isFolderOwner(address _folder, address _addr) {
    require(KopoFolderHandler(_folder).owner() == _addr, 'not folder owner');
    _;
  }

  constructor(address _addressProvider) ERC721('KopoDocumentHandler', 'KDH') {
    addressProvider = KopoAddressProvider(_addressProvider);
  }

  /**
   * Return the NFT metadata.
   * @param _tokenId ID of the token.
   */
  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    require(bytes(tokens[_tokenId]).length != 0, 'token does not exist');
    /* We don't need to add ipfs:// here because these NFT are onlt going to a Kopo Folder, saving a few wei. */
    return tokens[_tokenId];
  }

  /**
   * Submit a document to an oblige.
   * @dev The document to submit is on IPFS, identified with its CID.
   * In current version, the document is in clear-text. Future/Production
   * version will include asymetric encryption.
   * @param _documentCID The IPFS CID of the document to submit.
   * @param _toOblige The oblige that can validate the document.
   * @param _toFolder The folder to assign the NFT.
   */
  function requestToken(
    string calldata _documentCID,
    address _toOblige,
    address _toFolder
  ) external isVerified(msg.sender) isOblige(_toOblige) isValidFolder(_toFolder) isFolderOwner(_toFolder, msg.sender) {
    require(tokenRequests[_documentCID].from == address(0), 'already requested');

    TokenRequest memory tokenRequest = TokenRequest({
      from: msg.sender,
      to: _toOblige,
      folder: _toFolder,
      status: RequestStatus.pending
    });
    tokenRequests[_documentCID] = tokenRequest;

    emit TokenRequested(msg.sender, _documentCID, _toOblige, _toFolder);
  }

  /**
   * Let the proper oblige to reject a document.
   * @param _documentCID Original document CID.
   */
  function rejectTokenRequest(string calldata _documentCID) external {
    require(tokenRequests[_documentCID].to == msg.sender, 'not proper oblige');
    require(tokenRequests[_documentCID].status == RequestStatus.pending, 'invalid status');

    tokenRequests[_documentCID].status = RequestStatus.rejected;
    emit TokenRejected(_documentCID, msg.sender, tokenRequests[_documentCID].from, tokenRequests[_documentCID].folder);
  }

  /**
   * Mint a token that represents the document.
   * @param _documentCID IPFS CID for the original document.
   * @param _metadataCID IPFS CID for the NFT's metadata.
   * Emits a transfer event.
   */
  function safeMint(string calldata _documentCID, string calldata _metadataCID) external isOblige(msg.sender) {
    require(tokenRequests[_documentCID].status == RequestStatus.pending, 'invalid status');

    tokenRequests[_documentCID].status = RequestStatus.approved;

    /**
     * @dev Future improvements could be to use the _metadataCID as uint256 as tokenId.
     */
    uint256 tokenId = tokenIds.current();
    tokenIds.increment();
    tokens[tokenId] = _metadataCID;

    /**
     * @dev Mint the NFT and emit the Transfer event.
     */
    _safeMint(tokenRequests[_documentCID].folder, tokenId);

    emit TokenApproved(_documentCID, msg.sender, tokenRequests[_documentCID].from, tokenRequests[_documentCID].folder);
  }
}
