import React from 'react';
import { GovtEmblem } from '../Emblem';
import { Printer, Download, X, TrendingUp, BarChart3, ShieldCheck, MapPin } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { PROCESSING_TIME_TREND_DATA, MONTHLY_BUDGET_DATA } from '../../data/mockAnalystData';

interface ExportBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'hi';
}

export const ExportBriefingModal: React.FC<ExportBriefingModalProps> = ({
  isOpen,
  onClose,
  language = 'en'
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-70 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-5 text-xs relative max-h-[92vh] overflow-y-auto print:p-0 print:shadow-none print:max-h-full">
        {/* Header Controls (Hidden on Print) */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-3 print:hidden">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-950" />
            <div>
              <h3 className="font-bold text-stone-900 text-sm">
                Executive Ministry Briefing Document
              </h3>
              <p className="text-[11px] text-stone-500">
                Ready for high-level parliamentary and inter-ministerial review
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-900 hover:bg-indigo-950 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE OFFICIAL BRIEFING BODY */}
        <div className="space-y-5 border border-stone-200 rounded-xl p-6 print:border-none print:p-0">
          {/* Government Official Header */}
          <div className="flex items-center justify-between border-b-2 border-stone-800 pb-4">
            <div className="flex items-center gap-3">
              <GovtEmblem className="w-12 h-12 shrink-0" />
              <div>
                <h1 className="text-base font-extrabold text-stone-950 uppercase tracking-tight font-serif">
                  Ministry of Tribal Affairs • Government of India
                </h1>
                <h2 className="text-xs font-bold text-stone-700">
                  National Scheduled Tribe Scholarship &amp; Fellowship Management Directorate
                </h2>
                <p className="text-[10px] text-stone-500 font-mono mt-0.5">
                  Briefing Ref: MoTA/SCH/EXEC-2026/09 • GFR-2017 &amp; DBT Mission Compliant
                </p>
              </div>
            </div>
            <div className="text-right text-[10px] font-mono text-stone-500">
              <div>Date: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              <div>Class: Official Executive Briefing</div>
              <div className="text-emerald-800 font-bold">PFMS Realtime Verified</div>
            </div>
          </div>

          {/* Key Macro KPIs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
              <div className="text-[10px] font-semibold text-stone-500 uppercase">Target ST Cohort</div>
              <div className="text-lg font-bold font-mono text-stone-900 mt-1">24.50 L</div>
              <div className="text-[9px] text-stone-500">Census ST Projection</div>
            </div>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
              <div className="text-[10px] font-semibold text-emerald-800 uppercase">Enrolled Beneficiaries</div>
              <div className="text-lg font-bold font-mono text-emerald-800 mt-1">19.42 L</div>
              <div className="text-[9px] text-emerald-700">+18.4% YoY Growth</div>
            </div>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
              <div className="text-[10px] font-semibold text-stone-500 uppercase">National Saturation</div>
              <div className="text-lg font-bold font-mono text-stone-900 mt-1">79.2%</div>
              <div className="text-[9px] text-amber-700">Target: 85% by Q4</div>
            </div>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
              <div className="text-[10px] font-semibold text-emerald-800 uppercase">Median Turnaround</div>
              <div className="text-lg font-bold font-mono text-emerald-800 mt-1">11 Days</div>
              <div className="text-[9px] text-emerald-700">75% Reduction vs Manual</div>
            </div>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
              <div className="text-[10px] font-semibold text-rose-800 uppercase">Fraud Blocked</div>
              <div className="text-lg font-bold font-mono text-rose-700 mt-1">₹34.8 Cr</div>
              <div className="text-[9px] text-stone-500">412 Shared accounts</div>
            </div>
          </div>

          {/* Executive Insight Summary (What Needs Attention) */}
          <div className="bg-amber-50/70 border border-amber-300 rounded-xl p-4 space-y-2 text-xs">
            <h3 className="font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-amber-800" />
              <span>Key Executive Findings &amp; Intervention Priorities</span>
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-stone-800 leading-relaxed">
              <li>
                <strong>Turnaround Acceleration:</strong> End-to-end processing time from student upload to PFMS bank credit dropped from 44 days (manual baseline) to 11 days with deterministic DigiLocker PKI rules.
              </li>
              <li>
                <strong>PVTG Reach Bottlenecks:</strong> Mayurbhanj (OD) and Dantewada (CG) have a 22% lower reach than state average due to non-digitized hamlets. Mobile saturation vans with PESA 4(d) attestation deployed for October.
              </li>
              <li>
                <strong>Leading Rejection Driver:</strong> 34% of rejections stem from family income exceeding the ₹2.50L / ₹6.00L statutory cap. Policy simulator reveals raising the ceiling to ₹3.00L expands reach by 1.45 Lakh scholars.
              </li>
              <li>
                <strong>NPCI Seeding Mandate:</strong> Aadhaar mapper disconnects represent 28% of disbursement holds. Coordinated campaign with Department of Financial Services (DFS) underway.
              </li>
            </ul>
          </div>

          {/* Two Embedded Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Chart 1: Turnaround Acceleration */}
            <div className="border border-stone-200 rounded-xl p-3 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-xs">Processing Days: Manual vs. Deterministic AI</span>
                <span className="font-mono text-[10px] text-emerald-800 font-bold">11 Days (Current)</span>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={PROCESSING_TIME_TREND_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} domain={[0, 70]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="manualDays" stroke="#94a3b8" strokeWidth={2} name="Manual Legacy Days" />
                    <Line type="monotone" dataKey="aiAssistedDays" stroke="#047857" strokeWidth={2.5} name="A.S.T.R.A Portal Days" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Monthly Budget vs Disbursed */}
            <div className="border border-stone-200 rounded-xl p-3 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-xs">Monthly Grant Disbursal Progress (₹ Crores)</span>
                <span className="font-mono text-[10px] text-emerald-800 font-bold">₹2,995 Cr YTD</span>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MONTHLY_BUDGET_DATA} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="allocatedCr" fill="#cbd5e1" name="Allocated (₹ Cr)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="disbursedCr" fill="#047857" name="Disbursed (₹ Cr)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Official Sign-off Seal */}
          <div className="border-t border-stone-200 pt-4 flex items-center justify-between text-[10px] font-mono text-stone-500">
            <div>
              Generated via A.S.T.R.A Policy Engine • Cryptographic Chain #v2026.04.R1
            </div>
            <div className="text-stone-800 font-bold">
              Director General of Tribal Welfare, Government of India
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
