import React from 'react';
import { AuthUser } from '../types';
import { ShieldAlert, ArrowLeft, LogOut, Lock } from 'lucide-react';

interface AccessDeniedPageProps {
  currentUser: AuthUser | null;
  attemptedRole: string;
  onNavigateHome: () => void;
  onNavigateToUserDashboard: () => void;
}

export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({
  currentUser,
  attemptedRole,
  onNavigateHome,
  onNavigateToUserDashboard
}) => {
  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border-2 border-red-500 rounded-xl shadow-lg p-6 text-center space-y-4">
        <div className="w-14 h-14 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto border-2 border-red-300">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="font-mono text-xs font-bold text-red-700 uppercase tracking-widest bg-red-50 border border-red-200 px-2.5 py-0.5 rounded">
            HTTP 403 Forbidden
          </span>
          <h2 className="text-xl font-bold text-stone-900 mt-2">
            Access Denied for Your Role
          </h2>
          <p className="text-xs text-stone-600">
            You do not have authorization to access the <strong>/{attemptedRole}</strong> portal.
          </p>
        </div>

        {currentUser && (
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-left text-xs text-stone-700 space-y-1">
            <div className="font-bold text-stone-900">Current Session:</div>
            <div>User: <strong>{currentUser.name}</strong></div>
            <div>Assigned Role: <span className="font-mono font-bold text-stone-800 uppercase">{currentUser.role}</span></div>
            {currentUser.assignedInstitute && (
              <div>Jurisdiction: <strong>{currentUser.assignedInstitute}</strong></div>
            )}
            {currentUser.assignedState && (
              <div>Jurisdiction: <strong>{currentUser.assignedState}</strong></div>
            )}
            <div className="text-[10px] text-red-600 font-medium pt-1 border-t border-stone-200">
              Security notice: Unauthorized role boundary crossover attempts are recorded in the immutable audit ledger.
            </div>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
          {currentUser ? (
            <button
              onClick={onNavigateToUserDashboard}
              className="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Your Dashboard</span>
            </button>
          ) : (
            <button
              onClick={onNavigateHome}
              className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Portal Home</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
