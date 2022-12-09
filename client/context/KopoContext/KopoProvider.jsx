import { ethers } from 'ethers';
import { useCallback, useEffect, useReducer } from 'react';
import { useNetwork } from 'wagmi';

import addressProviderContractArtifact from '../../artifacts/contracts/KopoAddressProvider.sol/KopoAddressProvider.json';
import folderFactoryContractArtifact from '../../artifacts/contracts/KopoFolderFactory.sol/KopoFolderFactory.json';
import folderHandlerContractArtifact from '../../artifacts/contracts/KopoFolderHandler.sol/KopoFolderHandler.json';
import rolesManagerContractArtifact from '../../artifacts/contracts/KopoRolesManager.sol/KopoRolesManager.json';

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
  const { chain, chains } = useNetwork();

  /**
   * Load all contracts.
   */
  const init = useCallback(async () => {
    let addressProviderContract;

    // Address Provider
    if (chain.name === 'Localhost') {
      addressProviderContract = loadContract(
        process.env.KOPO_ADDRESS_PROVIDER_LOCALHOST,
        addressProviderContractArtifact.abi,
      );
    } else if (chain.name === 'Polygon Mumbai') {
      addressProviderContract = loadContract(
        process.env.KOPO_ADDRESS_PROVIDER_MUMBAI,
        addressProviderContractArtifact.abi,
      );
    }

    try {
      // Folder factory
      const rolesManagerAddress = await addressProviderContract.rolesManagerContractAddress();
      const rolesManagerContract = loadContract(rolesManagerAddress, folderFactoryContractArtifact.abi);

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
          rolesManagerContract: rolesManagerContract,
          folderFactoryContract: folderFactoryContract,
          getFolderHandlerContract: getFolderHandlerContract,
        },
      });
    } catch (error) {
      console.log('Could not load the contract. Are you on the correct chain?');
    }
  }, []);

  /**
   * Call the init callback.
   * Reload the contracts if the chain has changed.
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
  }, [init, chain]);

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
