'use client';

import React, { useState, useRef } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface WelcomeScreenProps {
  onYes: () => void;
  isSubmitting: boolean;
}

export function WelcomeScreen({ onYes, isSubmitting }: WelcomeScreenProps) {
  const [noClicks, setNoClicks] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNoHover = () => {
    if (noClicks < 3) {
      moveNoButton();
    }
  };

  const handleNoClick = () => {
    setNoClicks((prev) => prev + 1);
    if (noClicks < 3) {
      moveNoButton();
    }
  };

  const moveNoButton = () => {
    if (!containerRef.current) return;
    
    // Keep within bounds of the card/screen
    // YES button is in the center
    const xSign = Math.random() > 0.5 ? 1 : -1;
    const ySign = Math.random() > 0.5 ? 1 : -1;
    
    // Move 60-120px left/right
    const x = xSign * (60 + Math.random() * 60);
    // Move 30-50px up/down (so it doesn't overflow the h-32 container)
    const y = ySign * (30 + Math.random() * 20);
    
    setNoPosition({ x, y });
  };

  const getNoText = () => {
    if (noClicks === 0) return "NO 🥀";
    if (noClicks === 1) return "Are you sure? 🥺";
    if (noClicks === 2) return "Really?? 😭";
    return "Think again... 🥹";
  };

  return (
    <Card className="text-center flex flex-col items-center">
      <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 relative mb-6 rounded-full overflow-hidden shadow-xl border-4 border-white mx-auto">
        <Image 
          src="/jupiter.png" 
          alt="Planet Jupiter" 
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      
      <h1 className="text-2xl sm:text-3xl font-serif text-rose-900 mb-6 sm:mb-8 leading-tight px-2">
        🌸 Wanna go eat something with me Jupiter? 🌸
      </h1>

      {noClicks >= 4 ? (
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center space-y-4"
          >
            <p className="text-gray-600 mb-4">Okay... maybe next time 🥲</p>
            <Button variant="ghost" onClick={() => setNoClicks(0)}>Start over</Button>
          </motion.div>
        </AnimatePresence>
      ) : (
        <div ref={containerRef} className="flex gap-4 items-center justify-center relative w-full h-32">
          <Button 
            variant="primary" 
            onClick={onYes}
            isLoading={isSubmitting}
            className="text-xl px-8 z-10"
          >
            YES ♥
          </Button>

          <motion.div
            animate={{ x: noPosition.x, y: noPosition.y }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onHoverStart={handleNoHover}
            onClick={handleNoClick}
            className="absolute z-20 cursor-pointer"
            style={{ touchAction: 'none' }}
          >
            <Button variant="secondary" disabled={isSubmitting}>
              {getNoText()}
            </Button>
          </motion.div>
        </div>
      )}
    </Card>
  );
}
