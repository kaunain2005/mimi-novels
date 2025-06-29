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
    engine.gravity.y = 0.5;
    engineRef.current = engine;
    const world = engine.world;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const createFlower = (x, y) => {
      const size = 32;
      const body = Bodies.circle(x, y, size / 2, {
        restitution: 0.9,
        frictionAir: 0.02,
      });
      Body.setAngularVelocity(body, Math.random() * 0.1);

      const img = document.createElement('img');
      img.src = flowers[Math.floor(Math.random() * flowers.length)];
      img.className = 'absolute w-8 h-8 pointer-events-none';
      containerRef.current.appendChild(img);

      flowerElements.current.push(img);
      flowerBodies.current.push(body);
      World.add(world, body);

      // Lifetime: fade out and remove after `lifetime` sec
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

    // Initial flowers
    for (let i = 0; i < count; i++) {
      createFlower(Math.random() * width, Math.random() * -height);
    }

    // Add walls
    const walls = [
      Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true }),
      Bodies.rectangle(-50, height / 2, 100, height, { isStatic: true }),
      Bodies.rectangle(width + 50, height / 2, 100, height, { isStatic: true }),
    ];
    World.add(world, walls);

    // Animate
    const update = () => {
      Engine.update(engine);
      flowerBodies.current.forEach((body, i) => {
        const el = flowerElements.current[i];
        if (el) {
          el.style.transform = `translate(${body.position.x - 16}px, ${body.position.y - 16}px) rotate(${body.angle}rad)`;
        }
      });
      requestAnimationFrame(update);
    };
    update();

    // Tilt
    const handleOrientation = (event) => {
      const { gamma, beta } = event;
      flowerBodies.current.forEach((body) => {
        Body.applyForce(body, body.position, {
          x: gamma / 5000,
          y: beta / 5000,
        });
      });
    };
    window.addEventListener('deviceorientation', handleOrientation);

    // Click spawn
    const handleClick = (e) => {
      if (!enableClickSpawn) return;
      createFlower(e.clientX, e.clientY);
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
