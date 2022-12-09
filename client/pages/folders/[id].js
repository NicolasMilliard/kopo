import { useState } from 'react';
import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';

import { folderHandlerContract } from '../../utils/contracts';

// export async function getServerSideProps(context) {
//   const { id } = context.params;

//   const { data } = useContractRead({
//     address: id,
//     abi: addressProviderContract.abi,
//     functionName: 'folderFactoryContractAddress',
//     watch: true,
//   });

//   return {
//     props: {
//       event: data.event,
//     },
//   };
// }

const Folder = ({ folder }) => {
  return <div>Coucou</div>;
};

export default Folder;
