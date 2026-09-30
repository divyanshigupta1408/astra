import React, { useState } from 'react';
import { INITIAL_CAMP_PLANNER_DATA } from '../data/mockCampData';
import { CampPlannerItem } from '../types';
import { 
  Tent, 
  MapPin, 
  Calendar, 
  Users, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { useToast } from './Toast';

interface CampPlannerWidgetProps {
  language: 'en' | 'hi';
  onLogAction?: (action: string, targetId: string) => void;
}

export const CampPlannerWidget: React.FC<CampPlannerWidgetProps> = ({
  language,
  onLogAction
}) => {
  const { showToast } = useToast();
  const [camps, setCamps] = useState<CampPlannerItem[]>(INITIAL_CAMP_PLANNER_DATA);
  const [recentSanction, setRecentSanction] = useState<string | null>(null);

  const handleApproveCamp = (campId: string) => {
    setCamps(prev => prev.map(c => {
      if (c.id === campId) {
        return {
          ...c,
          approved: true
        };
      }
      return c;
    }));

    const targeted = camps.find(c => c.id === campId);
    if (targeted) {
      const msg = `Sanction Order ${targeted.sanctionOrderNumber} generated for ${targeted.district}. Mobile VLE units dispatched.`;
      setRecentSanction(msg);
      showToast(msg, 'success', 'Saturation Camp Sanctioned');
      setTimeout(() => setRecentSanction(null), 6000);
      if (onLogAction) {
        onLogAction('MINISTRY_SANCTIONED_FIELD_CAMP', targeted.id);
      }
    }
  };

  const handleApproveAll = () => {
    setCamps(prev => prev.map(c => ({ ...c, approved: true })));
    const msg = 'Bulk Sanction Order (MoTA/CAMPS/2026/ALL-5) approved. 14 Mobile VLE units scheduled.';
    setRecentSanction(msg);
    showToast(msg, 'success', 'All 5 Camps Sanctioned');
    setTimeout(() => setRecentSanction(null), 6000);
    if (onLogAction) {
      onLogAction('MINISTRY_BULK_SANCTIONED_CAMPS', 'ALL-5-DISTRICTS');
    }
  };

  const totalReachable = camps.reduce((acc, curr) => acc + curr.estimatedReachable, 0);
  const totalApproved = camps.filter(c => c.approved).length;

  return (
    <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-4">
      {/* Header and Summary Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <Tent className="w-5 h-5 text-emerald-800" />
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              {language === 'hi' 
                ? 'विशेष नामांकन एवं बैंक-सीडिंग शिविर योजनाकार (Camp Planner)' 
                : 'District Enrollment & DBT Bank-Seeding Camp Planner'}
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {language === 'hi'
              ? 'पात्रता एवं पहुंच अंतर (Reach Gap) के आधार पर शीर्ष 5 उच्च-प्राथमिकता जनजातीय जिलों हेतु मोबाइल शिविर'
              : 'Targeted saturation drive for the top 5 highest-gap tribal districts, addressing offline certification and NPCI mapper bottlenecks'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] text-stone-500 uppercase font-semibold block">Target Reachable</span>
            <span className="text-sm font-mono font-bold text-emerald-800">{totalReachable.toLocaleString()} Students</span>
          </div>
          <button
            type="button"
            onClick={handleApproveAll}
            disabled={totalApproved === camps.length}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              totalApproved === camps.length
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                : 'bg-emerald-900 hover:bg-emerald-950 text-white shadow-2xs'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{totalApproved === camps.length ? 'All Camps Sanctioned' : 'Approve All 5 Camps'}</span>
          </button>
        </div>
      </div>

      {recentSanction && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 px-4 py-2.5 rounded-lg text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{recentSanction}</span>
          </div>
          <span className="font-mono text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">
            DBT Mission Alert
          </span>
        </div>
      )}

      {/* 5 Priority Camp Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {camps.map((camp, idx) => (
          <div 
            key={camp.id}
            className={`rounded-lg border p-4 transition-all flex flex-col justify-between ${
              camp.approved 
                ? 'bg-emerald-50/50 border-emerald-300 shadow-2xs' 
                : 'bg-stone-50/80 border-stone-200 hover:border-emerald-400 hover:bg-white shadow-xs'
            }`}
          >
            <div className="space-y-3">
              {/* Card Top: Rank & Location */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                      Priority #{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono text-stone-500 font-semibold">
                      {camp.state}
                    </span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{camp.district}</span>
                  </h4>
                </div>

                {camp.approved ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    <span>Approved ✓</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                    Awaiting Sanction
                  </span>
                )}
              </div>

              {/* Reach Gap & Target */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded border border-stone-200">
                <div>
                  <span className="text-[10px] text-stone-500 block">Eligible Gap:</span>
                  <span className="font-mono font-bold text-red-700 text-sm">{camp.gapStudents.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block">Est. Reachable:</span>
                  <span className="font-mono font-bold text-emerald-800 text-sm">{camp.estimatedReachable.toLocaleString()}</span>
                </div>
              </div>

              {/* Barrier and PVTGs */}
              <div className="text-xs space-y-1.5">
                <div>
                  <span className="text-[10px] text-stone-500 block font-semibold">Primary Bottleneck:</span>
                  <p className="text-[11px] text-stone-700 font-medium">
                    {camp.primaryBarrier}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-stone-500 block font-semibold">Target Communities:</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {camp.targetPVTGs.map((tribe, tIdx) => (
                      <span key={tIdx} className="text-[10px] bg-stone-200/80 text-stone-800 px-1.5 py-0.2 rounded font-medium">
                        {tribe}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Logistics & Date */}
              <div className="pt-2 border-t border-stone-200/80 text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span className="font-medium">Dates: <strong>{camp.suggestedDateRange}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-700">
                  <Truck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Deployment: <strong>{camp.mobileVanUnits} Mobile VLE Tech Vans</strong></span>
                </div>
              </div>
            </div>

            {/* Approval Action */}
            <div className="mt-4 pt-3 border-t border-stone-200">
              {camp.approved ? (
                <div className="bg-emerald-100/70 border border-emerald-300 rounded p-2 text-center text-xs text-emerald-950 font-medium">
                  <div className="font-mono font-bold text-[10px] text-emerald-900">{camp.sanctionOrderNumber}</div>
                  <span className="text-[11px]">Sanction Order Dispatched to District Collector</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleApproveCamp(camp.id)}
                  className="w-full py-2 px-3 rounded bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Approve Camp</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
