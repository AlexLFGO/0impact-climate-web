'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Leaf, TrendingDown, Activity, Server, HardDrive, Database, Cpu, Users, Zap } from 'lucide-react';
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
            <span className="text-white block">Ø Emissions.</span>
            <span className="gradient-text block mt-2">
              Infinite&nbsp;Scale.
            </span>
          </h2>
          <div className="max-w-2xl mx-auto px-4">
            <p className="text-white/90 text-base sm:text-lg md:text-xl leading-relaxed">
              The first AI blockchain <span className="text-purple-400 font-normal">carbon-neutral from genesis</span>.
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

        {/* How it Works */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.52 }}
          className="mb-16"
        >
          <div className="px-1 mb-6">
            <h2 className="text-2xl sm:text-3xl font-light text-white mb-2">How it Works</h2>
            <p className="text-white/60 text-sm sm:text-base">Three steps to carbon-neutral infrastructure</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="dashboard-card p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="text-4xl font-light text-purple-400 mb-4">01</div>
                <h3 className="text-lg font-normal text-white mb-2">Monitor Network Impact</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Track real-time energy consumption across 2,000+ ØG nodes using hardware specifications and global carbon intensity data.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="dashboard-card p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="text-4xl font-light text-green-400 mb-4">02</div>
                <h3 className="text-lg font-normal text-white mb-2">Stake to ØImpact Engine</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Validators donate 100% of staking commissions to purchase verified carbon credits directly on-chain.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="dashboard-card p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="text-4xl font-light text-blue-400 mb-4">03</div>
                <h3 className="text-lg font-normal text-white mb-2">Create Real World Impact</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Automated carbon credit purchases create verifiable environmental impact, tracked transparently on-chain through 0impact.ai.
                </p>
              </div>
            </motion.div>
          </div>
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
              Every stake powers verified environmental action.
            </p>
            
            <a
              href="#"
              className="inline-flex items-center gap-3 px-6 sm:px-10 py-5 sm:py-5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl transition-all duration-300 shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] group text-lg font-semibold text-white"
            >
              <span className="text-lg font-semibold text-white/70">Stake to</span>
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


        {/* Methodology Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-16"
        >
          <div className="px-1 mb-6">
            <h2 className="text-2xl sm:text-3xl font-light text-white mb-2">Methodology</h2>
            <p className="text-white/60 text-sm sm:text-base">Transparent calculations for accurate impact measurement</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="dashboard-card p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <Database className="w-5 h-5 text-purple-400" />
                <h4 className="text-base font-normal text-white">Data Sources</h4>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                Real-time metrics from StorageScan API, testnet validators, 
                and estimated node distributions based on network architecture.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="dashboard-card p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <Activity className="w-5 h-5 text-green-400" />
                <h4 className="text-base font-normal text-white">Power Modeling</h4>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                Per-node power: Validators 200W, Storage 150W, DA 120W, 
                Compute 150W, Alignment 100W. Based on typical hardware specs.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.75 }}
              className="dashboard-card p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-5 h-5 text-blue-400" />
                <h4 className="text-base font-normal text-white">Carbon Intensity</h4>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                Global average 0.5 kg CO₂/kWh applied uniformly. 
                Future updates will include regional grid intensities.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-6 text-center"
          >
            <p className="text-xs text-white/60">
              Estimates based on testnet data and conservative assumptions. 
              Methodology reviewed quarterly.
            </p>
          </motion.div>
        </motion.section>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6">
              <Image 
                src="/0g-white-logo.png" 
                alt="ØG Logo" 
                width={60} 
                height={24}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-neutral-light text-sm mb-8">
              Building sustainable infrastructure for the future of AI
            </p>
            <div className="text-neutral-light text-xs">
              <p>© 2024 ØG Labs. All rights reserved</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}