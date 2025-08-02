'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Zap, TrendingDown, Activity, Wind } from 'lucide-react';
import { MetricCard } from './components/MetricCard';
import { EmissionsChart } from './components/EmissionsChart';
import { NetworkStatus } from './components/NetworkStatus';
import { RenewableEnergy } from './components/RenewableEnergy';
import { LiveCounter } from './components/LiveCounter';
import { LiveEmissions } from './components/LiveEmissions';
import { EmissionsMethodology } from './components/EmissionsMethodology';
import { 
  generateNetworkMetrics, 
  generateLayerMetrics, 
  generateHistoricalData,
  subscribeToMetrics 
} from './lib/mockData';
import type { NetworkMetrics } from './lib/types';

export default function Home() {
  const [metrics, setMetrics] = useState<NetworkMetrics>(generateNetworkMetrics());
  const [layerMetrics, setLayerMetrics] = useState(generateLayerMetrics());
  const historicalData = generateHistoricalData(30);

  useEffect(() => {
    // Subscribe to real-time metrics updates
    const unsubscribe = subscribeToMetrics((newMetrics) => {
      setMetrics(newMetrics);
      setLayerMetrics(generateLayerMetrics());
    });

    return unsubscribe;
  }, []);


  return (
    <div className="min-h-screen bg-black text-white">
      {/* ØG Background with video and dotted pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30 brightness-100"
        >
          <source 
            src="/videos/seamless-composability.mp4"
            type="video/mp4"
          />
        </video>
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('/images/dotted-gradient-bg.webp')`,
            backgroundRepeat: 'repeat',
            backgroundSize: '600px 600px'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 md:from-black/80 md:via-black/70 md:to-black/80" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="text-7xl font-light tracking-tight mb-2 text-white">ØG</div>
            <h1 className="text-xs font-light text-neutral-light tracking-[0.2em] uppercase opacity-60">Climate Impact Monitor</h1>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 pt-12"
        >
          <h2 className="text-6xl font-light mb-6 leading-tight">
            <span className="text-white">Zero Emissions.</span>
            <br />
            <span className="gradient-text">
              Infinite Scale.
            </span>
          </h2>
          <p className="text-neutral-light text-xl max-w-3xl mx-auto leading-relaxed">
            ØG pioneers sustainable AI infrastructure with
            <span className="text-purple-400 font-normal"> carbon offsets built into every block</span>.
            Our Proof-of-Stake consensus automatically allocates rewards to offset network emissions.
          </p>
          <p className="text-neutral-light text-sm mt-4">
            Every validator stake. Every block produced. Every computation tracked and offset.
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <MetricCard
            title="Daily Carbon Offset"
            value={Math.floor(metrics.totalEmissions * 0.85).toLocaleString()}
            unit="kg CO₂ prevented"
            icon={Leaf}
            delay={0}
          />
          <MetricCard
            title="Clean Energy Used"
            value={metrics.totalEnergy}
            unit="MWh/year"
            change={-12.5}
            icon={Zap}
            delay={0.1}
          />
          <MetricCard
            title="Trees Equivalent"
            value={Math.round(metrics.totalEmissions * 16.5)}
            unit="trees planted"
            icon={Wind}
            delay={0.2}
          />
          <MetricCard
            title="Active Validators"
            value={<LiveCounter value={63} increment={0} decimals={0} />}
            unit="carbon-aware nodes"
            icon={Wind}
            delay={0.3}
          />
        </div>

        {/* Live Network Impact */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12"
        >
          <LiveEmissions />
        </motion.section>

        {/* Network Status */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12"
        >
          <h3 className="text-3xl font-light mb-6 flex items-center gap-3 text-white">
            <Activity className="w-6 h-6 text-purple-400" />
            Carbon-Optimized Network Layers
          </h3>
          <NetworkStatus layers={layerMetrics} />
        </motion.section>

        {/* Emissions Tracking */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-12"
        >
          <h3 className="text-3xl font-light mb-6 flex items-center gap-3 text-white">
            <TrendingDown className="w-6 h-6 text-purple-400" />
            Emissions & Energy Trends
          </h3>
          <div className="dashboard-card">
            <EmissionsChart data={historicalData} height={400} />
          </div>
        </motion.section>



        {/* Renewable Energy Mix */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mb-12"
        >
          <RenewableEnergy renewablePercentage={45} />
        </motion.section>

        {/* Emissions Methodology */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="mb-12"
        >
          <EmissionsMethodology />
        </motion.section>

        {/* Carbon-Aware Consensus */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="mb-12"
        >
          <div className="dashboard-card">
            <h3 className="text-4xl font-light mb-6 text-center text-white">
              How ØG&apos;s Carbon-Aware Consensus Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">1</div>
                <h4 className="text-lg font-normal text-white mb-2">Stake & Validate</h4>
                <p className="text-neutral-light text-sm">
                  Validators stake ØG tokens and participate in Proof-of-Stake consensus
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">2</div>
                <h4 className="text-lg font-normal text-white mb-2">Track Emissions</h4>
                <p className="text-neutral-light text-sm">
                  Every block produced calculates its carbon footprint automatically
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">3</div>
                <h4 className="text-lg font-normal text-white mb-2">Offset On-Chain</h4>
                <p className="text-neutral-light text-sm">
                  Block rewards automatically fund verified carbon offset purchases
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-neutral-light">
                Result: <span className="text-purple-400 font-normal">Every block is carbon neutral</span> by design.
                The more the network grows, the more offsets it generates.
              </p>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-3xl font-light mb-4 text-white">ØG</div>
              <p className="text-neutral-light text-sm">
                Decentralized AI Operating System<br />
                Building sustainable infrastructure for the future of AI.
              </p>
            </div>
            <div>
              <h4 className="font-normal text-white mb-3">Current Performance</h4>
              <ul className="space-y-2 text-sm text-neutral-light">
                <li>Carbon Output: 430 tons CO₂/year</li>
                <li>vs AWS: 85% reduction</li>
                <li>vs Google Cloud: 83% reduction</li>
                <li>vs Azure: 86% reduction</li>
              </ul>
            </div>
            <div>
              <h4 className="font-normal text-white mb-3">ØG Architecture</h4>
              <ul className="space-y-2 text-sm text-neutral-light">
                <li>Modular L1 blockchain</li>
                <li>Decentralized storage layer</li>
                <li>Distributed compute network</li>
                <li>Data availability layer</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-purple-500/20 pt-8 text-center text-neutral-light text-xs">
            <p>© 2024 ØG Labs. All rights reserved. · Projections based on testnet specifications · Estimates use industry-standard methodologies</p>
          </div>
        </div>
      </footer>
    </div>
  );
}