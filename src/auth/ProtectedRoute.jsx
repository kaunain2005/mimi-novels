// src/auth/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import FancyLoader from '../components/FancyLoader';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const docRef = doc(db, 'admins', user.email);
        const docSnap = await getDoc(docRef);
        setIsAdmin(docSnap.exists());
      }
      setChecking(false);
    };

    if (adminOnly) {
      checkAdmin();
    } else {
      setChecking(false);
    }
  }, [user, adminOnly]);

  if (loading || checking) return <FancyLoader />;

  if (!user) return <Navigate to="/login" replace />;

  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  return children;
}
