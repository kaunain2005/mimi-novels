import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registration Successful");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full border p-2 rounded" placeholder="Email" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full border p-2 rounded" placeholder="Password" required />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Sign Up</button>
      </form>
    </div>
  );
};

export default Register;
