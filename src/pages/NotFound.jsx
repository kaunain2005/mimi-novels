// src/pages/NotFound.jsx
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

// ✅ Use your flower SVGs
import Flower1 from '../assets/flowers/flower1.svg';
import Flower3 from '../assets/flowers/flower3.svg';
import Flower4 from '../assets/flowers/flower4.svg';
import Flower5 from '../assets/flowers/flower5.svg';
import Flower6 from '../assets/flowers/flower6.svg';
import Flower8 from '../assets/flowers/flower8.svg';

const NotFound = () => {
  const flowerRefs = useRef([]);
  const flowers = [Flower1, Flower3, Flower4, Flower5, Flower6, Flower8];

  useEffect(() => {
    // ✅ Initial random drift
    flowerRefs.current.forEach((el) => {
      gsap.to(el, {
        y: 'random(-50, 50)',
        x: 'random(-50, 50)',
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    // ✅ Device orientation
    const handleOrientation = (event) => {
      const { gamma, beta } = event; // left-right, front-back
      flowerRefs.current.forEach((el, index) => {
        gsap.to(el, {
          x: gamma * (index % 5),
          y: beta * (index % 5),
          duration: 1.5,
          ease: 'power2.out',
        });
      });
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 bg-black">
      {/* Flowers */}
      {Array.from({ length: 10 }).map((_, i) => (
        <img
          key={i}
          ref={(el) => (flowerRefs.current[i] = el)}
          src={flowers[i % flowers.length]}
          alt="Flower"
          className="absolute w-10 h-10 pointer-events-none"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* 404 Message */}
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
};

export default NotFound;
