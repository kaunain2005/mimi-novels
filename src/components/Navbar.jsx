import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import gsap from 'gsap';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const flowerRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log('✅ Logged in as:', currentUser.email);
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

        // 🔍 Check Firestore for admin match
        try {
          const q = query(
            collection(db, 'admins'),
            where('email', '==', currentUser.email)
          );
          const snapshot = await getDocs(q);

          console.log('✅ Admin query snapshot:', snapshot.size);

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
            <span className="inline">👤 {user.displayName || user.email}</span>
            {isAdmin && (
              <Link
                to="/admin"
                className="bg-pink-500 text-white font-bold px-4 py-2 rounded hover:bg-pink-600 transition"
              >
                Admin Panel👑
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-pink-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600 transition"
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
    </nav>
  );
};

export default Navbar;
