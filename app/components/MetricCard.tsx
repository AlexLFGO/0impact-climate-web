import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Info } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number | React.ReactNode;
  unit?: string;
  change?: number;
  icon: LucideIcon;
  delay?: number;
  tooltip?: string;
}

export function MetricCard({ 
  title, 
  value, 
  unit, 
  change, 
  icon: Icon, 
  delay = 0,
  tooltip
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="dashboard-card relative overflow-visible"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="metric-label">{title}</p>
            {tooltip && (
              <div className="group relative">
                <Info className="w-3 h-3 text-neutral-light cursor-help" />
                <div className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-neutral-darker border border-purple-500/20 rounded-lg shadow-xl">
                  <p className="text-xs text-white leading-relaxed">{tooltip}</p>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-neutral-darker"></div>
                </div>
              </div>
            )}
          </div>
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
        </div>
        <div className="p-3 rounded-lg bg-neutral-dark text-purple-1">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}