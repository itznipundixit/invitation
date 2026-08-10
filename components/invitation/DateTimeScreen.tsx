'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TIME_OPTIONS } from '@/lib/constants/times';
import { motion } from 'framer-motion';

interface DateTimeScreenProps {
  onNext: (day: string, time: string) => void;
  isSubmitting: boolean;
}

export function DateTimeScreen({ onNext, isSubmitting }: DateTimeScreenProps) {
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = () => {
    if (!day) {
      setError('Please pick a day! 📅');
      return;
    }
    
    // Removed past date validation per request

    if (!time) {
      setError('Please pick a time! ⏰');
      return;
    }

    setError('');
    onNext(day, time);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">📅 🐾</div>
        <h2 className="text-2xl font-serif text-rose-900 font-medium">So... when are you free, Jupiter?</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pick a Day 📅</label>
          <input 
            type="date" 
            min={today}
            value={day}
            onChange={(e) => {
              setDay(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-300 focus:ring-2 focus:ring-pink-200 outline-none transition-all bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">What Time? ⏰</label>
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
            {TIME_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTime(t);
                  setIsCustomTime(false);
                  setError('');
                }}
                className={`px-2 py-2 text-sm rounded-lg border-2 transition-all ${
                  time === t && !isCustomTime
                    ? 'border-pink-500 bg-pink-50 text-pink-700 font-semibold' 
                    : 'border-gray-100 hover:border-pink-200 bg-white text-gray-600'
                }`}
              >
                {t}
              </button>
            ))}
            <button
              onClick={() => {
                setIsCustomTime(true);
                setTime('');
                setError('');
              }}
              className={`px-2 py-2 text-sm rounded-lg border-2 transition-all ${
                isCustomTime 
                  ? 'border-pink-500 bg-pink-50 text-pink-700 font-semibold' 
                  : 'border-gray-100 hover:border-pink-200 bg-white text-gray-600'
              }`}
            >
              Custom
            </button>
          </div>
          
          {isCustomTime && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              className="mt-4"
            >
              <input 
                type="time" 
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-300 focus:ring-2 focus:ring-pink-200 outline-none transition-all bg-white"
              />
            </motion.div>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        <Button 
          onClick={handleSubmit} 
          isLoading={isSubmitting}
          className="w-full mt-4"
        >
          set the day ♥
        </Button>
      </div>
    </Card>
  );
}
