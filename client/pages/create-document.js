import Head from 'next/head';
import CreateDocument from '../components/Dashboard/CreateDocument';

const CreateDocumentPage = () => {
  return (
    <div>
      <Head>
        <title>Envoi d'une nouvelle pièce au dossier</title>
        <meta name="description" content="Création d'un nouveau dossier - Kopo" />
      </Head>

      <section>
        <CreateDocument />
      </section>
    </div>
  );
};

export default CreateDocumentPage;
