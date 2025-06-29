// src/pages/NotFound
import { Link } from 'react-router-dom';
import GravityFlowersMatter from '../components/GravityFlowersPhysics';

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 bg-pink-300">
     <GravityFlowersMatter count={10} enableClickSpawn={true} />


      <div className="relative z-10 text-center text-white">
        <h1 className="text-7xl font-extrabold mb-4">404</h1>
        <p className="text-xl mb-8">Oops! Page not found 🌸</p>
        <Link
          to="/"
          className="inline-block bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
