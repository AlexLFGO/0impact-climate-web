'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Leaf, TrendingUp, Activity, Server, HardDrive, Database, Cpu, Users, Zap, Heart, FileText, Info } from 'lucide-react';
import { MetricCard } from './components/MetricCard';
import { NetworkStatus } from './components/NetworkStatus';
import { CarbonOffsetScanner } from './components/CarbonOffsetScanner';
import { LiveCounter } from './components/LiveCounter';
import {
  getNetworkMetrics,
  getLayerMetrics,
  getHistoricalData,
  subscribeToMetrics,
  getCumulativeOffset,
  getTodayOffset
} from './lib/productionData';
import type { NetworkMetrics } from './lib/types';

export default function Home() {
  const [metrics, setMetrics] = useState<NetworkMetrics>(getNetworkMetrics());
  const [layerMetrics, setLayerMetrics] = useState(getLayerMetrics());
  const [cumulativeOffset, setCumulativeOffset] = useState(getCumulativeOffset());
  const [todayOffset, setTodayOffset] = useState(getTodayOffset());
  const [showEfficiencyTooltip, setShowEfficiencyTooltip] = useState(false);
  const [showTreeTooltip, setShowTreeTooltip] = useState(false);
  const [showProgressTooltip, setShowProgressTooltip] = useState(false);
  const historicalData = getHistoricalData(30);

  useEffect(() => {
    // Subscribe to real-time metrics updates
    const unsubscribe = subscribeToMetrics((newMetrics) => {
      setMetrics(newMetrics);
      setCumulativeOffset(getCumulativeOffset());
      setTodayOffset(getTodayOffset());
      // Layer metrics are static, don't regenerate them
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
        <div className="px-1 mb-4">
          <h2 className="text-xs sm:text-sm text-neutral-light/70 uppercase tracking-[0.15em] font-medium">Network Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="dashboard-card relative overflow-hidden p-6 flex flex-col"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-light text-white flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/20">
                    <Leaf className="w-5 h-5 text-green-400" />
                  </div>
                  Carbon Offset
                </h3>
                <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[10px] text-green-400 font-medium tracking-wide">LIVE</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="mb-5 text-center">
                  <div className="flex items-baseline gap-2 justify-center">
                    <h4 className="text-3xl md:text-4xl font-extralight text-green-400">
                      {cumulativeOffset.toFixed(3)}
                    </h4>
                    <span className="text-sm text-green-400/70 font-light">tCO₂</span>
                  </div>
                  <p className="text-[10px] text-neutral-light/60 uppercase tracking-[0.15em] font-medium mt-2">SINCE GENESIS</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 relative">
                    <div className="text-center">
                      <p className="text-base font-light text-white">1.28</p>
                      <p className="text-[9px] text-neutral-light/60">tCO₂/hour</p>
                    </div>
                    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-green-400/30" />
                    <div className="text-center">
                      <p className="text-base font-light text-green-400">30.66</p>
                      <p className="text-[9px] text-neutral-light/60">tCO₂/day</p>
                    </div>
                  </div>

                  <div className="bg-green-500/5 rounded-lg p-3 border border-green-500/10 min-h-[80px] flex flex-col">
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="text-neutral-light font-medium">Daily Target Progress</span>
                      <div
                        className="relative"
                        onMouseEnter={() => setShowProgressTooltip(true)}
                        onMouseLeave={() => setShowProgressTooltip(false)}
                      >
                        <Info className="w-3 h-3 text-neutral-light/40 hover:text-green-400 cursor-help transition-colors" />
                        {showProgressTooltip && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-neutral-darker/98 backdrop-blur-sm border border-green-500/20 rounded-lg shadow-xl"
                            style={{ zIndex: 9999 }}
                          >
                            <div className="text-[10px] space-y-1.5">
                              <p className="text-green-400 font-medium mb-1">
                                How we track this:
                              </p>
                              <p className="text-neutral-light">
                                • Synchronized with <span className="text-white">live offsets</span>
                              </p>
                              <p className="text-neutral-light">
                                • Resets daily at <span className="text-green-400">midnight UTC</span>
                              </p>
                              <p className="text-neutral-light/60 mt-1 pt-1 border-t border-white/5">
                                See live transactions below
                              </p>
                            </div>
                            <div className="absolute -bottom-1 right-2 w-2 h-2 bg-neutral-darker border-r border-b border-green-500/20 rotate-45" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                      <div className="flex-1 h-4 bg-neutral-darker rounded-full overflow-hidden shadow-inner">
                        <motion.div
                          className="h-full bg-gradient-to-r from-green-500 via-green-400 to-green-300 rounded-full shadow-sm relative overflow-hidden"
                          initial={{ width: '0%' }}
                          animate={{ width: `${Math.min((todayOffset / 30.66) * 100, 100)}%` }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
                        </motion.div>
                      </div>
                      <span className="text-green-400 font-semibold text-xs min-w-[45px]">{((todayOffset / 30.66) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="dashboard-card relative overflow-hidden p-6 flex flex-col"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-light text-white flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <Activity className="w-5 h-5 text-purple-400" />
                  </div>
                  Network Scale
                </h3>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="mb-5 text-center">
                  <div className="flex items-baseline gap-2 justify-center">
                    <h4 className="text-3xl md:text-4xl font-extralight text-purple-400">
                      <LiveCounter value={metrics.totalNodes} decimals={0} increment={3} duration={10000} />
                    </h4>
                    <span className="text-sm text-purple-400/70 font-light">nodes</span>
                  </div>
                  <p className="text-[10px] text-neutral-light/60 uppercase tracking-[0.15em] font-medium mt-2">ACTIVE WORLDWIDE</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 relative">
                    <div className="text-center">
                      <p className="text-base font-light text-purple-400">64</p>
                      <p className="text-[9px] text-neutral-light/60">MWh/day</p>
                    </div>
                    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-purple-400/30" />
                    <div className="text-center">
                      <p className="text-base font-light text-white">23.4</p>
                      <p className="text-[9px] text-neutral-light/60">GWh/year</p>
                    </div>
                  </div>

                  <div className="bg-purple-500/5 rounded-lg p-3 border border-purple-500/10 min-h-[80px] flex flex-col">
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="text-neutral-light font-medium">Network Efficiency</span>
                      <div
                        className="relative"
                        onMouseEnter={() => setShowEfficiencyTooltip(true)}
                        onMouseLeave={() => setShowEfficiencyTooltip(false)}
                      >
                        <Info className="w-3 h-3 text-neutral-light/40 hover:text-purple-400 cursor-help transition-colors" />
                        {showEfficiencyTooltip && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-neutral-darker/98 backdrop-blur-sm border border-purple-500/20 rounded-lg shadow-xl"
                            style={{ zIndex: 9999 }}
                          >
                            <div className="text-[10px] space-y-1.5">
                              <p className="text-purple-400 font-medium mb-1">
                                How we calculate this:
                              </p>
                              <p className="text-neutral-light">
                                • Daily emissions: <span className="text-white">30.66 tCO₂</span>
                              </p>
                              <p className="text-neutral-light">
                                • Total nodes: <span className="text-white">179,471</span>
                              </p>
                              <p className="text-neutral-light">
                                • Per node: <span className="text-purple-400">0.000171 tCO₂</span>
                              </p>
                              <p className="text-neutral-light/60 mt-1 pt-1 border-t border-white/5">
                                Each node uses only 0.36 kWh daily
                              </p>
                            </div>
                            <div className="absolute -bottom-1 right-2 w-2 h-2 bg-neutral-darker border-r border-b border-purple-500/20 rotate-45" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div className="text-center">
                        <p className="text-[13px] font-light text-purple-400">0.000171 <span className="text-[10px] text-neutral-light/60">tCO₂/node</span></p>
                      </div>
                      <div className="text-center">
                        <p className="text-[13px] font-light text-white">0.36 <span className="text-[10px] text-neutral-light/60">kWh/node</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="dashboard-card relative overflow-hidden p-6 flex flex-col"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-light text-white flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  Positive Impact
                </h3>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="mb-5 text-center">
                  <div className="flex items-baseline gap-2 justify-center">
                    <h4 className="text-3xl md:text-4xl font-extralight text-emerald-400">
                      508,636
                    </h4>
                    <span className="text-sm text-emerald-400/70 font-light">trees</span>
                  </div>
                  <p className="text-[10px] text-neutral-light/60 uppercase tracking-[0.15em] font-medium mt-2">WORKING YEAR-ROUND</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 relative">
                    <div className="text-center">
                      <p className="text-base font-light text-white">11,190</p>
                      <p className="text-[9px] text-neutral-light/60">tCO₂/year</p>
                    </div>
                    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-green-400/30" />
                    <div className="text-center">
                      <p className="text-base font-light text-green-400">100%</p>
                      <p className="text-[9px] text-neutral-light/60">carbon neutral</p>
                    </div>
                  </div>

                  <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/10 min-h-[90px] flex flex-col">
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="text-neutral-light font-medium">Environmental Comparison</span>
                      <div
                        className="relative"
                        onMouseEnter={() => setShowTreeTooltip(true)}
                        onMouseLeave={() => setShowTreeTooltip(false)}
                      >
                        <Info className="w-3 h-3 text-neutral-light/40 hover:text-green-400 cursor-help transition-colors" />
                        {showTreeTooltip && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-neutral-darker/98 backdrop-blur-sm border border-green-500/20 rounded-lg shadow-xl"
                            style={{ zIndex: 9999 }}
                          >
                            <div className="text-[10px] space-y-1.5">
                              <p className="text-green-400 font-medium mb-1">
                                How we calculate this:
                              </p>
                              <p className="text-neutral-light">
                                • Annual offset: <span className="text-white">11,190 tCO₂</span>
                              </p>
                              <p className="text-neutral-light">
                                • Tree absorption: <span className="text-white">0.022 tCO₂/year</span> (EPA)
                              </p>
                              <p className="text-neutral-light">
                                • 11,190 ÷ 0.022 = <span className="text-green-400">508,636 trees</span>
                              </p>
                              <p className="text-neutral-light/60 mt-1 pt-1 border-t border-white/5">
                                Equivalent to 1,000 acres of forest
                              </p>
                            </div>
                            <div className="absolute -bottom-1 right-2 w-2 h-2 bg-neutral-darker border-r border-b border-green-500/20 rotate-45" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-neutral-light">
                        <span className="text-green-400 font-medium">1,000 acres</span> of mature forest absorbing CO₂
                      </p>
                    </div>
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
                'ØG Validator': Server,
                'ØG Storage': HardDrive,
                'ØG DA': Database,
                'ØG Compute': Cpu,
                'ØG Alignment': Users,
              };
              const colors = {
                'ØG Validator': { icon: 'text-purple-400', glow: 'from-purple-500/10' },
                'ØG Storage': { icon: 'text-blue-400', glow: 'from-blue-500/10' },
                'ØG DA': { icon: 'text-green-400', glow: 'from-green-500/10' },
                'ØG Compute': { icon: 'text-orange-400', glow: 'from-orange-500/10' },
                'ØG Alignment': { icon: 'text-pink-400', glow: 'from-pink-500/10' },
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
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className={`w-4 h-4 ${layer.comingSoon ? 'text-neutral-light/50' : color.icon}`} />
                      <h4 className="text-sm font-light text-white flex-1">{layer.layer}</h4>
                    </div>

                    <>
                      <div className="mb-3">
                        <p className="text-2xl md:text-3xl font-light text-white">
                          {layer.comingSoon ? '--' : layer.nodes.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-neutral-light uppercase tracking-wide">
                          {layer.comingSoon ? 'Coming Soon' : layer.status === 'calibrating' ? 'Estimated Nodes' : 'Active Nodes'}
                        </p>
                      </div>
                      <div className="space-y-1.5 pt-2 border-t border-white/5">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-neutral-light/60">Power</span>
                          <span className={layer.comingSoon ? "text-neutral-light/30" : "text-white"}>
                            {layer.comingSoon ? '--' : `${layer.power.toFixed(1)} kW`}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-neutral-light/60">Daily</span>
                          <span className={layer.comingSoon ? "text-neutral-light/30" : "text-blue-400"}>
                            {layer.comingSoon ? '--' : `${((layer.dailyEnergy || 0) / 1000).toFixed(1)} MWh`}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-neutral-light/60">Annual</span>
                          <span className={layer.comingSoon ? "text-neutral-light/30" : "text-purple-400"}>
                            {layer.comingSoon ? '--' :
                              (layer.annualEnergy && layer.annualEnergy >= 1000
                                ? `${(layer.annualEnergy / 1000).toFixed(1)} GWh`
                                : `${layer.annualEnergy?.toFixed(0) || 0} MWh`)
                            }
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] pt-1.5 border-t border-white/5">
                          <span className="text-neutral-light/60">CO₂/day</span>
                          <span className={layer.comingSoon ? "text-neutral-light/30" : "text-orange-400"}>
                            {layer.comingSoon ? '--' : `${(layer.emissions / 1000).toFixed(2)} t`}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-neutral-light/60">CO₂/year</span>
                          <span className={layer.comingSoon ? "text-neutral-light/30" : "text-red-400"}>
                            {layer.comingSoon ? '--' : `${layer.annualEmissions?.toFixed(0) || 0} t`}
                          </span>
                        </div>
                      </div>
                    </>
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
              Competitive APY + Verified Climate Action
            </p>

            <a
              href="https://wallet.0g.ai/0gchain/staking/0gvaloper1679yqpnt00wxje5ysf3tqmfcfzl5krwc63wpr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl transition-all duration-300 shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] group text-lg font-semibold text-white"
            >
              <span className="text-lg font-semibold text-white/70">Stake with</span>
              <Image
                src="/0impact_logo.png"
                alt="0Impact"
                width={100}
                height={33}
                className="h-6 sm:h-7 w-auto"
              />
              <span className="text-white/80 group-hover:translate-x-1 transition-transform">→</span>
            </a>

          </div>
        </motion.section>


        {/* Methodology Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-16"
        >
          <div className="max-w-3xl mx-auto">
            <div className="px-1 mb-4">
              <h2 className="text-[10px] sm:text-xs text-neutral-light uppercase tracking-wider mb-3 text-center">Methodology</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-xl mx-auto">
                <div className="dashboard-card p-2 md:p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Database className="w-3 h-3 text-purple-400" />
                    <h4 className="text-xs md:text-sm font-normal text-white">Compliance & Standards</h4>
                  </div>
                  <p className="text-[9px] md:text-[10px] text-white/60 leading-relaxed mb-1.5">
                    MiCA regulatory compliance and sustainability assessment per EU standards.
                  </p>
                  <div className="space-y-1">
                    <a href="https://4134984757-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FsEYMfeKUqxaOUwhkw6AT%2Fuploads%2Fgit-blob-6f0538c70e09bf3180519342bfc516355c7a12c0%2F0g-whitepaper.pdf?alt=media" target="_blank" rel="noopener noreferrer" className="text-[10px] text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                      <FileText className="w-2.5 h-2.5" />
                      MiCA Whitepaper
                    </a>
                    <a href="https://archax.com/hubfs/dlt-sustainability-assessment.pdf" target="_blank" rel="noopener noreferrer" className="text-[10px] text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                      <FileText className="w-2.5 h-2.5" />
                      Sustainability Assessment
                    </a>
                  </div>
                </div>

                <div className="dashboard-card p-2 md:p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Zap className="w-3 h-3 text-blue-400" />
                    <h4 className="text-xs md:text-sm font-normal text-white">Verification & Emissions</h4>
                  </div>
                  <p className="text-[9px] md:text-[10px] text-white/60 leading-relaxed mb-1.5">
                    ecoBridge tracks emissions and removals via on-chain, registry-certified credits.
                  </p>
                  <div className="space-y-1">
                    <a href="/Emissions_Methodology.pdf" target="_blank" rel="noopener noreferrer" className="text-[10px] text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                      <FileText className="w-2.5 h-2.5" />
                      Emissions Methodology
                    </a>
                    <a href="https://bridge.eco" target="_blank" rel="noopener noreferrer" className="text-[10px] text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                      <FileText className="w-2.5 h-2.5" />
                      ecoBridge
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-center">
                <p className="text-[9px] text-white/50">
                  Methodology aligned with EU standards. All transactions viewable on-chain in Impact Scanner.
                </p>
              </div>
            </div>
          </div>
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
              <p className="flex items-center justify-center gap-1.5">
                © 2025 ØG Labs. All rights reserved • Built with <Heart className="w-3 h-3 text-purple-400 fill-purple-400 inline" /> by{' '}
                <a href="https://bridge.eco" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">
                  ecoBridge
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}