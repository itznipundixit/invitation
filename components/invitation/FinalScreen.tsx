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
  const foodIds = foodId ? foodId.split(',') : [];
  
  const selectedFoods = foodIds.map(id => {
    if (id.startsWith('custom:')) {
      return { id, name: id.replace('custom:', ''), emoji: '🍽️' };
    }
    const found = FOOD_OPTIONS.find(f => f.id === id);
    return found || { id, name: 'Food', emoji: '🍽️' };
  });

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
            <div className="flex flex-col items-center gap-2">
              {selectedFoods.map((f, i) => (
                <div key={i} className="flex items-center justify-center gap-3 text-lg text-gray-700">
                  <span className="text-2xl">{f.emoji}</span>
                  <span className="font-semibold">{f.name}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 flex flex-col items-center gap-4">
              <span className="text-xl font-medium text-pink-600 block">
                I'll see you then 🚗💖
              </span>

              {onReset && (
                <button
                  onClick={onReset}
                  className="mt-2 px-6 py-2 text-sm text-pink-500 bg-pink-50/50 hover:bg-pink-100 border border-pink-200 rounded-full transition-all duration-300 shadow-sm"
                >
                  Start Over 🔄
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
