const main = async () => {
  // Contracts addresses
  const KopoAddressProviderContractAddress = "0xA56f1A7b95D5C2E01A97fE6c17103822cc191E0E";

  const KopoAddressProviderV2 = await ethers.getContractFactory("KopoAddressProvider_testonly");

  const proxy = await upgrades.upgradeProxy(KopoAddressProviderContractAddress, KopoAddressProviderV2);
  console.log(`Your upgraded proxy id done! Proxy address: ${proxy.address}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })