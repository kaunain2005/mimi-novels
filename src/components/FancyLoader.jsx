// src/components/FancyLoader.jsx
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import GravityFlowers from './GravityFlowers';

export default function FancyLoader() {
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1.2,
          duration: 2,
          yoyo: true,
          repeat: -1,
          ease: 'power1.inOut',
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-pink-300 overflow-hidden">
      <GravityFlowers count={20} />
      <h1
        ref={textRef}
        className="text-4xl md:text-6xl sm:text-3xl text-pink-600 font-extrabold z-10"
      >
        🌸 Blooming Mimi-Novels...
      </h1>
    </div>
  );
}
