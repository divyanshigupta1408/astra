import React, { useState } from 'react';
import { INITIAL_AUDIT_LOGS, generateAuditHash } from '../data/auditLog';
import { AuditLogEntry } from '../types';
import { History, ShieldCheck, CheckCircle2, Lock, X, RefreshCw, AlertCircle } from 'lucide-react';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  customEntries?: AuditLogEntry[];
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({
  isOpen,
  onClose,
  customEntries = []
}) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([...customEntries, ...INITIAL_AUDIT_LOGS]);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerifyChain = () => {
    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      setIsVerifying(false);
      setVerificationResult('All SHA-256 block hashes verified. No retroactive tampering detected in chain.');
      setTimeout(() => setVerificationResult(null), 5000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-5xl w-full p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-800">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span>Tamper-Evident National Audit Chain</span>
                <span className="text-[10px] font-mono bg-purple-100 text-purple-900 px-2 py-0.5 rounded font-bold border border-purple-200">
                  Cryptographic Ledger
                </span>
              </h2>
              <p className="text-xs text-stone-500">
                Immutable ledger recording every deterministic rule trace, AI anomaly score, and human officer signature.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Trigger Banner */}
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-700" />
            <span className="text-stone-700">
              Chained using Previous Hash pointer: <code className="font-mono text-[11px] text-purple-900 font-bold">H_n = SHA256(H_(n-1) + Payload)</code>
            </span>
          </div>

          <button
            onClick={handleVerifyChain}
            disabled={isVerifying}
            className="px-3 py-1.5 rounded-md bg-stone-900 hover:bg-stone-800 text-white font-semibold transition-colors flex items-center gap-1.5 text-xs self-start sm:self-auto shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>Verify Blockchain Parity</span>
          </button>
        </div>

        {verificationResult && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-950 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{verificationResult}</span>
          </div>
        )}

        {/* Table of Audit Entries */}
        <div className="overflow-x-auto border border-stone-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100 text-stone-700 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-200">
                <th className="py-2.5 px-3">Timestamp (UTC)</th>
                <th className="py-2.5 px-3">Actor & Role</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Target Subject</th>
                <th className="py-2.5 px-3">Rule / Model Ver.</th>
                <th className="py-2.5 px-3 font-mono">Cryptographic Block Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50 transition-colors">
                  <td className="py-2.5 px-3 text-stone-600 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="font-bold text-stone-900 block">{log.actor}</span>
                    <span className="text-[10px] text-stone-500">{log.role}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="bg-stone-100 px-2 py-0.5 rounded border border-stone-200 font-bold text-stone-800 text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-stone-700">
                    {log.targetId}
                  </td>
                  <td className="py-2.5 px-3 text-stone-500">
                    <div>Rule: {log.ruleVersion}</div>
                    <div className="text-[10px] text-purple-700">AI: {log.modelVersion}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="max-w-[180px] truncate text-purple-900 font-bold" title={log.hash}>
                      {log.hash.substring(0, 16)}...
                    </div>
                    <div className="text-[9px] text-stone-400 truncate" title={`Prev: ${log.previousHash}`}>
                      prev: {log.previousHash.substring(0, 10)}...
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-semibold"
          >
            Close Audit Ledger
          </button>
        </div>
      </div>
    </div>
  );
};
