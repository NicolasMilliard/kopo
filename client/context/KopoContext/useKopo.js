import { useContext } from 'react';
import KopoContext from './KopoContext';

const useKopo = () => {
  const context = useContext(KopoContext);
  if (context === undefined) {
    throw new Error('useKopo must be used within a UserProvider');
  }

  return context;
};

export default useKopo;
