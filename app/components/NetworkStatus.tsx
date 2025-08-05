'use client';

import { motion } from 'framer-motion';
import { Activity, Server, HardDrive, Cpu, Users, Info } from 'lucide-react';
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
            className="dashboard-card relative overflow-visible"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="metric-label">{layer.layer}</h3>
              <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-neutral-light">Nodes</span>
                  <div className="group relative">
                    <Info className="w-3 h-3 text-neutral-light/50 cursor-help" />
                    <div className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 bottom-full left-0 mb-2 w-48 p-2 bg-neutral-darker border border-purple-500/20 rounded-lg shadow-xl">
                      <p className="text-xs text-white leading-relaxed">
                        {layer.layer === 'ØG Chain' && 'Validators securing the network through consensus'}
                        {layer.layer === 'ØG Storage' && 'Nodes providing decentralized data storage with PoRA'}
                        {layer.layer === 'ØG DA' && 'Nodes ensuring data availability for the network'}
                        {layer.layer === 'ØG Compute' && 'GPU nodes providing AI inference capabilities'}
                        {layer.layer === 'Alignment Network' && 'Community nodes participating in alignment'}
                      </p>
                    </div>
                  </div>
                </div>
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
                <div className="flex items-center gap-1">
                  <span className="text-xs text-neutral-light">Power</span>
                  <div className="group relative">
                    <Info className="w-3 h-3 text-neutral-light/50 cursor-help" />
                    <div className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 bottom-full left-0 mb-2 w-48 p-2 bg-neutral-darker border border-purple-500/20 rounded-lg shadow-xl">
                      <p className="text-xs text-white leading-relaxed">
                        {layer.layer === 'ØG Chain' && 'Based on 200W per validator node (8-core server)'}
                        {layer.layer === 'ØG Storage' && 'Based on 150W per storage node with PoRA mining'}
                        {layer.layer === 'ØG DA' && 'Based on 120W per DA node (moderate utilization)'}
                        {layer.layer === 'ØG Compute' && 'Based on 150W average per GPU node'}
                        {layer.layer === 'Alignment Network' && 'Based on community device mix'}
                      </p>
                    </div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-purple-2">
                  {layer.power} kW
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-neutral-light">Emissions</span>
                  <div className="group relative">
                    <Info className="w-3 h-3 text-neutral-light/50 cursor-help" />
                    <div className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 bottom-full left-0 mb-2 w-56 p-2 bg-neutral-darker border border-purple-500/20 rounded-lg shadow-xl">
                      <p className="text-xs text-white leading-relaxed">
                        Daily CO₂ emissions based on node power consumption and global average carbon intensity (0.5 kg CO₂/kWh). All emissions will be offset through ØImpact Engine.
                      </p>
                    </div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-purple-1">
                  {layer.emissions} kg/day
                </span>
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-light">Network Status</span>
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    Testnet Active
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}