'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  X,
  CheckCircle2,
  FileText,
  ExternalLink,
  Copy,
  Download,
  Award,
  Calendar,
  Trees,
  MapPin,
  Hash,
  Loader2
} from 'lucide-react';
import { Certificate, impactApi, getExplorerUrl } from '../lib/impactApi';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificateId?: string;
  txHash?: string;
}

export function CertificateModal({ isOpen, onClose, certificateId, txHash }: CertificateModalProps) {
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && (certificateId || txHash)) {
      fetchCertificate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, certificateId, txHash]);

  const fetchCertificate = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prefer tx_hash over certificate_id as it's more reliable
      const idOrHash = txHash || certificateId || '';
      const useHash = !!txHash;
      console.log('Fetching certificate:', idOrHash, 'isHash:', useHash);

      const data = await impactApi.getCertificate(idOrHash, useHash);
      console.log('Certificate data received:', data);
      setCertificate(data);
    } catch (err: any) {
      console.error('Certificate fetch error:', err);

      // More specific error messages
      if (err.message?.includes('Network')) {
        setError('Network error - please check your connection');
      } else if (err.message?.includes('404')) {
        setError('Certificate not found');
      } else if (err.message?.includes('CORS')) {
        setError('Unable to connect to API - CORS error');
      } else {
        setError(err.message || 'Failed to load certificate details');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadCertificate = () => {
    if (!certificate) return;

    const content = `
CARBON OFFSET CERTIFICATE
========================

Certificate ID: ${certificate.certificate_id}
Retirement Date: ${certificate.retirement_date}
CO₂ Offset: ${certificate.co2e_tons} tCO₂e

PROJECT DETAILS
--------------
Project: ${certificate.project_name}
Project ID: ${certificate.project_id}
Credit Class: ${certificate.credit_class}
Vintage Year: ${certificate.vintage_year}

BLOCKCHAIN VERIFICATION
----------------------
Transaction Hash: ${certificate.tx_hash}
Block Height: ${certificate.height}
Batch: ${certificate.batch_denom}
Retired By: ${certificate.retired_by}

Reason: ${certificate.retirement_reason}

Verified on ecoBridge
Explorer: ${getExplorerUrl(certificate.tx_hash)}

Generated: ${new Date().toISOString()}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${certificate.certificate_id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            <div className="relative bg-gradient-to-br from-neutral-darker via-neutral-darker to-neutral-dark border border-green-500/20 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header Gradient */}
              <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-transparent pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 group z-10"
              >
                <X className="w-5 h-5 text-white/60 group-hover:text-white" />
              </button>

              {/* Content */}
              <div className="relative p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
                {loading && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 text-green-400 animate-spin mb-4" />
                    <p className="text-white/60">Loading certificate...</p>
                  </div>
                )}

                {error && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
                      <X className="w-8 h-8 text-red-400" />
                    </div>
                    <p className="text-red-400 mb-2">{error}</p>
                    <button
                      onClick={fetchCertificate}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      Try again
                    </button>
                  </div>
                )}

                {certificate && !loading && (
                  <>
                    {/* Header */}
                    <div className="mb-8">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30">
                          <Award className="w-8 h-8 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-2xl font-light text-white mb-2">Carbon Offset Certificate</h2>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-green-400">Verified on ecoBridge</span>
                          </div>
                        </div>
                      </div>

                      {/* Logo positioned below header to avoid X button overlap */}
                      <div className="flex justify-end mb-4">
                        <Image
                          src="/ecobridge_logo.png"
                          alt="ecoBridge"
                          width={120}
                          height={36}
                          className="h-8 w-auto opacity-80"
                        />
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                        <div className="bg-green-500/5 rounded-xl p-4 border border-green-500/10">
                          <p className="text-xs text-white/60 mb-1">CO₂ Offset</p>
                          <p className="text-xl font-light text-green-400">{certificate.co2e_tons} tCO₂e</p>
                        </div>
                        <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/10">
                          <p className="text-xs text-white/60 mb-1">Retirement Date</p>
                          <p className="text-lg font-light text-blue-400">{certificate.retirement_date}</p>
                        </div>
                        <div className="bg-purple-500/5 rounded-xl p-4 border border-purple-500/10 col-span-2 sm:col-span-1">
                          <p className="text-xs text-white/60 mb-1">Vintage Year</p>
                          <p className="text-lg font-light text-purple-400">{certificate.vintage_year}</p>
                        </div>
                      </div>

                      {/* Certificate ID */}
                      <div className="bg-neutral-darker/50 rounded-xl p-4 border border-white/5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-white/40" />
                            <span className="text-xs text-white/60">Certificate ID</span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(certificate.certificate_id, 'certId')}
                            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors group"
                          >
                            {copied === 'certId' ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-white/40 group-hover:text-white/60" />
                            )}
                          </button>
                        </div>
                        <p className="text-sm font-mono text-white/80 mt-2 break-all">{certificate.certificate_id}</p>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="space-y-6 mb-8">
                      <div>
                        <h3 className="text-sm font-medium text-white/60 mb-3 flex items-center gap-2">
                          <Trees className="w-4 h-4" />
                          Project Information
                        </h3>
                        <div className="bg-neutral-darker/30 rounded-xl p-4 border border-white/5 space-y-3">
                          <div>
                            <p className="text-xs text-white/40 mb-1">Project Name</p>
                            <p className="text-white">{certificate.project_name}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-white/40 mb-1">Project ID</p>
                              <p className="text-white/80 font-mono text-sm">{certificate.project_id}</p>
                            </div>
                            <div>
                              <p className="text-xs text-white/40 mb-1">Credit Class</p>
                              <p className="text-white/80 text-sm">{certificate.credit_class_id}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-white/40 mb-1">Credit Standard</p>
                              <p className="text-white/80 text-sm">{certificate.credit_class}</p>
                            </div>
                            <div>
                              <p className="text-xs text-white/40 mb-1">Registry</p>
                              <p className="text-white/80 text-sm">Regen Network</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Blockchain Details */}
                      <div>
                        <h3 className="text-sm font-medium text-white/60 mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Blockchain Verification
                        </h3>
                        <div className="bg-neutral-darker/30 rounded-xl p-4 border border-white/5 space-y-3">
                          <div>
                            <p className="text-xs text-white/40 mb-1">Transaction Hash</p>
                            <div className="flex items-center gap-2">
                              <p className="text-white/80 font-mono text-xs flex-1 truncate">{certificate.tx_hash}</p>
                              <button
                                onClick={() => copyToClipboard(certificate.tx_hash, 'txHash')}
                                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                              >
                                {copied === 'txHash' ? (
                                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                                ) : (
                                  <Copy className="w-3 h-3 text-white/40" />
                                )}
                              </button>
                              <a
                                href={getExplorerUrl(certificate.tx_hash)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                              >
                                <ExternalLink className="w-3 h-3 text-white/40" />
                              </a>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-white/40 mb-1">Block Height</p>
                              <p className="text-white/80 font-mono text-sm">{certificate.height.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-white/40 mb-1">Batch Denom</p>
                              <p className="text-white/80 font-mono text-xs truncate">{certificate.batch_denom}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-white/40 mb-1">Retired By</p>
                            <div className="flex items-center gap-2">
                              <p className="text-white/80 font-mono text-xs flex-1 truncate">{certificate.retired_by}</p>
                              <button
                                onClick={() => copyToClipboard(certificate.retired_by, 'wallet')}
                                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                              >
                                {copied === 'wallet' ? (
                                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                                ) : (
                                  <Copy className="w-3 h-3 text-white/40" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Retirement Reason */}
                      <div>
                        <h3 className="text-sm font-medium text-white/60 mb-3">Retirement Reason</h3>
                        <div className="bg-neutral-darker/30 rounded-xl p-4 border border-white/5">
                          <p className="text-sm text-white/80 leading-relaxed">{certificate.retirement_reason}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={downloadCertificate}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border border-green-500/30 hover:border-green-500/50 rounded-xl transition-all duration-200 group"
                      >
                        <Download className="w-4 h-4 text-green-400 group-hover:text-green-300" />
                        <span className="text-green-400 group-hover:text-green-300 font-medium">Download Certificate</span>
                      </button>

                      <a
                        href={getExplorerUrl(certificate.tx_hash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200 group"
                      >
                        <span className="text-white/60 group-hover:text-white">View on Explorer</span>
                        <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-white" />
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}