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
  Layers
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

interface AnalystViewProps {
  language: 'en' | 'hi';
  onLogAction?: (action: string, targetId: string) => void;
}

export const AnalystView: React.FC<AnalystViewProps> = ({ language, onLogAction }) => {
  const t = translations[language].analyst;

  // Dropout Risk Table State
  const [dropoutStudents, setDropoutStudents] = useState<DropoutRiskStudent[]>(INITIAL_DROPOUT_RISK_STUDENTS);
  const [selectedStudentForMentor, setSelectedStudentForMentor] = useState<DropoutRiskStudent | null>(null);
  const [mentorName, setMentorName] = useState<string>('Prof. S. Soren (Tribe Nodal Guide)');

  // Policy Simulator Interactive Sliders
  // Baseline: Income Ceiling = ₹2.50 Lakh, Seat Cap / Beneficiary Multiplier = 100%
  const [simIncomeCeiling, setSimIncomeCeiling] = useState<number>(250000); // 2.5L to 8.0L
  const [simSeatCap, setSimSeatCap] = useState<number>(100); // 50% to 200%
  const [simStipendHike, setSimStipendHike] = useState<number>(0); // 0% to 50% hike

  // Recomputed simulation numbers
  const simulationResults = useMemo(() => {
    // Base eligible: 24.5 Lakh students at 2.5L
    // For every 50k increase in income, ~1.4 Lakh more ST students become eligible
    const incomeDeltaFiftyThousands = (simIncomeCeiling - 250000) / 50000;
    const additionalEligibleLakhs = Math.max(0, incomeDeltaFiftyThousands * 1.45);
    const totalEligibleLakhs = Number((24.5 + additionalEligibleLakhs).toFixed(2));

    // Base budget needed: ~₹4,200 Crores
    const baseBudgetCr = 4200;
    const scaledBySeats = baseBudgetCr * (totalEligibleLakhs / 24.5) * (simSeatCap / 100);
    const finalBudgetCr = Math.round(scaledBySeats * (1 + simStipendHike / 100));

    return {
      eligibleLakhs: totalEligibleLakhs,
      budgetCr: finalBudgetCr,
      growthPercent: Math.round(((totalEligibleLakhs - 24.5) / 24.5) * 100)
    };
  }, [simIncomeCeiling, simSeatCap, simStipendHike]);

  // Handle Mentor Assignment
  const handleAssignMentor = (studentId: string) => {
    setDropoutStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, mentorAssigned: mentorName };
      }
      return s;
    }));
    setSelectedStudentForMentor(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                Desk: Ministry Policy & Welfare Analyst
              </span>
              <span className="text-xs text-stone-500 font-medium">
                National Direct Benefit Transfer (DBT) Analytics
              </span>
            </div>
            <h2 className="text-base font-bold text-stone-900 mt-1">
              {t.title}
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              {t.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
            <span>Fiscal Year 2026-27</span>
            <span>•</span>
            <span className="text-emerald-800 font-bold">PFMS Realtime Sync Active</span>
          </div>
        </div>
      </div>

      {/* 6 Macro KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1 */}
        <div className="bg-white border border-stone-200 rounded-lg p-3.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 block truncate">
            {t.kpiEligible}
          </span>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1">
            24.50 L
          </div>
          <span className="text-[10px] text-stone-500">Census 2026 ST Youth Projection</span>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-stone-200 rounded-lg p-3.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 block truncate">
            {t.kpiApplied}
          </span>
          <div className="text-xl font-bold font-mono text-emerald-800 mt-1">
            19.42 L
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold">+18.4% vs FY 2025</span>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-stone-200 rounded-lg p-3.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 block truncate">
            {t.kpiReach}
          </span>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1">
            79.2%
          </div>
          <span className="text-[10px] text-amber-700 font-semibold">Goal: 85% by Q4</span>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-stone-200 rounded-lg p-3.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 block truncate">
            {t.kpiDaysToCredit}
          </span>
          <div className="text-xl font-bold font-mono text-emerald-800 mt-1">
            11 Days
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold">Down from 44 days</span>
        </div>

        {/* KPI 5 */}
        <div className="bg-white border border-stone-200 rounded-lg p-3.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 block truncate">
            {t.kpiRejectionRate}
          </span>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1">
            4.8%
          </div>
          <span className="text-[10px] text-stone-500">Primarily income cap</span>
        </div>

        {/* KPI 6 */}
        <div className="bg-white border border-stone-200 rounded-lg p-3.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 block truncate">
            Fraud Blocked
          </span>
          <div className="text-xl font-bold font-mono text-red-700 mt-1">
            ₹34.8 Cr
          </div>
          <span className="text-[10px] text-red-600 font-semibold">412 Shared accounts stopped</span>
        </div>
      </div>

      {/* State-by-State India Coverage & PVTG Focus Table */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>State-by-State India Coverage & PVTG Reach Gap Analysis</span>
            </h3>
            <p className="text-[11px] text-stone-500">
              Evaluates penetration across high tribal concentration states, highlighting Particularly Vulnerable Tribal Group (PVTG) districts.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">
            PVTG Accelerated Enrolment Mandate
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100 text-stone-700 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-200">
                <th className="py-2.5 px-3">State / Region</th>
                <th className="py-2.5 px-3">ST Pop (Lakhs)</th>
                <th className="py-2.5 px-3">Estimated Eligible</th>
                <th className="py-2.5 px-3">Enrolled Beneficiaries</th>
                <th className="py-2.5 px-3">Reach Rate</th>
                <th className="py-2.5 px-3">Priority PVTG Districts Monitored</th>
                <th className="py-2.5 px-3 text-right">Strategic Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {STATE_COVERAGE_DATA.map((item) => (
                <tr key={item.code} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-stone-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-700" />
                    <span>{item.state}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-stone-700">
                    {item.stPopulationLakhs} L
                  </td>
                  <td className="py-2.5 px-3 font-mono text-stone-800">
                    {(item.estimatedEligibleStudents / 100000).toFixed(2)} L
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-900">
                    {(item.disbursedStudents / 100000).toFixed(2)} L
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-stone-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-700 h-full rounded-full"
                          style={{ width: `${item.reachPercentage}%` }}
                        />
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
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.priorityStatus === 'High Priority'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {item.priorityStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOP 5 DISTRICT ENROLLMENT & DBT BANK-SEEDING CAMP PLANNER */}
      <CampPlannerWidget language={language} onLogAction={onLogAction} />

      {/* RANKED INSTITUTIONAL VERIFICATION & UC COMPLIANCE SCORECARD */}
      <InstituteScorecardTable language={language} userRole="analyst" onIssueNotice={(inst) => onLogAction && onLogAction('MINISTRY_DISPATCHED_INSTITUTE_NOTICE', inst)} />

      {/* 4 RECHARTS CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Processing Time Trend */}
        <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-3">
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
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: 6, fontSize: 12, border: '1px solid #e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="manualDays" name="Legacy Manual Review" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" />
                <Line type="monotone" dataKey="aiAssistedDays" name="Vanavriddhi AI-Assisted" stroke="#047857" strokeWidth={3} />
                <Line type="monotone" dataKey="slaTarget" name="Statutory SLA Target (30d)" stroke="#f59e0b" strokeWidth={1.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Rejection Reasons Breakdown */}
        <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-3">
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
              <BarChart
                layout="vertical"
                data={REJECTION_REASONS_DATA}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" unit="%" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any) => [`${val}% of total queries`, 'Frequency']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: 6, fontSize: 12, border: '1px solid #e2e8f0' }}
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

        {/* Chart 3: Approval Rate by Gender & Region (Equity View) */}
        <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-purple-700" />
              <span>Equity & Inclusion Audit: Approval Rate by Gender & Region (%)</span>
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
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: 6, fontSize: 12, border: '1px solid #e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="maleRate" name="Male ST" fill="#0284c7" radius={[3, 3, 0, 0]} />
                <Bar dataKey="femaleRate" name="Female ST" fill="#ec4899" radius={[3, 3, 0, 0]} />
                <Bar dataKey="transRate" name="Transgender ST" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Monthly Budget Utilization */}
        <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-3">
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
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: 6, fontSize: 12, border: '1px solid #e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="allocatedCr" name="MoTA Budget Allocated" fill="#cbd5e1" radius={[3, 3, 0, 0]} />
                <Bar dataKey="disbursedCr" name="Direct Beneficiary Credit" fill="#047857" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* DROPOUT RISK INTERVENTION TABLE */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-600" />
              <span>{t.dropoutRiskTitle}</span>
            </h3>
            <p className="text-[11px] text-stone-500">
              Proactive early-warning AI model identifying beneficiaries at risk of discontinuing studies or missing scholarship renewals.
            </p>
          </div>
          <span className="text-[10px] font-mono text-stone-500">
            Automated Mentorship Dispatch Workflow
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100 text-stone-700 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-200">
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Scheme & Institute</th>
                <th className="py-2.5 px-3">State</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3">Top Contributing Factors</th>
                <th className="py-2.5 px-3">Assigned Mentor</th>
                <th className="py-2.5 px-3 text-right">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {dropoutStudents.map((student) => {
                const isHigh = student.riskLevel === 'High';
                const isMed = student.riskLevel === 'Medium';

                return (
                  <tr key={student.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-stone-900">
                      {student.name}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-stone-800">{student.scheme}</div>
                      <div className="text-[10px] text-stone-500">{student.institute}</div>
                    </td>
                    <td className="py-2.5 px-3 text-stone-600">
                      {student.state}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center gap-1 font-mono font-bold text-[10px] uppercase px-2 py-0.5 rounded ${
                        isHigh 
                          ? 'bg-red-100 text-red-900 border border-red-300' 
                          : isMed 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isHigh ? 'bg-red-600' : isMed ? 'bg-amber-600' : 'bg-emerald-600'}`} />
                        <span>{student.riskLevel} ({student.riskScore}%)</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3 max-w-[280px]">
                      <ul className="space-y-0.5 text-[11px] text-stone-700">
                        {student.topContributingFactors.map((factor, fIdx) => (
                          <li key={fIdx} className="truncate" title={factor}>
                            • {factor}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-2.5 px-3">
                      {student.mentorAssigned ? (
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded inline-flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{student.mentorAssigned}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-stone-400 italic">None assigned</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedStudentForMentor(student)}
                        className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 text-white font-semibold text-[11px] inline-flex items-center gap-1 shadow-2xs"
                      >
                        <UserPlus className="w-3 h-3 text-amber-400" />
                        <span>Assign Mentor</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* POLICY SIMULATOR & FAIRNESS MONITOR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Policy Simulator with Sliders */}
        <div className="lg:col-span-6 bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-700" />
              <span>{t.simulatorTitle}</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold">
              Instant Recomputation
            </span>
          </div>

          <p className="text-xs text-stone-600">
            Simulate the national fiscal impact and expansion of coverage by modifying statutory thresholds.
          </p>

          <div className="space-y-4 text-xs">
            {/* Slider 1: Income Ceiling */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-stone-800">
                  Annual Family Income Ceiling:
                </span>
                <span className="font-mono font-bold text-emerald-900 text-sm">
                  ₹{(simIncomeCeiling / 100000).toFixed(2)} Lakhs
                </span>
              </div>
              <input
                type="range"
                min="200000"
                max="800000"
                step="25000"
                value={simIncomeCeiling}
                onChange={(e) => setSimIncomeCeiling(Number(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-0.5">
                <span>₹2.00L (Baseline PMS-ST)</span>
                <span>₹5.00L</span>
                <span>₹8.00L (EWS Parity)</span>
              </div>
            </div>

            {/* Slider 2: Seat Cap & Coverage Multiplier */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-stone-800">
                  Higher Education Fellowship Slot Allocation:
                </span>
                <span className="font-mono font-bold text-emerald-900 text-sm">
                  {simSeatCap}% of Baseline Slots
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                step="10"
                value={simSeatCap}
                onChange={(e) => setSimSeatCap(Number(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-0.5">
                <span>50% (375 NFHET slots)</span>
                <span>100% (750 slots)</span>
                <span>200% (1,500 slots)</span>
              </div>
            </div>

            {/* Slider 3: Monthly Maintenance Stipend Adjustment */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-stone-800">
                  Cost-of-Living Maintenance Allowance Hike:
                </span>
                <span className="font-mono font-bold text-emerald-900 text-sm">
                  +{simStipendHike}% Inflation Indexing
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={simStipendHike}
                onChange={(e) => setSimStipendHike(Number(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-0.5">
                <span>0% (Existing rate)</span>
                <span>+25%</span>
                <span>+50% Enhanced</span>
              </div>
            </div>
          </div>

          {/* Simulation Output Card */}
          <div className="bg-emerald-950 text-white rounded-lg p-4 border border-emerald-900 space-y-3">
            <span className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider block">
              Projected Macro Welfare & Budgetary Outcome
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-emerald-900/60 rounded border border-emerald-800">
                <span className="text-[10px] text-stone-300 block">Total ST Beneficiaries</span>
                <span className="text-xl font-black font-mono text-white">
                  {simulationResults.eligibleLakhs} L
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">
                  +{simulationResults.growthPercent}% expansion
                </span>
              </div>

              <div className="p-2.5 bg-emerald-900/60 rounded border border-emerald-800">
                <span className="text-[10px] text-stone-300 block">Required MoTA Outlay</span>
                <span className="text-xl font-black font-mono text-amber-300">
                  ₹{simulationResults.budgetCr.toLocaleString('en-IN')} Cr
                </span>
                <span className="text-[10px] text-stone-300 block mt-0.5">
                  Annual Union Budget
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Fairness Monitor (Bias Auditing) */}
        <div className="lg:col-span-6 bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-purple-700" />
              <span>{t.fairnessTitle}</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">
              Demographic Parity Audit
            </span>
          </div>

          <p className="text-xs text-stone-600">
            Auditing AI anomaly detection models across vulnerable demographic slices to guarantee no systemic bias against gender, geography, or PVTG groups.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100 text-stone-700 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-200">
                  <th className="py-2 px-2.5">Demographic Group</th>
                  <th className="py-2 px-2.5">Applicant Share</th>
                  <th className="py-2 px-2.5">AI Flag Rate</th>
                  <th className="py-2 px-2.5">Approval Rate</th>
                  <th className="py-2 px-2.5 text-right">Audit Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {FAIRNESS_MONITOR_METRICS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/80">
                    <td className="py-2.5 px-2.5 font-bold text-stone-900">
                      {row.subgroup}
                    </td>
                    <td className="py-2.5 px-2.5 font-mono text-stone-700">
                      {row.shareOfApplicants}
                    </td>
                    <td className="py-2.5 px-2.5 font-mono text-stone-800">
                      {row.aiFlagRate}
                    </td>
                    <td className="py-2.5 px-2.5 font-mono font-bold text-emerald-800">
                      {row.officerApprovalRate}
                    </td>
                    <td className="py-2.5 px-2.5 text-right">
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-200">
                        {row.auditVerdict}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-stone-50 border border-stone-200 rounded text-[11px] text-stone-600 space-y-1">
            <span className="font-bold text-stone-800 block">Independent Algorithmic Compliance:</span>
            <span>
              All anomaly scores adhere to the 4/5ths Rule (80% Disparate Impact benchmark). Disparity ratios remain between 0.98 and 1.04, confirming equal protection under Article 15(4) of the Constitution of India.
            </span>
          </div>
        </div>
      </div>

      {/* MENTOR ASSIGNMENT MODAL */}
      {selectedStudentForMentor && (
        <div className="fixed inset-0 z-60 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h4 className="text-sm font-bold text-stone-900">
                Assign Institutional Welfare Mentor
              </h4>
              <button onClick={() => setSelectedStudentForMentor(null)} className="text-stone-400 hover:text-stone-700">
                ✕
              </button>
            </div>

            <div>
              <span className="text-stone-500 block">Student:</span>
              <span className="font-bold text-stone-900 text-sm">{selectedStudentForMentor.name}</span>
              <p className="text-stone-600 mt-0.5">{selectedStudentForMentor.scheme} • {selectedStudentForMentor.institute}</p>
            </div>

            <div className="bg-amber-50 p-2.5 rounded border border-amber-200 text-amber-900">
              <span className="font-bold block text-[11px]">Primary Risk Indicator:</span>
              <span>{selectedStudentForMentor.topContributingFactors[0]}</span>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Select Empanelled Tribal Welfare Nodal Mentor:
              </label>
              <select
                value={mentorName}
                onChange={(e) => setMentorName(e.target.value)}
                className="w-full bg-white border border-stone-300 text-stone-800 px-3 py-2 rounded-md font-medium"
              >
                <option value="Prof. S. Soren (Tribe Nodal Guide, NIT Rourkela)">Prof. S. Soren (Tribe Nodal Guide, NIT Rourkela)</option>
                <option value="Dr. Birsa Marandi (Anthropology Dept, Ranchi University)">Dr. Birsa Marandi (Anthropology Dept, Ranchi University)</option>
                <option value="Smt. Geeta Netam (District Tribal Liaison Officer, Bastar)">Smt. Geeta Netam (District Tribal Liaison Officer, Bastar)</option>
                <option value="Shri Arjun Baiga (PVTG Community Counselor, Dindori)">Shri Arjun Baiga (PVTG Community Counselor, Dindori)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setSelectedStudentForMentor(null)}
                className="px-3 py-1.5 rounded border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAssignMentor(selectedStudentForMentor.id)}
                className="px-4 py-1.5 rounded bg-emerald-800 hover:bg-emerald-900 text-white font-semibold flex items-center gap-1.5 shadow-2xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Confirm Mentor Assignment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
