'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FOOD_OPTIONS } from '@/lib/constants/foods';
import { motion } from 'framer-motion';

interface FoodSelectionScreenProps {
  onNext: (foodId: string) => void;
  isSubmitting: boolean;
}

export function FoodSelectionScreen({ onNext, isSubmitting }: FoodSelectionScreenProps) {
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!selectedFood) {
      setError('Please pick what we are eating! 🥺');
      return;
    }
    setError('');
    onNext(selectedFood);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-rose-900 mb-2">What are we feeling? 🍽️✨</h2>
        <p className="text-gray-500">pick your vibe</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {FOOD_OPTIONS.map((food) => {
          const isSelected = selectedFood === food.id;
          return (
            <motion.button
              key={food.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedFood(food.id);
                setError('');
              }}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 border-2 ${
                isSelected 
                  ? 'border-pink-500 bg-pink-50 shadow-lg shadow-pink-100 ring-4 ring-pink-500/20' 
                  : 'border-transparent bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <span className="text-4xl mb-3 block">{food.emoji}</span>
              <span className={`font-medium ${isSelected ? 'text-pink-700' : 'text-gray-700'}`}>
                {food.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center font-medium animate-pulse mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-center">
        <Button 
          onClick={handleSubmit} 
          isLoading={isSubmitting}
          className="w-full sm:w-auto min-w-[200px]"
        >
          Confirm Vibe ✨
        </Button>
      </div>
    </Card>
  );
}
