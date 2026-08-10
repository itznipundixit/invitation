'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function FloatingHearts() {
  const [hearts, setHearts] = useState<{ id: number; left: number; duration: number; size: number }[]>([]);

  useEffect(() => {
    const createHeart = () => {
      const newHeart = {
        id: Math.random(),
        left: Math.random() * 100,
        duration: 3 + Math.random() * 4,
        size: 10 + Math.random() * 20,
      };
      setHearts((prev) => [...prev.slice(-15), newHeart]); // Keep max 15 hearts at a time
    };

    const interval = setInterval(createHeart, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ y: '100vh', opacity: 0, scale: 0 }}
          animate={{ y: '-10vh', opacity: [0, 1, 1, 0], scale: 1 }}
          transition={{ duration: heart.duration, ease: "linear" }}
          className="absolute text-pink-400"
          style={{ left: `${heart.left}%`, fontSize: heart.size }}
        >
          {Math.random() > 0.5 ? '♥' : '🌸'}
        </motion.div>
      ))}
    </div>
  );
}
