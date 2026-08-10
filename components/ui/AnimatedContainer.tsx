'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedContainerProps {
  children: React.ReactNode;
  stepKey: number | string;
}

export function AnimatedContainer({ children, stepKey }: AnimatedContainerProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full flex flex-col items-center justify-center min-h-[100dvh]"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
