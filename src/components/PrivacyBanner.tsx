import React, { useState } from 'react';
import { ShieldCheck, X, ChevronRight, Lock, EyeOff } from 'lucide-react';

interface PrivacyBannerProps {
  onLearnMore?: () => void;
}

export const PrivacyBanner: React.FC<PrivacyBannerProps> = ({ onLearnMore }) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  if (isDismissed && !showDetailModal) return null;

  return (
    <>
      {!isDismissed && (
        <div className="bg-stone-900 text-stone-200 text-xs px-4 py-2.5 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="leading-tight">
              <span className="font-bold text-white">DPDP Act 2023 & Aadhaar Privacy Compliant: </span>
              <span className="text-stone-300">
                Data minimization strictly enforced. Direct biometric or raw Aadhaar numbers are never stored in plain text. Bank endpoints are accessed exclusively through masked NPCI tokens.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowDetailModal(true)}
              className="text-amber-400 hover:text-amber-300 font-semibold underline text-[11px] flex items-center gap-0.5"
            >
              <span>Consent Notice & Data Minimization</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="text-stone-400 hover:text-white p-1 rounded hover:bg-stone-800"
              title="Dismiss Notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* DPDP Act 2023 Compliance Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-60 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-bold text-stone-900">
                  Statutory Privacy & Consent Declaration
                </h3>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-stone-700 leading-relaxed">
              <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-stone-700" />
                  1. Digital Personal Data Protection (DPDP) Act 2023 Compliance
                </span>
                <p className="text-[11px]">
                  All personal attributes (caste status, family income, domicile, disability status) are collected strictly for the statutory purpose of scholarship evaluation under MoTA welfare guidelines. Data is never shared or monetized.
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <EyeOff className="w-3.5 h-3.5 text-stone-700" />
                  2. Aadhaar Masking & NPCI Virtual Tokenization
                </span>
                <p className="text-[11px]">
                  In accordance with the Supreme Court of India guidelines and UIDAI regulations, 12-digit Aadhaar numbers are masked (e.g. ••••••••8192). Disbursements leverage the NPCI Aadhaar Mapper bridge without exposing banking credentials to unauthorized personnel.
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900">
                  3. Right to Correction & Data Minimization
                </span>
                <p className="text-[11px]">
                  Students can review all extracted attributes and rectify mismatches prior to statutory submission. Officers can only view documents within their sanctioned institutional jurisdiction.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-stone-200">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-md font-semibold text-xs"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
