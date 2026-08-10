'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FloatingHearts } from '../effects/FloatingHearts';

interface AcceptanceScreenProps {
  onNext: () => void;
}

export function AcceptanceScreen({ onNext }: AcceptanceScreenProps) {
  return (
    <Card className="text-center w-full max-w-lg mx-auto relative overflow-hidden">
      <FloatingHearts />
      
      <div className="relative z-10 space-y-8 py-8">
        <h2 className="text-2xl sm:text-3xl font-serif text-rose-900 leading-relaxed">
          glad you didn't say no. be ready by 6, I'm coming to get you 🚗
        </h2>
        
        <p className="text-sm text-gray-500 font-mono bg-white/50 p-4 rounded-xl inline-block">
          P.S. normal people text.<br/>
          I made a website just so you can't cancel this now 😏
It's an official agreement, smarty. No backing out.
        </p>

        <div className="pt-4">
          <Button onClick={onNext} className="text-lg w-full sm:w-auto px-12 mx-auto">
            I accept 💝
          </Button>
        </div>
      </div>
    </Card>
  );
}
