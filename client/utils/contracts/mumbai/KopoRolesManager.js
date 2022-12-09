import rolesManagerContractArtifact from '../../../artifacts/contracts/KopoRolesManager.sol/KopoRolesManager.json';

const rolesManagerContract = {
  address: process.env.KOPO_ROLES_MANAGER_MUMBAI,
  abi: rolesManagerContractArtifact.abi,
};

export default rolesManagerContract;
