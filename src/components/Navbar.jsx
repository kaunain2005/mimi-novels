import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import gsap from 'gsap';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const flowerRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // 1️⃣ Get display name from users collection
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

        // 2️⃣ Check if user is admin
        try {
          const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
          if (adminDoc.exists()) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (err) {
          console.error('Failed to check admin status:', err);
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
        ease: 'power1.in',
        duration: 6,
      });
    });
    return () => ctx.revert();
  }, []);

  const handleFlowerHover = (scale) => {
    gsap.to(flowerRef.current, {
      scale,
      duration: 0.3,
      ease: 'power1.inOut',
    });
  };

  const toggleDrawer = () => setIsOpen(!isOpen);

  return (
    <nav
      ref={navbarRef}
      className="bg-white/30 flex justify-between items-center px-6 py-4 mt-1 shadow-lg relative"
    >
      <Link to="/" className="text-pink-500 text-xl font-bold flex items-center gap-2">
        <span
          ref={flowerRef}
          className="inline-block cursor-pointer"
          onMouseEnter={() => handleFlowerHover(1.2)}
          onMouseLeave={() => handleFlowerHover(1)}
        >
          🌸
        </span>
        Mimi-Novels
      </Link>

      {/* Desktop Nav */}
      <div className="hidden sm:flex items-center gap-4 text-sm">
        {user && (
          <>
            <span>👤 {user.displayName || user.email}</span>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-pink-600 hover:underline font-semibold"
              >
                Admin Panel
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-white font-bold bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded transition"
            >
              Logout ☹️
            </button>
          </>
        )}
        {!user && (
          <>
            <Link to="/login" className="hover:underline hover:text-pink-400">
              Login
            </Link>
            <Link to="/register" className="hover:underline hover:text-pink-400">
              Register
            </Link>
          </>
        )}
      </div>

      {/* Hamburger for mobile */}
      <button className="block sm:hidden" onClick={toggleDrawer}>
        <span className="w-6 h-0.5 bg-pink-600 block mb-1"></span>
        <span className="w-6 h-0.5 bg-pink-600 block mb-1"></span>
        <span className="w-6 h-0.5 bg-pink-600 block"></span>
      </button>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="absolute top-full right-0 w-full bg-white/80 backdrop-blur-md p-4 flex flex-col gap-4 sm:hidden">
          {user && (
            <>
              <span className="text-black">👤 {user.displayName || user.email}</span>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-pink-600 font-semibold"
                  onClick={toggleDrawer}
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  toggleDrawer();
                }}
                className="text-white font-bold bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded transition"
              >
                Logout ☹️
              </button>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" onClick={toggleDrawer}>
                Login
              </Link>
              <Link to="/register" onClick={toggleDrawer}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
