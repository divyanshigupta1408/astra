import React, { useState } from 'react';
import { ChevronRight, RefreshCw, ShieldCheck, Home } from 'lucide-react';
import { AuthUser } from '../types';
import { NotificationDropdown } from './NotificationDropdown';
import { UserProfileMenu } from './UserProfileMenu';

interface BreadcrumbsBarProps {
  portalName: string;
  tabLabel: string;
  user: AuthUser;
  onLogout: () => void;
  onNavigateHome?: () => void;
  accentColor?: 'amber' | 'emerald' | 'indigo';
}

export const BreadcrumbsBar: React.FC<BreadcrumbsBarProps> = ({
  portalName,
  tabLabel,
  user,
  onLogout,
  onNavigateHome,
  accentColor = 'amber'
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
          title="Return to Vanavriddhi Home"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Portal</span>
        </button>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="text-stone-700">{portalName}</span>
        <ChevronRight className="w-3 h-3 text-stone-400" />
        <span className="font-bold text-stone-950">{tabLabel}</span>
      </nav>

      {/* Right side widgets: Sync + Rule Version + Bell + Profile */}
      <div className="flex items-center gap-3">
        {/* Subtle Sync Indicator */}
        <button
          type="button"
          onClick={handleSyncClick}
          className="hidden md:flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          title="Refresh synchronization with central ledger"
        >
          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-emerald-600' : 'text-stone-400'}`} />
          <span>{syncLabel}</span>
        </button>

        <span className="hidden lg:inline text-stone-300">•</span>

        {/* Rule set version tag */}
        <div className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 border border-stone-200 text-[10px] font-mono text-stone-600">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>Rule set v3.2</span>
        </div>

        {/* Notification Bell */}
        <NotificationDropdown user={user} />

        {/* User Profile Menu */}
        <UserProfileMenu user={user} onLogout={onLogout} />
      </div>
    </div>
  );
};
