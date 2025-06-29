// src/components/Navbar.jsx
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; // ✅ Make sure db is imported
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import gsap from 'gsap';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const flowerRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // ✅ Try to get Firestore profile name:
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUser({
              ...currentUser,
              displayName: userDoc.data().name || currentUser.displayName,
            });
          } else {
            setUser(currentUser);
          }
        } catch (err) {
          console.error('Failed to get Firestore user name:', err);
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
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

  // ✅ Your original GSAP: slide-in navbar + infinite flower spin
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

  // ✅ Flower hover scale
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
      className="bg-white/30 flex justify-between items-center px-6 py-4 mt-1 shadow-lg z-999"
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
            <span className="hidden sm:inline">👤 {user.displayName || user.email}</span>
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
