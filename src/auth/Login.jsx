import { useState, useRef } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import GravityFlowers from '../components/GravityFlowers';
import Modal from '../components/Modal';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [modal, setModal] = useState({ show: false, success: true, title: '', message: '' });

  const containerRef = useRef(null);
  const formRefs = useRef([]);
  const buttonRef = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
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
    });
    return () => ctx.revert();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: 'power1.inOut',
    });

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setModal({
        show: true,
        success: true,
        title: '✅ Login Successful',
        message: 'Welcome back! Redirecting...',
      });
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      setModal({
        show: true,
        success: false,
        title: '❌ Login Failed',
        message: 'Are yrrr🤦🏻, account bna na bhool gaye kya???',
      });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fit=crop&w=1470&q=80')",
        }}
      ></div>
      <div className="absolute inset-0 backdrop-blur-sm bg-black/50"></div>

      <GravityFlowers count={10} />

      <div
        ref={containerRef}
        className="relative z-10 bg-white/90 backdrop-blur-xl p-5 md:p-10 rounded-2xl shadow-2xl max-w-md w-full"
      >
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-center text-pink-500">
          🌸 Login to Mimi-Novels
        </h2>
        <form onSubmit={handleLogin} className="space-y-7">
          <input
            ref={(el) => (formRefs.current[0] = el)}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded focus:ring-2 focus:ring-pink-400"
            placeholder="Email"
            required
          />
          <input
            ref={(el) => (formRefs.current[1] = el)}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded focus:ring-2 focus:ring-pink-400"
            placeholder="Password"
            required
          />
          <button
            ref={buttonRef}
            type="submit"
            className="w-full bg-pink-500 text-white py-3 px-4 rounded hover:bg-pink-700 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-gray-700 text-center text-sm md:text-base">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-pink-600 underline">
            Register here
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

export default Login;
