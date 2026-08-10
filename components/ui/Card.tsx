import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export function Card({ children, className = '', ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl border border-white/40 w-[95%] sm:w-[85%] md:w-full max-w-sm sm:max-w-md mx-auto ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
