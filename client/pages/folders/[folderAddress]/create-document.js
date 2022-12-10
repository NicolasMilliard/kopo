import Head from 'next/head';
import CreateDocument from '../../../components/Dashboard/CreateDocument';

const CreateDocumentPage = ({ folderAddress }) => {
  return (
    <div>
      <Head>
        <title>Envoi d'une nouvelle pièce au dossier</title>
        <meta name="description" content="Création d'un nouveau dossier - Kopo" />
      </Head>

      <section>
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
