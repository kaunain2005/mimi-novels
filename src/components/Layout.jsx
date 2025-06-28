import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <Navbar /> {/* ✅ Shared Navbar */}
      <main className="min-h-screen">
        <Outlet /> {/* ✅ Child routes render here */}
      </main>
    </>
  );
};

export default Layout;
