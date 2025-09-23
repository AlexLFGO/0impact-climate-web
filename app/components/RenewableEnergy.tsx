'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Sun, Wind, Zap, Flame } from 'lucide-react';

interface RenewableEnergyProps {
  renewablePercentage: number;
}

export function RenewableEnergy({ renewablePercentage }: RenewableEnergyProps) {
  const data = [
    { name: 'Renewable', value: renewablePercentage, color: 'var(--purple-1)' },
    { name: 'Non-renewable', value: 100 - renewablePercentage, color: 'var(--neutral-dark)' }
  ];

  const energySources = [
    { name: 'Solar', percentage: 12, icon: Sun, color: 'text-purple-1' },
    { name: 'Wind', percentage: 28, icon: Wind, color: 'text-purple-2' },
    { name: 'Hydro', percentage: 5, icon: Zap, color: 'text-purple-3' },
    { name: 'Grid Mix', percentage: 55, icon: Flame, color: 'text-purple-4' }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="dashboard-card">
          <p className="text-white font-medium">{payload[0].name}</p>
          <p className={`text-sm ${payload[0].name === 'Renewable' ? 'text-purple-1' : 'text-neutral-light'}`}>
            {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-card">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
        <Sun className="w-6 h-6 text-purple-1" />
        Energy Source Breakdown
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="relative">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <motion.p 
                className="metric-value"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {renewablePercentage}%
              </motion.p>
              <p className="metric-label text-sm">Renewable</p>
            </div>
          </div>
        </div>

        {/* Energy Sources */}
        <div className="space-y-4">
          {energySources.map((source, index) => {
            const Icon = source.icon;
            return (
              <motion.div
                key={source.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-neutral-darker rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-neutral-dark ${source.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-white font-medium">{source.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-white">{source.percentage}%</span>
                  <div className="w-24 bg-neutral-dark rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${source.color} bg-opacity-80`}
                      initial={{ width: 0 }}
                      animate={{ width: `${source.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                      style={{ backgroundColor: source.color === 'text-purple-1' ? 'var(--purple-1)' : 
                               source.color === 'text-purple-2' ? 'var(--purple-2)' :
                               source.color === 'text-purple-3' ? 'var(--purple-3)' : 'var(--purple-4)' }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 p-4 bg-purple-shade border border-purple-1 border-opacity-20 rounded-lg">
        <p className="text-neutral-light text-sm">
          <span className="text-purple-1 font-semibold">45% of nodes</span> operate in regions with 
          renewable energy grids, reducing our carbon footprint by an estimated 180 tons CO₂ annually.
        </p>
      </div>
    </div>
  );
}