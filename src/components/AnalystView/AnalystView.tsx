import React, { useState, useMemo } from 'react';
import { 
  STATE_COVERAGE_DATA, 
  REJECTION_REASONS_DATA, 
  PROCESSING_TIME_TREND_DATA, 
  EQUITY_GENDER_REGION_DATA, 
  MONTHLY_BUDGET_DATA, 
  INITIAL_DROPOUT_RISK_STUDENTS, 
  FAIRNESS_MONITOR_METRICS 
} from '../../data/mockAnalystData';
import { DropoutRiskStudent } from '../../types';
import { translations } from '../../locales/translations';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  Sliders, 
  Scale, 
  UserPlus, 
  MapPin, 
  Check, 
  AlertTriangle,
  FileSpreadsheet,
  PieChart as PieIcon,
  Activity,
  Layers,
  ArrowRight,
  Printer,
  Bell,
  Calendar,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid 
} from 'recharts';
import { CampPlannerWidget } from '../CampPlannerWidget';
import { InstituteScorecardTable } from '../InstituteScorecardTable';
import { ScheduledReportsModal } from './ScheduledReportsModal';
import { ExportBriefingModal } from './ExportBriefingModal';
import { AlertRulesModal } from './AlertRulesModal';
import { ContextualHelp } from '../ContextualHelp';
import { useToast } from '../Toast';

interface AnalystViewProps {
  language: 'en' | 'hi';
  onLogAction?: (action: string, targetId: string) => void;
}

export const AnalystView: React.FC<AnalystViewProps> = ({ language, onLogAction }) => {
  const { showToast } = useToast();
  const t = translations[language].analyst;

  // Modals State
  const [isScheduledOpen, setIsScheduledOpen] = useState(false);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [isAlertRulesOpen, setIsAlertRulesOpen] = useState(false);

  // Drilldown Hierarchy State: National -> State -> District -> Institute
  const [drilldownState, setDrilldownState] = useState<string | null>(null);
  const [drilldownDistrict, setDrilldownDistrict] = useState<string | null>(null);

  // Compare Mode State
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [compareDimension, setCompareDimension] = useState<'states' | 'years' | 'schemes'>('states');
  const [compareEntityA, setCompareEntityA] = useState<string>('Odisha');
  const [compareEntityB, setCompareEntityB] = useState<string>('Madhya Pradesh');

  // Dropout Risk Table State
  const [dropoutStudents, setDropoutStudents] = useState<DropoutRiskStudent[]>(INITIAL_DROPOUT_RISK_STUDENTS);
  const [selectedStudentForMentor, setSelectedStudentForMentor] = useState<DropoutRiskStudent | null>(null);
  const [mentorName, setMentorName] = useState<string>('Prof. S. Soren (Tribe Nodal Guide)');

  // Policy Simulator Interactive Sliders
  const [simIncomeCeiling, setSimIncomeCeiling] = useState<number>(250000);
  const [simSeatCap, setSimSeatCap] = useState<number>(100);
  const [simStipendHike, setSimStipendHike] = useState<number>(0);

  // Recomputed simulation numbers
  const simulationResults = useMemo(() => {
    const incomeDeltaFiftyThousands = (simIncomeCeiling - 250000) / 50000;
    const additionalEligibleLakhs = Math.max(0, incomeDeltaFiftyThousands * 1.45);
    const totalEligibleLakhs = Number((24.5 + additionalEligibleLakhs).toFixed(2));

    const baseBudgetCr = 4200;
    const scaledBySeats = baseBudgetCr * (totalEligibleLakhs / 24.5) * (simSeatCap / 100);
    const finalBudgetCr = Math.round(scaledBySeats * (1 + simStipendHike / 100));

    return {
      eligibleLakhs: totalEligibleLakhs,
      budgetCr: finalBudgetCr,
      growthPercent: Math.round(((totalEligibleLakhs - 24.5) / 24.5) * 100)
    };
  }, [simIncomeCeiling, simSeatCap, simStipendHike]);

  // District Mock Data for Drilldown
  const districtDataByState: Record<string, any[]> = {
    'Odisha': [
      { name: 'Mayurbhanj', stPop: 14.8, eligible: 54000, disbursed: 39000, reach: 72.2, pvtg: 'Santhal, Kolha', priority: 'High Priority' },
      { name: 'Koraput', stPop: 11.2, eligible: 42000, disbursed: 31500, reach: 75.0, pvtg: 'Gadaba, Paroja', priority: 'High Priority' },
      { name: 'Malkangiri', stPop: 8.4, eligible: 31000, disbursed: 21000, reach: 67.7, pvtg: 'Bonda, Didayi', priority: 'High Priority' },
      { name: 'Rayagada', stPop: 7.9, eligible: 29000, disbursed: 23200, reach: 80.0, pvtg: 'Dangaria Kandha', priority: 'Moderate' },
      { name: 'Keonjhar', stPop: 9.1, eligible: 34000, disbursed: 28900, reach: 85.0, pvtg: 'Juang', priority: 'Satisfactory' }
    ],
    'Chhattisgarh': [
      { name: 'Dantewada', stPop: 6.4, eligible: 24000, disbursed: 16500, reach: 68.8, pvtg: 'Gond, Maria', priority: 'High Priority' },
      { name: 'Bastar', stPop: 8.9, eligible: 32000, disbursed: 22700, reach: 71.0, pvtg: 'Muria, Halba', priority: 'High Priority' },
      { name: 'Bijapur', stPop: 5.2, eligible: 19000, disbursed: 12100, reach: 63.7, pvtg: 'Abujhmadia', priority: 'High Priority' },
      { name: 'Sukma', stPop: 4.8, eligible: 17500, disbursed: 10800, reach: 61.7, pvtg: 'Dorla', priority: 'High Priority' },
      { name: 'Jashpur', stPop: 7.2, eligible: 27000, disbursed: 22950, reach: 85.0, pvtg: 'Birhor', priority: 'Satisfactory' }
    ],
    'Madhya Pradesh': [
      { name: 'Dindori', stPop: 5.8, eligible: 22000, disbursed: 15400, reach: 70.0, pvtg: 'Baiga', priority: 'High Priority' },
      { name: 'Mandla', stPop: 6.9, eligible: 26000, disbursed: 19500, reach: 75.0, pvtg: 'Gond', priority: 'High Priority' },
      { name: 'Chhindwara', stPop: 8.4, eligible: 31000, disbursed: 24800, reach: 80.0, pvtg: 'Bharia', priority: 'Moderate' }
    ],
    'Jharkhand': [
      { name: 'Khunti', stPop: 5.1, eligible: 19000, disbursed: 15200, reach: 80.0, pvtg: 'Munda, Birhor', priority: 'High Priority' },
      { name: 'West Singhbhum', stPop: 10.2, eligible: 38000, disbursed: 31920, reach: 84.0, pvtg: 'Ho', priority: 'Moderate' }
    ]
  };

  // Institute Mock Data for District Drilldown
  const instituteDataByDistrict: Record<string, any[]> = {
    'Mayurbhanj': [
      { name: 'Maharaja Sriram Chandra Bhanja Deo University, Baripada', code: 'UNIV-MBJ-01', total: 1420, verified: 1380, uc: 98, status: 'Exemplary' },
      { name: 'Karanjia Autonomous College, Karanjia', code: 'COL-MBJ-02', total: 890, verified: 820, uc: 92, status: 'Satisfactory' },
      { name: 'Rairangpur Government Polytechnic', code: 'POLY-MBJ-03', total: 430, verified: 390, uc: 88, status: 'Satisfactory' }
    ],
    'Dantewada': [
      { name: 'Govt. Danteshwari Post Graduate College, Dantewada', code: 'COL-DTW-01', total: 950, verified: 910, uc: 95, status: 'Exemplary' },
      { name: 'NMDC Industrial Training Institute, Bacheli', code: 'ITI-DTW-02', total: 620, verified: 590, uc: 94, status: 'Exemplary' },
      { name: 'Model Eklavya Residential School, Kuakonda', code: 'EMRS-DTW-03', total: 310, verified: 285, uc: 91, status: 'Satisfactory' }
    ]
  };

  // Auto-Generated 5 Executive Insights (What Needs Attention)
  const attentionInsights = [
    {
      id: 'ins-1',
      title: 'District Saturation Lag',
      highlight: 'Mayurbhanj (OD) & Dantewada (CG) have 22% lower reach than state averages.',
      explanation: 'Remote forest hamlets lack digitized revenue records, delaying standard DigiLocker PKI verification.',
      targetSection: 'state-coverage-section',
      actionLabel: 'View State & District Breakdown →',
      onAction: () => {
        setDrilldownState('Odisha');
        const el = document.getElementById('state-coverage-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'ins-2',
      title: 'Rising Rejection Driver',
      highlight: 'Family income ceiling breach is the #1 rejection cause (34% of rejections, 3,420 files).',
      explanation: 'Inflation in nominal tribal wages has pushed students past the ₹2.50L cap without real wealth gains.',
      targetSection: 'rejections-chart-section',
      actionLabel: 'Inspect Rejection Breakdown & Simulate Ceilings →',
      onAction: () => {
        const el = document.getElementById('policy-simulator-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'ins-3',
      title: 'Slowest Scrutiny Stage',
      highlight: 'District Nodal Desk turnaround averages 8.4 days vs 2.1 days at Institute Desks.',
      explanation: 'Staff vacancies at district welfare offices create a bottleneck before state-level sanction.',
      targetSection: 'turnaround-trend-section',
      actionLabel: 'Analyze Stage Turnaround Acceleration →',
      onAction: () => {
        const el = document.getElementById('turnaround-trend-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'ins-4',
      title: 'Aadhaar NPCI Mapper Hold',
      highlight: '28% of disbursement holds are driven by bank account Aadhaar disconnects.',
      explanation: 'Disbursal ready via PFMS but rejected by bank gateway due to dormant student accounts.',
      targetSection: 'rejections-chart-section',
      actionLabel: 'Review Bank Seeding Error Share →',
      onAction: () => {
        const el = document.getElementById('rejections-chart-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'ins-5',
      title: 'PVTG Saturation Acceleration',
      highlight: 'Special mobile saturation camps improved female ST participation by 14% in pilot blocks.',
      explanation: 'VLE mobile vans in Bonda and Baiga belts succeeded in capturing on-the-spot biometric eKYC.',
      targetSection: 'camp-planner-section',
      actionLabel: 'Open District Saturation Camp Planner →',
      onAction: () => {
        const el = document.getElementById('camp-planner-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  ];

  // Compare Mode Data Generator
  const compareData = useMemo(() => {
    if (compareDimension === 'states') {
      const stateA = STATE_COVERAGE_DATA.find(s => s.state === compareEntityA) || STATE_COVERAGE_DATA[0];
      const stateB = STATE_COVERAGE_DATA.find(s => s.state === compareEntityB) || STATE_COVERAGE_DATA[1];
      return {
        labelA: stateA.state,
        labelB: stateB.state,
        kpi1: { label: 'ST Population', a: `${stateA.stPopulationLakhs} L`, b: `${stateB.stPopulationLakhs} L` },
        kpi2: { label: 'Disbursed Beneficiaries', a: `${(stateA.disbursedStudents / 100000).toFixed(2)} L`, b: `${(stateB.disbursedStudents / 100000).toFixed(2)} L` },
        kpi3: { label: 'Reach Rate', a: `${stateA.reachPercentage}%`, b: `${stateB.reachPercentage}%` },
        chartData: [
          { metric: 'Reach %', [stateA.state]: stateA.reachPercentage, [stateB.state]: stateB.reachPercentage },
          { metric: 'Eligible (x10k)', [stateA.state]: Math.round(stateA.estimatedEligibleStudents / 10000), [stateB.state]: Math.round(stateB.estimatedEligibleStudents / 10000) },
          { metric: 'Disbursed (x10k)', [stateA.state]: Math.round(stateA.disbursedStudents / 10000), [stateB.state]: Math.round(stateB.disbursedStudents / 10000) }
        ]
      };
    } else if (compareDimension === 'years') {
      return {
        labelA: 'FY 2025-26',
        labelB: 'FY 2026-27 (Current)',
        kpi1: { label: 'Total Disbursed', a: '16.40 L Students', b: '19.42 L Students (+18.4%)' },
        kpi2: { label: 'Turnaround Time', a: '44 Days (Manual)', b: '11 Days (AI Assisted)' },
        kpi3: { label: 'Fraud Blocked', a: '₹12.2 Crores', b: '₹34.8 Crores' },
        chartData: [
          { metric: 'Turnaround (Days)', 'FY 2025-26': 44, 'FY 2026-27 (Current)': 11 },
          { metric: 'Saturation %', 'FY 2025-26': 67, 'FY 2026-27 (Current)': 79.2 },
          { metric: 'Disbursed (Lakhs)', 'FY 2025-26': 16.4, 'FY 2026-27 (Current)': 19.42 }
        ]
      };
    } else {
      return {
        labelA: 'Top Class ST Education',
        labelB: 'National Fellowship (NFHET)',
        kpi1: { label: 'Income Ceiling', a: '₹6.00 Lakhs', b: '₹6.00 Lakhs' },
        kpi2: { label: 'Annual Slots', a: 'Notified Top Institutes', b: '750 Fresh Merit Slots' },
        kpi3: { label: 'Turnaround', a: '9 Days', b: '14 Days' },
        chartData: [
          { metric: 'Approval %', 'Top Class ST Education': 94, 'National Fellowship (NFHET)': 88 },
          { metric: 'Turnaround (d)', 'Top Class ST Education': 9, 'National Fellowship (NFHET)': 14 },
          { metric: 'UC Compliance %', 'Top Class ST Education': 96, 'National Fellowship (NFHET)': 91 }
        ]
      };
    }
  }, [compareDimension, compareEntityA, compareEntityB]);

  return (
    <div className="space-y-6">
      {/* Top Header Info with Action Buttons */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-indigo-100 text-indigo-950 px-2 py-0.5 rounded">
                MoTA National Command
              </span>
              <span className="text-xs text-stone-500 font-medium">
                Direct Benefit Transfer (DBT) Macro Analytics
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 mt-1">
              {t.title}
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              {t.subtitle}
            </p>
          </div>

          {/* Action Buttons: Export Briefing, Scheduled Reports, Alert Rules */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsBriefingOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export Briefing</span>
            </button>

            <button
              type="button"
              onClick={() => setIsScheduledOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-stone-600" />
              <span>Scheduled Reports</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAlertRulesOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Bell className="w-3.5 h-3.5 text-amber-600" />
              <span>Alert Rules</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. "WHAT NEEDS ATTENTION" PANEL AT TOP OF NATIONAL OVERVIEW */}
      <div className="bg-gradient-to-br from-indigo-950 to-stone-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-indigo-900 space-y-4">
        <div className="flex items-center justify-between border-b border-indigo-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                What Needs Attention: National Executive Insights
              </h3>
              <p className="text-[11px] text-indigo-300">
                Auto-generated statutory signals computed dynamically from live portal and PFMS ledger streams.
              </p>
            </div>
          </div>
          <span className="font-mono text-[10px] font-bold bg-indigo-900 text-indigo-200 px-2.5 py-1 rounded-full border border-indigo-800">
            5 Critical Signals Active
          </span>
        </div>

        {/* 5 Insight Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          {attentionInsights.map((ins, idx) => (
            <div
              key={ins.id}
              className={`p-3.5 rounded-xl border backdrop-blur-xs flex flex-col justify-between space-y-2.5 transition-all ${
                idx === 0 
                  ? 'bg-amber-950/60 border-amber-600/60' 
                  : idx === 1 
                  ? 'bg-rose-950/60 border-rose-600/60' 
                  : 'bg-white/10 border-white/10'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">
                    {ins.title}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                </div>
                <div className="font-bold text-stone-100 text-xs leading-snug">
                  {ins.highlight}
                </div>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  {ins.explanation}
                </p>
              </div>

              <button
                type="button"
                onClick={ins.onAction}
                className="text-amber-300 hover:text-amber-200 font-bold text-[11px] flex items-center gap-1 cursor-pointer pt-1 self-start"
              >
                <span>{ins.actionLabel}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 6 Macro KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-stone-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 block truncate">{t.kpiEligible}</span>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1">24.50 L</div>
          <span className="text-[10px] text-stone-500">Census 2026 ST Youth</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 block truncate">{t.kpiApplied}</span>
          <div className="text-xl font-bold font-mono text-emerald-800 mt-1">19.42 L</div>
          <span className="text-[10px] text-emerald-700 font-semibold">+18.4% vs FY 2025</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 block truncate">{t.kpiReach}</span>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1">79.2%</div>
          <span className="text-[10px] text-amber-700 font-semibold">Goal: 85% by Q4</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 block truncate">{t.kpiDaysToCredit}</span>
          <div className="text-xl font-bold font-mono text-emerald-800 mt-1">11 Days</div>
          <span className="text-[10px] text-emerald-700 font-semibold">Down from 44 days</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 block truncate">{t.kpiRejectionRate}</span>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1">4.8%</div>
          <span className="text-[10px] text-stone-500">Primarily income cap</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 block truncate">Fraud Blocked</span>
          <div className="text-xl font-bold font-mono text-red-700 mt-1">₹34.8 Cr</div>
          <span className="text-[10px] text-red-600 font-semibold">412 Shared accounts</span>
        </div>
      </div>

      {/* 3. COMPARE MODE TOGGLE & PANEL */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-900" />
            <div>
              <h3 className="font-bold text-stone-900 text-sm">
                Dual Cohort Comparative Analytics
              </h3>
              <p className="text-[11px] text-stone-500">
                Overlay two states, two financial years, or two schemes on synchronized charts.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCompareMode(!isCompareMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isCompareMode 
                ? 'bg-indigo-900 text-white shadow-xs' 
                : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
            }`}
          >
            {isCompareMode ? 'Compare Mode: Active' : 'Toggle Compare Mode'}
          </button>
        </div>

        {isCompareMode && (
          <div className="space-y-4 animate-in fade-in">
            {/* Dimension Selection */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-stone-700">Compare By:</span>
              <div className="flex rounded-lg border border-stone-300 p-0.5 bg-stone-50 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCompareDimension('states')}
                  className={`px-3 py-1 rounded-md transition-colors ${compareDimension === 'states' ? 'bg-indigo-900 text-white' : 'text-stone-700'}`}
                >
                  Two States
                </button>
                <button
                  type="button"
                  onClick={() => setCompareDimension('years')}
                  className={`px-3 py-1 rounded-md transition-colors ${compareDimension === 'years' ? 'bg-indigo-900 text-white' : 'text-stone-700'}`}
                >
                  Two Years
                </button>
                <button
                  type="button"
                  onClick={() => setCompareDimension('schemes')}
                  className={`px-3 py-1 rounded-md transition-colors ${compareDimension === 'schemes' ? 'bg-indigo-900 text-white' : 'text-stone-700'}`}
                >
                  Two Schemes
                </button>
              </div>

              {compareDimension === 'states' && (
                <div className="flex items-center gap-2 text-xs">
                  <select
                    value={compareEntityA}
                    onChange={(e) => setCompareEntityA(e.target.value)}
                    className="p-1.5 rounded border border-stone-300 bg-white font-bold text-stone-800"
                  >
                    {STATE_COVERAGE_DATA.map(s => <option key={s.code} value={s.state}>{s.state}</option>)}
                  </select>
                  <span className="text-stone-400 font-bold">vs</span>
                  <select
                    value={compareEntityB}
                    onChange={(e) => setCompareEntityB(e.target.value)}
                    className="p-1.5 rounded border border-stone-300 bg-white font-bold text-stone-800"
                  >
                    {STATE_COVERAGE_DATA.map(s => <option key={s.code} value={s.state}>{s.state}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Comparative KPI & Recharts Bar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
              <div className="lg:col-span-4 space-y-2 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <div className="text-[10px] text-stone-500 uppercase font-bold">{compareData.kpi1.label}</div>
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <div>
                      <span className="text-[10px] text-stone-500 block truncate">{compareData.labelA}:</span>
                      <span className="font-mono font-bold text-stone-900 text-sm">{compareData.kpi1.a}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block truncate">{compareData.labelB}:</span>
                      <span className="font-mono font-bold text-indigo-900 text-sm">{compareData.kpi1.b}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <div className="text-[10px] text-stone-500 uppercase font-bold">{compareData.kpi2.label}</div>
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <div>
                      <span className="text-[10px] text-stone-500 block truncate">{compareData.labelA}:</span>
                      <span className="font-mono font-bold text-stone-900 text-sm">{compareData.kpi2.a}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block truncate">{compareData.labelB}:</span>
                      <span className="font-mono font-bold text-indigo-900 text-sm">{compareData.kpi2.b}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <div className="text-[10px] text-stone-500 uppercase font-bold">{compareData.kpi3.label}</div>
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <div>
                      <span className="text-[10px] text-stone-500 block truncate">{compareData.labelA}:</span>
                      <span className="font-mono font-bold text-stone-900 text-sm">{compareData.kpi3.a}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block truncate">{compareData.labelB}:</span>
                      <span className="font-mono font-bold text-indigo-900 text-sm">{compareData.kpi3.b}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 bg-stone-50 rounded-xl border border-stone-200 p-4">
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={compareData.chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey={compareData.labelA} fill="#047857" radius={[4, 4, 0, 0]} />
                      <Bar dataKey={compareData.labelB} fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. STATE -> DISTRICT -> INSTITUTE DRILL-DOWN HIERARCHY */}
      <div id="state-coverage-section" className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
        {/* Breadcrumb Navigation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
          <div className="space-y-1">
            {/* Interactive Breadcrumb Bar */}
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
              <button
                type="button"
                onClick={() => {
                  setDrilldownState(null);
                  setDrilldownDistrict(null);
                }}
                className={`hover:underline cursor-pointer ${!drilldownState ? 'font-bold text-stone-900' : 'text-indigo-900'}`}
              >
                All 28 States &amp; UTs
              </button>

              {drilldownState && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  <button
                    type="button"
                    onClick={() => setDrilldownDistrict(null)}
                    className={`hover:underline cursor-pointer ${drilldownState && !drilldownDistrict ? 'font-bold text-stone-900' : 'text-indigo-900'}`}
                  >
                    State: {drilldownState}
                  </button>
                </>
              )}

              {drilldownDistrict && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  <span className="font-bold text-stone-900">
                    District: {drilldownDistrict}
                  </span>
                </>
              )}
            </div>

            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>
                {!drilldownState 
                  ? 'State-by-State India Coverage (Click any State to Drill-Down)' 
                  : !drilldownDistrict
                  ? `Districts in ${drilldownState} (Click any District to Drill-Down)`
                  : `Institutions in ${drilldownDistrict}, ${drilldownState}`}
              </span>
            </h3>
          </div>

          {drilldownState && (
            <button
              type="button"
              onClick={() => {
                if (drilldownDistrict) setDrilldownDistrict(null);
                else setDrilldownState(null);
              }}
              className="px-3 py-1 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-1 self-start sm:self-center cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back one level</span>
            </button>
          )}
        </div>

        {/* Level 1: All States Table */}
        {!drilldownState && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100 text-stone-700 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-200">
                  <th className="py-2.5 px-3">State / Region (Click to Drill)</th>
                  <th className="py-2.5 px-3">ST Pop (Lakhs)</th>
                  <th className="py-2.5 px-3">Estimated Eligible</th>
                  <th className="py-2.5 px-3">Enrolled Beneficiaries</th>
                  <th className="py-2.5 px-3">Reach Rate</th>
                  <th className="py-2.5 px-3">Priority PVTG Districts</th>
                  <th className="py-2.5 px-3 text-right">Drill Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {STATE_COVERAGE_DATA.map((item) => (
                  <tr
                    key={item.code}
                    onClick={() => setDrilldownState(item.state)}
                    className="hover:bg-indigo-50/60 cursor-pointer transition-colors group"
                  >
                    <td className="py-2.5 px-3 font-bold text-stone-900 flex items-center gap-1.5 group-hover:text-indigo-900">
                      <span className="w-2 h-2 rounded-full bg-emerald-700 group-hover:bg-indigo-700" />
                      <span>{item.state}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-stone-700">{item.stPopulationLakhs} L</td>
                    <td className="py-2.5 px-3 font-mono text-stone-800">{(item.estimatedEligibleStudents / 100000).toFixed(2)} L</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-900">{(item.disbursedStudents / 100000).toFixed(2)} L</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-stone-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-700 h-full rounded-full" style={{ width: `${item.reachPercentage}%` }} />
                        </div>
                        <span className="font-mono font-bold text-stone-800">{item.reachPercentage}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {item.pvtgDistricts.map((d, dIdx) => (
                          <span key={dIdx} className="text-[10px] bg-purple-50 text-purple-900 border border-purple-200 px-1.5 py-0.2 rounded font-medium">
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="text-xs font-bold text-indigo-900 group-hover:underline flex items-center justify-end gap-1">
                        <span>Districts</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Level 2: District View for Selected State */}
        {drilldownState && !drilldownDistrict && (
          <div className="space-y-3 animate-in fade-in">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-950">
                Drill-down active for {drilldownState}. Click any district below to inspect enrolled universities and colleges.
              </span>
              <span className="text-[10px] font-mono text-indigo-800">5 Monitored Districts</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-200">
                    <th className="py-2.5 px-3">District Name</th>
                    <th className="py-2.5 px-3">ST Pop (Lakhs)</th>
                    <th className="py-2.5 px-3">Eligible Cohort</th>
                    <th className="py-2.5 px-3">Enrolled</th>
                    <th className="py-2.5 px-3">Reach Rate</th>
                    <th className="py-2.5 px-3">PVTG Communities</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {(districtDataByState[drilldownState] || districtDataByState['Odisha']).map((dist, idx) => (
                    <tr
                      key={idx}
                      onClick={() => setDrilldownDistrict(dist.name)}
                      className="hover:bg-indigo-50/60 cursor-pointer transition-colors group"
                    >
                      <td className="py-2.5 px-3 font-bold text-stone-900 group-hover:text-indigo-900">
                        {dist.name}
                      </td>
                      <td className="py-2.5 px-3 font-mono">{dist.stPop} L</td>
                      <td className="py-2.5 px-3 font-mono">{dist.eligible.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">{dist.disbursed.toLocaleString()}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-mono font-bold text-stone-800">{dist.reach}%</span>
                      </td>
                      <td className="py-2.5 px-3 text-purple-900 font-medium">{dist.pvtg}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="text-xs font-bold text-indigo-900 group-hover:underline flex items-center justify-end gap-1">
                          <span>Institutes</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Level 3: Institute View for Selected District */}
        {drilldownDistrict && (
          <div className="space-y-3 animate-in fade-in">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-950">
                Institutional Scrutiny &amp; Utilization Compliance in {drilldownDistrict}, {drilldownState}.
              </span>
              <span className="text-[10px] font-mono text-emerald-800">Audited via AISHE</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-200">
                    <th className="py-2.5 px-3">Institute / University</th>
                    <th className="py-2.5 px-3">AISHE Code</th>
                    <th className="py-2.5 px-3 text-right">Total Applied</th>
                    <th className="py-2.5 px-3 text-right">Officer Verified</th>
                    <th className="py-2.5 px-3 text-center">UC Compliance</th>
                    <th className="py-2.5 px-3 text-right">GFR Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {(instituteDataByDistrict[drilldownDistrict] || instituteDataByDistrict['Mayurbhanj']).map((inst, idx) => (
                    <tr key={idx} className="hover:bg-stone-50 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-stone-900">{inst.name}</td>
                      <td className="py-2.5 px-3 font-mono text-stone-500">{inst.code}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{inst.total}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">{inst.verified}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">{inst.uc}%</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                          {inst.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* TOP 5 DISTRICT ENROLLMENT & DBT BANK-SEEDING CAMP PLANNER */}
      <div id="camp-planner-section">
        <CampPlannerWidget language={language} onLogAction={onLogAction} />
      </div>

      {/* RANKED INSTITUTIONAL VERIFICATION & UC COMPLIANCE SCORECARD */}
      <InstituteScorecardTable language={language} userRole="analyst" onIssueNotice={(inst) => onLogAction && onLogAction('MINISTRY_DISPATCHED_INSTITUTE_NOTICE', inst)} />

      {/* 4 RECHARTS CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Processing Time Trend */}
        <div id="turnaround-trend-section" className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>Turnaround Acceleration: Manual vs. AI-Assisted (Days)</span>
            </h4>
            <span className="text-[11px] font-mono text-emerald-800 font-bold">
              Current: 11 Days
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PROCESSING_TIME_TREND_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis unit="d" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: 8, fontSize: 12, border: '1px solid #e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="manualDays" name="Legacy Manual Review" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" />
                <Line type="monotone" dataKey="aiAssistedDays" name="A.S.T.R.A AI-Assisted" stroke="#047857" strokeWidth={3} />
                <Line type="monotone" dataKey="slaTarget" name="Statutory SLA Target (30d)" stroke="#f59e0b" strokeWidth={1.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Rejection Reasons Breakdown */}
        <div id="rejections-chart-section" className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <PieIcon className="w-4 h-4 text-amber-600" />
              <span>Categorical Rejection Reasons Breakdown</span>
            </h4>
            <span className="text-[11px] font-mono text-stone-500">
              Total Ineligible: 10,050 Files
            </span>
          </div>

          <div className="h-64 w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={REJECTION_REASONS_DATA} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" unit="%" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any) => [`${val}% of total queries`, 'Frequency']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: 8, fontSize: 12, border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="percent" fill="#047857" radius={[0, 4, 4, 0]}>
                  {REJECTION_REASONS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Approval Rate by Gender & Region */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-purple-700" />
              <span>Equity &amp; Inclusion Audit: Approval Rate by Gender &amp; Region (%)</span>
            </h4>
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
              Zero Gender Gap
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={EQUITY_GENDER_REGION_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="region" tick={{ fontSize: 10 }} />
                <YAxis unit="%" domain={[60, 100]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: 8, fontSize: 12, border: '1px solid #e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="maleRate" name="Male ST" fill="#0284c7" radius={[3, 3, 0, 0]} />
                <Bar dataKey="femaleRate" name="Female ST" fill="#ec4899" radius={[3, 3, 0, 0]} />
                <Bar dataKey="transRate" name="Transgender ST" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Monthly Budget Utilization */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              <span>Monthly PFMS Budget Allocation vs. Real Disbursed (₹ Cr)</span>
            </h4>
            <span className="text-[11px] font-mono text-emerald-800 font-bold">
              Cumulative: ₹2,995 Cr Disbursed
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_BUDGET_DATA} margin={{ top: 10, right: 20, left: -5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis unit="Cr" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`₹${val} Crores`, 'Amount']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: 8, fontSize: 12, border: '1px solid #e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="allocatedCr" name="MoTA Budget Allocated" fill="#cbd5e1" radius={[3, 3, 0, 0]} />
                <Bar dataKey="disbursedCr" name="Direct Beneficiary Credit" fill="#047857" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* POLICY SIMULATOR INTERACTIVE SLIDERS */}
      <div id="policy-simulator-section" className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-900" />
              <span>{t.simulatorTitle}</span>
            </h3>
            <p className="text-xs text-stone-500">
              Model fiscal impact and beneficiary expansion by shifting statutory ceilings and stipends.
            </p>
          </div>
          <span className="text-[10px] font-mono bg-indigo-50 text-indigo-900 px-2 py-0.5 rounded font-bold border border-indigo-200">
            Interactive Policy Sandbox
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Sliders Column */}
          <div className="lg:col-span-2 space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-stone-700">Annual Family Income Ceiling:</span>
                <span className="font-mono text-emerald-800">₹{(simIncomeCeiling / 100000).toFixed(2)} Lakhs</span>
              </div>
              <input
                type="range"
                min={250000}
                max={800000}
                step={50000}
                value={simIncomeCeiling}
                onChange={(e) => setSimIncomeCeiling(Number(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>₹2.50L (Statutory Baseline)</span>
                <span>₹5.00L</span>
                <span>₹8.00L (OBC/EWS Parity)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-stone-700">Seat Cap / Cohort Target Multiplier:</span>
                <span className="font-mono text-indigo-900">{simSeatCap}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={200}
                step={10}
                value={simSeatCap}
                onChange={(e) => setSimSeatCap(Number(e.target.value))}
                className="w-full accent-indigo-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>50%</span>
                <span>100% (Baseline)</span>
                <span>200% (Double Enrollment)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-stone-700">Monthly Stipend Allowance Adjustment:</span>
                <span className="font-mono text-amber-700">+{simStipendHike}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                step={5}
                value={simStipendHike}
                onChange={(e) => setSimStipendHike(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>0% (Status Quo)</span>
                <span>+25%</span>
                <span>+50% (Cost-of-Living Index)</span>
              </div>
            </div>
          </div>

          {/* Simulation Output Card */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                Simulated Outcome Projection
              </span>

              <div className="border-b border-stone-200 pb-2">
                <div className="text-xs text-stone-600">Projected Eligible Scholars:</div>
                <div className="text-xl font-bold font-mono text-emerald-800 mt-0.5">
                  {simulationResults.eligibleLakhs} Lakhs
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold">
                  +{simulationResults.growthPercent}% expansion
                </div>
              </div>

              <div>
                <div className="text-xs text-stone-600">Estimated Annual MoTA Budget:</div>
                <div className="text-xl font-bold font-mono text-stone-900 mt-0.5">
                  ₹{simulationResults.budgetCr} Crores
                </div>
                <div className="text-[10px] text-stone-500">
                  Includes full tuition fees + monthly allowances
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSimIncomeCeiling(250000);
                setSimSeatCap(100);
                setSimStipendHike(0);
              }}
              className="text-[11px] font-bold text-stone-600 hover:text-stone-900 underline text-center cursor-pointer"
            >
              Reset to Baseline
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ScheduledReportsModal
        isOpen={isScheduledOpen}
        onClose={() => setIsScheduledOpen(false)}
        language={language}
      />

      <ExportBriefingModal
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
        language={language}
      />

      <AlertRulesModal
        isOpen={isAlertRulesOpen}
        onClose={() => setIsAlertRulesOpen(false)}
        language={language}
        onAlertTriggered={(title, msg) => {
          showToast(`${title}: ${msg}`, 'warning', 'Alert Rule Breached');
        }}
      />
    </div>
  );
};
