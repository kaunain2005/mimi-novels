// src/components/GravityFlowersMatter.jsx
import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

import Flower1 from '../assets/flowers/flower1.svg';
import Flower3 from '../assets/flowers/flower3.svg';
import Flower4 from '../assets/flowers/flower4.svg';
import Flower5 from '../assets/flowers/flower5.svg';
import Flower6 from '../assets/flowers/flower6.svg';
import Flower8 from '../assets/flowers/flower8.svg';

const flowers = [Flower1, Flower3, Flower4, Flower5, Flower6, Flower8];

const GravityFlowersMatter = ({ count = 10, enableClickSpawn = true }) => {
  const containerRef = useRef(null);
  const flowerRefs = useRef([]);
  const engineRef = useRef(null);
  const bodiesRef = useRef([]);

  useEffect(() => {
    const { Engine, Bodies, World, Body } = Matter;
    const engine = Engine.create();
    engineRef.current = engine;
    const world = engine.world;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Initial flowers
    const initialBodies = Array.from({ length: count }).map(() =>
      createFlowerBody(width, height)
    );

    bodiesRef.current = initialBodies;
    World.add(world, initialBodies);

    // Walls
    const walls = [
      Bodies.rectangle(width / 2, -50, width, 100, { isStatic: true }),
      Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true }),
      Bodies.rectangle(-50, height / 2, 100, height, { isStatic: true }),
      Bodies.rectangle(width + 50, height / 2, 100, height, { isStatic: true }),
    ];
    World.add(world, walls);

    // Engine run
    const runner = Engine.run(engine);

    // Animation loop
    const update = () => {
      bodiesRef.current.forEach((body, i) => {
        const flower = flowerRefs.current[i];
        if (flower) {
          flower.style.transform = `translate(${body.position.x}px, ${body.position.y}px) rotate(${body.angle}rad)`;
        }
      });
      requestAnimationFrame(update);
    };
    update();

    // Tilt
    const handleOrientation = (event) => {
      const { gamma, beta } = event;
      bodiesRef.current.forEach((body) => {
        Body.applyForce(body, body.position, {
          x: gamma / 5000,
          y: beta / 5000,
        });
      });
    };
    window.addEventListener('deviceorientation', handleOrientation);

    // Mouse drift
    const handleMouse = (e) => {
      const forceX = (e.clientX / width - 0.5) * 0.002;
      const forceY = (e.clientY / height - 0.5) * 0.002;
      bodiesRef.current.forEach((body) => {
        Body.applyForce(body, body.position, { x: forceX, y: forceY });
      });
    };
    window.addEventListener('mousemove', handleMouse);

    // Click spawn
    const handleClick = (e) => {
      if (!enableClickSpawn) return;

      const flowerBody = createFlowerBody(width, height, e.clientX, e.clientY);
      bodiesRef.current.push(flowerBody);
      World.add(world, flowerBody);

      const newIndex = bodiesRef.current.length - 1;

      const img = document.createElement('img');
      img.src = flowers[Math.floor(Math.random() * flowers.length)];
      img.className = 'absolute w-8 h-8 pointer-events-none';
      containerRef.current.appendChild(img);
      flowerRefs.current[newIndex] = img;

      // Optional: add burst or sound here
    };
    window.addEventListener('click', handleClick);

    return () => {
      Matter.Engine.clear(engine);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('click', handleClick);
    };
  }, [count, enableClickSpawn]);

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <img
          key={i}
          ref={(el) => (flowerRefs.current[i] = el)}
          src={flowers[i % flowers.length]}
          alt="Flower"
          className="absolute w-8 h-8"
          style={{ transform: 'translate(0, 0)' }}
        />
      ))}
    </div>
  );
};

// 🔑 Helper: create random body
function createFlowerBody(width, height, x = null, y = null) {
  const { Bodies, Body } = Matter;
  const size = Math.random() * 20 + 20;
  const body = Bodies.circle(
    x ?? Math.random() * width,
    y ?? Math.random() * height,
    size / 2,
    {
      restitution: 0.9,
      frictionAir: 0.02,
    }
  );
  Body.setAngularVelocity(body, Math.random() * 0.05);
  return body;
}

export default GravityFlowersMatter;
