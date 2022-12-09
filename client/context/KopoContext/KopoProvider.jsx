import { ethers } from 'ethers';
import { useCallback, useEffect, useReducer } from 'react';

import addressProviderContractArtifact from '../../artifacts/contracts/KopoAddressProvider.sol/KopoAddressProvider.json';
import folderFactoryContractArtifact from '../../artifacts/contracts/KopoFolderFactory.sol/KopoFolderFactory.json';
import folderHandlerContractArtifact from '../../artifacts/contracts/KopoFolderHandler.sol/KopoFolderHandler.json';

import KopoContext from './KopoContext';
import { actions, initialState, reducer } from './state';

const loadContract = (addr, abi) => {
  let contract = undefined;
  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      contract = new ethers.Contract(addr, abi, signer);
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log('Contract error:', error);
  }
  return contract;
};

const KopoProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * Load all contracts.
   */
  const init = useCallback(async () => {
    // Address Provider
    const addressProviderContract = loadContract(
      process.env.KOPO_ADDRESS_PROVIDER_LOCALHOST, // TODO Dynamically change this value based on the network selected.
      addressProviderContractArtifact.abi,
    );

    // Folder factory
    const folderFactoryAddress = await addressProviderContract.folderFactoryContractAddress();
    const folderFactoryContract = loadContract(folderFactoryAddress, folderFactoryContractArtifact.abi);

    // Folder handler
    const getFolderHandlerContract = (address) => {
      return loadContract(address, folderHandlerContractArtifact.abi);
    };

    dispatch({
      type: actions.INIT,
      data: {
        addressProviderContract: addressProviderContract,
        folderFactoryContract: folderFactoryContract,
        getFolderHandlerContract: getFolderHandlerContract,
      },
    });
  }, []);

  /**
   * Call the init callback.
   */
  useEffect(() => {
    const tryInit = async () => {
      try {
        init();
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  return (
    <KopoContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {props.children}
    </KopoContext.Provider>
  );
};

export default KopoProvider;
