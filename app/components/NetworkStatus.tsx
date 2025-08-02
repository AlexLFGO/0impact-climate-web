'use client';

import { motion } from 'framer-motion';
import { Activity, Server, HardDrive, Cpu, Users } from 'lucide-react';
import { LayerMetrics } from '../lib/types';

interface NetworkStatusProps {
  layers: LayerMetrics[];
}

const layerIcons = {
  'ØG Chain': Server,
  'ØG Storage': HardDrive,
  'ØG DA': Activity,
  'ØG Compute': Cpu,
  'Alignment Network': Users,
};

const layerColors = {
  'ØG Chain': 'text-purple-1 bg-purple-shade',
  'ØG Storage': 'text-purple-2 bg-purple-shade',
  'ØG DA': 'text-purple-3 bg-purple-shade',
  'ØG Compute': 'text-purple-4 bg-purple-shade',
  'Alignment Network': 'text-purple-1 bg-purple-shade',
};

export function NetworkStatus({ layers }: NetworkStatusProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {layers.map((layer, index) => {
        const Icon = layerIcons[layer.layer as keyof typeof layerIcons] || Server;
        const colorClass = layerColors[layer.layer as keyof typeof layerColors] || 'text-purple-1 bg-purple-shade';
        
        return (
          <motion.div
            key={layer.layer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="dashboard-card"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="metric-label">{layer.layer}</h3>
              <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-light">Nodes</span>
                <motion.span 
                  className="text-sm font-semibold text-white"
                  key={layer.nodes}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {layer.nodes.toLocaleString()}
                </motion.span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-light">Power</span>
                <span className="text-sm font-semibold text-purple-2">
                  {layer.power} kW
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-light">Efficiency</span>
                <span className="text-sm font-semibold text-purple-1">
                  {layer.efficiency.toFixed(1)}%
                </span>
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-neutral-light">Utilization</span>
                  <span className="text-xs text-neutral-light">{layer.utilization.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-neutral-dark rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full bg-purple-1"
                    initial={{ width: 0 }}
                    animate={{ width: `${layer.utilization}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}