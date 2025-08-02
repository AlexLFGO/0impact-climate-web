import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number | React.ReactNode;
  unit?: string;
  change?: number;
  icon: LucideIcon;
  delay?: number;
}

export function MetricCard({ 
  title, 
  value, 
  unit, 
  change, 
  icon: Icon, 
  delay = 0 
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="dashboard-card"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="metric-label">{title}</p>
          <div className="flex items-baseline mt-2">
            <motion.span 
              className="metric-value"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: delay + 0.2 }}
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </motion.span>
            {unit && <span className="text-neutral-light text-sm ml-2">{unit}</span>}
          </div>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <span className={`text-sm ${change >= 0 ? 'text-red-400' : 'text-purple-2'}`}>
                {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
              </span>
              <span className="text-neutral-light text-xs ml-2">vs last month</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-lg bg-neutral-dark text-purple-1">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}