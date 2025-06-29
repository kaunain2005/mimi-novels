// src/components/Navbar.jsx
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import gsap from 'gsap';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const flowerRef = useRef(null);

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

  // GSAP slide-in for Navbar + flower spin
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navbarRef.current, {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      });

      gsap.to(flowerRef.current, {
        rotate: 360,
        repeat: -1,
        ease: 'power1.in',
        duration: 6,
      });
    });

    return () => ctx.revert();
  }, []);

  // Flower hover scale
  const handleFlowerHover = (scale) => {
    gsap.to(flowerRef.current, {
      scale,
      duration: 0.3,
      ease: 'power1.inOut',
    });
  };

  return (
    <nav
      ref={navbarRef}
      className="bg-white/30 flex justify-between items-center px-6 py-4 shadow-lg"
    >
      <Link to="/" className="text-pink-500 text-xl font-bold flex items-center gap-2">
        <span
          id="flower-logo"
          ref={flowerRef}
          className="inline-block cursor-pointer"
          onMouseEnter={() => handleFlowerHover(1.2)}
          onMouseLeave={() => handleFlowerHover(1)}
        >
          🌸
        </span>
        Mimi-Novels
      </Link>

      <div className="flex items-center gap-4 text-sm">
        {user ? (
          <>
            <span className="hidden sm:inline">👤 {user.name}</span>
            <button
              onClick={handleLogout}
              className="text-white font-bold bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded transition"
            >
              Logout☹️
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hover:underline hover:text-pink-400 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="hover:underline hover:text-pink-400 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
