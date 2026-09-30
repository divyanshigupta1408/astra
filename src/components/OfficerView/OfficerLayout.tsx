import React from 'react';
import { AuthUser, AppLanguage } from '../../types';
import { VanavriddhiLogo } from '../Emblem';
import { BreadcrumbsBar } from '../BreadcrumbsBar';
import { 
  Building2, 
  CheckSquare, 
  FileSearch, 
  ShieldAlert, 
  CreditCard, 
  MessageSquare, 
  Building, 
  ShieldCheck,
  MapPin,
  Lock
} from 'lucide-react';

export type OfficerNavTab = 
  | 'overview'
  | 'queue'
  | 'review'
  | 'fraud'
  | 'disbursal'
  | 'grievances'
  | 'institute';

interface OfficerLayoutProps {
  user: AuthUser;
  activeTab: OfficerNavTab;
  onTabChange: (tab: OfficerNavTab) => void;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onLogout: () => void;
  onOpenCommandPalette?: () => void;
  onReplayTour?: () => void;
  children: React.ReactNode;
}

export const OfficerLayout: React.FC<OfficerLayoutProps> = ({
  user,
  activeTab,
  onTabChange,
  language,
  onLanguageChange,
  onLogout,
  onOpenCommandPalette,
  onReplayTour,
  children
}) => {
  const isInstituteNodal = user.officerSubRole === 'institute';

  const navItems: { id: OfficerNavTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'queue', label: 'Verification Queue', icon: CheckSquare },
    { id: 'review', label: 'Application Review', icon: FileSearch },
    { id: 'fraud', label: 'Flags & Fraud', icon: ShieldAlert },
    { id: 'disbursal', label: 'Disbursal & UC', icon: CreditCard },
    { id: 'grievances', label: 'Grievances', icon: MessageSquare },
    { id: 'institute', label: 'Institute', icon: Building }
  ];

  const currentTabItem = navItems.find(i => i.id === activeTab) || navItems[0];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-between">
      {/* Deep Green Officer Ribbon */}
      <div className="h-1.5 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800" />

      {/* Top Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <VanavriddhiLogo className="w-8 h-8" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-stone-900 tracking-tight">
                  A.S.T.R.A
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300">
                  {isInstituteNodal ? 'Institute Nodal Desk' : 'State Welfare Desk'}
                </span>
              </div>
              <p className="text-[10px] text-stone-500">
                {isInstituteNodal 
                  ? user.assignedInstitute 
                  : `State Directorate: ${user.assignedState || 'Odisha'}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-100 border border-stone-200 text-xs font-mono text-stone-700">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>{user.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs + Notification & Profile Bar */}
      <BreadcrumbsBar
        portalName={isInstituteNodal ? 'Institute Nodal Desk' : 'State Welfare Desk'}
        tabLabel={currentTabItem.label}
        user={user}
        onLogout={onLogout}
        onNavigateHome={() => onTabChange('overview')}
        accentColor="emerald"
        onOpenCommandPalette={onOpenCommandPalette}
        onReplayTour={onReplayTour}
      />

      {/* Main Body with Dense, Table-Driven Desktop Sidebar + Content */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* Desktop Sidebar (Deep Green Accent) */}
        <aside className="hidden md:block w-64 shrink-0 space-y-4">
          <div className="bg-white border-2 border-emerald-800 rounded-xl p-3 shadow-xs space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-950 px-3 py-1 flex items-center justify-between">
              <span>Officer Navigation</span>
              <span className="font-mono text-[9px] bg-emerald-100 px-1.5 py-0.2 rounded text-emerald-900 font-bold">
                GFR 2017
              </span>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-emerald-900 text-white shadow-xs'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-emerald-700'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Statutory Mandate Note */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-emerald-900 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Statutory Rule Enforcement</span>
            </div>
            <p className="text-[10px] text-emerald-800 leading-tight">
              Rule 230(1) GFR 2017 compliance active. AI flags are advisory; officer verification carries statutory authority.
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 pb-16 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-2 py-1.5 z-40 flex items-center justify-around shadow-lg">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-bold transition-all ${
                isActive ? 'text-emerald-900 font-extrabold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-emerald-800 scale-110' : 'text-stone-400'}`} />
              <span className="truncate max-w-16">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>

      {/* Subtle Footer */}
      <footer className="border-t border-stone-200 bg-white py-3 text-center text-[11px] text-stone-500 hidden md:block">
        General Financial Rules (GFR) 2017 • Institutional &amp; State Scrutiny Engine
      </footer>
    </div>
  );
};
