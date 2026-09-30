import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AuthUser, AppLanguage, OfficerApplication, CaseNote, OfficerSavedFilter } from '../../types';
import { INITIAL_OFFICER_APPLICATIONS } from '../../data/mockApplications';
import { filterApplicationsForUser } from '../../services/dataScoping';
import { OfficerLayout, OfficerNavTab } from './OfficerLayout';
import { FraudGraphPanel } from './FraudGraphPanel';
import { DelayPredictorWidget } from './DelayPredictorWidget';
import { InstituteScorecardTable } from '../InstituteScorecardTable';
import { AccessControlPanel } from '../AccessControlPanel';
import { BulkApproveModal } from './BulkApproveModal';
import { OfficerCompareModal } from './OfficerCompareModal';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { CommandPaletteModal } from '../CommandPaletteModal';
import { OnboardingTour } from '../OnboardingTour';
import { useToast } from '../Toast';
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
  MessageSquare,
  RotateCcw,
  Keyboard,
  Bookmark,
  Plus,
  BookmarkCheck,
  Check,
  Calendar,
  SendHorizontal
} from 'lucide-react';
import { ContextualHelp } from '../ContextualHelp';

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
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<OfficerNavTab>('queue');

  // Enforce data scoping at the data layer
  const scopedInitialApps = useMemo(() => {
    return filterApplicationsForUser(INITIAL_OFFICER_APPLICATIONS, user);
  }, [user]);

  const [applications, setApplications] = useState<OfficerApplication[]>(scopedInitialApps);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [laneFilter, setLaneFilter] = useState<string>('All');
  const [slaFilter, setSlaFilter] = useState<string>('All');
  const [sortOldestFirst, setSortOldestFirst] = useState<boolean>(true);

  // Saved Filters Tabs
  const [savedFilters, setSavedFilters] = useState<OfficerSavedFilter[]>([
    { id: 'f-all', name: 'My Queue (All)', laneFilter: 'All', slaFilter: 'All', sortOldestFirst: true, isPinned: true },
    { id: 'f-breach', name: 'Breaching in 3 days', laneFilter: 'All', slaFilter: 'At risk', sortOldestFirst: true, isPinned: true },
    { id: 'f-green', name: 'Green Lane (Fast-Track)', laneFilter: 'Green', slaFilter: 'All', sortOldestFirst: false, isPinned: true },
    { id: 'f-amber', name: 'Amber Friction', laneFilter: 'Amber', slaFilter: 'All', sortOldestFirst: true, isPinned: true }
  ]);
  const [activeFilterId, setActiveFilterId] = useState<string>('f-all');

  // Detail Drawer State
  const [selectedApp, setSelectedApp] = useState<OfficerApplication | null>(null);

  // Modals State
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isBulkApproveOpen, setIsBulkApproveOpen] = useState<boolean>(false);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Bulk Selection & Compare Selection
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [compareAppIds, setCompareAppIds] = useState<string[]>([]);

  // 10-Second Undo State for Bulk Approval
  const [undoSnapshot, setUndoSnapshot] = useState<{
    previousApps: OfficerApplication[];
    count: number;
    expiresAt: number;
  } | null>(null);
  const [undoSecondsRemaining, setUndoSecondsRemaining] = useState<number>(0);

  // "Send Back" Modal State with Reason Templates
  const [isSendBackOpen, setIsSendBackOpen] = useState<boolean>(false);
  const [sendBackReason, setSendBackReason] = useState<string>('name_mismatch');
  const [sendBackMessage, setSendBackMessage] = useState<string>('');
  const [officerFeedback, setOfficerFeedback] = useState<string | null>(null);

  // Case Notes Thread
  const [caseNotes, setCaseNotes] = useState<Record<string, CaseNote[]>>({
    'APP-2026-OD-001': [
      {
        id: 'cn-1',
        applicationId: 'APP-2026-OD-001',
        authorName: user.name,
        authorRole: user.officerSubRole === 'institute' ? 'Institute Nodal Officer' : 'State Officer',
        timestamp: 'Yesterday, 15:42 IST',
        content: 'Cross-checked academic marksheet with central university controller of examinations. Verified regular full-time student.'
      }
    ]
  });
  const [newNoteText, setNewNoteText] = useState<string>('');

  // Pre-written Reason Templates
  const reasonTemplates: Record<string, { en: string; hi: string }> = {
    name_mismatch: {
      en: "Discrepancy observed in candidate full name across ST Caste Certificate and Bank Mandate. Please upload an attested alias affidavit from Tahsildar within 15 days.",
      hi: "जाति प्रमाण पत्र एवं बैंक पासबुक में नाम भिन्नता पाई गई है। कृपया 15 दिनों के भीतर तहसीलदार से सत्यापित उपनाम (Alias) शपथ पत्र अपलोड करें।"
    },
    income_expired: {
      en: "Income Certificate submitted is expired or not issued for current financial year 2026-27. Please upload valid Form 16 or Tahsil Revenue assessment certificate.",
      hi: "प्रस्तुत आय प्रमाण पत्र वित्तीय वर्ष 2026-27 का नहीं है। कृपया चालू वित्तीय वर्ष का सक्षम प्राधिकारी द्वारा निर्गत वैध आय प्रमाण पत्र अपलोड करें।"
    },
    npci_inactive: {
      en: "Direct Benefit Transfer (DBT) verification failed: Bank account is not seeded with Aadhaar on NPCI mapper. Please visit your bank branch or nearest CSC to seed your individual account.",
      hi: "डीबीटी सत्यापन असफल: बैंक खाता आधार से एनपीसीआई मैपर पर सक्रिय नहीं है। कृपया अपनी बैंक शाखा में जाकर आधार सीडिंग करवाएं।"
    },
    marksheet_unclear: {
      en: "Uploaded marksheet scan is blurry or missing the university registrar seal. Please upload a clear 300 DPI scanned copy showing all semester grades.",
      hi: "अपलोड की गई अंकसूची अस्पष्ट है अथवा प्राधिकृत हस्ताक्षर व मुहर नहीं है। कृपया 300 DPI की स्पष्ट प्रति अपलोड करें।"
    },
    pesa_attestation: {
      en: "Community Attestation requires physical Gram Sabha resolution signature from Ward Member and local Tahsil inquiry verification.",
      hi: "सामुदायिक सत्यापन हेतु स्थानीय ग्राम सभा एवं वार्ड सदस्य का हस्ताक्षरित प्रस्ताव संलग्न किया जाना अनिवार्य है।"
    }
  };

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

  // Apply Saved Filter Tab
  const handleApplySavedFilter = (filter: OfficerSavedFilter) => {
    setActiveFilterId(filter.id);
    setLaneFilter(filter.laneFilter);
    setSlaFilter(filter.slaFilter);
    setSortOldestFirst(filter.sortOldestFirst);
  };

  // Save current filter preset
  const handleSaveCurrentFilter = () => {
    const filterName = prompt('Enter a name for this custom filter preset:', `Preset ${savedFilters.length + 1}`);
    if (filterName && filterName.trim()) {
      const newFilter: OfficerSavedFilter = {
        id: `f-${Date.now()}`,
        name: filterName.trim(),
        laneFilter,
        slaFilter,
        sortOldestFirst,
        isPinned: true
      };
      setSavedFilters(prev => [...prev, newFilter]);
      setActiveFilterId(newFilter.id);
      showToast(`Filter preset "${filterName}" saved and pinned.`, 'success');
    }
  };

  // 10-Second Undo Timer
  useEffect(() => {
    if (!undoSnapshot) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((undoSnapshot.expiresAt - Date.now()) / 1000));
      setUndoSecondsRemaining(remaining);
      if (remaining <= 0) {
        setUndoSnapshot(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [undoSnapshot]);

  const handleUndoBulkApproval = () => {
    if (!undoSnapshot) return;
    setApplications(undoSnapshot.previousApps);
    showToast(`Bulk approval undone. ${undoSnapshot.count} applications restored to queue.`, 'info', 'Undone');
    setUndoSnapshot(null);
    if (onLogAction) {
      onLogAction('OFFICER_UNDONE_BULK_APPROVAL', `${undoSnapshot.count} records restored`);
    }
  };

  // Actions
  const handleApprove = (app: OfficerApplication) => {
    setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'Institute Verified', daysPending: 0 } : a));
    setOfficerFeedback(`Statutory GFR Approval Recorded for ${app.studentName} (${app.applicationNumber}). Forwarded to State Level.`);
    setTimeout(() => setOfficerFeedback(null), 5000);
    setSelectedApp(null);
    if (onLogAction) {
      onLogAction('OFFICER_APPROVAL_SIGN_OFF', `${app.id} (${app.studentName})`);
    }
  };

  const handleEscalate = (app: OfficerApplication) => {
    setOfficerFeedback(`Application ${app.applicationNumber} escalated to State Directorate of Tribal Welfare for special committee review.`);
    setTimeout(() => setOfficerFeedback(null), 5000);
    if (onLogAction) {
      onLogAction('OFFICER_ESCALATED_TO_STATE', app.id);
    }
  };

  const handleOpenSendBack = (app: OfficerApplication) => {
    setSelectedApp(app);
    setSendBackReason('name_mismatch');
    const msg = language === 'hi' ? reasonTemplates['name_mismatch'].hi : reasonTemplates['name_mismatch'].en;
    setSendBackMessage(msg);
    setIsSendBackOpen(true);
  };

  const handleReasonChange = (reasonKey: string) => {
    setSendBackReason(reasonKey);
    const template = reasonTemplates[reasonKey];
    if (template) {
      setSendBackMessage(language === 'hi' ? template.hi : template.en);
    }
  };

  const handleConfirmSendBack = () => {
    if (!selectedApp) return;
    setApplications(prev => prev.map(a => a.id === selectedApp.id ? { ...a, status: 'Returned for Correction' } : a));
    setOfficerFeedback(`File ${selectedApp.applicationNumber} returned for student rectification with reason: ${sendBackReason}.`);
    setTimeout(() => setOfficerFeedback(null), 5000);
    setIsSendBackOpen(false);
    setSelectedApp(null);
    if (onLogAction) {
      onLogAction('OFFICER_RETURNED_FOR_CORRECTION', `${selectedApp.id} - ${sendBackReason}`);
    }
  };

  // Keyboard Shortcuts in Application Review: A, S, E, J, K, ?
  useEffect(() => {
    if (activeTab !== 'review' || !selectedApp) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleApprove(selectedApp);
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleOpenSendBack(selectedApp);
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        handleEscalate(selectedApp);
      } else if (e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        const currentIndex = filteredApps.findIndex(a => a.id === selectedApp.id);
        if (currentIndex < filteredApps.length - 1) {
          setSelectedApp(filteredApps[currentIndex + 1]);
        }
      } else if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        const currentIndex = filteredApps.findIndex(a => a.id === selectedApp.id);
        if (currentIndex > 0) {
          setSelectedApp(filteredApps[currentIndex - 1]);
        }
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, selectedApp, filteredApps]);

  // Bulk Approval Execution
  const handleBulkApproveConfirm = () => {
    const selectedSet = new Set(selectedAppIds);
    const snapshot = [...applications];
    setApplications(prev => prev.map(a => selectedSet.has(a.id) ? { ...a, status: 'Institute Verified', daysPending: 0 } : a));
    
    setUndoSnapshot({
      previousApps: snapshot,
      count: selectedAppIds.length,
      expiresAt: Date.now() + 10000
    });
    setUndoSecondsRemaining(10);
    setSelectedAppIds([]);
    showToast(`Bulk approved ${selectedAppIds.length} Green Lane applications. 10-second undo window active.`, 'success');
    if (onLogAction) {
      onLogAction('OFFICER_BULK_GREEN_LANE_APPROVED', `${selectedAppIds.length} applications`);
    }
  };

  // Add Case Note
  const handleAddCaseNote = () => {
    if (!selectedApp || !newNoteText.trim()) return;
    const note: CaseNote = {
      id: `cn-${Date.now()}`,
      applicationId: selectedApp.id,
      authorName: user.name,
      authorRole: user.officerSubRole === 'institute' ? 'Institute Nodal' : 'State Officer',
      timestamp: 'Just now',
      content: newNoteText.trim()
    };

    setCaseNotes(prev => ({
      ...prev,
      [selectedApp.id]: [...(prev[selectedApp.id] || []), note]
    }));
    setNewNoteText('');
    showToast('Case note added to application audit trail.', 'success');
  };

  // KPI Metrics
  const greenCount = applications.filter(a => a.riskLane === 'Green').length;
  const amberCount = applications.filter(a => a.riskLane === 'Amber').length;
  const redCount = applications.filter(a => a.riskLane === 'Red').length;
  const breachedCount = applications.filter(a => a.slaStatus === 'Breached').length;

  return (
    <>
      <OfficerLayout
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        language={language}
        onLanguageChange={onLanguageChange}
        onLogout={onLogout}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onReplayTour={() => setIsTourOpen(true)}
      >
      <div className="space-y-5">
        {/* Your Access Scope Panel */}
        <AccessControlPanel user={user} totalFilteredRecords={applications.length} />

        {/* 10-Second Undo Banner for Bulk Approval */}
        {undoSnapshot && (
          <div className="bg-amber-900 text-amber-100 border-2 border-amber-400 p-3.5 rounded-xl text-xs flex items-center justify-between shadow-lg animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-amber-300 animate-spin" />
              <div>
                <span className="font-bold text-white">Bulk Approval Confirmed ({undoSnapshot.count} Files).</span>
                <span className="text-amber-200 ml-1">
                  Revert available for <strong className="font-mono text-amber-100">{undoSecondsRemaining}s</strong>.
                </span>
              </div>
            </div>
            <button
              onClick={handleUndoBulkApproval}
              className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-lg cursor-pointer shadow-xs transition-colors"
            >
              Undo Approval
            </button>
          </div>
        )}

        {officerFeedback && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between animate-fadeIn shadow-2xs">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{officerFeedback}</span>
            </div>
            <span className="font-mono text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">
              GFR-Signed
            </span>
          </div>
        )}

        {/* TAB 1: OVERVIEW & DAILY DIGEST */}
        {activeTab === 'overview' && (
          <div className="space-y-5 animate-fadeIn">
            {/* 7. DAILY DIGEST CARD ON OVERVIEW */}
            <div className="bg-gradient-to-br from-emerald-950 to-stone-900 text-white rounded-2xl p-6 shadow-md space-y-4 border border-emerald-800">
              <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-stone-100">
                      Daily Jurisdictional Scrutiny Digest
                    </h3>
                    <p className="text-[11px] text-emerald-300">
                      Target desk: {user.assignedInstitute || user.assignedState || 'National'} • Today's actionable briefing
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[10px] font-bold bg-emerald-800 text-emerald-100 px-2.5 py-1 rounded-full border border-emerald-700">
                  IST Cycle Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* 1. What needs action today */}
                <div className="bg-white/10 rounded-xl p-4 space-y-1.5 backdrop-blur-xs border border-white/10">
                  <div className="text-[10px] font-mono uppercase font-bold tracking-wider text-amber-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>What Needs Action Today</span>
                  </div>
                  <div className="text-xl font-bold font-mono text-white">
                    {applications.filter(a => a.status === 'Submitted').length} Applications
                  </div>
                  <p className="text-[11px] text-stone-300 leading-snug">
                    Including {greenCount} Green lane fast-tracks and 2 PVTG community attestation inquiries.
                  </p>
                </div>

                {/* 2. Close to SLA breach */}
                <div className="bg-white/10 rounded-xl p-4 space-y-1.5 backdrop-blur-xs border border-white/10">
                  <div className="text-[10px] font-mono uppercase font-bold tracking-wider text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Close to SLA Breach</span>
                  </div>
                  <div className="text-xl font-bold font-mono text-rose-300">
                    {applications.filter(a => a.slaStatus === 'At risk' || a.slaStatus === 'Breached').length} Files
                  </div>
                  <p className="text-[11px] text-stone-300 leading-snug">
                    2 files have reached 36 hours of the statutory 48-hour institutional scrutiny deadline.
                  </p>
                </div>

                {/* 3. Completed yesterday */}
                <div className="bg-white/10 rounded-xl p-4 space-y-1.5 backdrop-blur-xs border border-white/10">
                  <div className="text-[10px] font-mono uppercase font-bold tracking-wider text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed Yesterday</span>
                  </div>
                  <div className="text-xl font-bold font-mono text-emerald-300">
                    14 Verified
                  </div>
                  <p className="text-[11px] text-stone-300 leading-snug">
                    ₹18.40 Lakhs cumulative grant sanctioned and forwarded to State Nodal Directorate.
                  </p>
                </div>
              </div>
            </div>

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

            {/* Quick Actions & Recent Queue Priorities */}
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
                          setActiveTab('review');
                        }}
                        className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold cursor-pointer"
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

        {/* TAB 2: VERIFICATION QUEUE WITH SAVED FILTERS & BULK APPROVE */}
        {activeTab === 'queue' && (
          <div className="space-y-4 animate-fadeIn">
            {/* 4. PINNED SAVED FILTERS TABS */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 mr-1 flex items-center gap-1">
                  <Bookmark className="w-3 h-3 text-stone-500" />
                  <span>Saved Tabs:</span>
                </span>
                {savedFilters.map((sf) => (
                  <button
                    key={sf.id}
                    onClick={() => handleApplySavedFilter(sf)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeFilterId === sf.id
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    {sf.name}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleSaveCurrentFilter}
                className="px-2.5 py-1 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                title="Save current filters as a quick-switch tab"
              >
                <Plus className="w-3.5 h-3.5 text-stone-500" />
                <span>Save Filter</span>
              </button>
            </div>

            {/* Filter and Search Bar + Bulk Approval Actions */}
            <div className="bg-white border border-stone-200 rounded-xl p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search student name, application #..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50 focus:bg-white focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={laneFilter}
                  onChange={(e) => {
                    setLaneFilter(e.target.value);
                    setActiveFilterId('custom');
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white font-medium"
                >
                  <option value="All">All Risk Lanes</option>
                  <option value="Green">Green (Auto-pass)</option>
                  <option value="Amber">Amber (Review)</option>
                  <option value="Red">Red (High friction)</option>
                </select>

                <select
                  value={slaFilter}
                  onChange={(e) => {
                    setSlaFilter(e.target.value);
                    setActiveFilterId('custom');
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white font-medium"
                >
                  <option value="All">All SLA Tiers</option>
                  <option value="On time">On time</option>
                  <option value="At risk">At risk</option>
                  <option value="Breached">Breached (&gt; 30d)</option>
                </select>

                <button
                  type="button"
                  onClick={() => setSortOldestFirst(!sortOldestFirst)}
                  className="px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>{sortOldestFirst ? 'Oldest Pending' : 'Newest'}</span>
                </button>

                {/* 3. BULK APPROVE BUTTON FOR GREEN LANE */}
                {selectedAppIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsBulkApproveOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer animate-in zoom-in-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Bulk Approve ({selectedAppIds.length})</span>
                  </button>
                )}

                {/* 5. COMPARE BUTTON FOR 2 SELECTED */}
                {compareAppIds.length === 2 && (
                  <button
                    type="button"
                    onClick={() => setIsCompareOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-900 hover:bg-indigo-950 text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer animate-in zoom-in-95"
                  >
                    <Scale className="w-3.5 h-3.5 text-indigo-300" />
                    <span>Compare (2 Selected)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Dense Verification Table with Selection Checkboxes */}
            <div className="overflow-x-auto bg-white border border-stone-200 rounded-xl shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-200">
                    <th className="py-2.5 px-3 w-8">
                      <input
                        type="checkbox"
                        checked={selectedAppIds.length > 0 && selectedAppIds.length === filteredApps.filter(a => a.riskLane === 'Green').length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAppIds(filteredApps.filter(a => a.riskLane === 'Green').map(a => a.id));
                          } else {
                            setSelectedAppIds([]);
                          }
                        }}
                        title="Select all Green Lane applications for bulk approval"
                        className="rounded border-stone-300 text-emerald-800 focus:ring-emerald-700 cursor-pointer"
                      />
                    </th>
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
                      <td colSpan={10} className="py-6 text-center text-stone-500 italic">
                        No applications in queue for this jurisdiction matching selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map((app) => {
                      const isSelected = selectedAppIds.includes(app.id);
                      const isCompareSelected = compareAppIds.includes(app.id);

                      return (
                        <tr key={app.id} className={`hover:bg-stone-50/80 transition-colors ${isSelected ? 'bg-emerald-50/40' : ''}`}>
                          <td className="py-2.5 px-3">
                            {app.riskLane === 'Green' ? (
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedAppIds(prev => [...prev, app.id]);
                                  } else {
                                    setSelectedAppIds(prev => prev.filter(id => id !== app.id));
                                  }
                                }}
                                className="rounded border-stone-300 text-emerald-800 focus:ring-emerald-700 cursor-pointer"
                              />
                            ) : (
                              <input
                                type="checkbox"
                                checked={isCompareSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    if (compareAppIds.length < 2) {
                                      setCompareAppIds(prev => [...prev, app.id]);
                                    } else {
                                      setCompareAppIds([compareAppIds[1], app.id]);
                                    }
                                  } else {
                                    setCompareAppIds(prev => prev.filter(id => id !== app.id));
                                  }
                                }}
                                title="Select up to 2 for side-by-side comparison"
                                className="rounded border-stone-300 text-indigo-700 focus:ring-indigo-700 cursor-pointer"
                              />
                            )}
                          </td>
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
                                onClick={() => {
                                  setSelectedApp(app);
                                  setActiveTab('review');
                                }}
                                className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold cursor-pointer"
                              >
                                Review
                              </button>
                              <button
                                onClick={() => handleApprove(app)}
                                className="px-2 py-1 rounded bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold shadow-2xs cursor-pointer"
                              >
                                Approve
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: APPLICATION REVIEW (WITH KEYBOARD SHORTCUTS & CASE NOTES) */}
        {activeTab === 'review' && (
          <div className="space-y-4 animate-fadeIn">
            {selectedApp ? (
              <div className="bg-white border-2 border-emerald-800 rounded-2xl p-5 shadow-sm space-y-4">
                {/* Header with Shortcut Hints */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-stone-200 pb-3 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-500">
                        App ID: {selectedApp.applicationNumber}
                      </span>
                      {/* Keyboard shortcuts trigger */}
                      <button
                        type="button"
                        onClick={() => setIsShortcutsOpen(true)}
                        className="text-[10px] font-mono text-emerald-800 hover:text-emerald-950 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 cursor-pointer"
                      >
                        <Keyboard className="w-3 h-3" />
                        <span>Shortcuts [?]</span>
                      </button>
                    </div>
                    <h3 className="text-lg font-extrabold text-stone-900 mt-0.5">
                      {selectedApp.studentName}
                    </h3>
                    <p className="text-xs text-stone-600">
                      {selectedApp.institute} • {selectedApp.schemeName}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleEscalate(selectedApp)}
                      className="px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                      title="Press E to Escalate"
                    >
                      <kbd className="px-1 py-0.2 bg-stone-200 rounded text-[9px] font-mono">E</kbd>
                      <span>Escalate</span>
                    </button>
                    <button
                      onClick={() => handleOpenSendBack(selectedApp)}
                      className="px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-1 cursor-pointer"
                      title="Press S to Return for Correction"
                    >
                      <kbd className="px-1 py-0.2 bg-amber-200 rounded text-[9px] font-mono">S</kbd>
                      <span>Return for Correction</span>
                    </button>
                    <button
                      onClick={() => handleApprove(selectedApp)}
                      className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                      title="Press A to Approve"
                    >
                      <kbd className="px-1 py-0.2 bg-emerald-700 text-white rounded text-[9px] font-mono">A</kbd>
                      <span>Statutory Sign-Off ✓</span>
                    </button>
                  </div>
                </div>

                {/* Deterministic Rule Trace Box */}
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-xs space-y-1">
                  <div className="font-bold text-stone-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <Scale className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Statutory Rule Engine Trace (Deterministic GFR Evaluation)</span>
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
                      <div key={doc.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-900">{doc.name}</span>
                          <span className="font-mono text-[10px] text-emerald-700 font-bold">
                            {doc.confidenceScore}% OCR
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500">Issuer: {doc.issuer}</div>
                        <div className="bg-white p-2 rounded-lg border border-stone-100 text-[10px] font-mono space-y-0.5">
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

                {/* 6. CASE NOTES THREAD (VISIBLE TO OFFICERS IN SAME JURISDICTION) */}
                <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-emerald-800" />
                      <span>Case Notes &amp; Officer Audit Trail</span>
                    </h4>
                    <span className="text-[10px] font-mono text-stone-500">
                      Scoped to {user.assignedInstitute || user.assignedState || 'Jurisdiction'}
                    </span>
                  </div>

                  {/* Existing Notes Thread */}
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {(caseNotes[selectedApp.id] || []).length === 0 ? (
                      <p className="text-stone-400 text-xs italic py-2">
                        No previous case notes recorded for this applicant. Add an internal verification note below.
                      </p>
                    ) : (
                      caseNotes[selectedApp.id].map((cn) => (
                        <div key={cn.id} className="p-2.5 rounded-lg bg-white border border-stone-200 text-xs space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold text-stone-800">
                              {cn.authorName} ({cn.authorRole})
                            </span>
                            <span className="text-stone-400 font-mono">{cn.timestamp}</span>
                          </div>
                          <p className="text-stone-700 leading-relaxed">{cn.content}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add New Case Note Form */}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add an internal observation, physical check, or tahsil phone remark..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddCaseNote();
                      }}
                      className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                    />
                    <button
                      type="button"
                      onClick={handleAddCaseNote}
                      className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <SendHorizontal className="w-3.5 h-3.5" />
                      <span>Add Note</span>
                    </button>
                  </div>
                </div>

                {/* Footer Navigation Hints */}
                <div className="flex items-center justify-between border-t border-stone-200 pt-3 text-[11px] text-stone-500">
                  <div className="flex items-center gap-2">
                    <span>Use <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-300 rounded font-mono font-bold">J</kbd> next, <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-300 rounded font-mono font-bold">K</kbd> prev</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('queue')}
                    className="text-emerald-800 font-bold hover:underline"
                  >
                    Back to Queue ({filteredApps.length})
                  </button>
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
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold cursor-pointer"
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
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">#GRV-2026-081: Name spelling mismatch on caste certificate</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">Action Required</span>
                </div>
                <p className="text-stone-600">
                  Student Ramu Kumar uploaded Tahsil affidavit explaining alias "Ramu". Requests officer re-scrutiny.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. "SEND BACK" MODAL WITH REASON TEMPLATES (ENGLISH & HINDI) */}
      {isSendBackOpen && selectedApp && (
        <div className="fixed inset-0 z-70 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsSendBackOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                Statutory Return-for-Correction Notice
              </span>
              <h3 className="text-base font-bold text-stone-900">
                Return Application {selectedApp.applicationNumber} to Student
              </h3>
              <p className="text-stone-500 text-xs">
                Candidate: <strong>{selectedApp.studentName}</strong> • {selectedApp.institute}
              </p>
            </div>

            {/* Reason Templates Dropdown */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-stone-700">
                Standard Reason Template:
              </label>
              <select
                value={sendBackReason}
                onChange={(e) => handleReasonChange(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs font-semibold text-stone-800"
              >
                <option value="name_mismatch">Name Discrepancy Across Documents (Caste vs Passbook)</option>
                <option value="income_expired">Income Certificate Expired / Not Issued for FY 2026-27</option>
                <option value="npci_inactive">Bank Account Not Aadhaar-Seeded on NPCI Mapper</option>
                <option value="marksheet_unclear">Marksheet Scan Unclear / Missing Registrar Stamp</option>
                <option value="pesa_attestation">PESA Section 4(d) Gram Sabha Physical Resolution Needed</option>
              </select>
            </div>

            {/* Editable Notice Textarea */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-700">
                Pre-written Editable Message for Candidate ({language === 'hi' ? 'हिन्दी' : 'English'}):
              </label>
              <textarea
                rows={4}
                value={sendBackMessage}
                onChange={(e) => setSendBackMessage(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg p-3 text-xs text-stone-800 font-medium focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsSendBackOpen(false)}
                className="px-3.5 py-2 border border-stone-300 text-stone-700 font-bold rounded-lg hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSendBack}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Notice to Candidate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Approve Preview Modal */}
      <BulkApproveModal
        isOpen={isBulkApproveOpen}
        onClose={() => setIsBulkApproveOpen(false)}
        selectedApps={applications.filter(a => selectedAppIds.includes(a.id))}
        onConfirm={handleBulkApproveConfirm}
      />

      {/* Side-by-Side Dual Compare Modal */}
      <OfficerCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        appA={applications.find(a => a.id === compareAppIds[0]) || null}
        appB={applications.find(a => a.id === compareAppIds[1]) || null}
      />

      {/* Keyboard Shortcuts Cheat Sheet Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        language={language}
      />
    </OfficerLayout>

    {/* Global Command Palette (Ctrl+K) */}
    <CommandPaletteModal
      isOpen={isCommandPaletteOpen}
      onClose={() => setIsCommandPaletteOpen(false)}
      user={user}
      language={language}
      onNavigateTab={(tab) => {
        setActiveTab(tab as OfficerNavTab);
        setIsCommandPaletteOpen(false);
      }}
      onSelectApplication={(appId) => {
        const found = applications.find(a => a.id === appId);
        if (found) {
          setSelectedApp(found);
          setActiveTab('review');
        }
        setIsCommandPaletteOpen(false);
      }}
    />

    {/* Onboarding Tour */}
    <OnboardingTour
      isOpen={isTourOpen}
      onClose={() => setIsTourOpen(false)}
      onSelectRole={() => setIsTourOpen(false)}
    />
  </>
  );
};
