import { requestToBodyStream } from 'next/dist/server/body-streams';
import { useEffect, useState } from 'react';
import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { rolesManagerContract } from '../../utils/contracts';

// GETTERS
// GetUserRole
const GetUserRole = () => {
  // const [rolesManager, setRolesManager] = useState('');
  // const { contract } = useContractRead({
  //   address: '0xA56f1A7b95D5C2E01A97fE6c17103822cc191E0E',
  //   abi: addressProviderContract.abi,
  //   functionName: 'rolesManagerContractAddress',
  //   watch: true,
  // });

  // useEffect(() => {
  //   if (contract) {
  //     setRolesManager(contract);
  //   }
  // }, [contract]);

  const [userRole, setUserRole] = useState('');
  const { data } = useContractRead({
    address: rolesManagerContract.address,
    abi: rolesManagerContract.abi,
    functionName: 'getUserRole',
    args: ['0x125BA2dC7567990A6b455E2F5dbF95d58b352db5'],
    watch: true,
  });

  useEffect(() => {
    if (data) {
      setUserRole(data);
    }
  }, [data]);

  return <h3 className="text-lg">getUserRole: {userRole}</h3>;
};

// GetUserVerifiedStatus
const GetUserVerifiedStatus = () => {
  const [userVerified, setUserVerified] = useState('');
  const { data } = useContractRead({
    address: rolesManagerContract.address,
    abi: rolesManagerContract.abi,
    functionName: 'getUserVerifiedStatus',
    args: ['0x125BA2dC7567990A6b455E2F5dbF95d58b352db5'],
    watch: true,
  });

  useEffect(() => {
    if (!data) return;
    if (data.toString().length > 0) {
      setUserVerified(data);
    }
  }, [data]);

  return <h3 className="text-lg">getUserVerifiedStatus: {userVerified.toString()}</h3>;
};

// GetUserBlacklistedStatus
const GetUserBlacklistedStatus = () => {
  const [userBlacklisted, setUserBlacklisted] = useState('');
  const { data } = useContractRead({
    address: rolesManagerContract.address,
    abi: rolesManagerContract.abi,
    functionName: 'getUserBlacklistedStatus',
    args: ['0x125BA2dC7567990A6b455E2F5dbF95d58b352db5'],
    watch: true,
  });

  useEffect(() => {
    if (!data) return;
    if (data.toString().length > 0) {
      setUserBlacklisted(data);
    }
  }, [data]);

  return <h3 className="text-lg">getUserBlacklistedStatus: {userBlacklisted.toString()}</h3>;
};

// isBeneficiaire
const IsBeneficiaire = () => {
  const [userBeneficiaire, setUserBeneficiaire] = useState('');
  const { data } = useContractRead({
    address: rolesManagerContract.address,
    abi: rolesManagerContract.abi,
    functionName: 'isBeneficiaire',
    args: ['0x125BA2dC7567990A6b455E2F5dbF95d58b352db5'],
    watch: true,
  });

  useEffect(() => {
    if (!data) return;
    if (data.toString().length > 0) {
      setUserBeneficiaire(data);
    }
  }, [data]);

  return <h3 className="text-lg">isBeneficiaire: {userBeneficiaire.toString()}</h3>;
};

// isRGE
const IsRGE = () => {
  const [userRGE, setUserRGE] = useState('');
  const { data } = useContractRead({
    address: rolesManagerContract.address,
    abi: rolesManagerContract.abi,
    functionName: 'isRGE',
    args: ['0x125BA2dC7567990A6b455E2F5dbF95d58b352db5'],
    watch: true,
  });

  useEffect(() => {
    if (!data) return;
    if (data.toString().length > 0) {
      setUserRGE(data);
    }
  }, [data]);

  return <h3 className="text-lg">isRGE: {userRGE.toString()}</h3>;
};

// isOblige
const IsOblige = () => {
  const [userOblige, setUserOblige] = useState('');
  const { data } = useContractRead({
    address: rolesManagerContract.address,
    abi: rolesManagerContract.abi,
    functionName: 'isOblige',
    args: ['0x125BA2dC7567990A6b455E2F5dbF95d58b352db5'],
    watch: true,
  });

  useEffect(() => {
    if (!data) return;
    if (data.toString().length > 0) {
      setUserOblige(data);
    }
  }, [data]);

  return <h3 className="text-lg">isOblige: {userOblige.toString()}</h3>;
};

// isNonOblige
const IsNonOblige = () => {
  const [userNonOblige, setUserNonOblige] = useState('');
  const { data } = useContractRead({
    address: rolesManagerContract.address,
    abi: rolesManagerContract.abi,
    functionName: 'isNonOblige',
    args: ['0x125BA2dC7567990A6b455E2F5dbF95d58b352db5'],
    watch: true,
  });

  useEffect(() => {
    if (!data) return;
    if (data.toString().length > 0) {
      setUserNonOblige(data);
    }
  }, [data]);

  return <h3 className="text-lg">isNonOblige: {userNonOblige.toString()}</h3>;
};

// SETTERS
// SetRoleAdmin -> 0xDD5adB483A6578B4D2e2f2B8CF795C810213e932
const SetRoleAdmin = () => {
  const [userRole, setUserRole] = useState('');
  const { config, error } = usePrepareContractWrite({
    address: rolesManagerContract.address,
    abi: rolesManagerContract.abi,
    functionName: 'setRoleAdmin',
    args: [userRole],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const handleSubmit = (event) => {
    event.preventDefault();
    write();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input id="message" placeholder="Enter 0x account" onChange={(e) => setUserRole(e.target.value)} />
        <button
          type="submit"
          className="mt-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
        >
          setRoleAdmin
        </button>
      </form>
    </>
  );
};

// UpdateUserRole -> 0xDD5adB483A6578B4D2e2f2B8CF795C810213e932
const UpdateUserRole = () => {
  const [userRole, setUserRole] = useState('');
  const [role, setRole] = useState('');
  const { config, error } = usePrepareContractWrite({
    address: rolesManagerContract.address,
    abi: rolesManagerContract.abi,
    functionName: 'updateUserRole',
    args: [userRole, role],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const handleSubmit = (event) => {
    event.preventDefault();
    write();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input id="message" placeholder="Enter 0x account" onChange={(e) => setUserRole(e.target.value)} />
        <input id="role" placeholder="Enter role" onChange={(e) => setRole(e.target.value)} />
        <button
          type="submit"
          className="mt-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
        >
          updateUserRole
        </button>
      </form>
    </>
  );
};

// VerifyUser
const VerifyUser = () => {
  const [userRole, setUserRole] = useState('');
  const { config, error } = usePrepareContractWrite({
    address: rolesManagerContract.address,
    abi: rolesManagerContract.abi,
    functionName: 'verifyUser',
    args: [userRole],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const handleSubmit = (event) => {
    event.preventDefault();
    write();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input id="message" placeholder="Enter 0x account" onChange={(e) => setUserRole(e.target.value)} />
        <button
          type="submit"
          className="mt-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
        >
          verifyUser
        </button>
      </form>
    </>
  );
};

// BlacklistUser
const BlacklistUser = () => {
  const [userRole, setUserRole] = useState('');
  const { config, error } = usePrepareContractWrite({
    address: rolesManagerContract.address,
    abi: rolesManagerContract.abi,
    functionName: 'blacklistUser',
    args: [userRole],
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const handleSubmit = (event) => {
    event.preventDefault();
    write();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input id="message" placeholder="Enter 0x account" onChange={(e) => setUserRole(e.target.value)} />
        <button
          type="submit"
          className="mt-8 bg-green-500 text-white font-bold py-2 px-4 rounded-xl drop-shadow-md hover:bg-green-700 hover:drop-shadow-lg"
        >
          blacklistUser
        </button>
      </form>
    </>
  );
};

const WagmiTest = () => {
  return (
    <>
      <GetUserRole />
      <GetUserVerifiedStatus />
      <GetUserBlacklistedStatus />
      <IsBeneficiaire />
      <IsRGE />
      <IsOblige />
      <IsNonOblige />
      <SetRoleAdmin />
      <UpdateUserRole />
      <VerifyUser />
      <BlacklistUser />
    </>
  );
};

export default WagmiTest;
