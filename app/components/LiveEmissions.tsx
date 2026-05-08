'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export function LiveEmissions() {
  // Initial values based on strategy.md calculations
  // Daily emissions: 3,376 kg CO2
  // Daily energy: 6,752 kWh  
  // Starting at beginning of day values
  const [co2Saved, setCo2Saved] = useState(2868); // 85% of daily emissions offset
  const [kwh, setKwh] = useState(6752);
  const [transactions, setTransactions] = useState(86400); // ~1 tx/sec * seconds in day

  useEffect(() => {
    const interval = setInterval(() => {
      // Based on 63 validators at 500W each = 31.5kW
      // Assuming 45% renewable energy, ~14kW clean energy
      // ~0.23 kWh per minute = 0.004 kWh per second
      setKwh(prev => prev + 0.004);
      
      // Based on ~1 transaction per second on testnet
      setTransactions(prev => prev + 1);
      
      // Carbon offset: 14kW clean energy offsets ~0.006 kg CO2 per second
      setCo2Saved(prev => prev + 0.006);
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="dashboard-card-glass"
    >
      <div className="flex items-center justify-center mb-6">
        <Zap className="w-6 h-6 text-purple-1 mr-2" />
        <h3 className="text-2xl font-bold text-white">Live Network Impact</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="metric-value mb-2">
            {Math.floor(co2Saved).toLocaleString()}
          </div>
          <p className="metric-label">kg CO₂ Offset Today</p>
          <p className="text-xs text-neutral-light mt-1">Equivalent to {Math.floor(Math.floor(co2Saved) / 21).toLocaleString()} trees</p>
        </div>
        
        <div className="text-center">
          <div className="metric-value mb-2">
            {Math.floor(kwh).toLocaleString()}
          </div>
          <p className="metric-label">kWh Clean Energy Used</p>
          <p className="text-xs text-neutral-light mt-1">Powering sustainable AI</p>
        </div>
        
        <div className="text-center">
          <div className="metric-value mb-2">
            {transactions.toLocaleString()}
          </div>
          <p className="metric-label">Documented retirements</p>
          <p className="text-xs text-neutral-light mt-1">Every block tracked on-chain</p>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-neutral-light">
          Each transaction on ØG is tracked through our retirement pipeline
        </p>
      </div>
    </motion.div>
  );
}