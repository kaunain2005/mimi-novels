import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md fixed top-0 left-0 w-full z-50 px-4 md:px-8 py-3 flex justify-between items-center">
      {/* Brand */}
      <Link
        to="/"
        className="text-2xl md:text-3xl font-bold text-pink-500 hover:text-pink-600 transition-colors"
      >
        🌸 Mimi-Novels
      </Link>

      {/* Links */}
      <div className="flex items-center gap-4 text-sm md:text-base">
        {user ? (
          <>
            <span className="text-gray-800 hidden sm:inline">
              👋 Hi, {user.displayName || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-pink-500 hover:text-pink-600 font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
