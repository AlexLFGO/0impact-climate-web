'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LiveCounterProps {
  value: number;
  increment?: number;
  decimals?: number;
  duration?: number;
}

export function LiveCounter({ value, increment = 0.1, decimals = 1, duration = 2000 }: LiveCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (increment === 0) {
      setDisplayValue(value);
      return;
    }

    const interval = setInterval(() => {
      setDisplayValue(prev => {
        const newValue = prev + increment;
        return parseFloat(newValue.toFixed(decimals));
      });
    }, duration);

    return () => clearInterval(interval);
  }, [value, increment, decimals, duration]);

  return (
    <motion.span
      key={displayValue}
      initial={{ opacity: 0.8, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {displayValue.toLocaleString(undefined, { 
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals 
      })}
    </motion.span>
  );
}