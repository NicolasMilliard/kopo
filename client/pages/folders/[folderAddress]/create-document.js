import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import CreateDocument from '../../../components/Dashboard/CreateDocument';
import chevron from '../../../public/images/icons/left-chevron.svg';

const CreateDocumentPage = ({ folderAddress }) => {
  console.log(folderAddress);
  return (
    <div>
      <Head>
        <title>Envoi d'une nouvelle pièce au dossier</title>
        <meta name="description" content="Création d'un nouveau dossier - Kopo" />
      </Head>

      <section className="mx-4 py-8 lg:px-40 xl:px-60">
        <Link href={`/folders/${folderAddress}`} className='flex items-center'>
          <Image src={chevron} alt="<" width="8" className='mr-1' />
          Retour au dossier
        </Link>
        <CreateDocument folderAddress={folderAddress} />
      </section>
    </div>
  );
};

export async function getServerSideProps(context) {
  // TODO Sanitize id to avoid non address. There is already a security check though.
  const { folderAddress } = context.params;

  return {
    props: {
      folderAddress: folderAddress,
    },
  };
}

export default CreateDocumentPage;
