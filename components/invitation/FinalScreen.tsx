'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { Confetti } from '../effects/Confetti';
import { FloatingHearts } from '../effects/FloatingHearts';
import { FOOD_OPTIONS } from '@/lib/constants/foods';

interface FinalScreenProps {
  day: string;
  time: string;
  foodId: string;
  onReset?: () => void;
}

export function FinalScreen({ day, time, foodId, onReset }: FinalScreenProps) {
  const food = FOOD_OPTIONS.find(f => f.id === foodId);

  // Format date nicely
  let formattedDate = day;
  try {
    const d = new Date(day);
    formattedDate = d.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
  } catch (e) {
    // fallback to raw string
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Confetti />
      <FloatingHearts />
      
      <Card className="text-center relative z-10 border-2 border-pink-200">
        <div className="space-y-6 py-4">
          <h1 className="text-4xl font-serif text-rose-900">💕 IT'S A PLAN! 😏</h1>
          <p className="text-xl font-medium text-pink-600">You said YES ❤️</p>
          
          <div className="bg-white/60 rounded-2xl p-6 space-y-4 my-8 shadow-inner">
            <div className="flex items-center justify-center gap-3 text-lg text-gray-700">
              <span className="text-2xl">📅</span>
              <span className="font-semibold">{formattedDate}</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-lg text-gray-700">
              <span className="text-2xl">⏰</span>
              <span className="font-semibold">{time}</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-lg text-gray-700">
              <span className="text-2xl">{food?.emoji || '🍽️'}</span>
              <span className="font-semibold">{food?.name || 'Food'}</span>
            </div>
            <div className="pt-4 flex flex-col items-center">
              <span className="text-xl font-medium text-pink-600 block">
                I'll see you then 🚗💖
              </span>
              {onReset && (
                <button 
                  onClick={onReset}
                  className="mt-6 text-xs text-pink-300 hover:text-pink-500 underline transition-colors"
                >
                  Start Over (Test Mode)
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
