import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Admin from './pages/Admin';
import Register from './auth/Register';
import Login from './auth/Login';

import Home from './pages/Home';
import Reader from './pages/Reader';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Home />} />
        <Route path="/reader/:id" element={<Reader />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
