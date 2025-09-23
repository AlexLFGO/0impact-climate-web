'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Leaf,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Loader2,
  RefreshCw,
  Trees,
  ArrowLeft,
  ArrowRight,
  Zap,
  Bot,
  Sparkles,
  ScanLine,
  Activity
} from 'lucide-react';
import {
  Transaction,
  DailySummary,
  impactApi,
  IMPACT_CONSTANTS,
  getTimeSinceLastOffset,
  getExplorerUrl
} from '../lib/impactApi';
import { CertificateModal } from './CertificateModal';

export function ImpactScanner() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<{ id?: string; hash?: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const ITEMS_PER_PAGE = 5;

  // Fetch transactions for a specific page
  const fetchTransactions = async (page: number = 0) => {
    try {
      setError(null);
      setLoading(true);

      console.log('Fetching page:', page);
      const offset = page * ITEMS_PER_PAGE;
      const txData = await impactApi.getTransactions(ITEMS_PER_PAGE, offset);

      console.log('Fetched transactions:', txData.length, 'for page:', page);
      setTransactions(txData);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to fetch impact data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch - not memoized to avoid closure issues
  const fetchInitialData = async () => {
    try {
      setError(null);
      setLoading(true);

      const [txData, summaryData, certsData] = await Promise.all([
        impactApi.getTransactions(ITEMS_PER_PAGE, 0),
        impactApi.getDailySummary(),
        impactApi.getCertificates(1, 0) // Get total count
      ]);

      setTransactions(txData);
      setDailySummary(summaryData);
      setTotalCount(certsData.total);
      setTotalPages(Math.ceil(certsData.total / ITEMS_PER_PAGE));
      setCurrentPage(0);
    } catch (err) {
      setError('Failed to fetch impact data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update countdown timer
  const updateCountdown = () => {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const nextOffsetMinute = Math.ceil(minutes / 5) * 5;
    const minutesUntil = nextOffsetMinute - minutes;
    const secondsUntil = minutesUntil * 60 - seconds;

    if (secondsUntil <= 0) {
      setTimeUntilNext('Offsetting now...');
    } else if (secondsUntil < 60) {
      setTimeUntilNext(`${secondsUntil}s`);
    } else {
      const mins = Math.floor(secondsUntil / 60);
      const secs = secondsUntil % 60;
      setTimeUntilNext(`${mins}m ${secs}s`);
    }
  };

  // Initialize data on mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Set up intervals
  useEffect(() => {
    // Update countdown every second
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();

    // Update data every 30 seconds
    const dataInterval = setInterval(() => {
      if (currentPage === 0) {
        fetchInitialData();
      } else {
        fetchTransactions(currentPage);
      }
    }, 30000);

    return () => {
      clearInterval(countdownInterval);
      clearInterval(dataInterval);
    };
  }, [currentPage]);

  const openCertificateModal = (certId?: string, txHash?: string) => {
    setSelectedCertificate({ id: certId, hash: txHash });
    setIsModalOpen(true);
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-4" />
        <p className="text-white/60">Initializing Impact Scanner...</p>
      </div>
    );
  }

  if (error && transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchInitialData}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Recent Transactions - Full Width */}
        <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-xl bg-gradient-to-br from-neutral-darker via-neutral-darker to-neutral-dark border border-white/10"
            >
              {/* Scanner Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                    <Activity className="w-4 h-4 text-green-400" />
                  </div>
                  <h2 className="text-sm sm:text-base text-white/90 font-light tracking-[0.1em]">
                    ØIMPACT SCANNER
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-purple-400/80 font-light">0g-Mainnet-Aristotle</span>
                </div>
              </div>
              {/* Transparency Layer Banner */}
              <div className="p-3 rounded-lg bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-cyan-500/5 border border-green-500/10 mb-4">
                <h3 className="text-sm font-light text-white mb-1">
                  Real-time transparency layer for decentralized AI carbon accounting
                </h3>
                <p className="text-xs text-white/50">
                  Powered by ecoBridge • Verified on-chain • Continuous offsetting
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h3 className="text-base sm:text-lg font-light text-white flex items-center gap-2">
                  <Trees className="w-4 sm:w-5 h-4 sm:h-5 text-green-400" />
                  Recent Offsets
                </h3>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-green-500/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-green-500/20">
                    <Clock className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-green-400" />
                    <span className="text-[10px] sm:text-xs text-green-400 font-medium">Next: {timeUntilNext}</span>
                  </div>
                  <button
                    onClick={() => fetchTransactions(currentPage)}
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-white/5 transition-colors group"
                    disabled={loading}
                  >
                    <RefreshCw className={`w-3.5 sm:w-4 h-3.5 sm:h-4 text-white/40 group-hover:text-white/60 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {transactions.map((tx, index) => {
                    // Clear contrast between green and purple
                    const isEven = index % 2 === 0;
                    const bgColor = isEven ? 'bg-green-500/10' : 'bg-purple-500/10';
                    const borderColor = isEven ? 'border-green-500/20' : 'border-purple-500/20';
                    const textColor = isEven ? 'text-green-400' : 'text-purple-400';

                    return (
                      <motion.div
                        key={tx.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="group p-2 sm:p-3 rounded-lg bg-gradient-to-br from-white/[0.02] to-transparent border border-white/5 hover:border-green-500/30 transition-all duration-300 cursor-pointer"
                        onClick={() => openCertificateModal(tx.certificate_id, tx.tx_hash)}
                      >
                        <div className="flex items-center justify-between">
                          {/* Left: Icon, Amount, Project */}
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className={`p-1.5 rounded-lg ${bgColor} border ${borderColor} shrink-0`}>
                              <Leaf className={`w-3 sm:w-3.5 h-3 sm:h-3.5 ${textColor}`} />
                            </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                              <p className="text-sm font-medium text-white">{tx.co2e_tons} tCO₂</p>
                              <p className="text-[10px] sm:text-xs text-white/60 truncate">{tx.project_name}</p>
                            </div>
                            <p className="text-[9px] sm:text-[10px] text-white/40">{getTimeSinceLastOffset(tx.created_at)}</p>
                          </div>
                        </div>

                        {/* Right: Verified badge and arrow */}
                        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                          {tx.certificate_generated === 1 && (
                            <span className="px-1.5 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-[8px] sm:text-[9px] text-green-400 font-medium">
                              VERIFIED
                            </span>
                          )}
                          <ChevronRight className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white/20 group-hover:text-green-400 transition-colors" />
                        </div>
                      </div>
                    </motion.div>
                    );
                  })}
                </AnimatePresence>

                {transactions.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-white/40 text-sm">No recent transactions</p>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        const newPage = currentPage - 1;
                        if (newPage >= 0 && !loading) {
                          console.log('Previous button clicked, going to page:', newPage);
                          fetchTransactions(newPage);
                        }
                      }}
                      disabled={currentPage === 0 || loading}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                        currentPage === 0 || loading
                          ? 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                          : 'bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border-white/10 hover:border-white/20 text-white/60 hover:text-white'
                      }`}
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span className="text-sm">Previous</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {/* Page indicators */}
                      <div className="flex items-center gap-1">
                        {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = idx;
                          } else if (currentPage < 3) {
                            pageNum = idx;
                          } else if (currentPage > totalPages - 4) {
                            pageNum = totalPages - 5 + idx;
                          } else {
                            pageNum = currentPage - 2 + idx;
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                if (!loading && pageNum !== currentPage && pageNum >= 0 && pageNum < totalPages) {
                                  console.log('Page button clicked, going to page:', pageNum);
                                  fetchTransactions(pageNum);
                                }
                              }}
                              className={`w-8 h-8 rounded-lg text-xs font-medium transition-all duration-200 ${
                                pageNum === currentPage
                                  ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400'
                                  : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/60 hover:text-white'
                              }`}
                              disabled={loading}
                            >
                              {pageNum + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const newPage = currentPage + 1;
                        if (newPage < totalPages && !loading) {
                          console.log('Next button clicked, going to page:', newPage);
                          fetchTransactions(newPage);
                        }
                      }}
                      disabled={currentPage >= totalPages - 1 || loading}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                        currentPage >= totalPages - 1 || loading
                          ? 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                          : 'bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border-white/10 hover:border-white/20 text-white/60 hover:text-white'
                      }`}
                    >
                      <span className="text-sm">Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Agent Status Footer */}
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-green-500/5 border border-purple-500/10 relative overflow-hidden">
                  {/* Animated background effect */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 backdrop-blur-sm">
                            <Bot className="w-5 h-5 text-purple-400" />
                          </div>
                          <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white flex items-center gap-1.5">
                            0impact.ai • Agent Zero
                            <span className="text-[9px] text-purple-400/80 font-normal">#000</span>
                          </h4>
                          <p className="text-xs text-white/60">Autonomous Carbon Offsetting Intelligence</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full border border-green-500/20 backdrop-blur-sm">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                        <span className="text-[10px] text-green-400 font-medium">ONLINE</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="bg-black/30 rounded-lg p-2.5 border border-white/5 backdrop-blur-sm relative">
                        <p className="text-[10px] text-white/40 mb-1 flex items-center gap-1">
                          24h Rolling
                          <span className="inline-block w-1 h-1 bg-green-400/60 rounded-full animate-pulse" />
                        </p>
                        <p className="text-sm font-medium text-green-400 flex items-center gap-1">
                          {dailySummary?.total_credits_retired || '0'} tCO₂
                          <span className="text-[9px] text-green-400/60">↑</span>
                        </p>
                      </div>
                      <div className="bg-black/30 rounded-lg p-2.5 border border-white/5 backdrop-blur-sm">
                        <p className="text-[10px] text-white/40 mb-1">Network</p>
                        <p className="text-sm font-medium text-purple-400">0g-Mainnet</p>
                      </div>
                      <div className="bg-black/30 rounded-lg p-2.5 border border-white/5 backdrop-blur-sm">
                        <p className="text-[10px] text-white/40 mb-1">Runtime</p>
                        <p className="text-sm font-medium text-blue-400">∞ 24/7</p>
                      </div>
                    </div>

                    {/* Agent Capabilities */}
                    <div className="p-3 rounded-lg bg-black/20 border border-white/5 backdrop-blur-sm">
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Core Capabilities</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1 h-1 bg-green-400 rounded-full" />
                          <span className="text-[10px] text-white/60">ecoBridge Integration</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1 h-1 bg-purple-400 rounded-full" />
                          <span className="text-[10px] text-white/60">Blockchain Verification</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1 h-1 bg-blue-400 rounded-full" />
                          <span className="text-[10px] text-white/60">Auto-Retirement</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                          <span className="text-[10px] text-white/60">Certificate Generation</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                          <span className="text-[10px] text-white/60">Real-time Monitoring</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1 h-1 bg-yellow-400 rounded-full" />
                          <span className="text-[10px] text-white/60">0impact.ai API</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-[10px] sm:text-xs text-white/50 leading-relaxed">
                        Processing continuous carbon credit retirements. All transactions verified on Regen Network.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
        </div>

      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCertificate(null);
        }}
        certificateId={selectedCertificate?.id}
        txHash={selectedCertificate?.hash}
      />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </>
  );
}