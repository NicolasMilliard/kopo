import Head from 'next/head';
import CreateFolder from '../components/Kopo/CreateFolder';

const CreateDocumentPage = () => {
  return (
    <div>
      <Head>
        <title>Envoi d'une nouvelle pièce au dossier</title>
        <meta name="description" content="Création d'un nouveau dossier - Kopo" />
      </Head>

      <section>
        <CreateFolder />
      </section>
    </div>
  );
};

export default CreateDocumentPage;
