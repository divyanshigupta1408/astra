import React from 'react';
import { OfficerApplication } from '../../types';
import { CheckCircle2, ShieldCheck, X, AlertTriangle } from 'lucide-react';

interface BulkApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedApps: OfficerApplication[];
  onConfirm: () => void;
}

export const BulkApproveModal: React.FC<BulkApproveModalProps> = ({
  isOpen,
  onClose,
  selectedApps,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-70 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 border-b border-stone-200 pb-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Bulk GFR Statutory Approval Preview
            </h3>
            <p className="text-[11px] text-stone-500">
              Fast-track sign-off for {selectedApps.length} Green Lane applications
            </p>
          </div>
        </div>

        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Deterministic Criteria Satisfied:</span>
          </div>
          <p className="text-[11px] text-emerald-900">
            All selected candidates possess 100% verified DigiLocker PKI documents, zero cross-document entity mismatches, and verified active NPCI bank accounts.
          </p>
        </div>

        {/* Selected Applications List */}
        <div className="space-y-2">
          <div className="font-bold text-stone-700 text-xs">
            Applications Queued for Immediate Sign-Off ({selectedApps.length}):
          </div>
          <div className="max-h-48 overflow-y-auto divide-y divide-stone-100 border border-stone-200 rounded-xl p-1 bg-stone-50">
            {selectedApps.map((app) => (
              <div key={app.id} className="p-2 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-stone-900">{app.studentName}</div>
                  <div className="text-[10px] text-stone-500 font-mono">
                    {app.applicationNumber} • {app.schemeName}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-emerald-800 text-[11px]">
                    Score: {app.healthScore}/100
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                    Green Lane
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between gap-3 border-t border-stone-200">
          <span className="text-[11px] text-stone-500 italic">
            You will have 10 seconds to Undo after confirming.
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-stone-300 rounded-lg text-stone-700 font-semibold hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold shadow-xs cursor-pointer"
            >
              Confirm Bulk Sign-Off ({selectedApps.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
