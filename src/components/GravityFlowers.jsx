import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

// ✅ Use your real SVGs
import Flower1 from '../assets/flowers/flower1.svg';
import Flower8 from '../assets/flowers/flower8.svg';
import Flower3 from '../assets/flowers/flower3.svg';
import Flower4 from '../assets/flowers/flower4.svg';
import Flower5 from '../assets/flowers/flower5.svg';
import Flower6 from '../assets/flowers/flower6.svg';

const flowerSvgs = [Flower1, Flower8, Flower3, Flower4, Flower5, Flower6];

const GravityFlowers = React.memo(({ count = 10 }) => {
  const gravityRefs = useRef([]);
  const containerRef = useRef(null);

  // ✅ Falling flowers: only once
  useEffect(() => {
    gravityRefs.current.forEach((el) => {
      gsap.to(el, {
        y: '110vh',
        x: 'random(-200, 200)',
        rotation: 'random(0, 360)',
        duration: 'random(8, 15)',
        ease: 'none',
        repeat: -1,
        delay: Math.random() * 5,
      });
    });
  }, []);

  // ✅ Click pop
  useEffect(() => {
    const container = containerRef.current;

    const handleClick = (e) => {
      const svg = flowerSvgs[Math.floor(Math.random() * flowerSvgs.length)];

      const flower = document.createElement('img');
      flower.src = svg;
      flower.className = 'pointer-events-none fixed w-8 h-8 z-[9999]';
      flower.style.left = `${e.clientX}px`;
      flower.style.top = `${e.clientY}px`;
      flower.style.transform = 'translate(-50%, -50%)';

      document.body.appendChild(flower);

      gsap.fromTo(
        flower,
        { scale: 0, opacity: 1, rotate: 0 },
        {
          scale: 2,
          rotate: Math.random() * 720,
          opacity: 0,
          duration: 1.5,
          ease: 'back.out(2)',
          onComplete: () => flower.remove(),
        }
      );
    };

    container.addEventListener('click', handleClick);
    return () => container.removeEventListener('click', handleClick);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-auto z-0"
    >
      {Array.from({ length: count }).map((_, i) => (
        <img
          key={i}
          ref={(el) => (gravityRefs.current[i] = el)}
          src={flowerSvgs[i % flowerSvgs.length]}
          alt="flower"
          className="absolute w-8 h-8"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-10%`,
          }}
        />
      ))}
    </div>
  );
});

export default GravityFlowers;
