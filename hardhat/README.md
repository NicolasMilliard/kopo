# Contracts

- KopoAddressProvider.sol: Acts as a simple router for the other contracts. Upgradable contract.
- KopoAddressProvider_testonly.sol: Used to test upgrading the AddressProvider.
- KopoDocumentHandler.sol: Mint NFT that gets attached to a Folder contract.
- KopoFolderFactory.sol: Deploy new Folder contracts.
- KopoFolderHandler.sol: Represent a Folder. Document NFT get attached to it.
- KopoRolesManager.sol: Handle the different Kopo Roles.

# Mumbai

```console
[+] KopoAddressProvider: 0xaaf65BCa7bB2CeD7C27A9751c51E2FcCd05bA475
[+] KopoRolesManager: 0x3eE5B775c2BA871C59332E4A3BAbE19ED75DDE99
[+] KopoDocumentHandler: 0x6D4041c73d5Fb7dF00B2FcB1E14b7BC626Ff2160
[+] KopoFolderFactory: 0x2765c1e980A83BB3A7B068A7e1217C5d200047ff
```

# Deploy

```console
$ hh run scripts/deploy.js --network localhost
Compiled 22 Solidity files successfully
[+] Deployer orig balance: 999.951882279220701573

[+] KopoAddressProvider: 0x4c0A4d84db4E4534FfB29129fa74baFb179e7C22
[+] KopoRolesManager: 0xD7e13CbE7657B95D77FfA17024E38F7eeAAd73A2
[+] KopoDocumentHandler: 0x1010B2696Acb5970A489935dE06D15620062B4eE
[+] KopoFolderFactory: 0x3b8D3980E847606f07d15576Dc3f9cE2458b2128

[+] Deployer new balance: 999.945635216615555413
```

# Test coverage

```console
$ hh coverage

-----------------------------------|----------|----------|----------|----------|----------------|
File                               |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-----------------------------------|----------|----------|----------|----------|----------------|
 contracts/                        |      100 |    99.17 |      100 |      100 |                |
  KopoAddressProvider.sol          |      100 |      100 |      100 |      100 |                |
  KopoAddressProvider_testonly.sol |      100 |      100 |      100 |      100 |                |
  KopoDocumentHandler.sol          |      100 |      100 |      100 |      100 |                |
  KopoFolderFactory.sol            |      100 |       90 |      100 |      100 |                |
  KopoFolderHandler.sol            |      100 |      100 |      100 |      100 |                |
  KopoRolesManager.sol             |      100 |      100 |      100 |      100 |                |
-----------------------------------|----------|----------|----------|----------|----------------|
All files                          |      100 |    99.17 |      100 |      100 |                |
-----------------------------------|----------|----------|----------|----------|----------------|
```

KopoFolderFactory.sol could not be fully covered by tests because of this require:

```solidity
    bytes32 folderId = keccak256(abi.encodePacked(msg.sender, address(this), block.timestamp, _nonce));
    require(registeredFolders[folderId] == address(0), 'already registered');
```

To test the same folder ID twice, one would need to have the same block.timestamp twice. This could be possible from a
smart contract or from a miner. Unfortunately, Hardhat does not cover manipulating this value. It is only possible to go
in the future, not in the past.
