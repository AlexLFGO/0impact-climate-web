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
import { PRODUCTION_CONFIG } from './config/production.config';
import type { NetworkMetrics } from './lib/types';

export default function Home() {
  const [metrics, setMetrics] = useState<NetworkMetrics>(getNetworkMetrics());
  const [layerMetrics, setLayerMetrics] = useState(getLayerMetrics());
  const [cumulativeOffset, setCumulativeOffset] = useState(0);
  const [todayOffset, setTodayOffset] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [showEfficiencyTooltip, setShowEfficiencyTooltip] = useState(false);
  const [showTreeTooltip, setShowTreeTooltip] = useState(false);
  const [showProgressTooltip, setShowProgressTooltip] = useState(false);
  const historicalData = getHistoricalData(30);

  useEffect(() => {
    setIsClient(true);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
                  width={120}
                  height={48}
                  className="h-10 sm:h-12 md:h-14 w-auto"
                />
                <span className="text-sm sm:text-base font-normal text-white/40">(Zero Gravity)</span>
              </div>
              <div className="h-5 sm:h-6 w-px bg-[#E5E5E5]/20"></div>
              <div className="text-base sm:text-lg font-normal text-white/60">Climate Dashboard</div>
            </div>
            <a
              href="#impact-engine"
              className="text-base sm:text-lg font-normal text-white/60 hover:text-white transition-colors"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden p-4 sm:p-6 flex flex-col rounded-xl bg-gradient-to-br from-blue-500/5 via-blue-500/[0.02] to-transparent border border-blue-500/30 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_4px_24px_rgba(59,130,246,0.2)] hover:scale-[1.02] cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <h3 className="text-base sm:text-lg font-light text-white flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Leaf className="w-4 sm:w-5 h-4 sm:h-5 text-blue-400" />
                  </div>
                  <span className="hidden sm:inline">Carbon Offset</span>
                  <span className="sm:hidden">Carbon</span>
                </h3>
                <div className="flex items-center gap-1.5 sm:gap-2 bg-blue-500/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-blue-500/20">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-[9px] sm:text-[10px] text-blue-400 font-medium tracking-wide">LIVE</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="mb-3 sm:mb-4 text-center">
                  <div className="flex items-baseline gap-1 justify-center">
                    <h4 className="text-xl sm:text-2xl lg:text-3xl font-extralight text-blue-400">
                      {isClient ? cumulativeOffset.toFixed(3) : '0.000'}
                    </h4>
                    <span className="text-xs sm:text-sm text-blue-400 font-normal">tCO₂</span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-neutral-light/60 uppercase tracking-[0.1em] sm:tracking-[0.15em] font-medium mt-1 sm:mt-2">SINCE GENESIS</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 relative">
                    <div className="text-center">
                      <p className="text-sm sm:text-base font-light text-white">{PRODUCTION_CONFIG.CARBON_CREDITS_PER_HOUR.toFixed(2)}</p>
                      <p className="text-[8px] sm:text-[9px] text-neutral-light/60">tCO₂/hour</p>
                    </div>
                    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-blue-400/30" />
                    <div className="text-center">
                      <p className="text-sm sm:text-base font-light text-blue-400">{(PRODUCTION_CONFIG.CARBON_CREDITS_PER_HOUR * 24).toFixed(2)}</p>
                      <p className="text-[8px] sm:text-[9px] text-neutral-light/60">tCO₂/day</p>
                    </div>
                  </div>

                  <div className="bg-blue-500/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-500/10 min-h-[70px] sm:min-h-[90px] flex flex-col">
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] mb-2">
                      <span className="text-neutral-light font-medium">Daily Progress</span>
                      <div
                        className="relative"
                        onMouseEnter={() => setShowProgressTooltip(true)}
                        onMouseLeave={() => setShowProgressTooltip(false)}
                      >
                        <Info className="w-3 h-3 text-neutral-light/40 hover:text-blue-400 cursor-help transition-colors" />
                        {showProgressTooltip && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-neutral-darker border border-blue-500/20 rounded-lg shadow-xl"
                            style={{ zIndex: 9999 }}
                          >
                            <div className="text-[10px] space-y-1.5">
                              <p className="text-blue-400 font-medium mb-1">
                                How we track this:
                              </p>
                              <p className="text-neutral-light">
                                • Synchronized with <span className="text-white">live offsets</span>
                              </p>
                              <p className="text-neutral-light">
                                • Resets daily at <span className="text-blue-400">midnight UTC</span>
                              </p>
                              <p className="text-neutral-light/60 mt-1 pt-1 border-t border-white/5">
                                See live transactions below
                              </p>
                            </div>
                            <div className="absolute -bottom-1 right-2 w-2 h-2 bg-neutral-darker border-r border-b border-blue-500/20 rotate-45" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                      <div className="flex-1 h-4 bg-neutral-darker rounded-full overflow-hidden shadow-inner">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 rounded-full shadow-sm relative overflow-hidden"
                          initial={{ width: '0%' }}
                          animate={{ width: `${Math.min((todayOffset / 26.06) * 100, 100)}%` }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
                        </motion.div>
                      </div>
                      <span className="text-blue-400 font-semibold text-[11px] sm:text-xs min-w-[40px] sm:min-w-[45px]">{((todayOffset / 26.06) * 100).toFixed(1)}%</span>
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
            className="relative overflow-hidden p-4 sm:p-6 flex flex-col rounded-xl bg-gradient-to-br from-purple-500/5 via-purple-500/[0.02] to-transparent border border-purple-500/30 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_4px_24px_rgba(147,51,234,0.2)] hover:scale-[1.02] cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <h3 className="text-base sm:text-lg font-light text-white flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <Activity className="w-4 sm:w-5 h-4 sm:h-5 text-purple-400" />
                  </div>
                  <span className="hidden sm:inline">Network Efficiency</span>
                  <span className="sm:hidden">Efficiency</span>
                </h3>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="mb-3 sm:mb-4 text-center">
                  <div className="flex items-baseline gap-1 justify-center">
                    <h4 className="text-xl sm:text-2xl lg:text-3xl font-extralight text-purple-400">
                      <LiveCounter value={metrics.totalNodes} decimals={0} increment={3} duration={10000} />
                    </h4>
                    <span className="text-xs sm:text-sm text-purple-400 font-normal">nodes</span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-neutral-light/60 uppercase tracking-[0.1em] sm:tracking-[0.15em] font-medium mt-1 sm:mt-2">ACTIVE WORLDWIDE</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 relative">
                    <div className="text-center">
                      <p className="text-sm sm:text-base font-light text-purple-400">64</p>
                      <p className="text-[8px] sm:text-[9px] text-neutral-light/60">MWh/day</p>
                    </div>
                    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-purple-400/30" />
                    <div className="text-center">
                      <p className="text-sm sm:text-base font-light text-white">23.4</p>
                      <p className="text-[8px] sm:text-[9px] text-neutral-light/60">GWh/year</p>
                    </div>
                  </div>

                  <div className="bg-purple-500/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-500/10 min-h-[70px] sm:min-h-[90px] flex flex-col">
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] mb-2">
                      <span className="text-neutral-light font-medium">Efficiency</span>
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
                            className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-neutral-darker border border-purple-500/20 rounded-lg shadow-xl"
                            style={{ zIndex: 9999 }}
                          >
                            <div className="text-[10px] space-y-1.5">
                              <p className="text-purple-400 font-medium mb-1">
                                How we calculate this:
                              </p>
                              <p className="text-neutral-light">
                                • Daily target: <span className="text-white">26.06 tCO₂</span>
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
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-2">
                      <div className="text-center">
                        <p className="text-[11px] sm:text-[13px] font-light text-purple-400">0.000171 <span className="text-[9px] sm:text-[10px] text-neutral-light/60">tCO₂/node</span></p>
                      </div>
                      <div className="text-center">
                        <p className="text-[11px] sm:text-[13px] font-light text-white">0.36 <span className="text-[9px] sm:text-[10px] text-neutral-light/60">kWh/node</span></p>
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
            className="relative overflow-hidden p-4 sm:p-6 flex flex-col rounded-xl bg-gradient-to-br from-green-500/5 via-green-500/[0.02] to-transparent border border-green-500/30 backdrop-blur-sm transition-all duration-300 hover:border-green-500/50 hover:shadow-[0_4px_24px_rgba(34,197,94,0.2)] hover:scale-[1.02] cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-light text-white flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/20">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  Positive Impact
                </h3>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="mb-3 sm:mb-4 text-center">
                  <div className="flex items-baseline gap-1 justify-center">
                    <h4 className="text-xl sm:text-2xl lg:text-3xl font-extralight text-green-400">
                      432,332
                    </h4>
                    <span className="text-sm text-green-400 font-normal">trees</span>
                  </div>
                  <p className="text-[10px] text-neutral-light/60 uppercase tracking-[0.15em] font-medium mt-2">WORKING YEAR-ROUND</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 relative">
                    <div className="text-center">
                      <p className="text-base font-light text-white">9,511</p>
                      <p className="text-[9px] text-neutral-light/60">tCO₂/year</p>
                    </div>
                    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-green-400/30" />
                    <div className="text-center">
                      <p className="text-lg font-extralight text-green-400">100%</p>
                      <p className="text-[9px] text-neutral-light/60">carbon neutral</p>
                    </div>
                  </div>

                  <div className="bg-green-500/5 rounded-xl p-4 border border-green-500/10 min-h-[90px] flex flex-col">
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
                            className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-neutral-darker border border-blue-500/20 rounded-lg shadow-xl"
                            style={{ zIndex: 9999 }}
                          >
                            <div className="text-[10px] space-y-1.5">
                              <p className="text-green-400 font-medium mb-1">
                                How we calculate this:
                              </p>
                              <p className="text-neutral-light">
                                • Annual offset: <span className="text-white">9,511 tCO₂</span>
                              </p>
                              <p className="text-neutral-light">
                                • Tree absorption: <span className="text-white">0.022 tCO₂/year</span> (EPA)
                              </p>
                              <p className="text-neutral-light">
                                • 9,511 ÷ 0.022 = <span className="text-green-400">432,332 trees</span>
                              </p>
                              <p className="text-neutral-light/60 mt-1 pt-1 border-t border-white/5">
                                Equivalent to 850 acres of forest
                              </p>
                            </div>
                            <div className="absolute -bottom-1 right-2 w-2 h-2 bg-neutral-darker border-r border-b border-blue-500/20 rotate-45" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-neutral-light">
                        <span className="text-emerald-400 font-medium">850 acres</span> of mature forest absorbing CO₂
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>


        {/* ØG Architecture */}
        <div className="px-1 mb-4">
          <h2 className="text-xs sm:text-sm text-neutral-light/70 uppercase tracking-[0.15em] font-medium">Layer Breakdown</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3 mb-8 sm:mb-10 md:mb-12">
            {layerMetrics.map((layer, index) => {
              const icons = {
                'ØG Validator': Server,
                'ØG Storage': HardDrive,
                'ØG DA': Database,
                'ØG Compute': Cpu,
                'ØG Alignment': Users,
              };
              const colors = {
                'ØG Validator': {
                  icon: 'text-cyan-400',
                  glow: 'from-cyan-500/20',
                  bg: 'bg-cyan-500/10',
                  border: 'border-cyan-500/20',
                  cardBg: 'bg-gradient-to-br from-cyan-500/5 via-cyan-500/[0.02] to-transparent',
                  cardBorder: 'border-cyan-500/30',
                  hoverBorder: 'hover:border-cyan-500/50',
                  hoverShadow: 'hover:shadow-[0_4px_24px_rgba(6,182,212,0.2)]'
                },
                'ØG Storage': {
                  icon: 'text-emerald-400',
                  glow: 'from-emerald-500/20',
                  bg: 'bg-emerald-500/10',
                  border: 'border-emerald-500/20',
                  cardBg: 'bg-gradient-to-br from-emerald-500/5 via-emerald-500/[0.02] to-transparent',
                  cardBorder: 'border-emerald-500/30',
                  hoverBorder: 'hover:border-emerald-500/50',
                  hoverShadow: 'hover:shadow-[0_4px_24px_rgba(16,185,129,0.2)]'
                },
                'ØG DA': {
                  icon: 'text-amber-400',
                  glow: 'from-amber-500/20',
                  bg: 'bg-amber-500/10',
                  border: 'border-amber-500/20',
                  cardBg: 'bg-gradient-to-br from-amber-500/5 via-amber-500/[0.02] to-transparent',
                  cardBorder: 'border-amber-500/30',
                  hoverBorder: 'hover:border-amber-500/50',
                  hoverShadow: 'hover:shadow-[0_4px_24px_rgba(245,158,11,0.2)]'
                },
                'ØG Compute': {
                  icon: 'text-orange-400',
                  glow: 'from-orange-500/20',
                  bg: 'bg-orange-500/10',
                  border: 'border-orange-500/20',
                  cardBg: 'bg-gradient-to-br from-orange-500/5 via-orange-500/[0.02] to-transparent',
                  cardBorder: 'border-orange-500/30',
                  hoverBorder: 'hover:border-orange-500/50',
                  hoverShadow: 'hover:shadow-[0_4px_24px_rgba(249,115,22,0.2)]'
                },
                'ØG Alignment': {
                  icon: 'text-pink-400',
                  glow: 'from-pink-500/20',
                  bg: 'bg-pink-500/10',
                  border: 'border-pink-500/20',
                  cardBg: 'bg-gradient-to-br from-pink-500/5 via-pink-500/[0.02] to-transparent',
                  cardBorder: 'border-pink-500/30',
                  hoverBorder: 'hover:border-pink-500/50',
                  hoverShadow: 'hover:shadow-[0_4px_24px_rgba(236,72,153,0.2)]'
                },
              };
              const Icon = icons[layer.layer as keyof typeof icons] || Server;
              const color = colors[layer.layer as keyof typeof colors] || {
                icon: 'text-purple-400',
                glow: 'from-purple-500/20',
                bg: 'bg-purple-500/10',
                border: 'border-purple-500/20',
                cardBg: 'bg-gradient-to-br from-purple-500/5 via-purple-500/[0.02] to-transparent',
                cardBorder: 'border-purple-500/30'
              };

              return (
                <motion.div
                  key={layer.layer}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                  className={`relative overflow-hidden p-3 sm:p-4 rounded-lg ${color.cardBg} border ${layer.comingSoon ? 'border-white/10' : color.cardBorder} backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] cursor-pointer ${layer.comingSoon ? 'hover:border-white/20 hover:shadow-[0_4px_20px_rgba(255,255,255,0.08)]' : `${color.hoverBorder} ${color.hoverShadow}`}`}
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br ${color.glow} to-transparent rounded-full blur-3xl opacity-50`} />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <div className={`p-1.5 rounded-md ${layer.comingSoon ? 'bg-neutral-darker/50 border border-white/5' : `${color.bg} border ${color.border}`}`}>
                          <Icon className={`w-3.5 h-3.5 ${layer.comingSoon ? 'text-neutral-light/30' : color.icon}`} />
                        </div>
                        <h4 className="text-[11px] sm:text-xs font-medium text-white/90">{layer.layer}</h4>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm sm:text-base md:text-lg font-extralight ${layer.comingSoon ? 'text-neutral-light/30' : color.icon}`}>
                          {layer.comingSoon ? '--' : layer.nodes.toLocaleString()}
                        </p>
                        <p className="text-[8px] sm:text-[9px] text-neutral-light/60 uppercase tracking-wider">
                          {layer.comingSoon ? 'Coming Soon' : 'Nodes'}
                        </p>
                      </div>
                    </div>

                    <>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-2 border-t border-white/5 text-[9px] sm:text-[10px]">
                        <div>
                          <span className="text-neutral-light/50">Power</span>
                          <p className={`font-medium ${layer.comingSoon ? "text-neutral-light/30" : "text-white/90"}`}>
                            {layer.comingSoon ? '--' : `${layer.power.toFixed(1)} kW`}
                          </p>
                        </div>
                        <div>
                          <span className="text-neutral-light/50">Daily CO₂</span>
                          <p className={`font-medium ${layer.comingSoon ? "text-neutral-light/30" : "text-orange-300"}`}>
                            {layer.comingSoon ? '--' : `${(layer.emissions / 1000).toFixed(1)} t`}
                          </p>
                        </div>
                        <div>
                          <span className="text-neutral-light/50">Daily</span>
                          <p className={`font-medium ${layer.comingSoon ? "text-neutral-light/30" : color.icon}`}>
                            {layer.comingSoon ? '--' : `${((layer.dailyEnergy || 0) / 1000).toFixed(1)} MWh`}
                          </p>
                        </div>
                        <div>
                          <span className="text-neutral-light/50">Annual CO₂</span>
                          <p className={`font-medium ${layer.comingSoon ? "text-neutral-light/30" : "text-red-300"}`}>
                            {layer.comingSoon ? '--' : `${layer.annualEmissions?.toFixed(0) || 0} t`}
                          </p>
                        </div>
                        <div>
                          <span className="text-neutral-light/50">Annual</span>
                          <p className={`font-medium ${layer.comingSoon ? "text-neutral-light/30" : color.icon}`}>
                            {layer.comingSoon ? '--' :
                              (layer.annualEnergy && layer.annualEnergy >= 1000
                                ? `${(layer.annualEnergy / 1000).toFixed(1)} GWh`
                                : `${layer.annualEnergy?.toFixed(0) || 0} MWh`)
                            }
                          </p>
                        </div>
                        <div>
                          <span className="text-neutral-light/50">Status</span>
                          <p className={`font-medium capitalize ${layer.comingSoon ? "text-neutral-light/30" : layer.status === 'live' ? "text-green-400" : "text-amber-300/70"}`}>
                            {layer.comingSoon ? 'Soon' : layer.status === 'calibrating' ? 'Calibrating' : 'Live'}
                          </p>
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
          className="pt-20 pb-12 mb-8"
        >
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-6 md:mb-8 leading-[1.2]">
              <span className="text-white block">What you stake today</span>
              <span className="gradient-text block mt-2">shapes tomorrow.</span>
            </h2>

            <p className="text-xl sm:text-2xl text-green-400 font-medium max-w-3xl mx-auto mb-8 px-4">
              Earn competitive yields while helping ØG lead carbon-neutral decentralized AI.
            </p>

            <a
              href="https://www.0impact.ai/#climate"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl transition-all duration-300 shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] group text-lg font-semibold text-white"
            >
              <span className="text-base sm:text-lg font-medium">Start Staking with</span>
              <Image
                src="/0Impact_logo.png"
                alt="0Impact"
                width={100}
                height={33}
                className="h-6 sm:h-7 w-auto"
              />
              <span className="text-white/90 group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </motion.section>

        {/* Divider */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
        </div>

        {/* Methodology Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-16"
        >
          <div className="max-w-3xl mx-auto">
            <div className="px-1 mb-4">
              <h2 className="text-[10px] sm:text-xs text-neutral-light uppercase tracking-wider mb-4 text-center">Methodology</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto">
                <motion.div
                  whileHover={{ scale: 1.02, borderColor: 'rgba(107, 114, 128, 0.5)' }}
                  transition={{ duration: 0.3 }}
                  className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-gray-500/5 via-gray-500/[0.02] to-transparent border border-gray-500/30 backdrop-blur-sm hover:shadow-[0_4px_16px_rgba(107,114,128,0.15)] cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-gray-500/10 border border-gray-500/20">
                      <Database className="w-4 h-4 text-gray-400" />
                    </div>
                    <h4 className="text-sm sm:text-base font-light text-white">Compliance & Standards</h4>
                  </div>
                  <p className="text-[11px] sm:text-xs text-neutral-light/60 leading-relaxed mb-3">
                    MiCA regulatory compliance and sustainability assessment per EU standards.
                  </p>
                  <div className="space-y-2">
                    <a href="https://4134984757-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FsEYMfeKUqxaOUwhkw6AT%2Fuploads%2Fgit-blob-6f0538c70e09bf3180519342bfc516355c7a12c0%2F0g-whitepaper.pdf?alt=media" target="_blank" rel="noopener noreferrer" className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2">
                      <FileText className="w-3 h-3" />
                      MiCA Whitepaper
                    </a>
                    <a href="https://archax.com/hubfs/dlt-sustainability-assessment.pdf" target="_blank" rel="noopener noreferrer" className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2">
                      <FileText className="w-3 h-3" />
                      Sustainability Assessment
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, borderColor: 'rgba(107, 114, 128, 0.5)' }}
                  transition={{ duration: 0.3 }}
                  className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-gray-500/5 via-gray-500/[0.02] to-transparent border border-gray-500/30 backdrop-blur-sm hover:shadow-[0_4px_16px_rgba(107,114,128,0.15)] cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-gray-500/10 border border-gray-500/20">
                      <Zap className="w-4 h-4 text-gray-400" />
                    </div>
                    <h4 className="text-sm sm:text-base font-light text-white">Verification & Emissions</h4>
                  </div>
                  <p className="text-[11px] sm:text-xs text-neutral-light/60 leading-relaxed mb-3">
                    ecoBridge tracks emissions and removals via on-chain, registry-certified credits.
                  </p>
                  <div className="space-y-2">
                    <a href="/Emissions_Methodology.pdf" target="_blank" rel="noopener noreferrer" className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2">
                      <FileText className="w-3 h-3" />
                      Emissions Methodology
                    </a>
                    <a href="https://bridge.eco" target="_blank" rel="noopener noreferrer" className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2">
                      <FileText className="w-3 h-3" />
                      ecoBridge
                    </a>
                  </div>
                </motion.div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 sm:mb-6 flex items-center gap-3">
              <a href="https://0g.ai" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <Image
                  src="/0g-white-logo.png"
                  alt="ØG Logo"
                  width={60}
                  height={24}
                  className="h-6 sm:h-8 w-auto"
                />
              </a>
              <span className="text-neutral-light text-lg">×</span>
              <a href="https://bridge.eco" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <Image
                  src="/ecobridge_logo.png"
                  alt="ecoBridge Logo"
                  width={80}
                  height={24}
                  className="h-3 sm:h-5 w-auto"
                />
              </a>
            </div>
            <p className="text-neutral-light text-xs sm:text-sm mb-6 sm:mb-8">
              Building sustainable infrastructure for the future of AI
            </p>
            <div className="text-neutral-light text-[10px] sm:text-xs">
              <p className="text-center">
                © 2025 ØG Labs. All rights reserved
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}