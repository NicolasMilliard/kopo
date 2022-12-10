import React from 'react';
import Button from '../Buttons/Button';
import WagmiButton from '../Buttons/WagmiButton';
import DashboardBeneficiary from './DashboardBeneficiary';
import DashboardObligated from './DashboardObligated';

const Dashboard = ({ currentAccount, isVerified, role }) => {
  console.log('currentAccount: ' + currentAccount);
  console.log('isVerified: ' + isVerified);
  console.log('role: ' + role);

  return (
    <>
      {/* If user is not connected */}
      {!currentAccount && (
        <section className="flex flex-col items-center justify-center">
          <h1 className="text-xl mb-8">Veuillez vous connecter pour accéder à votre tableau de bord.</h1>
          <WagmiButton />
        </section>
      )}
      {/* If user is connected but not verified */}
      {currentAccount && !isVerified && (
        <section className="flex flex-col items-center justify-center">
          <h1 className="text-xl mb-8">Vous n'êtes pas encore vérifié, merci de vérifier votre identité.</h1>
          <Button text="Vérifier mon idendité" />
        </section>
      )}
      {/* If user is connected, verified and got the role 0 (BENEFICIARE) */}
      {currentAccount && isVerified && role === 0 && <DashboardBeneficiary />}
      {/* If user is connected, verified and got the role 2 (OBLIGE) */}
      {currentAccount && isVerified && role === 2 && <DashboardObligated />}
    </>
  );
};

export default Dashboard;
