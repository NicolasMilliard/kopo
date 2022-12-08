import documentHandlerContractArtifact from '../../../artifacts/contracts/KopoDocumentHandler.sol/KopoDocumentHandler.json';

const documentHandlerContract = {
  address: process.env.KOPO_DOCUMENT_HANDLER_LOCALHOST,
  abi: documentHandlerContractArtifact.abi,
};

export default documentHandlerContract;
