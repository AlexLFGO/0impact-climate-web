'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Leaf, CheckCircle, Clock, TrendingDown, Search, ChevronLeft, ChevronRight, Server, HardDrive, Database, Cpu, Users } from 'lucide-react';

interface Transaction {
  id: string;
  hash: string;
  blockHeight: number;
  timestamp: Date;
  type: 'chain' | 'storage' | 'compute' | 'da' | 'alignment';
  gasUsed: number;
  co2Offset: number;
  status: 'confirmed' | 'pending';
  validator: string;
}

export function CarbonOffsetScanner() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [totalOffsetToday, setTotalOffsetToday] = useState(324.56);
  const [searchQuery, setSearchQuery] = useState('');
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  // Generate mock transaction data
  const generateTransaction = (): Transaction => {
    const types = ['chain', 'storage', 'compute', 'da', 'alignment'] as const;
    const type = types[Math.floor(Math.random() * types.length)];
    const gasUsed = Math.floor(Math.random() * 50000) + 10000;
    
    return {
      id: Math.random().toString(36).substring(2, 9),
      hash: '0x' + Math.random().toString(16).substring(2, 18) + Math.random().toString(16).substring(2, 18),
      blockHeight: Math.floor(Math.random() * 1000000) + 1000000,
      timestamp: new Date(),
      type,
      gasUsed,
      co2Offset: gasUsed * 0.00002 + Math.random() * 0.5, // Mock calculation in kg
      status: 'confirmed',
      validator: '0g1val' + Math.random().toString(36).substring(2, 8)
    };
  };

  // Initialize with some transactions
  useEffect(() => {
    const initial = Array.from({ length: 5 }, () => {
      const tx = generateTransaction();
      tx.timestamp = new Date(Date.now() - Math.random() * 3600000);
      return tx;
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setTransactions(initial);
    setAllTransactions(initial);
  }, []);

  // Add new transactions in real-time
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newTx = generateTransaction();
      setAllTransactions(prev => [newTx, ...prev]);
      setTransactions(prev => {
        const updated = [newTx, ...prev];
        return searchQuery ? updated : updated.slice(0, 10);
      });
      setTotalOffsetToday(prev => prev + newTx.co2Offset);
    }, 4000);

    return () => clearInterval(interval);
  }, [isLive, searchQuery]);

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'chain': return Server;
      case 'storage': return HardDrive;
      case 'compute': return Cpu;
      case 'da': return Database;
      case 'alignment': return Users;
    }
  };

  const getTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'chain': return 'text-purple-400';
      case 'storage': return 'text-blue-400';
      case 'compute': return 'text-orange-400';
      case 'da': return 'text-green-400';
      case 'alignment': return 'text-pink-400';
    }
  };

  const getTypeLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'chain': return '0G Chain';
      case 'storage': return '0G Storage';
      case 'compute': return '0G Compute';
      case 'da': return '0G DA';
      case 'alignment': return '0G Alignment';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };

  // Filter and paginate transactions
  const filteredTransactions = searchQuery 
    ? allTransactions.filter(tx => 
        tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.validator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allTransactions;

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + transactionsPerPage);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="dashboard-card p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-light flex items-center gap-2 sm:gap-3 text-white">
            <Scan className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-purple-400" />
            Impact Scanner
          </h3>
          <p className="text-sm text-white/60 mt-2">Real-time transparency layer for decentralized AI carbon accounting</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsLive(!isLive)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all text-xs sm:text-sm ${
            isLive 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-neutral-dark text-neutral-light'
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-neutral-light'}`} />
          {isLive ? 'Live' : 'Paused'}
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative group w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-light group-focus-within:text-purple-400 transition-colors" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-neutral-darker border border-purple-500/20 rounded-lg text-white placeholder-neutral-light focus:outline-none focus:border-purple-500/50 focus:bg-neutral-darker/70 transition-all text-base"
          />
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {paginatedTransactions.map((tx) => (
            <motion.div
              key={tx.id}
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-4 rounded-lg border border-purple-500/20 bg-neutral-darker/50 hover:border-purple-500/40 hover:bg-neutral-darker/70 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {(() => {
                      const Icon = getTypeIcon(tx.type);
                      return <Icon className={`w-4 h-4 ${getTypeColor(tx.type)}`} />;
                    })()}
                    <span className={`text-xs font-medium ${getTypeColor(tx.type)}`}>
                      {getTypeLabel(tx.type)}
                    </span>
                    <span className="text-xs text-neutral-light">
                      Block #{tx.blockHeight.toLocaleString()}
                    </span>
                    <span className="text-xs text-neutral-light">
                      {formatTime(tx.timestamp)}
                    </span>
                  </div>
                  <a 
                    href={`https://explorer.0g.ai/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-purple-400 hover:text-purple-300 truncate block transition-colors break-all sm:break-normal"
                  >
                    {tx.hash}
                  </a>
                  <p className="text-xs text-neutral-light mt-1">
                    Validator: <span className="font-mono">{tx.validator}</span>
                  </p>
                </div>
                
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <Leaf className="w-3 h-3 text-green-400" />
                    <p className="text-sm font-light text-green-400">
                      {tx.co2Offset.toFixed(2)} kg CO₂
                    </p>
                  </div>
                  <p className="text-xs text-neutral-light">
                    Gas: {tx.gasUsed.toLocaleString()}
                  </p>
                  {tx.status === 'confirmed' && (
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <CheckCircle className="w-3 h-3 text-blue-400" />
                      <span className="text-xs text-blue-400">0impact.ai</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-purple-500/20">
          <p className="text-xs text-neutral-light text-center sm:text-left">
            Showing {startIndex + 1}-{Math.min(startIndex + transactionsPerPage, filteredTransactions.length)} of {filteredTransactions.length}
          </p>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-neutral-darker border border-purple-500/20 text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-purple-500/40 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm transition-all ${
                      currentPage === pageNum
                        ? 'bg-purple-500/30 text-white border border-purple-500/50'
                        : 'bg-neutral-darker border border-purple-500/20 text-neutral-light hover:border-purple-500/40'
                    }`}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-neutral-darker border border-purple-500/20 text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-purple-500/40 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      )}

    </div>
  );
}