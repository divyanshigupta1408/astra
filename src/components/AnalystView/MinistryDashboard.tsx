import React, { useState, useEffect } from 'react';
import { AuthUser, AppLanguage } from '../../types';
import { MinistryLayout, MinistryNavTab } from './MinistryLayout';
import { AnalystView } from './AnalystView';
import { CampPlannerWidget } from '../CampPlannerWidget';
import { InstituteScorecardTable } from '../InstituteScorecardTable';
import { AccessControlPanel } from '../AccessControlPanel';
import { CommandPaletteModal } from '../CommandPaletteModal';
import { OnboardingTour } from '../OnboardingTour';
import { 
  BarChart3, 
  MapPin, 
  Building2, 
  TrendingDown, 
  Tent, 
  ShieldCheck, 
  Users, 
  Download,
  Sparkles
} from 'lucide-react';

interface MinistryDashboardProps {
  user: AuthUser;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onLogout: () => void;
  onLogAction?: (action: string, targetId: string) => void;
}

export const MinistryDashboard: React.FC<MinistryDashboardProps> = ({
  user,
  language,
  onLanguageChange,
  onLogout,
  onLogAction
}) => {
  const [activeTab, setActiveTab] = useState<MinistryNavTab>('overview');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <MinistryLayout
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        language={language}
        onLanguageChange={onLanguageChange}
        onLogout={onLogout}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onReplayTour={() => setIsTourOpen(true)}
      >
        <div className="space-y-6">
          {/* Your Access Scope Panel */}
          <AccessControlPanel user={user} />

          {/* Tab 1: Executive Overview (Full AnalystView with charts, heatmap, dropouts) */}
          {activeTab === 'overview' && (
            <AnalystView language={language} onLogAction={onLogAction} />
          )}

          {/* Tab 2: District Gap Analytics */}
          {activeTab === 'heatmaps' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-900" />
                    <span>District-Level Reach Gap Saturation Heatmap</span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Comparison between AISHE census ST students and verified MoTA portal applicants.
                  </p>
                </div>
              </div>
              {/* Embedded Analyst View focuses on coverage */}
              <AnalystView language={language} onLogAction={onLogAction} />
            </div>
          )}

          {/* Tab 3: District Camp Planner */}
          {activeTab === 'camps' && (
            <div className="space-y-4 animate-fadeIn">
              <CampPlannerWidget language={language} onLogAction={onLogAction} />
            </div>
          )}

          {/* Tab 4: Institutional Scorecards */}
          {activeTab === 'institutes' && (
            <div className="space-y-4 animate-fadeIn">
              <InstituteScorecardTable
                language={language}
                userRole="analyst"
                onIssueNotice={(inst) => onLogAction && onLogAction('MINISTRY_DISPATCHED_INSTITUTE_NOTICE', inst)}
              />
            </div>
          )}

          {/* Tab 5: Dropout Risk & Retention AI */}
          {activeTab === 'dropout' && (
            <div className="space-y-4 animate-fadeIn">
              <AnalystView language={language} onLogAction={onLogAction} />
            </div>
          )}
        </div>
      </MinistryLayout>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        user={user}
        language={language}
        onNavigateTab={(tab) => {
          setActiveTab(tab as MinistryNavTab);
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
