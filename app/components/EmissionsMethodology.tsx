'use client';

import { motion } from 'framer-motion';
import { Calculator, Database, Activity } from 'lucide-react';

export function EmissionsMethodology() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="dashboard-card"
    >
      <h3 className="text-2xl font-light mb-6 text-white">Emissions Estimation Methodology</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Database className="w-5 h-5 text-purple-1" />
            <h4 className="text-lg font-normal text-white">Data Sources</h4>
          </div>
          <p className="text-sm text-neutral-light">
            Real-time metrics from StorageScan (928 active miners), 
            testnet validator count (63), and estimated node distributions 
            based on network architecture.
          </p>
        </div>
        
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Calculator className="w-5 h-5 text-purple-1" />
            <h4 className="text-lg font-normal text-white">Power Modeling</h4>
          </div>
          <p className="text-sm text-neutral-light">
            Per-node power draw: Validators 200W, Storage 150W (PoRA mining), 
            DA 120W, Compute 150W (30% GPU util), Alignment 100W. 
            Based on hardware specs and utilization patterns.
          </p>
        </div>
        
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Activity className="w-5 h-5 text-purple-1" />
            <h4 className="text-lg font-normal text-white">Carbon Intensity</h4>
          </div>
          <p className="text-sm text-neutral-light">
            Global average 0.5 kg CO₂/kWh applied uniformly. 
            Future iterations will use IP geolocation for 
            region-specific grid intensities.
          </p>
        </div>
      </div>
      
      <div className="bg-neutral-darker rounded-lg p-6">
        <h4 className="text-lg font-normal text-white mb-4">Current Network Footprint</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-neutral-light">Total Nodes</p>
            <p className="text-xl font-light text-purple-1">2,191</p>
          </div>
          <div>
            <p className="text-neutral-light">Total Power</p>
            <p className="text-xl font-light text-purple-1">277 kW</p>
          </div>
          <div>
            <p className="text-neutral-light">Daily Energy</p>
            <p className="text-xl font-light text-purple-1">6,648 kWh</p>
          </div>
          <div>
            <p className="text-neutral-light">Daily Emissions</p>
            <p className="text-xl font-light text-purple-1">3,324 kg CO₂</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-neutral-light">
          Estimates based on testnet data and conservative assumptions. 
          See full methodology in strategy.md
        </p>
      </div>
    </motion.div>
  );
}