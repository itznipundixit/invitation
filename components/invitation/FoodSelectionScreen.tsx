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
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [customFood, setCustomFood] = useState('');
  const [error, setError] = useState('');

  const toggleFood = (id: string) => {
    setSelectedFoods(prev => 
      prev.includes(id) 
        ? prev.filter(f => f !== id)
        : [...prev, id]
    );
    setError('');
  };

  const handleSubmit = () => {
    if (selectedFoods.length === 0 && !customFood.trim()) {
      setError('Please pick what we are eating or suggest something! 🥺');
      return;
    }
    setError('');
    
    // Combine selected options and custom option
    const finalSelection = [...selectedFoods];
    if (customFood.trim()) {
      finalSelection.push(`custom:${customFood.trim()}`);
    }
    
    onNext(finalSelection.join(','));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-2xl sm:text-3xl font-serif text-rose-900 mb-1">What are we feeling? 🍽️✨</h2>
        <p className="text-sm text-gray-500">pick your vibes (select multiple)</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {FOOD_OPTIONS.map((food) => {
          const isSelected = selectedFoods.includes(food.id);
          return (
            <motion.button
              key={food.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleFood(food.id)}
              className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl transition-all duration-300 border-2 ${
                isSelected 
                  ? 'border-pink-500 bg-pink-50 shadow-md shadow-pink-100 ring-2 ring-pink-500/20' 
                  : 'border-transparent bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <span className="text-3xl sm:text-4xl mb-1 sm:mb-2 block">{food.emoji}</span>
              <span className={`text-sm sm:text-base font-medium text-center leading-tight ${isSelected ? 'text-pink-700' : 'text-gray-700'}`}>
                {food.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={customFood}
            onChange={(e) => {
              setCustomFood(e.target.value);
              setError('');
            }}
            placeholder="Suggest something else? 😋"
            className="w-full px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl border-2 border-pink-100 focus:border-pink-300 focus:ring-4 focus:ring-pink-100 outline-none transition-all placeholder:text-pink-300 text-gray-700"
          />
        </div>
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
