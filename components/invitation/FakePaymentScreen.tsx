'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface FakePaymentScreenProps {
  onNext: () => void;
  isSubmitting: boolean;
}

export function FakePaymentScreen({ onNext, isSubmitting }: FakePaymentScreenProps) {
  const [showJoke, setShowJoke] = useState(false);

  const handlePay = () => {
    setShowJoke(true);
    setTimeout(() => {
      onNext();
    }, 2500); // show joke for 2.5 seconds then move on
  };

  return (
    <Card className="text-center w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {!showJoke ? (
          <motion.div
            key="payment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-serif text-rose-900">one small fee</h2>
            
            <p className="text-gray-600 text-sm px-4">
              to confirm your acceptance of this hangout, please complete the following transaction. totally normal. everyone does this.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm mx-4 text-left">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-gray-800">Eat Agreement™</span>
                <span className="text-xl font-bold text-gray-800">₹499</span>
              </div>
              <p className="text-xs text-gray-500 border-t pt-4">
                one-time fee • absolutely worth it
              </p>
            </div>

            <div className="pt-2">
              <Button 
                onClick={handlePay} 
                className="w-full"
                disabled={isSubmitting}
              >
                pay ₹499 & confirm 💝
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="joke"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 space-y-4"
          >
            <div className="text-6xl mb-4">😂</div>
            <h2 className="text-3xl font-bold text-rose-900">JUST KIDDING</h2>
            <p className="text-gray-600">You don't have to pay anything.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
