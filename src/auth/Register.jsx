import { useState, useRef } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // ✅ Include db here!
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import GravityFlowers from '../components/GravityFlowers';
import Modal from '../components/Modal';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modal, setModal] = useState({ show: false, success: true, title: '', message: '' });

  const navigate = useNavigate();
  const containerRef = useRef(null);
  const formRefs = useRef([]);
  const buttonRef = useRef(null);

  useGSAP(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: 'power2.out',
    });

    gsap.from(formRefs.current, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.2,
      delay: 0.5,
    });
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: 'power1.inOut',
    });

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      // ✅ Save to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        createdAt: new Date(),
      });

      setModal({
        show: true,
        success: true,
        title: '✅ Registration Successful',
        message: 'Welcome to MiMi-Novels! Redirecting...',
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error(err); // ✅ show what exactly failed!
      let customMessage = 'Something went wrong 😭';

      if (err.code === 'auth/email-already-in-use') {
        customMessage = 'Email already registered🧐🧐';
      } else if (err.code === 'auth/weak-password') {
        customMessage = 'Password too weak🤔🤔. Minimum 6 characters required.';
      }

      setModal({
        show: true,
        success: false,
        title: '❌ Registration Failed',
        message: customMessage,
      });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* BG */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/6c/03/9e/6c039ee0225b2711d36aec6c92d768e7.jpg')",
        }}
      ></div>
      <div className="absolute inset-0 backdrop-blur-sm bg-black/50"></div>
      <GravityFlowers count={10} />

      {/* Card */}
      <div
        ref={containerRef}
        className="relative z-10 bg-white/70 backdrop-blur-xl p-5 md:p-10 rounded-2xl shadow-2xl max-w-md w-full"
      >
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-center text-pink-500">
          🌸 Create Mimi-Novels Account
        </h2>
        <form onSubmit={handleRegister} className="space-y-7">
          <input
            ref={(el) => (formRefs.current[0] = el)}
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-3 rounded focus:ring-2 focus:ring-pink-400"
            required
          />
          <input
            ref={(el) => (formRefs.current[1] = el)}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded focus:ring-2 focus:ring-pink-400"
            required
          />
          <input
            ref={(el) => (formRefs.current[2] = el)}
            type="password"
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded focus:ring-2 focus:ring-pink-400"
            required
          />
          <button
            ref={buttonRef}
            type="submit"
            className="w-full bg-pink-500 text-white py-3 px-4 rounded hover:bg-pink-700 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-gray-700 text-center text-sm md:text-base">
          Already have an account?{' '}
          <Link to="/login" className="text-pink-600 underline">
            Login here
          </Link>
        </p>
      </div>

      <Modal
        show={modal.show}
        onClose={() => setModal({ ...modal, show: false })}
        title={modal.title}
        message={modal.message}
        success={modal.success}
      />
    </div>
  );
};

export default Register;
