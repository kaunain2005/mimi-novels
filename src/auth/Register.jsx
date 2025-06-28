import { useState, useRef } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import GravityFlowers from '../components/GravityFlowers';
import Modal from '../components/Modal'; // ✅ Same Modal

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

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

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }

      setModalMessage('🎉 Registration successful!');
      setModalOpen(true);

      setTimeout(() => {
        setModalOpen(false);
        navigate('/login');
      }, 2000);
    } catch (err) {
      setModalMessage(`❌ ${err.message}`);
      setModalOpen(true);

      setTimeout(() => {
        setModalOpen(false);
      }, 3000);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* BG */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1496497243327-86e6816c1666?fit=crop&w=1470&q=80')",
        }}
      ></div>
      <div className="absolute inset-0 backdrop-blur-sm bg-black/50"></div>
      <GravityFlowers count={10} />

      {/* Card */}
      <div
        ref={containerRef}
        className="relative z-10 bg-white/90 backdrop-blur-xl p-5 md:p-10 rounded-2xl shadow-2xl max-w-md w-full"
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

      {/* ✅ Shared Modal */}
      <Modal open={modalOpen} message={modalMessage} />
    </div>
  );
};

export default Register;
