import React from 'react';
import { UserRole, AppLanguage } from '../types';
import { translations } from '../locales/translations';
import { GovtEmblem } from './Emblem';
import { 
  Languages, 
  UserCheck, 
  Building2, 
  BarChart3, 
  Layers, 
  History, 
  ShieldCheck, 
  HelpCircle,
  Wifi,
  WifiOff,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  onOpenSystemDesign: () => void;
  onOpenAuditLog: () => void;
  onOpenPrivacy: () => void;
  onStartTour: () => void;
  onStartPersonaDemo?: () => void;
  isPersonaDemoActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  language,
  onLanguageChange,
  activeTab,
  onTabChange,
  isOffline,
  onToggleOffline,
  onOpenSystemDesign,
  onOpenAuditLog,
  onOpenPrivacy,
  onStartTour,
  onStartPersonaDemo,
  isPersonaDemoActive = false
}) => {
  const t = translations[language];

  return (
    <header className="border-b border-stone-200 bg-white sticky top-0 z-40 shadow-xs">
      {/* Topmost Official Bar with Saffron Stripe */}
      <div className="h-1 bg-gradient-to-r from-amber-600 via-orange-500 to-emerald-700" />
      
      {/* Core Principle Banner */}
      <div className="bg-emerald-950 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-semibold tracking-wide text-amber-300">
            {t.corePrinciple}
          </span>
          <span className="hidden md:inline text-stone-300 text-[11px]">
            — {t.corePrincipleSub}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Offline-First Indicator */}
          <button
            onClick={onToggleOffline}
            title={isOffline ? "Currently running in offline cached mode (click to toggle)" : "Online with real-time bridge (click to simulate offline)"}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              isOffline 
                ? 'bg-amber-600 text-white' 
                : 'bg-emerald-800 text-emerald-200 hover:bg-emerald-700'
            }`}
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3 h-3 text-amber-200" />
                <span>Offline mode: will sync later</span>
              </>
            ) : (
              <>
                <Wifi className="w-3 h-3 text-emerald-300" />
                <span>Sync Online</span>
              </>
            )}
          </button>

          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-900 border border-emerald-800 text-stone-300">
            {t.demoDataBadge}
          </span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Emblem & Portal Identity */}
        <div className="flex items-center gap-3">
          <GovtEmblem className="w-10 h-10 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-emerald-950 font-serif">
                {t.appTitle}
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200 font-semibold">
                MoTA v2.4
              </span>
            </div>
            <p className="text-xs text-stone-600 font-medium">
              {t.ministryName}
            </p>
          </div>
        </div>

        {/* Global Action Controls: Role Switcher & Language */}
        <div className="flex items-center gap-3">
          {/* Role Switcher */}
          <div className="flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs">
            <label className="text-[11px] font-semibold text-stone-500 px-2 flex items-center gap-1">
              <span>View:</span>
            </label>
            <button
              onClick={() => onRoleChange('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                currentRole === 'student'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{t.roleSwitcher.student}</span>
            </button>
            <button
              onClick={() => onRoleChange('officer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                currentRole === 'officer'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{t.roleSwitcher.officer}</span>
            </button>
            <button
              onClick={() => onRoleChange('analyst')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                currentRole === 'analyst'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{t.roleSwitcher.analyst}</span>
            </button>
          </div>

          {/* Language Selector */}
          <div className="relative inline-flex items-center">
            <Languages className="w-4 h-4 text-stone-500 absolute left-2.5 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as AppLanguage)}
              aria-label="Select Language"
              className="pl-8 pr-4 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 border border-stone-200 text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
            >
              <option value="en">English (Official)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option disabled value="gondi">Gondi (गोंडी) — Coming Soon</option>
              <option disabled value="santali">Santali (संताली/Ol Chiki) — Coming Soon</option>
              <option disabled value="bhili">Bhili (भीली) — Coming Soon</option>
              <option disabled value="kokborok">Kokborok (कॉकबोरोक) — Coming Soon</option>
            </select>
          </div>

          {/* Persona Demo Button: "Demo as Meena" */}
          {onStartPersonaDemo && (
            <button
              onClick={onStartPersonaDemo}
              title="Load Pre-filled Persona (Meena - Remote ST Scholar from Dantewada, Hindi UI)"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                isPersonaDemoActive
                  ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-500 animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-stone-950" />
              <span>{language === 'hi' ? '✨ मीना डेमो' : '✨ Demo as Meena'}</span>
            </button>
          )}

          {/* Onboarding Tour Button */}
          <button
            onClick={onStartTour}
            title="Start Onboarding Tour"
            className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-emerald-800 hover:bg-stone-50 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub Navigation Bar for View / Global Pages */}
      <div className="bg-stone-50 border-t border-stone-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto py-1">
          {/* View Specific Tabs (if Student) */}
          {currentRole === 'student' && (
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => onTabChange('eligibility')}
                className={`px-3 py-1.5 font-medium border-b-2 transition-all ${
                  activeTab === 'eligibility'
                    ? 'border-emerald-700 text-emerald-950 font-semibold'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                1. {t.nav.eligibility}
              </button>
              <button
                onClick={() => onTabChange('apply')}
                className={`px-3 py-1.5 font-medium border-b-2 transition-all ${
                  activeTab === 'apply'
                    ? 'border-emerald-700 text-emerald-950 font-semibold'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                2. {t.nav.apply}
              </button>
              <button
                onClick={() => onTabChange('track')}
                className={`px-3 py-1.5 font-medium border-b-2 transition-all ${
                  activeTab === 'track'
                    ? 'border-emerald-700 text-emerald-950 font-semibold'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                3. {t.nav.track}
              </button>
            </div>
          )}

          {currentRole === 'officer' && (
            <div className="flex items-center gap-1 text-xs text-stone-600 font-medium py-1">
              <span className="text-emerald-900 font-semibold flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                Institutional & State Verification Desk
              </span>
              <span className="text-stone-400">|</span>
              <span>Statutory Rule Verification & Fraud Community Detection</span>
            </div>
          )}

          {currentRole === 'analyst' && (
            <div className="flex items-center gap-1 text-xs text-stone-600 font-medium py-1">
              <span className="text-emerald-900 font-semibold flex items-center gap-1">
                <BarChart3 className="w-3.5 h-3.5 text-emerald-700" />
                National Tribal Welfare Analytics & Policy Simulation
              </span>
            </div>
          )}

          {/* Global Utility Links */}
          <div className="flex items-center gap-4 text-xs font-medium text-stone-600">
            <button
              onClick={onOpenSystemDesign}
              className="flex items-center gap-1 hover:text-emerald-800 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-stone-500" />
              <span>{t.nav.systemDesign}</span>
            </button>
            <button
              onClick={onOpenAuditLog}
              className="flex items-center gap-1 hover:text-emerald-800 transition-colors"
            >
              <History className="w-3.5 h-3.5 text-stone-500" />
              <span>{t.nav.auditLog}</span>
            </button>
            <button
              onClick={onOpenPrivacy}
              className="flex items-center gap-1 hover:text-emerald-800 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
              <span>{t.nav.privacy}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
