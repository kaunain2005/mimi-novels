import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import gsap from 'gsap';

import Flower1 from '../assets/flowers/flower1.svg';
import Flower3 from '../assets/flowers/flower3.svg';
import Flower4 from '../assets/flowers/flower4.svg';
import Flower5 from '../assets/flowers/flower5.svg';
import Flower6 from '../assets/flowers/flower6.svg';
import Flower8 from '../assets/flowers/flower8.svg';

const flowers = [Flower1, Flower3, Flower4, Flower5, Flower6, Flower8];

const GravityFlowersMatter = ({ count = 10, enableClickSpawn = true, lifetime = 20 }) => {
  const containerRef = useRef(null);
  const flowerElements = useRef([]);
  const flowerBodies = useRef([]);
  const engineRef = useRef(null);

  useEffect(() => {
    const { Engine, World, Bodies, Body } = Matter;

    const engine = Engine.create();
    engine.gravity.y = 0.3; // slightly softer fall for smoother look
    engineRef.current = engine;
    const world = engine.world;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const createFlower = (x, y) => {
      const size = 28 + Math.random() * 8; // varied sizes for natural feel
      const body = Bodies.circle(x, y, size / 2, {
        restitution: 0.8,
        frictionAir: 0.02,
      });

      Body.setAngularVelocity(body, Math.random() * 0.05);

      const img = document.createElement('img');
      img.src = flowers[Math.floor(Math.random() * flowers.length)];
      img.className = 'absolute pointer-events-none';
      img.style.width = `${size}px`;
      img.style.height = `${size}px`;
      img.style.opacity = 0;

      containerRef.current.appendChild(img);

      flowerElements.current.push(img);
      flowerBodies.current.push(body);
      World.add(world, body);

      // Fade in
      gsap.to(img, {
        opacity: 1,
        duration: 0.8,
      });

      // Lifetime fade out
      gsap.to(img, {
        opacity: 0,
        scale: 0,
        duration: 2,
        delay: lifetime,
        onComplete: () => {
          World.remove(world, body);
          img.remove();
        },
      });
    };

    // Spawn initial flowers near the top with some horizontal spread
    for (let i = 0; i < count; i++) {
      const x = width * 0.2 + Math.random() * width * 0.6; // center spread
      const y = -Math.random() * height * 0.5;
      createFlower(x, y);
    }

    // Add gentle walls
    const walls = [
      Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true }),
      Bodies.rectangle(-50, height / 2, 100, height, { isStatic: true }),
      Bodies.rectangle(width + 50, height / 2, 100, height, { isStatic: true }),
    ];
    World.add(world, walls);

    // Animate Matter world & DOM elements
    const update = () => {
      Engine.update(engine);
      flowerBodies.current.forEach((body, i) => {
        const el = flowerElements.current[i];
        if (el) {
          el.style.transform = `translate(${body.position.x - body.circleRadius}px, ${body.position.y - body.circleRadius}px) rotate(${body.angle}rad)`;
        }
      });
      requestAnimationFrame(update);
    };
    update();

    // Smooth tilt
    const handleOrientation = (event) => {
      const { gamma = 0, beta = 0 } = event;

      flowerBodies.current.forEach((body) => {
        Body.applyForce(body, body.position, {
          x: gamma / 20000, // gentler force
          y: beta / 20000,
        });
      });
    };
    window.addEventListener('deviceorientation', handleOrientation, true);

    // Click spawn
    const handleClick = (e) => {
      if (!enableClickSpawn) return;
      createFlower(e.clientX, e.clientY - 50); // small upward offset for natural drop
    };
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('click', handleClick);
      Engine.clear(engine);
    };
  }, [count, enableClickSpawn, lifetime]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    ></div>
  );
};

export default GravityFlowersMatter;
