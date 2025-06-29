// ✅ src/App.jsx — Version 1.0.0
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Admin from './pages/Admin';
import Register from './auth/Register';
import Login from './auth/Login';
import Home from './pages/Home';
import Reader from './pages/Reader';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import ProtectedRoute from './auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Public routes without Navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />

        {/* ✅ Protected routes with Navbar */}
        <Route element={<Layout />}>
          {/* Home is public but wrapped with auth check */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Admin route protected — checks admin Firestore */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Reader route protected — normal auth check */}
          <Route
            path="/reader/:bookId"
            element={
              <ProtectedRoute>
                <Reader />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
