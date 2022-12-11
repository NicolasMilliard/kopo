import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import chevron from '../../public/images/icons/left-chevron.svg';

const ReturnToDashboard = () => {
  return (
    <Link href="/dashboard" className='flex items-center'>
      <Image src={chevron} alt="<" width="8" className='mr-1' />
      Retour au tableau de bord
    </Link>
  )
}

export default ReturnToDashboard