import React, { useState } from 'react';
import { AuthUser, AppLanguage } from '../../types';
import { VanavriddhiLogo } from '../Emblem';
import { BreadcrumbsBar } from '../BreadcrumbsBar';
import { 
  Home, 
  HelpCircle, 
  FileText, 
  FolderCheck, 
  Clock, 
  RefreshCw, 
  MessageSquare, 
  Languages, 
  PhoneCall,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export type StudentNavTab = 
  | 'home'
  | 'eligibility'
  | 'apply'
  | 'documents'
  | 'track'
  | 'renewal'
  | 'grievance';

interface StudentLayoutProps {
  user: AuthUser;
  activeTab: StudentNavTab;
  onTabChange: (tab: StudentNavTab) => void;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onLogout: () => void;
  onOpenCommandPalette?: () => void;
  onReplayTour?: () => void;
  children: React.ReactNode;
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({
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
  const navItems: { id: StudentNavTab; labelHi: string; labelEn: string; icon: React.ElementType }[] = [
    { id: 'home', labelHi: 'होम (Home)', labelEn: 'Home', icon: Home },
    { id: 'eligibility', labelHi: 'पात्रता जांचें', labelEn: 'Check Eligibility', icon: HelpCircle },
    { id: 'apply', labelHi: 'मेरा आवेदन', labelEn: 'My Application', icon: FileText },
    { id: 'documents', labelHi: 'दस्तावेज़', labelEn: 'Documents', icon: FolderCheck },
    { id: 'track', labelHi: 'स्थिति ट्रैक करें', labelEn: 'Track Status', icon: Clock },
    { id: 'renewal', labelHi: 'नवीनीकरण (Renewal)', labelEn: 'Renewal', icon: RefreshCw },
    { id: 'grievance', labelHi: 'सहायता व शिकायत', labelEn: 'Help & Grievance', icon: MessageSquare }
  ];

  const currentNavItem = navItems.find(i => i.id === activeTab) || navItems[0];
  const currentTabLabel = language === 'hi' ? currentNavItem.labelHi : currentNavItem.labelEn;

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-between">
      {/* Warm Saffron Stripe for Student Portal */}
      <div className="h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

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
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                  {language === 'hi' ? 'छात्र पोर्टल' : 'Student Portal'}
                </span>
              </div>
              <p className="text-[10px] text-stone-500">
                {language === 'hi' ? 'जनजातीय कार्य मंत्रालय • भारत सरकार' : 'Ministry of Tribal Affairs • Government of India'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Hindi / English Toggle */}
            <div className="flex rounded-md border border-stone-300 bg-stone-50 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  language === 'en' ? 'bg-amber-600 text-white shadow-2xs' : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  language === 'hi' ? 'bg-amber-600 text-white shadow-2xs' : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs + Notification & Profile Bar */}
      <BreadcrumbsBar
        portalName={language === 'hi' ? 'छात्र पोर्टल' : 'Student Portal'}
        tabLabel={currentTabLabel}
        user={user}
        onLogout={onLogout}
        onNavigateHome={() => onTabChange('home')}
        accentColor="amber"
        onOpenCommandPalette={onOpenCommandPalette}
        onReplayTour={onReplayTour}
      />

      {/* Main Body with Desktop Sidebar + Content */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* Desktop Sidebar (Warm Saffron Accent) */}
        <aside className="hidden md:block w-60 shrink-0 space-y-4">
          <div className="bg-white border-2 border-amber-200 rounded-xl p-3 shadow-xs space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900 px-3 py-1">
              {language === 'hi' ? 'मुख्य मेनू' : 'Student Navigation'}
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 shadow-xs ring-1 ring-amber-600'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-stone-950' : 'text-amber-700'}`} />
                  <span>{language === 'hi' ? item.labelHi : item.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Helpline Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
              <span>{language === 'hi' ? 'जनजातीय सहायता केंद्र' : 'Tribal Helpline'}</span>
            </div>
            <p className="text-[11px] text-amber-800">
              Toll-Free: <strong>1800-11-7788</strong> (09:00 - 17:30 IST)
            </p>
            <p className="text-[10px] text-amber-700 italic">
              Bhashini support available in 22 languages.
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 pb-16 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar (warm saffron accent, high tap targets) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-2 py-1.5 z-40 flex items-center justify-around shadow-lg">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-bold transition-all ${
                isActive ? 'text-amber-700 font-extrabold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-amber-600 scale-110' : 'text-stone-400'}`} />
              <span className="truncate max-w-16">
                {language === 'hi' ? item.labelHi.split(' ')[0] : item.labelEn.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Subtle Footer */}
      <footer className="border-t border-stone-200 bg-white py-3 text-center text-[11px] text-stone-500 hidden md:block">
        Direct Benefit Transfer (DBT) Mission • Ministry of Tribal Affairs, Govt of India
      </footer>
    </div>
  );
};
