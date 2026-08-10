'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Confetti() {
  const [particles, setParticles] = useState<{ id: number; left: number; duration: number; color: string }[]>([]);

  useEffect(() => {
    const colors = ['#f472b6', '#fbbf24', '#38bdf8', '#a78bfa', '#fb7185'];
    
    // Generate initial burst of confetti
    const burst = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 2 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    
    setParticles(burst);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ y: '-10vh', opacity: 1, rotate: 0, x: 0 }}
          animate={{ 
            y: '110vh', 
            opacity: 0, 
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
            x: (Math.random() - 0.5) * 200 // drift left/right
          }}
          transition={{ duration: particle.duration, ease: "easeOut" }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ 
            left: `${particle.left}%`, 
            backgroundColor: particle.color 
          }}
        />
      ))}
    </div>
  );
}
