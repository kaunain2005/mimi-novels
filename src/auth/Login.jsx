import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      alert("Login Failed: " + error.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full border p-2 rounded" placeholder="Email" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full border p-2 rounded" placeholder="Password" required />
        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;
