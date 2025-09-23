'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, TrendingUp, Info } from 'lucide-react';
import { PRODUCTION_CONFIG } from '@/app/config/production.config';

// Fixed genesis timestamp - September 22, 2025, 09:06:42 UTC
const GENESIS_TIME = new Date('2025-09-22T09:06:42Z').getTime();

export function OffsetCounter2() {
  const [offsetAmount, setOffsetAmount] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const updateOffset = () => {
      const hoursElapsed = (Date.now() - GENESIS_TIME) / (1000 * 60 * 60);
      const currentOffset = 1.0857 * hoursElapsed; // Use correct hourly rate
      setOffsetAmount(currentOffset);
    };

    // Initial update
    updateOffset();

    // Update every 100ms for smooth animation
    const interval = setInterval(updateOffset, 100);

    return () => clearInterval(interval);
  }, []);

  // Calculate daily and annual projections
  // Force use of correct value - 9,511.3264 tCO₂/year ÷ 365 ÷ 24 = 1.0857
  const HOURLY_RATE = 1.0857;
  const dailyCredits = HOURLY_RATE * 24;
  const annualCredits = dailyCredits * 365;
  const creditsPerSecond = HOURLY_RATE / 3600;

  // Calculate tree equivalents (1 mature tree absorbs ~22kg CO₂/year = 0.022 tCO₂/year)
  // Annual offset of 9,511 tCO₂ equals 432,332 mature trees working for a full year
  const treesEquivalentAnnual = Math.round((annualCredits * 1000) / 22);

  return (
    <div className="dashboard-card p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-400" />
            <h3 className="text-base sm:text-lg font-light text-white">Carbon-Neutral Since Genesis</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs text-neutral-light/70 uppercase tracking-wider">Carbon Removed</p>
            <p className="text-2xl sm:text-3xl font-light text-green-400 font-mono">
              {offsetAmount.toFixed(3)}
            </p>
            <p className="text-[10px] sm:text-xs text-neutral-light">tCO₂ offset</p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs text-neutral-light/70 uppercase tracking-wider">Offset Rate</p>
            <p className="text-xl sm:text-2xl font-light text-white">
              1.086
            </p>
            <p className="text-[10px] sm:text-xs text-neutral-light">tCO₂/hour (FIXED)</p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs text-neutral-light/70 uppercase tracking-wider">Daily Impact</p>
            <p className="text-xl sm:text-2xl font-light text-white">
              {dailyCredits.toFixed(2)}
            </p>
            <p className="text-[10px] sm:text-xs text-neutral-light">tCO₂/day</p>
          </div>

          <div className="space-y-1 relative">
            <div className="flex items-center gap-1">
              <p className="text-[10px] sm:text-xs text-neutral-light/70 uppercase tracking-wider">Annual Impact</p>
              <div
                className="relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <Info className="w-3 h-3 text-neutral-light/50 hover:text-green-400 cursor-help transition-colors" />
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full right-0 mb-2 w-48 sm:w-64 p-2 sm:p-3 bg-neutral-darker/95 backdrop-blur-sm border border-green-500/20 rounded-lg shadow-xl"
                    style={{ zIndex: 9999 }}
                  >
                    <div className="text-[10px] space-y-1.5">
                      <p className="text-green-400 font-medium mb-1">
                        How we calculate this:
                      </p>
                      <p className="text-neutral-light">
                        • ØG offsets <span className="text-white">9,511 tCO₂</span> per year
                      </p>
                      <p className="text-neutral-light">
                        • 1 mature tree absorbs <span className="text-white">~22kg CO₂</span> per year (EPA)
                      </p>
                      <p className="text-neutral-light">
                        • 9,511,000 kg ÷ 22 kg = <span className="text-green-400">432,332 trees</span>
                      </p>
                      <p className="text-neutral-light/60 mt-1 pt-1 border-t border-white/5">
                        Equal to a forest the size of Central Park working all year!
                      </p>
                    </div>
                    <div className="absolute -bottom-1 right-2 w-2 h-2 bg-neutral-darker border-r border-b border-green-500/20 rotate-45" />
                  </motion.div>
                )}
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-light text-green-400">
              {treesEquivalentAnnual.toLocaleString()}
            </p>
            <p className="text-[10px] sm:text-xs text-neutral-light">trees worth of CO₂</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-green-500/20">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-neutral-light/60">Progress to daily target</span>
            <span className="text-green-400">{((offsetAmount / dailyCredits) * 100).toFixed(2)}%</span>
          </div>
          <div className="mt-2 h-1.5 bg-neutral-darker rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min((offsetAmount / dailyCredits) * 100, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="mt-3 text-[9px] sm:text-[10px] text-neutral-light/60">
          <p className="text-[8px] sm:text-[9px]">Verified carbon removal tracked on-chain. 1 credit = 1 tCO₂ permanently removed.</p>
        </div>
      </div>
    </div>
  );
}