import React, { useState } from 'react';
import { ChevronRight, RefreshCw, ShieldCheck, Home, Search, Command } from 'lucide-react';
import { AuthUser } from '../types';
import { NotificationDropdown } from './NotificationDropdown';
import { UserProfileMenu } from './UserProfileMenu';
import { AccessibilityToolbar } from './AccessibilityToolbar';

interface BreadcrumbsBarProps {
  portalName: string;
  tabLabel: string;
  user: AuthUser;
  onLogout: () => void;
  onNavigateHome?: () => void;
  accentColor?: 'amber' | 'emerald' | 'indigo';
  onOpenCommandPalette?: () => void;
  onReplayTour?: () => void;
}

export const BreadcrumbsBar: React.FC<BreadcrumbsBarProps> = ({
  portalName,
  tabLabel,
  user,
  onLogout,
  onNavigateHome,
  accentColor = 'amber',
  onOpenCommandPalette,
  onReplayTour
}) => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncLabel, setSyncLabel] = useState<string>('Last synced 2 minutes ago');

  const handleSyncClick = () => {
    setIsSyncing(true);
    setSyncLabel('Syncing state...');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncLabel('Last synced just now');
    }, 600);
  };

  return (
    <div className="bg-white border-b border-stone-200 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Breadcrumb Path */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-stone-500 font-medium">
        <button
          type="button"
          onClick={onNavigateHome}
          className="hover:text-stone-900 flex items-center gap-1 cursor-pointer transition-colors"
          title="Return to A.S.T.R.A Home"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Portal</span>
        </button>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-stone-700">{portalName}</span>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="font-bold text-stone-950">{tabLabel}</span>
      </nav>

      {/* Right side widgets: Search + Accessibility + Sync + Rule Version + Bell + Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search (Ctrl+K) Trigger */}
        {onOpenCommandPalette && (
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-stone-200 hover:border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors text-xs cursor-pointer shadow-2xs"
            title="Global Quick Search (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden md:inline font-medium">Search</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-white border border-stone-300 font-mono text-[10px] text-stone-500 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        )}

        {/* Accessibility Toolbar */}
        <AccessibilityToolbar userRole={user.role} />

        <span className="hidden lg:inline text-stone-300">•</span>

        {/* Subtle Sync Indicator */}
        <button
          type="button"
          onClick={handleSyncClick}
          className="hidden xl:flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          title="Refresh synchronization with central ledger"
        >
          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-emerald-600' : 'text-stone-400'}`} />
          <span>{syncLabel}</span>
        </button>

        {/* Notification Bell */}
        <NotificationDropdown user={user} />

        {/* User Profile Menu */}
        <UserProfileMenu user={user} onLogout={onLogout} onReplayTour={onReplayTour} />
      </div>
    </div>
  );
};
