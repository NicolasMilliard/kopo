import Navbar from '../Navbar/Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className='mb-60'>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
