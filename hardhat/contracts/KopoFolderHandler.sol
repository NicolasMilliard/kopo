// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

/**
 * The KopoFolderHandler contracts aims to represent a CEE folder.
 * The contract can receive NFTs that represent a proof of declaration.
 * The contract can mint a single NFT, representing the folder, that can
 * be transfered, set as collateral, or any Defi usage.
 */
contract KopoFolderHandler is ERC721, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private tokenIds;
  bytes32 public folderId;
  /** MAX_SUPPLY
   * @dev The max supply is here for future use. If we need to mint more than
   * one NFT by folder, for instance for more complex Defi schemes.
   * It's a uint256 because a whole new 256 bits is allocated anyway.
   */
  uint256 public MAX_SUPPLY = 1;

  constructor(bytes32 _folderId) ERC721('KopoFolderHandler', 'KFH') {
    folderId = _folderId;
  }

  /** Mint a token that represents the folder.
   * param _to The NFT recipient.
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

  /** Validates the reception of an NFT
   * @param _from Wallet address to receive from.
   * @param _tokenId Token id to to reveive.
   * Emits a transfer event.
   */
  function receiveFileNft(address _from, uint256 _tokenId) external onlyOwner {
    /* TODO: Initiate tranfer from KopoFile */
    /* TODO: Update Merkle Tree for owned NFT. */
  }
}
