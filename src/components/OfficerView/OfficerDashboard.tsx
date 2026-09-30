import React, { useState, useMemo } from 'react';
import { AuthUser, AppLanguage, OfficerApplication } from '../../types';
import { INITIAL_OFFICER_APPLICATIONS } from '../../data/mockApplications';
import { filterApplicationsForUser } from '../../services/dataScoping';
import { OfficerLayout, OfficerNavTab } from './OfficerLayout';
import { FraudGraphPanel } from './FraudGraphPanel';
import { DelayPredictorWidget } from './DelayPredictorWidget';
import { InstituteScorecardTable } from '../InstituteScorecardTable';
import { AccessControlPanel } from '../AccessControlPanel';
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
  Building2,
  CheckSquare,
  CreditCard,
  MessageSquare
} from 'lucide-react';

interface OfficerDashboardProps {
  user: AuthUser;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onLogout: () => void;
  onLogAction?: (action: string, targetId: string) => void;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  user,
  language,
  onLanguageChange,
  onLogout,
  onLogAction
}) => {
  const [activeTab, setActiveTab] = useState<OfficerNavTab>('queue');

  // Enforce data scoping at the data layer!
  const scopedInitialApps = useMemo(() => {
    return filterApplicationsForUser(INITIAL_OFFICER_APPLICATIONS, user);
  }, [user]);

  const [applications, setApplications] = useState<OfficerApplication[]>(scopedInitialApps);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [laneFilter, setLaneFilter] = useState<string>('All');
  const [slaFilter, setSlaFilter] = useState<string>('All');
  const [sortOldestFirst, setSortOldestFirst] = useState<boolean>(true);

  // Detail Drawer State
  const [selectedApp, setSelectedApp] = useState<OfficerApplication | null>(null);

  // "Send Back" Modal State
  const [isSendBackOpen, setIsSendBackOpen] = useState<boolean>(false);
  const [sendBackReason, setSendBackReason] = useState<string>('name_mismatch');
  const [sendBackMessage, setSendBackMessage] = useState<string>('');
  const [officerFeedback, setOfficerFeedback] = useState<string | null>(null);

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications
      .filter((app) => {
        if (laneFilter !== 'All' && app.riskLane !== laneFilter) return false;
        if (slaFilter !== 'All' && app.slaStatus !== slaFilter) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = app.studentName.toLowerCase().includes(q);
          const matchId = app.applicationNumber.toLowerCase().includes(q) || app.id.toLowerCase().includes(q);
          const matchInst = app.institute.toLowerCase().includes(q);
          return matchName || matchId || matchInst;
        }
        return true;
      })
      .sort((a, b) => {
        return sortOldestFirst ? b.daysPending - a.daysPending : a.daysPending - b.daysPending;
      });
  }, [applications, laneFilter, slaFilter, searchQuery, sortOldestFirst]);

  // Actions
  const handleApprove = (app: OfficerApplication) => {
    setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'Institute Verified', daysPending: 0 } : a));
    setOfficerFeedback(`Statutory Approval Recorded for ${app.studentName} (${app.applicationNumber}). Forwarded to State Level.`);
    setTimeout(() => setOfficerFeedback(null), 5000);
    setSelectedApp(null);
    if (onLogAction) {
      onLogAction('OFFICER_APPROVAL_SIGN_OFF', `${app.id} (${app.studentName})`);
    }
  };

  const handleOpenSendBack = (app: OfficerApplication) => {
    setSelectedApp(app);
    setIsSendBackOpen(true);
    setSendBackMessage(`Discrepancy observed in submitted records. Please upload an attested affidavit or rectify name differences within 15 days.`);
  };

  const handleConfirmSendBack = () => {
    if (!selectedApp) return;
    setApplications(prev => prev.map(a => a.id === selectedApp.id ? { ...a, status: 'Returned for Correction' } : a));
    setOfficerFeedback(`File ${selectedApp.applicationNumber} returned for student rectification with reason code: ${sendBackReason}.`);
    setTimeout(() => setOfficerFeedback(null), 5000);
    setIsSendBackOpen(false);
    setSelectedApp(null);
    if (onLogAction) {
      onLogAction('OFFICER_RETURNED_FOR_CORRECTION', `${selectedApp.id} - ${sendBackReason}`);
    }
  };

  // KPI Metrics
  const greenCount = applications.filter(a => a.riskLane === 'Green').length;
  const amberCount = applications.filter(a => a.riskLane === 'Amber').length;
  const redCount = applications.filter(a => a.riskLane === 'Red').length;
  const breachedCount = applications.filter(a => a.slaStatus === 'Breached').length;

  return (
    <OfficerLayout
      user={user}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      language={language}
      onLanguageChange={onLanguageChange}
      onLogout={onLogout}
    >
      <div className="space-y-5">
        {/* Your Access Scope Panel */}
        <AccessControlPanel user={user} totalFilteredRecords={applications.length} />

        {officerFeedback && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 px-4 py-2.5 rounded-lg text-xs flex items-center justify-between animate-fadeIn shadow-2xs">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{officerFeedback}</span>
            </div>
            <span className="font-mono text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">
              GFR-Signed
            </span>
          </div>
        )}

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-5 animate-fadeIn">
            {/* KPI Cards Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border-2 border-emerald-800/40 rounded-xl p-4 shadow-xs">
                <div className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Total Scoped Records</div>
                <div className="text-2xl font-mono font-bold text-stone-900 mt-1">{applications.length}</div>
                <div className="text-[10px] text-stone-500 mt-0.5">Assigned to your desk</div>
              </div>

              <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
                <div className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Green Lane (Fast-Track)</div>
                <div className="text-2xl font-mono font-bold text-emerald-700 mt-1">{greenCount}</div>
                <div className="text-[10px] text-stone-500 mt-0.5">100% Deterministic match</div>
              </div>

              <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
                <div className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Amber Lane (Review)</div>
                <div className="text-2xl font-mono font-bold text-amber-600 mt-1">{amberCount}</div>
                <div className="text-[10px] text-stone-500 mt-0.5">Minor name/doc mismatch</div>
              </div>

              <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs">
                <div className="text-[10px] uppercase font-bold text-red-800 tracking-wider">SLA Breached</div>
                <div className="text-2xl font-mono font-bold text-red-700 mt-1">{breachedCount}</div>
                <div className="text-[10px] text-stone-500 mt-0.5">&gt; 30 days pending</div>
              </div>
            </div>

            {/* Quick Actions & Recent Queue Teaser */}
            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-800" />
                  <span>Immediate Scrutiny Priorities</span>
                </h3>
                <button
                  onClick={() => setActiveTab('queue')}
                  className="text-xs font-bold text-emerald-800 hover:underline"
                >
                  View Full Queue ({applications.length}) →
                </button>
              </div>

              <div className="divide-y divide-stone-200 text-xs">
                {applications.slice(0, 3).map((app) => (
                  <div key={app.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-stone-900">{app.studentName} ({app.applicationNumber})</div>
                      <div className="text-[11px] text-stone-500">{app.institute} • {app.schemeName}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        app.riskLane === 'Green' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {app.riskLane} Lane
                      </span>
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setActiveTab('queue');
                        }}
                        className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Verification Queue */}
        {activeTab === 'queue' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Filter and Search Bar */}
            <div className="bg-white border border-stone-200 rounded-lg p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search student name, application #..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-md border border-stone-300 bg-stone-50 focus:bg-white focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={laneFilter}
                  onChange={(e) => setLaneFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-md border border-stone-300 bg-white font-medium"
                >
                  <option value="All">All Risk Lanes</option>
                  <option value="Green">Green (Auto-pass)</option>
                  <option value="Amber">Amber (Review)</option>
                  <option value="Red">Red (High friction)</option>
                </select>

                <select
                  value={slaFilter}
                  onChange={(e) => setSlaFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-md border border-stone-300 bg-white font-medium"
                >
                  <option value="All">All SLA Tiers</option>
                  <option value="On time">On time</option>
                  <option value="At risk">At risk</option>
                  <option value="Breached">Breached (&gt; 30d)</option>
                </select>

                <button
                  type="button"
                  onClick={() => setSortOldestFirst(!sortOldestFirst)}
                  className="px-2.5 py-1.5 rounded-md border border-stone-300 bg-white font-semibold flex items-center gap-1"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>{sortOldestFirst ? 'Oldest Pending' : 'Newest'}</span>
                </button>
              </div>
            </div>

            {/* Dense Verification Table */}
            <div className="overflow-x-auto bg-white border border-stone-200 rounded-lg shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-200">
                    <th className="py-2.5 px-3">Application #</th>
                    <th className="py-2.5 px-3">Applicant Name</th>
                    <th className="py-2.5 px-3">Enrolled Scheme</th>
                    <th className="py-2.5 px-3 text-right">Income</th>
                    <th className="py-2.5 px-3 text-right">Marks %</th>
                    <th className="py-2.5 px-3 text-center">Pending</th>
                    <th className="py-2.5 px-3 text-center">Risk Lane</th>
                    <th className="py-2.5 px-3 text-center">Health</th>
                    <th className="py-2.5 px-3 text-right">Statutory Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-stone-500 italic">
                        No applications in queue for this jurisdiction matching selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map((app) => (
                      <tr key={app.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-stone-700">
                          {app.applicationNumber}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-stone-900">{app.studentName}</div>
                          <div className="text-[10px] text-stone-500 font-mono">Father: {app.fatherName}</div>
                        </td>
                        <td className="py-2.5 px-3 text-stone-700 max-w-xs truncate" title={app.schemeName}>
                          {app.schemeName}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-medium">
                          ₹{(app.income / 100000).toFixed(2)}L
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-medium">
                          {app.percentage}%
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            app.daysPending > 30 ? 'bg-red-100 text-red-900' : 'bg-stone-100 text-stone-800'
                          }`}>
                            {app.daysPending}d
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            app.riskLane === 'Green'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : app.riskLane === 'Amber'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-red-100 text-red-900 border border-red-300'
                          }`}>
                            {app.riskLane}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold">
                          {app.healthScore}/100
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold"
                            >
                              Review
                            </button>
                            <button
                              onClick={() => handleApprove(app)}
                              className="px-2 py-1 rounded bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold shadow-2xs"
                            >
                              Approve
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Application Review (Inspection Drawer / View) */}
        {activeTab === 'review' && (
          <div className="space-y-4 animate-fadeIn">
            {selectedApp ? (
              <div className="bg-white border-2 border-emerald-800 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-start justify-between border-b border-stone-200 pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-stone-500">
                      Application ID: {selectedApp.applicationNumber}
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 mt-0.5">
                      {selectedApp.studentName}
                    </h3>
                    <p className="text-xs text-stone-600">
                      {selectedApp.institute} • {selectedApp.schemeName}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenSendBack(selectedApp)}
                      className="px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs"
                    >
                      Return for Correction
                    </button>
                    <button
                      onClick={() => handleApprove(selectedApp)}
                      className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs"
                    >
                      Statutory Sign-Off ✓
                    </button>
                  </div>
                </div>

                {/* Deterministic Rule Trace Box */}
                <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs space-y-1">
                  <div className="font-bold text-stone-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <Scale className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Statutory Rule Engine Trace (Deterministic)</span>
                  </div>
                  <p className="text-stone-700 font-mono text-[11px]">
                    {selectedApp.ruleTraceSummary}
                  </p>
                </div>

                {/* Extracted Document Grid */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-stone-800 uppercase tracking-wider">
                    Extracted &amp; Cross-Reconciled Documents ({selectedApp.extractedDocs.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {selectedApp.extractedDocs.map((doc) => (
                      <div key={doc.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-900">{doc.name}</span>
                          <span className="font-mono text-[10px] text-emerald-700 font-bold">
                            {doc.confidenceScore}% OCR
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500">Issuer: {doc.issuer}</div>
                        <div className="bg-white p-2 rounded border border-stone-100 text-[10px] font-mono space-y-0.5">
                          {Object.entries(doc.extractedData).map(([k, v]) => (
                            <div key={k} className="flex justify-between">
                              <span className="text-stone-500">{k}:</span>
                              <span className="font-semibold text-stone-800">{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-stone-200 rounded-xl p-8 text-center space-y-2">
                <FileText className="w-10 h-10 text-stone-400 mx-auto" />
                <h4 className="font-bold text-stone-800 text-sm">No Application Selected for Deep Review</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Select an application from the Verification Queue to inspect its DigiLocker PKI documents and rule traces.
                </p>
                <button
                  onClick={() => setActiveTab('queue')}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold"
                >
                  Go to Queue
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Flags & Fraud (Syndicate Graph) */}
        {activeTab === 'fraud' && <FraudGraphPanel />}

        {/* Tab 5: Disbursal & UC (Delay Predictor) */}
        {activeTab === 'disbursal' && <DelayPredictorWidget />}

        {/* Tab 6: Grievances */}
        {activeTab === 'grievances' && (
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                  Jurisdiction Grievance Desk
                </h3>
                <p className="text-xs text-stone-500">
                  Tickets logged by students within your assigned institution or state.
                </p>
              </div>
              <span className="font-mono text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                2 Pending Redressal
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">GRV-2026-942: Income Certificate Update</span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">Under Inquiry</span>
                </div>
                <p className="text-stone-600 text-[11px]">
                  Applicant submitted updated FY 2026-27 income certificate issued by Tahsildar to resolve Clause 5.2 discrepancy.
                </p>
                <button
                  onClick={() => alert('Grievance marked resolved.')}
                  className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded font-bold text-[11px]"
                >
                  Mark Resolved &amp; Update Record
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Institute Scorecard */}
        {activeTab === 'institute' && (
          <InstituteScorecardTable
            language={language}
            userRole="officer"
            onIssueNotice={(inst) => onLogAction && onLogAction('OFFICER_DISPATCHED_INSTITUTE_NOTICE', inst)}
          />
        )}
      </div>

      {/* Return for Correction Modal */}
      {isSendBackOpen && selectedApp && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl border-2 border-amber-400 animate-slideUp">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h4 className="font-bold text-stone-900 text-sm">
                Return Application for Rectification
              </h4>
              <button onClick={() => setIsSendBackOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Select Defect Code</label>
                <select
                  value={sendBackReason}
                  onChange={(e) => setSendBackReason(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                >
                  <option value="name_mismatch">Name variation across Caste cert &amp; Bank passbook</option>
                  <option value="income_expired">Income certificate expired or illegible</option>
                  <option value="npci_dormant">Bank account not linked to Aadhaar on NPCI mapper</option>
                  <option value="community_inquiry">Gram Sabha attestation resolution required</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Instruction to Student</label>
                <textarea
                  rows={3}
                  value={sendBackMessage}
                  onChange={(e) => setSendBackMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsSendBackOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSendBack}
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
              >
                Dispatch Return Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </OfficerLayout>
  );
};
