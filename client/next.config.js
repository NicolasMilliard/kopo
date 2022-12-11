module.exports = {
  env: {
    KOPO_ADDRESS_PROVIDER_LOCALHOST: process.env.KOPO_ADDRESS_PROVIDER_LOCALHOST,
    KOPO_ADDRESS_PROVIDER_MUMBAI: process.env.KOPO_ADDRESS_PROVIDER_MUMBAI,
    NFT_STORAGE_API_KEY: process.env.NFT_STORAGE_API_KEY, // TODO This will be handled server side in a future release
    KOPO_NFT_LOGO: process.env.KOPO_NFT_LOGO,
    KOPO_URL: process.env.KOPO_URL,
    MAX_NFT_BY_FOLDER: process.env.MAX_NFT_BY_FOLDER,
    KOPO_GENESIS: process.env.KOPO_GENESIS,
  },
};
