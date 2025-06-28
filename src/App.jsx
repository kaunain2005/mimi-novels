import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Admin from './pages/Admin';
import Register from './auth/Register';
import Login from './auth/Login';
import Home from './pages/Home';
import Reader from './pages/Reader';
import Layout from './components/Layout'; // 🔑 New Layout with Navbar!

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Public routes without Navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Routes with Navbar */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/reader/:bookId" element={<Reader />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
