import Link from 'next/link';
import Image from 'next/image';
import WagmiButton from '../components/Buttons/WagmiButton';
import EstimateFinancialAid from '../components/Buttons/EstimateFinancialAid';
import kopoImage from '../images/kopo-renovation-energetique.svg';

const Index = () => {
  return (
    <>
      <Link href="/dashboard">Go to Dashboard</Link>
      <div className='mx-4 py-8 lg:px-40 xl-px60'>
        <div className='flex items-center justify-center'>
          <div>
            <h1 className='text-3xl mb-8 max-w-md'>Kopo&nbsp;: votre rénovation énergétique en toute simplicité</h1>
            <p className='max-w-md mb-8'>
              Kopo simplifie vos démarches de demande de Certificats d'Economie d'Energie (CEE)
              et vous assure leur traçabilité en toute transparence.
            </p>
            <div className='flex items-center max-w-2md'>
              <WagmiButton />
              <EstimateFinancialAid />
            </div>
          </div>
          <div className='ml-60'>
            <Image
              src={kopoImage}
              alt="Kopo : votre rénovation énergétique en toute simplicité"
              width="560"
              priority={true}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
