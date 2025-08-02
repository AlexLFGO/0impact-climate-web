'use client';

import { useEffect, useRef } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface EmissionsChartProps {
  data: Array<{
    date: string;
    emissions: number;
    energy: number;
    nodes: number;
    efficiency: number;
  }>;
  height?: number;
}

export function EmissionsChart({ data, height = 300 }: EmissionsChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="dashboard-card">
          <p className="text-white font-medium mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-purple-1 text-sm">
              Emissions: {payload[0].value.toFixed(1)} tons CO₂
            </p>
            <p className="text-purple-2 text-sm">
              Energy: {payload[1].value.toFixed(0)} MWh
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      ref={chartRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--purple-1)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--purple-1)" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--purple-2)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--purple-2)" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-dark)" opacity={0.5} />
          <XAxis 
            dataKey="date" 
            stroke="var(--neutral-light)"
            tick={{ fill: 'var(--neutral-light)', fontSize: 12 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
            }}
          />
          <YAxis 
            stroke="var(--neutral-light)"
            tick={{ fill: 'var(--neutral-light)', fontSize: 12 }}
            yAxisId="left"
          />
          <YAxis 
            stroke="var(--neutral-light)"
            tick={{ fill: 'var(--neutral-light)', fontSize: 12 }}
            yAxisId="right"
            orientation="right"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="rect"
            formatter={(value) => <span className="text-white">{value}</span>}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="emissions"
            stroke="var(--purple-1)"
            fillOpacity={1}
            fill="url(#colorEmissions)"
            strokeWidth={2}
            name="CO₂ Emissions (tons)"
            animationDuration={1500}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="energy"
            stroke="var(--purple-2)"
            fillOpacity={1}
            fill="url(#colorEnergy)"
            strokeWidth={2}
            name="Energy (MWh)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}