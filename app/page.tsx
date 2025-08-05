'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Leaf, TrendingDown, Activity, Server, HardDrive, Database, Cpu, Users } from 'lucide-react';
import { MetricCard } from './components/MetricCard';
import { NetworkStatus } from './components/NetworkStatus';
import { CarbonOffsetScanner } from './components/CarbonOffsetScanner';
import { LiveCounter } from './components/LiveCounter';
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
      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Image 
                  src="/0g-white-logo.png" 
                  alt="ØG Logo" 
                  width={80} 
                  height={32}
                  className="h-8 w-auto"
                />
                <span className="text-xs font-normal text-white/40">(Zero Gravity)</span>
              </div>
              <div className="h-4 w-px bg-[#E5E5E5]/20"></div>
              <div className="text-sm font-normal text-white/60">Climate Impact Monitor</div>
            </div>
            <a
              href="#impact-engine"
              className="text-sm font-normal text-white/60 hover:text-white transition-colors"
            >
              Stake Now
            </a>
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
          className="text-center mb-20 pt-12 -mx-4 sm:-mx-6 lg:-mx-8"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-6 md:mb-8 leading-[1.2] px-4">
            <span className="text-white block">Zero Emissions.</span>
            <span className="gradient-text block mt-2">
              Infinite&nbsp;Scale.
            </span>
          </h2>
          <div className="max-w-2xl mx-auto px-4">
            <p className="text-white/90 text-base sm:text-lg md:text-xl leading-relaxed">
              The first AI blockchain <span className="text-purple-400 font-normal">carbon-negative from genesis</span>.
            </p>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="px-1 mb-3 flex items-center justify-between">
          <h2 className="text-xs sm:text-sm text-neutral-light uppercase tracking-wider">Network Overview</h2>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-green-400">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live data • Updates every 30s</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="dashboard-card relative overflow-hidden p-4 md:p-5"
          >
            <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-light text-neutral-light">Network Scale</p>
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
              <div className="space-y-2">
                <div>
                  <h3 className="text-2xl md:text-3xl font-light text-white">
                    <LiveCounter value={metrics.totalNodes} decimals={0} increment={3} duration={10000} />
                  </h3>
                  <p className="text-xs text-neutral-light mt-0.5">active nodes</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-500/20">
                  <div>
                    <p className="text-[10px] text-neutral-light/70">Power Draw</p>
                    <p className="text-sm md:text-base font-light text-purple-400">{(metrics.totalPower/1000).toFixed(2)} MW</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-light/70">Daily Emissions</p>
                    <p className="text-sm md:text-base font-light text-white">{(metrics.totalEmissions / 1000).toFixed(1)} tCO₂</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="dashboard-card relative overflow-hidden p-4 md:p-5"
          >
            <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-light text-neutral-light">Carbon Impact</p>
                <Leaf className="w-4 h-4 text-green-400" />
              </div>
              <div className="space-y-2">
                <div>
                  <h3 className="text-2xl md:text-3xl font-light text-green-400">
                    <LiveCounter value={324.56} decimals={2} increment={0.05} duration={8000} />
                  </h3>
                  <p className="text-xs text-neutral-light mt-0.5">tCO₂ removed</p>
                </div>
                <div className="pt-2 border-t border-green-500/20">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-neutral-light/70">Estimated annual</span>
                    <span className="text-white">~{Math.floor(324.56 * 365).toLocaleString()} tCO₂</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] mt-0.5">
                    <span className="text-neutral-light/70">Network emissions</span>
                    <span className="text-white">~{Math.floor(metrics.totalEmissions * 365 / 1000).toLocaleString()} tCO₂</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="dashboard-card relative overflow-hidden p-4 md:p-5"
          >
            <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-light text-neutral-light">Efficiency Metrics</p>
                <TrendingDown className="w-4 h-4 text-blue-400" />
              </div>
              <div className="space-y-2">
                <div>
                  <h3 className="text-2xl md:text-3xl font-light text-white">
                    <LiveCounter value={0.48} decimals={2} increment={0.01} duration={5000} />
                  </h3>
                  <p className="text-xs text-neutral-light mt-0.5">kWh per AI inference</p>
                </div>
                <div className="pt-2 border-t border-blue-500/20">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-neutral-light/70">vs GPT-4 inference</span>
                    <span className="text-blue-400">~10x lower</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] mt-0.5">
                    <span className="text-neutral-light/70">Decentralized efficiency</span>
                    <span className="text-blue-400">87%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>


        {/* ØG Architecture */}
        <div className="px-1 mb-3">
          <h2 className="text-xs sm:text-sm text-neutral-light uppercase tracking-wider">Layer Breakdown</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-12 md:mb-16">
            {layerMetrics.map((layer, index) => {
              const icons = {
                'ØG Chain': Server,
                'ØG Storage': HardDrive,
                'ØG DA': Database,
                'ØG Compute': Cpu,
                'Alignment Network': Users,
              };
              const colors = {
                'ØG Chain': { icon: 'text-purple-400', glow: 'from-purple-500/10' },
                'ØG Storage': { icon: 'text-blue-400', glow: 'from-blue-500/10' },
                'ØG DA': { icon: 'text-green-400', glow: 'from-green-500/10' },
                'ØG Compute': { icon: 'text-orange-400', glow: 'from-orange-500/10' },
                'Alignment Network': { icon: 'text-pink-400', glow: 'from-pink-500/10' },
              };
              const Icon = icons[layer.layer as keyof typeof icons] || Server;
              const color = colors[layer.layer as keyof typeof colors] || { icon: 'text-purple-400', glow: 'from-purple-500/10' };
              
              return (
                <motion.div
                  key={layer.layer}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                  className="dashboard-card relative overflow-hidden hover:scale-[1.02] transition-all duration-300 p-4 md:p-5"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br ${color.glow} to-transparent rounded-full blur-2xl`} />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <Icon className={`w-5 h-5 ${color.icon}`} />
                    </div>
                    
                    <h4 className="text-xs md:text-sm font-light text-white mb-1 truncate">{layer.layer}</h4>
                    <p className="text-xl md:text-2xl font-light text-white mb-2 md:mb-3">
                      {layer.nodes.toLocaleString()}
                      <span className="text-xs text-neutral-light ml-1 hidden sm:inline">nodes</span>
                    </p>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-light/70">Power</span>
                        <span className="text-white font-light">{layer.power} kW</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-light/70">Daily CO₂</span>
                        <span className="text-white font-light">{layer.emissions} kg</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>

        {/* ØG Impact Scanner - Main Feature */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-16"
        >
          <CarbonOffsetScanner />
        </motion.section>

        {/* ØImpact Engine Section */}
        <motion.section
          id="impact-engine"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="py-20 mb-16"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-6 md:mb-8 leading-[1.2]">
              <span className="text-white block">What you stake today</span>
              <span className="gradient-text block mt-2">shapes tomorrow.</span>
            </h2>
            
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8 md:mb-12 px-4">
              100% commission directed to verified real world impact.
            </p>
            
            <a
              href="#"
              className="inline-flex items-center gap-3 px-6 sm:px-10 py-5 sm:py-5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl transition-all duration-300 shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] group text-lg font-semibold text-white"
            >
              <span className="text-lg font-semibold">Stake to</span>
              <Image
                src="/images/fulllogo_transparent_nobuffer.png"
                alt="ØImpact Engine"
                width={140}
                height={30}
                className="h-6 sm:h-6 w-auto object-contain"
              />
              <span className="text-white/80 group-hover:translate-x-1 transition-transform">→</span>
            </a>
            
            <p className="text-sm text-neutral-light/70 mt-6">
              0% APY • 100% RWI • Full Transparency
            </p>
          </div>
        </motion.section>


      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <Image 
                  src="/0g-white-logo.png" 
                  alt="ØG Logo" 
                  width={60} 
                  height={24}
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-neutral-light text-sm">
                Decentralized AI Operating System<br />
                Building sustainable infrastructure for the future of AI.
              </p>
            </div>
            <div>
              <h4 className="font-normal text-white mb-3">Current Impact</h4>
              <ul className="space-y-2 text-sm text-neutral-light">
                <li>2,191 testnet nodes</li>
                <li>277 kW total power draw</li>
                <li>3.3 tons CO₂/day</li>
                <li>100% offset via ØImpact Engine</li>
              </ul>
            </div>
            <div>
              <h4 className="font-normal text-white mb-3">Architecture</h4>
              <ul className="space-y-2 text-sm text-neutral-light">
                <li>63 validators (200W each)</li>
                <li>928 storage nodes (150W)</li>
                <li>~150 DA nodes (120W)</li>
                <li>~1,050 other nodes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-normal text-white mb-3">Methodology</h4>
              <p className="text-sm text-neutral-light">
                Emissions calculated using hardware power specs and global average carbon intensity (0.5 kg CO₂/kWh). Real-time node counts from testnet validators and StorageScan.
              </p>
            </div>
          </div>
          <div className="border-t border-purple-500/20 pt-8 text-center text-neutral-light text-xs">
            <p>© 2024 ØG Labs. All rights reserved · Carbon estimates based on testnet data and conservative hardware assumptions</p>
          </div>
        </div>
      </footer>
    </div>
  );
}