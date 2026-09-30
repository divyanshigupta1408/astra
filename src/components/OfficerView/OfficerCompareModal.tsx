import React from 'react';
import { OfficerApplication } from '../../types';
import { X, Scale, AlertOctagon, CheckCircle2, ShieldAlert, CreditCard, Smartphone, Building2, MapPin } from 'lucide-react';

interface OfficerCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  appA: OfficerApplication | null;
  appB: OfficerApplication | null;
}

export const OfficerCompareModal: React.FC<OfficerCompareModalProps> = ({
  isOpen,
  onClose,
  appA,
  appB
}) => {
  if (!isOpen || !appA || !appB) return null;

  // Check shared attributes
  const isSharedBank = appA.bankAccountMasked === appB.bankAccountMasked;
  const isSharedMobile = appA.mobileNumberMasked === appB.mobileNumberMasked;
  const isSharedInstitute = appA.institute === appB.institute;
  const isSharedDistrict = appA.district === appB.district;
  const isSharedFather = appA.fatherName.toLowerCase() === appB.fatherName.toLowerCase();

  const hasHighRiskCollocation = isSharedBank || isSharedMobile;

  return (
    <div className="fixed inset-0 z-70 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 text-xs relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-800" />
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Side-by-Side Dual Application Inspection
              </h3>
              <p className="text-[11px] text-stone-500">
                Compare biometric records, bank mappings, and syndicate co-occurrence in your jurisdiction.
              </p>
            </div>
          </div>

          {hasHighRiskCollocation ? (
            <span className="px-2.5 py-1 rounded bg-rose-100 text-rose-950 font-bold text-[10px] flex items-center gap-1 border border-rose-300">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-700" />
              <span>Collocated Syndicate Risk Detected</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-950 font-bold text-[10px] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Independent Disjoint Profiles</span>
            </span>
          )}
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Card A */}
          <div className="border-2 border-stone-200 rounded-xl p-4 bg-stone-50/60 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-mono font-bold text-stone-600 text-[11px]">
                {appA.applicationNumber}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                appA.riskLane === 'Green' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
              }`}>
                {appA.riskLane} Lane
              </span>
            </div>

            <div>
              <h4 className="font-extrabold text-stone-900 text-sm">{appA.studentName}</h4>
              <p className="text-stone-500 text-[11px]">{appA.schemeName}</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2 rounded bg-white border border-stone-200">
                <span className="text-stone-400 block text-[10px]">Father / Guardian:</span>
                <span className="font-semibold text-stone-800">{appA.fatherName}</span>
              </div>

              <div className={`p-2 rounded border ${isSharedBank ? 'bg-rose-50 border-rose-300 text-rose-950 font-bold' : 'bg-white border-stone-200 text-stone-800'}`}>
                <span className="block text-[10px] flex items-center justify-between">
                  <span>Bank Account Masked:</span>
                  {isSharedBank && <span className="text-[9px] uppercase px-1 rounded bg-rose-200 text-rose-900">Shared Bank</span>}
                </span>
                <span className="font-mono">{appA.bankAccountMasked}</span>
              </div>

              <div className={`p-2 rounded border ${isSharedMobile ? 'bg-rose-50 border-rose-300 text-rose-950 font-bold' : 'bg-white border-stone-200 text-stone-800'}`}>
                <span className="block text-[10px] flex items-center justify-between">
                  <span>Mobile Contact Masked:</span>
                  {isSharedMobile && <span className="text-[9px] uppercase px-1 rounded bg-rose-200 text-rose-900">Shared Phone</span>}
                </span>
                <span className="font-mono">{appA.mobileNumberMasked}</span>
              </div>

              <div className={`p-2 rounded border ${isSharedInstitute ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-white border-stone-200 text-stone-800'}`}>
                <span className="block text-[10px]">Enrolled Institute:</span>
                <span className="font-medium truncate block">{appA.institute}</span>
              </div>

              <div className={`p-2 rounded border ${isSharedDistrict ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-white border-stone-200 text-stone-800'}`}>
                <span className="block text-[10px]">District &amp; State:</span>
                <span className="font-medium">{appA.district}, {appA.state}</span>
              </div>

              <div className="p-2 rounded bg-white border border-stone-200 grid grid-cols-2 gap-1 text-[11px]">
                <div>
                  <span className="text-stone-400 block text-[10px]">Income:</span>
                  <span className="font-mono font-bold">₹{(appA.income / 100000).toFixed(2)}L</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Marks:</span>
                  <span className="font-mono font-bold">{appA.percentage}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card B */}
          <div className="border-2 border-stone-200 rounded-xl p-4 bg-stone-50/60 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-mono font-bold text-stone-600 text-[11px]">
                {appB.applicationNumber}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                appB.riskLane === 'Green' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
              }`}>
                {appB.riskLane} Lane
              </span>
            </div>

            <div>
              <h4 className="font-extrabold text-stone-900 text-sm">{appB.studentName}</h4>
              <p className="text-stone-500 text-[11px]">{appB.schemeName}</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2 rounded bg-white border border-stone-200">
                <span className="text-stone-400 block text-[10px]">Father / Guardian:</span>
                <span className="font-semibold text-stone-800">{appB.fatherName}</span>
              </div>

              <div className={`p-2 rounded border ${isSharedBank ? 'bg-rose-50 border-rose-300 text-rose-950 font-bold' : 'bg-white border-stone-200 text-stone-800'}`}>
                <span className="block text-[10px] flex items-center justify-between">
                  <span>Bank Account Masked:</span>
                  {isSharedBank && <span className="text-[9px] uppercase px-1 rounded bg-rose-200 text-rose-900">Shared Bank</span>}
                </span>
                <span className="font-mono">{appB.bankAccountMasked}</span>
              </div>

              <div className={`p-2 rounded border ${isSharedMobile ? 'bg-rose-50 border-rose-300 text-rose-950 font-bold' : 'bg-white border-stone-200 text-stone-800'}`}>
                <span className="block text-[10px] flex items-center justify-between">
                  <span>Mobile Contact Masked:</span>
                  {isSharedMobile && <span className="text-[9px] uppercase px-1 rounded bg-rose-200 text-rose-900">Shared Phone</span>}
                </span>
                <span className="font-mono">{appB.mobileNumberMasked}</span>
              </div>

              <div className={`p-2 rounded border ${isSharedInstitute ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-white border-stone-200 text-stone-800'}`}>
                <span className="block text-[10px]">Enrolled Institute:</span>
                <span className="font-medium truncate block">{appB.institute}</span>
              </div>

              <div className={`p-2 rounded border ${isSharedDistrict ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-white border-stone-200 text-stone-800'}`}>
                <span className="block text-[10px]">District &amp; State:</span>
                <span className="font-medium">{appB.district}, {appB.state}</span>
              </div>

              <div className="p-2 rounded bg-white border border-stone-200 grid grid-cols-2 gap-1 text-[11px]">
                <div>
                  <span className="text-stone-400 block text-[10px]">Income:</span>
                  <span className="font-mono font-bold">₹{(appB.income / 100000).toFixed(2)}L</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Marks:</span>
                  <span className="font-mono font-bold">{appB.percentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Co-occurrence Diagnostic Summary */}
        <div className={`p-3.5 rounded-xl border text-xs ${
          hasHighRiskCollocation
            ? 'bg-rose-50 border-rose-300 text-rose-950'
            : 'bg-stone-50 border-stone-200 text-stone-700'
        }`}>
          <div className="font-bold mb-1 flex items-center gap-1.5">
            {hasHighRiskCollocation ? <AlertOctagon className="w-4 h-4 text-rose-700" /> : <ShieldAlert className="w-4 h-4 text-stone-600" />}
            <span>Reconciliation Finding:</span>
          </div>
          {hasHighRiskCollocation ? (
            <p>
              Shared financial attribute detected. Multiple candidates claiming Direct Benefit Transfer on the identical bank account (<strong>{appA.bankAccountMasked}</strong>). Recommend placing on hold for State Nodal syndicate investigation.
            </p>
          ) : (
            <p>
              No shared financial identifiers or mobile collision detected between these two candidates. Independent genuine ST applicants.
            </p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-xs"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
