import React, { useState, useMemo } from 'react';
import { 
  OfficerApplication, 
  RiskLane, 
  SLAStatus, 
  AppStatus 
} from '../../types';
import { INITIAL_OFFICER_APPLICATIONS } from '../../data/mockApplications';
import { translations } from '../../locales/translations';
import { FraudGraphPanel } from './FraudGraphPanel';
import { DelayPredictorWidget } from './DelayPredictorWidget';
import { InstituteScorecardTable } from '../InstituteScorecardTable';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  ArrowUpDown, 
  FileText, 
  ChevronRight, 
  X, 
  Send, 
  AlertOctagon, 
  Building, 
  Eye, 
  Sparkles, 
  ShieldCheck,
  Network,
  Scale,
  Tent,
  Building2
} from 'lucide-react';
import { useToast } from '../Toast';

interface OfficerViewProps {
  language: 'en' | 'hi';
  onLogAction?: (action: string, targetId: string) => void;
}

export const OfficerView: React.FC<OfficerViewProps> = ({
  language,
  onLogAction
}) => {
  const { showToast } = useToast();
  const t = translations[language].officer;

  // Applications State
  const [applications, setApplications] = useState<OfficerApplication[]>(INITIAL_OFFICER_APPLICATIONS);

  // Sub-tabs in Officer View
  const [activeSubTab, setActiveSubTab] = useState<'queue' | 'fraud' | 'delay' | 'scorecard'>('queue');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [laneFilter, setLaneFilter] = useState<string>('All');
  const [slaFilter, setSlaFilter] = useState<string>('All');
  const [stateFilter, setStateFilter] = useState<string>('All');
  const [sortOldestFirst, setSortOldestFirst] = useState<boolean>(true);

  // Detail Drawer State
  const [selectedApp, setSelectedApp] = useState<OfficerApplication | null>(null);

  // "Send Back" Modal / State
  const [isSendBackOpen, setIsSendBackOpen] = useState<boolean>(false);
  const [sendBackReason, setSendBackReason] = useState<string>('name_mismatch');
  const [sendBackMessage, setSendBackMessage] = useState<string>('');

  // Toast feedback
  const [officerFeedback, setOfficerFeedback] = useState<string | null>(null);

  // Available unique states
  const uniqueStates = useMemo(() => {
    const states = Array.from(new Set(applications.map(a => a.state)));
    return states.sort();
  }, [applications]);

  // Filtered & Sorted Applications
  const filteredApps = useMemo(() => {
    return applications
      .filter((app) => {
        if (laneFilter !== 'All' && app.riskLane !== laneFilter) return false;
        if (slaFilter !== 'All' && app.slaStatus !== slaFilter) return false;
        if (stateFilter !== 'All' && app.state !== stateFilter) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = app.studentName.toLowerCase().includes(q);
          const matchId = app.applicationNumber.toLowerCase().includes(q) || app.id.toLowerCase().includes(q);
          const matchInst = app.institute.toLowerCase().includes(q);
          const matchState = app.state.toLowerCase().includes(q);
          if (!matchName && !matchId && !matchInst && !matchState) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOldestFirst) {
          return b.daysPending - a.daysPending; // Oldest days pending first
        } else {
          return a.daysPending - b.daysPending;
        }
      });
  }, [applications, laneFilter, slaFilter, stateFilter, searchQuery, sortOldestFirst]);

  // Actions
  const handleApprove = (appId: string) => {
    setApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return { ...a, status: 'Institute Verified' as AppStatus };
      }
      return a;
    }));
    if (onLogAction) {
      onLogAction('OFFICER_APPROVAL_FORWARDED', appId);
    }
    const msg = `Application ${appId} successfully approved and forwarded to State Directorate.`;
    setOfficerFeedback(msg);
    showToast(msg, 'success', 'Statutory Approval Granted');
    setSelectedApp(null);
    setTimeout(() => setOfficerFeedback(null), 4000);
  };

  const handleEscalate = (appId: string) => {
    setApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return { ...a, riskLane: 'Red' as RiskLane, status: 'Submitted' as AppStatus };
      }
      return a;
    }));
    if (onLogAction) {
      onLogAction('OFFICER_ESCALATED_VIGILANCE', appId);
    }
    const msg = `Application ${appId} escalated to District Vigilance Cell for inquiry.`;
    setOfficerFeedback(msg);
    showToast(msg, 'warning', 'Escalated to Vigilance');
    setSelectedApp(null);
    setTimeout(() => setOfficerFeedback(null), 4000);
  };

  const openSendBackModal = () => {
    if (!selectedApp) return;
    const defaultMsg = sendBackReason === 'name_mismatch'
      ? `Dear ${selectedApp.studentName}, your application has a mismatch between the name on your Caste Certificate and Bank Passbook. Please upload a Gazetted name endorsement or Tahsil clarification.`
      : `Dear ${selectedApp.studentName}, your income certificate verification requires clarification. Please re-submit within 7 working days.`;
    setSendBackMessage(defaultMsg);
    setIsSendBackOpen(true);
  };

  const confirmSendBack = () => {
    if (!selectedApp) return;
    setApplications(prev => prev.map(a => {
      if (a.id === selectedApp.id) {
        return { ...a, status: 'Returned for Correction' as AppStatus };
      }
      return a;
    }));
    if (onLogAction) {
      onLogAction('OFFICER_RETURNED_FOR_CORRECTION', `${selectedApp.id}: ${sendBackReason}`);
    }
    const msg = `Application returned to student ${selectedApp.studentName} with correction notice dispatched via SMS/WhatsApp.`;
    setOfficerFeedback(msg);
    showToast(msg, 'info', 'Correction Notice Dispatched');
    setIsSendBackOpen(false);
    setSelectedApp(null);
    setTimeout(() => setOfficerFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {officerFeedback && (
        <div className="bg-emerald-900 text-white text-xs px-4 py-3 rounded-lg flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span className="font-semibold">{officerFeedback}</span>
          </div>
          <button onClick={() => setOfficerFeedback(null)} className="text-stone-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Controls & Navigation Bar */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                Desk: Verification Officer
              </span>
              <span className="text-xs text-stone-500 font-medium">
                Autonomous Verification Ledger
              </span>
            </div>
            <h2 className="text-base font-bold text-stone-900 mt-1">
              {t.title}
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              {t.subtitle}
            </p>
          </div>

          {/* Sub-tab Switchers */}
          <div className="flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs">
            <button
              onClick={() => setActiveSubTab('queue')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                activeSubTab === 'queue'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              Verification Queue ({applications.length})
            </button>
            <button
              onClick={() => setActiveSubTab('fraud')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'fraud'
                  ? 'bg-red-700 text-white shadow-2xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>{t.fraudGraphTab}</span>
            </button>
            <button
              onClick={() => setActiveSubTab('delay')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'delay'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{t.delayPredictorTab}</span>
            </button>
            <button
              onClick={() => setActiveSubTab('scorecard')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'scorecard'
                  ? 'bg-emerald-900 text-white shadow-2xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Institute Scorecard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Sub Tabs */}
      {activeSubTab === 'fraud' && <FraudGraphPanel />}
      {activeSubTab === 'delay' && <DelayPredictorWidget />}
      {activeSubTab === 'scorecard' && <InstituteScorecardTable language={language} userRole="officer" />}

      {activeSubTab === 'queue' && (
        <div className="space-y-4">
          {/* Filters Row */}
          <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-emerald-700 text-stone-800"
              />
            </div>

            {/* Lane Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-stone-500 font-semibold">{t.laneFilter}:</span>
              <select
                value={laneFilter}
                onChange={(e) => setLaneFilter(e.target.value)}
                className="bg-stone-50 border border-stone-300 text-stone-800 px-2.5 py-1.5 rounded-md font-medium"
              >
                <option value="All">All Lanes</option>
                <option value="Green">Green (Pristine)</option>
                <option value="Amber">Amber (Caution)</option>
                <option value="Red">Red (High Risk)</option>
              </select>
            </div>

            {/* SLA Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-stone-500 font-semibold">{t.slaFilter}:</span>
              <select
                value={slaFilter}
                onChange={(e) => setSlaFilter(e.target.value)}
                className="bg-stone-50 border border-stone-300 text-stone-800 px-2.5 py-1.5 rounded-md font-medium"
              >
                <option value="All">All SLA</option>
                <option value="On time">On Time</option>
                <option value="At risk">At Risk</option>
                <option value="Breached">Breached</option>
              </select>
            </div>

            {/* State Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-stone-500 font-semibold">{t.stateFilter}:</span>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="bg-stone-50 border border-stone-300 text-stone-800 px-2.5 py-1.5 rounded-md font-medium"
              >
                <option value="All">All States</option>
                {uniqueStates.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Sort Toggle: Oldest First */}
            <button
              onClick={() => setSortOldestFirst(!sortOldestFirst)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-stone-300 bg-stone-50 text-stone-700 hover:bg-stone-100 font-semibold transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
              <span>{sortOldestFirst ? 'Oldest Pending' : 'Newest Pending'}</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-stone-200 rounded-lg shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-200">
                    <th className="py-3 px-3">Application ID</th>
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Institute & State</th>
                    <th className="py-3 px-3">Scheme</th>
                    <th className="py-3 px-3">Submitted</th>
                    <th className="py-3 px-3">Days Pending</th>
                    <th className="py-3 px-3">{t.riskLaneLabel}</th>
                    <th className="py-3 px-3">{t.slaStatusLabel}</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-stone-500">
                        No applications match the current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map((app) => {
                      const isRed = app.riskLane === 'Red';
                      const isAmber = app.riskLane === 'Amber';
                      const isGreen = app.riskLane === 'Green';

                      return (
                        <tr
                          key={app.id}
                          onClick={() => setSelectedApp(app)}
                          className={`cursor-pointer transition-colors ${
                            selectedApp?.id === app.id
                              ? 'bg-emerald-50/70 font-medium'
                              : 'hover:bg-stone-50'
                          }`}
                        >
                          <td className="py-3 px-3 font-mono font-bold text-stone-900">
                            {app.applicationNumber}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-stone-900 flex items-center gap-1.5 flex-wrap">
                              <span>{app.studentName}</span>
                              {app.pvtgDistrict && (
                                <span className="text-[9px] bg-purple-100 text-purple-900 px-1.5 py-0.2 rounded font-bold uppercase" title="Particularly Vulnerable Tribal Group District">
                                  PVTG
                                </span>
                              )}
                              {app.isGramSabhaFallback && (
                                <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded font-bold uppercase" title="Applied via Community Attestation Fallback">
                                  Gram Sabha Attestation
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-stone-500 font-mono">
                              Father: {app.fatherName}
                            </span>
                          </td>
                          <td className="py-3 px-3 max-w-[200px]">
                            <div className="truncate font-medium text-stone-800" title={app.institute}>
                              {app.institute}
                            </div>
                            <span className="text-[10px] text-stone-500">
                              {app.district}, {app.state}
                            </span>
                          </td>
                          <td className="py-3 px-3 max-w-[160px]">
                            <span className="truncate block font-semibold text-stone-700" title={app.schemeName}>
                              {app.schemeId}
                            </span>
                            <span className="text-[10px] text-stone-500">
                              ₹{app.income.toLocaleString('en-IN')}/yr • {app.percentage}%
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-stone-600">
                            {app.submittedDate}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-stone-800">
                            {app.daysPending}d
                          </td>
                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center gap-1 font-bold text-[10px] uppercase px-2 py-0.5 rounded border ${
                              isRed
                                ? 'bg-red-100 text-red-900 border-red-300'
                                : isAmber
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                isRed ? 'bg-red-600' : isAmber ? 'bg-amber-600' : 'bg-emerald-600'
                              }`} />
                              <span>{app.riskLane}</span>
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`font-mono text-[11px] font-semibold ${
                              app.slaStatus === 'Breached'
                                ? 'text-red-700'
                                : app.slaStatus === 'At risk'
                                ? 'text-amber-700'
                                : 'text-emerald-700'
                            }`}>
                              {app.slaStatus}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedApp(app);
                              }}
                              className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-[11px] inline-flex items-center gap-1 transition-colors"
                            >
                              <Eye className="w-3 h-3 text-stone-600" />
                              <span>Triage</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Summary */}
            <div className="bg-stone-50 p-3 border-t border-stone-200 text-xs text-stone-600 flex items-center justify-between">
              <span>Showing {filteredApps.length} of {applications.length} applications in nodal queue</span>
              <span className="font-mono text-[11px] text-stone-500">
                Statutory Mandate: All decisions digitally logged to tamper-evident audit ledger
              </span>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL DRAWER (Side by side extracted docs, explainable flags, rule trace, actions) */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-4xl h-full shadow-2xl overflow-y-auto flex flex-col justify-between">
            {/* Drawer Header */}
            <div className="p-5 border-b border-stone-200 bg-stone-50 sticky top-0 z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                    {selectedApp.applicationNumber}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                    selectedApp.riskLane === 'Red'
                      ? 'bg-red-100 text-red-900 border-red-300'
                      : selectedApp.riskLane === 'Amber'
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  }`}>
                    Lane: {selectedApp.riskLane}
                  </span>
                  <span className="text-xs text-stone-500 font-mono">
                    Pending {selectedApp.daysPending} days
                  </span>
                </div>
                <h3 className="text-lg font-bold text-stone-950 mt-1">
                  {selectedApp.studentName} — {selectedApp.schemeName}
                </h3>
                <p className="text-xs text-stone-600">
                  {selectedApp.institute} • {selectedApp.district}, {selectedApp.state}
                </p>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 flex-1 text-xs">
              {/* Statutory Safeguard Notice for Red Lane */}
              {selectedApp.riskLane === 'Red' && (
                <div className="p-4 bg-red-50 border-2 border-red-400 rounded-lg text-red-950 flex items-start gap-3">
                  <AlertOctagon className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-sm text-red-900">
                      High Risk Advisory Lane
                    </h5>
                    <p className="font-semibold text-xs mt-0.5">
                      {t.advisoryNote}
                    </p>
                    <p className="text-[11px] text-red-800 mt-1">
                      Our system flag indicates potential multi-application financial collusion or duplicate bank routing. The statutory officer must exercise independent judgment before sanctioning or escalating.
                    </p>
                  </div>
                </div>
              )}

              {/* Community Attestation Fallback Box */}
              {selectedApp.isGramSabhaFallback && (
                <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-lg text-amber-950 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tent className="w-5 h-5 text-amber-700" />
                      <h5 className="font-bold text-sm text-amber-950">
                        Community Attestation Fallback (PESA / FRA Rule)
                      </h5>
                    </div>
                    <span className="text-[10px] font-mono bg-amber-200 px-2 py-0.5 rounded font-bold">
                      Field Inquiry Active
                    </span>
                  </div>
                  <p className="text-xs text-amber-900">
                    Applicant does not possess a digitized caste certificate. Application has been routed for village Gram Sabha inquiry and ITDA Project Administrator field attestation.
                  </p>
                  {selectedApp.gramSabhaDetails && (
                    <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded border border-amber-200 text-[11px] font-mono">
                      <div>Village: <strong>{selectedApp.gramSabhaDetails.village}</strong></div>
                      <div>Panchayat: <strong>{selectedApp.gramSabhaDetails.panchayat}</strong></div>
                      <div>Block: <strong>{selectedApp.gramSabhaDetails.block}</strong></div>
                      <div>ITDA Desk: <strong>{selectedApp.gramSabhaDetails.itdaOffice}</strong></div>
                    </div>
                  )}
                  <div className="p-2 bg-amber-100 rounded font-semibold text-xs text-amber-950 border border-amber-300">
                    Officer Decides: "AI flag is advisory. Officer decision on Community Attestation is statutory and final."
                  </div>
                </div>
              )}

              {/* Explainable Flags Box */}
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Explainable AI & Anomaly Detection Flags</span>
                </h4>

                {selectedApp.flags.length === 0 ? (
                  <p className="text-emerald-800 font-semibold flex items-center gap-1 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Clean File: Zero anomalies flagged across National Registries or Entity Linkage.
                  </p>
                ) : (
                  <ul className="space-y-1.5">
                    {selectedApp.flags.map((flag, fIdx) => (
                      <li key={fIdx} className="text-stone-800 bg-white p-2.5 rounded border border-amber-200 font-medium flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Rule Trace Breakdown */}
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-4 space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-emerald-700" />
                  <span>Deterministic Rule Trace Summary</span>
                </h4>
                <div className="font-mono text-stone-800 bg-white p-2.5 rounded border border-emerald-200 text-xs">
                  {selectedApp.ruleTraceSummary}
                </div>
              </div>

              {/* Side-by-Side Extracted Documents Box */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center justify-between">
                  <span>Side-by-Side Extracted Documents (OCR Ingest)</span>
                  <span className="text-[11px] text-stone-500 font-normal font-mono">
                    DigiLocker PKI Verified
                  </span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedApp.extractedDocs.length === 0 ? (
                    <div className="col-span-2 p-4 bg-stone-50 border border-stone-200 rounded text-center text-stone-500">
                      Standard DigiLocker XML stream ingested with 100% hash parity.
                    </div>
                  ) : (
                    selectedApp.extractedDocs.map((doc) => (
                      <div key={doc.id} className="bg-white border border-stone-200 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between pb-1.5 border-b border-stone-100">
                          <span className="font-bold text-stone-900 text-xs">{doc.name}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                            doc.status === 'verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {doc.status.toUpperCase()} ({doc.confidenceScore}%)
                          </span>
                        </div>

                        <div className="text-[11px] text-stone-500">
                          Issuer: <span className="font-medium text-stone-700">{doc.issuer}</span>
                        </div>

                        <div className="bg-stone-50 p-2 rounded border border-stone-200 text-[11px] space-y-1 font-mono">
                          {Object.entries(doc.extractedData).map(([key, val]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-stone-500">{key}:</span>
                              <span className="text-stone-900 font-semibold">{val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Cross-Document Mismatches Detail (if any) */}
              {selectedApp.mismatches && selectedApp.mismatches.length > 0 && (
                <div className="bg-amber-50/70 border border-amber-300 rounded-lg p-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950">
                    Cross-Document Attribute Inconsistencies
                  </h4>
                  {selectedApp.mismatches.map((m, mIdx) => (
                    <div key={mIdx} className="bg-white p-3 rounded border border-amber-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900">{m.field}</span>
                        <span className="text-[10px] font-bold text-amber-900 uppercase">{m.severity} Priority</span>
                      </div>
                      <p className="text-stone-700 text-xs">{m.description}</p>
                      <div className="text-emerald-900 text-[11px] font-medium pt-1">
                        Recommended Resolution: {m.suggestedAction}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Footer Actions (Approve / Send back / Escalate) */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] text-stone-500">
                Action will be recorded as digital signature in National Audit Chain.
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEscalate(selectedApp.id)}
                  className="px-3 py-2 rounded-md border border-red-300 text-red-900 bg-red-50 hover:bg-red-100 font-semibold text-xs transition-colors"
                >
                  {t.escalate}
                </button>

                <button
                  type="button"
                  onClick={openSendBackModal}
                  className="px-3 py-2 rounded-md border border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100 font-semibold text-xs transition-colors"
                >
                  {t.sendBack}
                </button>

                <button
                  type="button"
                  onClick={() => handleApprove(selectedApp.id)}
                  className="px-4 py-2 rounded-md bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.approve}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* "SEND BACK FOR CORRECTION" MODAL */}
      {isSendBackOpen && selectedApp && (
        <div className="fixed inset-0 z-60 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h4 className="text-sm font-bold text-stone-900">
                Send Back for Student Correction
              </h4>
              <button onClick={() => setIsSendBackOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Select Statutory Query Reason
              </label>
              <select
                value={sendBackReason}
                onChange={(e) => {
                  setSendBackReason(e.target.value);
                  if (e.target.value === 'name_mismatch') {
                    setSendBackMessage(`Dear ${selectedApp.studentName}, your application has a mismatch between the name on your Caste Certificate ("Ramu") and Bank Passbook ("Ramu Kumar"). Please upload an official name clarification endorsement.`);
                  } else if (e.target.value === 'income_cert') {
                    setSendBackMessage(`Dear ${selectedApp.studentName}, your income certificate was issued after the application filing date. Please re-submit competent authority certification.`);
                  } else if (e.target.value === 'bank_seeding') {
                    setSendBackMessage(`Dear ${selectedApp.studentName}, your bank account is not seeded on the NPCI Aadhaar mapper. Please visit your branch and submit the mandate.`);
                  } else {
                    setSendBackMessage(`Dear ${selectedApp.studentName}, additional documentation required for institutional verification.`);
                  }
                }}
                className="w-full bg-white border border-stone-300 text-stone-800 px-3 py-2 rounded-md font-medium"
              >
                <option value="name_mismatch">Name / Identity Attribute Discrepancy</option>
                <option value="income_cert">Income Certificate Validity / Issuance Date Issue</option>
                <option value="bank_seeding">Aadhaar-NPCI Bank Seeding Mandate Incomplete</option>
                <option value="marksheet">Marksheet Scan Illegible / Verification Failed</option>
                <option value="other">Other Institutional Scrutiny Query</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Generated Student Advisory Notice (SMS & WhatsApp Ready)
              </label>
              <textarea
                value={sendBackMessage}
                onChange={(e) => setSendBackMessage(e.target.value)}
                rows={4}
                className="w-full bg-stone-50 border border-stone-300 rounded p-2.5 text-stone-800 font-sans focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              />
              <span className="text-[10px] text-stone-500 mt-1 block">
                Message will be automatically dispatched via Bhashini Multilingual Bridge to student mobile {selectedApp.mobileNumberMasked}.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsSendBackOpen(false)}
                className="px-3 py-1.5 rounded border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSendBack}
                className="px-4 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center gap-1.5 shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Query to Student</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
