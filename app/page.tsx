'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Leaf, TrendingDown, Activity, Server, HardDrive, Database, Cpu, Users, Zap, Heart, BarChart3, Scan, CheckCircle, FileText } from 'lucide-react';
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

        {/* How it Works */}
        <div className="px-1 mb-2 flex items-center justify-between">
          <h2 className="text-[10px] sm:text-xs text-neutral-light uppercase tracking-wider">How it Works</h2>
          <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-green-400">
            <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
            <span>Automated</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="dashboard-card relative overflow-hidden p-3 md:p-4"
          >
            <motion.div
              className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
                <h3 className="text-sm md:text-base font-normal text-white">
                  Live Tracking
                </h3>
              </div>
              <p className="text-[10px] md:text-xs text-neutral-light leading-relaxed">
                Emissions calculated through continuous monitoring
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="dashboard-card relative overflow-hidden p-3 md:p-4"
          >
            <motion.div
              className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-4 h-4 text-green-400 animate-pulse" />
                <h3 className="text-sm md:text-base font-normal text-white">
                  Carbon Removal
                </h3>
              </div>
              <p className="text-[10px] md:text-xs text-neutral-light leading-relaxed">
                Verified carbon credits actively remove CO₂
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="dashboard-card relative overflow-hidden p-3 md:p-4"
          >
            <motion.div
              className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, delay: 2 }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-blue-400 animate-pulse" />
                <h3 className="text-sm md:text-base font-normal text-white">
                  On-Chain Proof
                </h3>
              </div>
              <p className="text-[10px] md:text-xs text-neutral-light leading-relaxed">
                Transactions displayed in the Impact Scanner
              </p>
            </div>
          </motion.div>
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
              className="inline-flex items-center gap-3 px-6 sm:px-10 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl transition-all duration-300 shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] group text-lg font-semibold text-white"
              style={{ height: 'auto', padding: '0 40px' }}
            >
              <span className="text-lg font-semibold text-white/70">Stake with</span>
              <img
                src="/0impact_logo.svg"
                alt="0Impact"
                width="120"
                height="40"
                style={{ display: 'block' }}
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
                    MiCA regulatory compliance and sustainability per EU standards.
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
                    <h4 className="text-xs md:text-sm font-normal text-white">Verification Process</h4>
                  </div>
                  <p className="text-[9px] md:text-[10px] text-white/60 leading-relaxed mb-1.5">
                    Carbon offsets verified through{' '}
                    <a href="https://bridge.eco" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">
                      ecoBridge
                    </a>.
                  </p>
                  <p className="text-[9px] md:text-[10px] text-white/80 leading-relaxed">
                    All transactions recorded on-chain, available in Impact Scanner.
                  </p>
                </div>
              </div>

              <div className="mt-3 text-center">
                <p className="text-[9px] text-white/50">
                  Methodology aligned with EU standards. See whitepapers for details.
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