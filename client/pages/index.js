import Link from 'next/link';
import { toast } from 'react-toastify';

const Index = () => {
  const notify = () => toast('Hello Kopo!');
  return (
    <>
      <h1>Landing Page</h1>
      <Link href="/dashboard">Go to Dashboard</Link>
      <button
        onClick={notify}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Toastify test
      </button>
    </>
  );
};

export default Index;
