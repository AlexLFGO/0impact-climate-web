'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Leaf, CheckCircle, Clock, TrendingDown, Hash, Search } from 'lucide-react';

interface Transaction {
  id: string;
  hash: string;
  blockHeight: number;
  timestamp: Date;
  type: 'validator' | 'storage' | 'compute' | 'da' | 'alignment';
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

  // Generate mock transaction data
  const generateTransaction = (): Transaction => {
    const types = ['validator', 'storage', 'compute', 'da', 'alignment'] as const;
    const type = types[Math.floor(Math.random() * types.length)];
    const gasUsed = Math.floor(Math.random() * 50000) + 10000;
    
    return {
      id: Math.random().toString(36).substring(2, 9),
      hash: '0x' + Math.random().toString(16).substring(2, 18) + Math.random().toString(16).substring(2, 18),
      blockHeight: Math.floor(Math.random() * 1000000) + 1000000,
      timestamp: new Date(),
      type,
      gasUsed,
      co2Offset: gasUsed * 0.0000012, // Mock calculation
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
  }, [isLive]);

  const getTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'validator': return 'text-purple-400';
      case 'storage': return 'text-blue-400';
      case 'compute': return 'text-green-400';
      case 'da': return 'text-yellow-400';
      case 'alignment': return 'text-pink-400';
    }
  };

  const getTypeLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'validator': return 'Validator';
      case 'storage': return 'Storage';
      case 'compute': return 'Compute';
      case 'da': return 'Data Availability';
      case 'alignment': return 'Alignment';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };

  // Filter transactions based on search
  useEffect(() => {
    if (!searchQuery) {
      setTransactions(allTransactions.slice(0, 10));
    } else {
      const filtered = allTransactions.filter(tx => 
        tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.validator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setTransactions(filtered.slice(0, 10));
    }
  }, [searchQuery, allTransactions]);

  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-light flex items-center gap-3 text-white">
          <Scan className="w-6 h-6 text-purple-400" />
          ØG Impact Registry
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsLive(!isLive)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            isLive 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-neutral-dark text-neutral-light'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-neutral-light'}`} />
          {isLive ? 'Live' : 'Paused'}
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-light" />
          <input
            type="text"
            placeholder="Search by transaction hash, validator, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-darker border border-purple-500/20 rounded-lg text-white placeholder-neutral-light focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Daily Offset Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-purple-500/10 to-transparent rounded-lg border border-purple-500/20">
          <p className="text-xs text-neutral-light mb-1">24h Carbon Offset</p>
          <p className="text-2xl font-light text-white">
            {totalOffsetToday.toFixed(2)}
            <span className="text-sm text-neutral-light ml-1">kg CO₂</span>
          </p>
        </div>
        <div className="p-4 bg-gradient-to-br from-blue-500/10 to-transparent rounded-lg border border-blue-500/20">
          <p className="text-xs text-neutral-light mb-1">Transactions Offset</p>
          <p className="text-2xl font-light text-white">
            {(transactions.length * 142).toLocaleString()}
            <span className="text-sm text-neutral-light ml-1">today</span>
          </p>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-500/10 to-transparent rounded-lg border border-green-500/20">
          <p className="text-xs text-neutral-light mb-1">Offset Rate</p>
          <p className="text-2xl font-light text-white">
            100%
            <span className="text-sm text-neutral-light ml-1">automatic</span>
          </p>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        <div className="text-xs text-neutral-light uppercase tracking-wider mb-3 flex items-center gap-2">
          <Hash className="w-3 h-3" />
          On-Chain Impact Records
        </div>
        
        <AnimatePresence mode="popLayout">
          {transactions.map((tx) => (
            <motion.div
              key={tx.id}
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-4 rounded-lg border border-purple-500/20 bg-neutral-darker/50 hover:border-purple-500/40 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
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
                    className="text-xs font-mono text-purple-400 hover:text-purple-300 truncate block transition-colors"
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
                      {tx.co2Offset.toFixed(6)} kg
                    </p>
                  </div>
                  <p className="text-xs text-neutral-light">
                    Gas: {tx.gasUsed.toLocaleString()}
                  </p>
                  {tx.status === 'confirmed' && (
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-400">Offset</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Carbon-Aware Consensus Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg"
      >
        <div className="flex items-start gap-3">
          <TrendingDown className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-white font-normal mb-1">
              ØImpact Engine
            </p>
            <p className="text-xs text-neutral-light leading-relaxed">
              Every transaction is transparently recorded on-chain with automatic carbon offset allocation. 
              View each transaction on ØG Explorer to verify offset purchases and validator participation.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}