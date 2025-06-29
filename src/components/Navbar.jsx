import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import gsap from 'gsap';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const flowerRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        let displayName = currentUser.displayName;

        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            displayName = userDoc.data().name || displayName;
          }
        } catch (err) {
          console.error('Failed to get user profile:', err);
        }

        setUser({
          ...currentUser,
          displayName,
        });

        // 🔍 Check Firestore for admin
        try {
          const q = query(
            collection(db, 'admins'),
            where('email', '==', currentUser.email)
          );
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (err) {
          console.error('Admin check failed:', err);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

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
        ease: 'linear',
        duration: 6,
      });
    });

    return () => ctx.revert();
  }, []);

  // Animate mobile menu open/close
  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      });
    }
  }, [isOpen]);

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
      className="bg-white/30 flex justify-between items-center px-6 py-4 shadow-lg relative"
    >
      <Link
        to="/"
        className="text-pink-500 text-xl font-bold flex items-center gap-2"
      >
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
        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-3xl text-pink-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span>👤 {user.displayName || user.email}</span>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
                >
                  Admin Panel👑
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout 😭
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
      </div>

      {/* Animated Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`${
          isOpen ? 'flex' : 'hidden'
        } flex-col gap-4 absolute top-full right-6 bg-white shadow-md rounded-md p-4 md:hidden`}
      >
        {user ? (
          <>
            <span>👤 {user.displayName || user.email}</span>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
              >
                Admin Panel👑
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout 😭
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="hover:underline hover:text-pink-400 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
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
