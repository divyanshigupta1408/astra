import React, { useState, useRef, useEffect } from 'react';
import { AuthUser } from '../types';
import { 
  User, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  LogOut, 
  ChevronDown, 
  Building2, 
  GraduationCap, 
  BarChart3,
  ExternalLink,
  Lock,
  Layers,
  RotateCcw
} from 'lucide-react';

interface UserProfileMenuProps {
  user: AuthUser;
  onLogout: () => void;
  onOpenAccessPanel?: () => void;
  onReplayTour?: () => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  user,
  onLogout,
  onOpenAccessPanel,
  onReplayTour
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute realistic jurisdiction & role title
  let roleTitle = 'Student Scholar';
  let jurisdiction = 'National Scope';
  let avatarBg = 'bg-amber-600';
  let badgeBorder = 'border-amber-300 bg-amber-50 text-amber-900';

  if (user.role === 'student') {
    roleTitle = 'ST Scholar (Candidate)';
    jurisdiction = `${user.assignedDistrict || 'Dantewada'}, ${user.assignedState || 'Chhattisgarh'}`;
    avatarBg = 'bg-amber-600';
    badgeBorder = 'border-amber-300 bg-amber-50 text-amber-900';
  } else if (user.role === 'officer') {
    if (user.officerSubRole === 'institute') {
      roleTitle = 'Institute Nodal Officer';
      jurisdiction = user.assignedInstitute || 'National Institute of Technology (NIT) Rourkela';
    } else {
      roleTitle = 'State Welfare Officer';
      jurisdiction = `State Directorate of ${user.assignedState || 'Odisha'}`;
    }
    avatarBg = 'bg-emerald-800';
    badgeBorder = 'border-emerald-300 bg-emerald-50 text-emerald-950';
  } else if (user.role === 'analyst') {
    roleTitle = 'Ministry Analyst & Director';
    jurisdiction = 'National Command (All 28 States & UTs)';
    avatarBg = 'bg-indigo-900';
    badgeBorder = 'border-indigo-300 bg-indigo-50 text-indigo-950';
  }

  // Realistic last login formatted in Indian Standard Time (IST)
  const lastLoginTime = 'Today, 09:14 AM IST';

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-stone-400"
        aria-label="User profile menu"
        aria-expanded={isOpen}
      >
        <div className={`w-7 h-7 rounded-lg ${avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-2xs`}>
          {user.name.charAt(0)}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-xs font-bold text-stone-900 leading-none truncate max-w-28">
            {user.name.split(' ')[0]}
          </div>
          <div className="text-[10px] text-stone-500 font-medium leading-none mt-1">
            {user.role === 'student' ? 'Student' : user.role === 'officer' ? 'Officer' : 'Ministry'}
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-stone-500 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 text-xs">
          {/* User Profile Header */}
          <div className="p-4 bg-stone-50 border-b border-stone-200 space-y-2">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl ${avatarBg} text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0`}>
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-stone-950 text-sm truncate">
                  {user.name}
                </div>
                <div className="text-stone-500 text-[11px] truncate font-mono">
                  {user.emailOrPhone}
                </div>
              </div>
            </div>

            <div className="pt-1 flex flex-wrap gap-1.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badgeBorder}`}>
                {roleTitle}
              </span>
              <span className="text-[10px] font-mono text-stone-600 bg-stone-200/80 px-1.5 py-0.5 rounded">
                ID: {user.identifier}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="p-4 space-y-3 divide-y divide-stone-100">
            {/* Jurisdiction */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold text-stone-500">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>Assigned Jurisdiction</span>
              </div>
              <p className="text-xs font-medium text-stone-800 leading-snug">
                {jurisdiction}
              </p>
            </div>

            {/* Last Login & Security */}
            <div className="pt-3 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold text-stone-500">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>Session Security</span>
              </div>
              <div className="text-[11px] text-stone-700">
                <span>Last login: </span>
                <span className="font-medium text-stone-900">{lastLoginTime}</span>
              </div>
              <div className="text-[10px] text-emerald-800 font-mono flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Role Scoped • DPDP Act 2023 Compliant</span>
              </div>
            </div>
          </div>

          {/* Action List */}
          <div className="border-t border-stone-200 bg-stone-50/50 p-2 space-y-1">
            {onReplayTour && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onReplayTour();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors text-xs cursor-pointer font-medium"
              >
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  <span>Replay Onboarding Tour</span>
                </div>
                <span className="text-[10px] text-stone-500">Walkthrough →</span>
              </button>
            )}

            {onOpenAccessPanel && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenAccessPanel();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors text-xs cursor-pointer font-medium"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-stone-500" />
                  <span>View Role Access Boundaries</span>
                </div>
                <span className="text-[10px] text-stone-500">Details →</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-700 hover:bg-rose-50 transition-colors text-xs cursor-pointer font-bold"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Log out of Session</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
