// src/components/Footer.jsx (or src/Footer.jsx)
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    if (footerRef.current) {
      gsap.to(footerRef.current, {
        background: 'linear-gradient(270deg, #FF69B4, #FF8C94, #FF69B4, #FF8C94)',
        backgroundSize: '400% 100%',
        backgroundPosition: '100% 0%',
        duration: 8,
        ease: 'none',
        repeat: -1,
        yoyo: true
      });
    }
  }, []);

  return (
    <footer
      ref={footerRef}
      className="py-4 text-center text-white font-bold text-md md:text-md"
      style={{
        // Initial inline styles for GSAP target
        background: 'linear-gradient(270deg, #FF69B4, #FF8C94, #FF69B4, #FF8C94)',
        backgroundSize: '400% 100%',
        backgroundPosition: '0% 0%',
      }}
    >
      Made with ❤️ by Kaunain
    </footer>
  );
};

export default Footer;