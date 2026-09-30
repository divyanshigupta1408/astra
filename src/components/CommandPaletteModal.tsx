import React, { useState, useEffect, useMemo } from 'react';
import { AuthUser, AppLanguage } from '../types';
import { SCHEMES_DATABASE } from '../data/schemes';
import { INITIAL_OFFICER_APPLICATIONS } from '../data/mockApplications';
import { filterApplicationsForUser } from '../services/dataScoping';
import { STATE_COVERAGE_DATA } from '../data/mockAnalystData';
import { 
  Search, 
  Command, 
  FileText, 
  HelpCircle, 
  User, 
  ShieldCheck, 
  MapPin, 
  BarChart3, 
  ArrowRight, 
  X, 
  AlertTriangle,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser;
  language: AppLanguage;
  onNavigateTab?: (tab: string) => void;
  onSelectApplication?: (appId: string) => void;
  onSelectState?: (stateName: string) => void;
}

interface SearchItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  badge?: string;
  action: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  user,
  language,
  onNavigateTab,
  onSelectApplication,
  onSelectState
}) => {
  const [query, setQuery] = useState('');

  // Reset query on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  // Scoped Items based on User Role
  const allItems = useMemo<SearchItem[]>(() => {
    const list: SearchItem[] = [];

    if (user.role === 'student') {
      // 1. Schemes
      SCHEMES_DATABASE.forEach(scheme => {
        list.push({
          id: `scheme-${scheme.id}`,
          category: 'MoTA Schemes',
          title: scheme.name,
          subtitle: `${scheme.ministry} • Benefit: ${scheme.benefitAmount}`,
          badge: scheme.code,
          action: () => {
            if (onNavigateTab) onNavigateTab('eligibility');
            onClose();
          }
        });
      });

      // 2. Help Articles & Guidelines
      const helpArticles = [
        {
          id: 'help-npci',
          title: 'How to Seed Bank Account with Aadhaar on NPCI Mapper',
          subtitle: 'Step-by-step guidance for direct PFMS scholarship credit into your individual bank account.',
          badge: 'DBT Guide',
          tab: 'grievance'
        },
        {
          id: 'help-pesa',
          title: 'PESA Section 4(d) Community Attestation Route',
          subtitle: 'Special provision for forest dwellers without digitized revenue caste certificates.',
          badge: 'PESA / FRA',
          tab: 'apply'
        },
        {
          id: 'help-renewal',
          title: 'Annual Renewal Window & Attendance Criteria',
          subtitle: 'Statutory requirements for submitting semester-3 marksheet and attendance certificate.',
          badge: 'Renewal',
          tab: 'renewal'
        },
        {
          id: 'help-income',
          title: 'Income Certificate Validity & Tahsil Guidelines',
          subtitle: 'Guideline Clause 5.2 ceiling requirements and acceptable issuing authorities.',
          badge: 'Compliance',
          tab: 'documents'
        }
      ];

      helpArticles.forEach(art => {
        list.push({
          id: art.id,
          category: 'Help Articles & Guidelines',
          title: art.title,
          subtitle: art.subtitle,
          badge: art.badge,
          action: () => {
            if (onNavigateTab) onNavigateTab(art.tab);
            onClose();
          }
        });
      });

      // 3. Student's Own Documents
      const myDocs = [
        { title: 'ST Caste Certificate', sub: 'OD/MBJ/ST/2022/49102 • SDM Baripada • Verified' },
        { title: 'Annual Family Income Certificate', sub: 'Tahsildar Baripada • ₹1,85,000 • Verified' },
        { title: 'Class 12 Higher Secondary Marksheet', sub: 'CHSE Board • 78.4% • Verified' },
        { title: 'Bank Passbook & NPCI Mapper Status', sub: 'SBI Rourkela Main • Active Aadhaar Seeding' }
      ];

      myDocs.forEach((doc, idx) => {
        list.push({
          id: `mydoc-${idx}`,
          category: 'My Verified Documents',
          title: doc.title,
          subtitle: doc.sub,
          badge: 'DigiLocker PKI',
          action: () => {
            if (onNavigateTab) onNavigateTab('documents');
            onClose();
          }
        });
      });

      // 4. Quick Actions
      list.push(
        {
          id: 'action-apply',
          category: 'Quick Navigation',
          title: 'Fill / Edit Scholarship Application',
          subtitle: 'Smart application ingest with cross-document consistency checks',
          badge: 'Form',
          action: () => { if (onNavigateTab) onNavigateTab('apply'); onClose(); }
        },
        {
          id: 'action-track',
          category: 'Quick Navigation',
          title: 'Track Live Application Timeline',
          subtitle: 'Check Institute, State, and PFMS payment stage status',
          badge: 'Timeline',
          action: () => { if (onNavigateTab) onNavigateTab('track'); onClose(); }
        }
      );
    } else if (user.role === 'officer') {
      // OFFICER: STRICT DATA SCOPING! Only applications in their jurisdiction
      const scopedApps = filterApplicationsForUser(INITIAL_OFFICER_APPLICATIONS, user);

      scopedApps.forEach(app => {
        list.push({
          id: `app-${app.id}`,
          category: `Applications (${user.assignedInstitute || user.assignedState || 'Assigned'})`,
          title: `${app.studentName} — ${app.applicationNumber}`,
          subtitle: `${app.institute} • ${app.schemeName} • ₹${(app.income / 100000).toFixed(2)}L income`,
          badge: `${app.riskLane} Lane`,
          action: () => {
            if (onSelectApplication) onSelectApplication(app.id);
            if (onNavigateTab) onNavigateTab('review');
            onClose();
          }
        });
      });

      // Officer tools & settings
      list.push(
        {
          id: 'tool-queue',
          category: 'Officer Tools',
          title: 'Verification Queue',
          subtitle: 'Pending institutional and state scrutiny cases',
          badge: 'Queue',
          action: () => { if (onNavigateTab) onNavigateTab('queue'); onClose(); }
        },
        {
          id: 'tool-fraud',
          category: 'Officer Tools',
          title: 'Syndicate Fraud Ring Visualizer',
          subtitle: 'Graph network analysis of shared bank accounts and mobile numbers',
          badge: 'Risk Analysis',
          action: () => { if (onNavigateTab) onNavigateTab('fraud'); onClose(); }
        },
        {
          id: 'tool-delay',
          category: 'Officer Tools',
          title: 'Delay Predictor & Bottlenecks',
          subtitle: 'Predict SLA breaches across Institute and District nodal desks',
          badge: 'SLA Engine',
          action: () => { if (onNavigateTab) onNavigateTab('disbursal'); onClose(); }
        },
        {
          id: 'tool-sendback-templates',
          category: 'Settings & Templates',
          title: 'Reason Templates for Return-for-Correction',
          subtitle: 'Standardized GFR-compliant rejection & correction notices',
          badge: 'Templates',
          action: () => { if (onNavigateTab) onNavigateTab('queue'); onClose(); }
        }
      );
    } else if (user.role === 'analyst') {
      // MINISTRY: National reports, districts, metrics
      STATE_COVERAGE_DATA.forEach(state => {
        list.push({
          id: `state-${state.code}`,
          category: 'State & Regional Coverage',
          title: `${state.state} ST Overview`,
          subtitle: `ST Pop: ${state.stPopulationLakhs}L • Reach: ${state.reachPercentage}% • PVTGs: ${state.pvtgDistricts.join(', ')}`,
          badge: state.priorityStatus,
          action: () => {
            if (onSelectState) onSelectState(state.state);
            if (onNavigateTab) onNavigateTab('heatmaps');
            onClose();
          }
        });
      });

      const metrics = [
        { title: 'Turnaround Time (Median Days to Credit)', sub: 'Current: 11 Days • Down from 44 days (75% faster)', tab: 'overview' },
        { title: 'National ST Saturation Reach Rate', sub: 'Current: 79.2% of eligible census students enrolled', tab: 'overview' },
        { title: 'Fraud Blockage Value & Ring Synthesis', sub: '₹34.8 Crores safeguarded across 412 syndicated accounts', tab: 'overview' },
        { title: 'Fiscal Policy Simulator (Ceilings & Stipends)', sub: 'Simulate budget impact of income threshold shifts', tab: 'overview' },
        { title: 'District Enrollment & Bank-Seeding Camps', sub: 'Plan mobile saturation vans for Mayurbhanj, Dantewada, Koraput', tab: 'camps' },
        { title: 'Institute Scorecard & UC Compliance Audit', sub: 'Exemplary vs Critical Delay ranking of 150+ universities', tab: 'institutes' }
      ];

      metrics.forEach((m, idx) => {
        list.push({
          id: `metric-${idx}`,
          category: 'National Metrics & Briefings',
          title: m.title,
          subtitle: m.sub,
          badge: 'Ministry KPI',
          action: () => {
            if (onNavigateTab) onNavigateTab(m.tab);
            onClose();
          }
        });
      });
    }

    return list;
  }, [user, onNavigateTab, onSelectApplication, onSelectState, onClose]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 10);
    const q = query.toLowerCase();
    return allItems.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.badge && item.badge.toLowerCase().includes(q))
    ).slice(0, 15);
  }, [allItems, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-80 bg-stone-950/70 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl ring-1 ring-stone-900/10 overflow-hidden text-xs flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-stone-200 flex items-center gap-3 bg-stone-50">
          <Search className="w-4 h-4 text-stone-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              user.role === 'student' 
                ? 'Search schemes, guidelines, documents, or FAQ...' 
                : user.role === 'officer'
                ? 'Search applicants in your jurisdiction, fraud ring, or queue...'
                : 'Search states, districts, reports, metrics, or camp plans...'
            }
            className="w-full bg-transparent text-stone-900 placeholder-stone-400 focus:outline-hidden text-xs sm:text-sm font-medium"
          />
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-md hover:bg-stone-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-stone-100">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-stone-500 space-y-1">
              <Search className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="font-semibold text-stone-700">No results found for "{query}"</p>
              <p className="text-[11px] text-stone-400">Search within your role's authorized data boundary.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                className="w-full p-2.5 text-left rounded-xl hover:bg-stone-100/80 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-stone-600 bg-stone-200/80 px-1.5 py-0.2 rounded">
                      {item.category}
                    </span>
                    {item.badge && (
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-stone-900 text-xs truncate group-hover:text-emerald-950">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-stone-500 truncate mt-0.5">
                    {item.subtitle}
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-700 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </button>
            ))
          )}
        </div>

        {/* Palette Footer */}
        <div className="p-2.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500 px-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-700 capitalize">{user.role} Scope</span>
            <span>•</span>
            <span>Use ↑↓ to navigate</span>
          </div>
          <span className="font-mono text-[10px] bg-stone-200 px-1.5 py-0.5 rounded text-stone-700">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
