import Head from 'next/head';
import CreateFolder from '../components/Dashboard/CreateFolder';

const CreateFolderPage = () => {
  return (
    <div>
      <Head>
        <title>Création d'un nouveau dossier</title>
        <meta name="description" content="Création d'un nouveau dossier - Kopo" />
      </Head>

      <section>
        <CreateFolder />
      </section>
    </div>
  );
};

export default CreateFolderPage;
