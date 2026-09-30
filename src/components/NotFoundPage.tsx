import React from 'react';
import { VanavriddhiLogo } from './Emblem';
import { Home, ArrowLeft, Search, GraduationCap, Building2, BarChart3, HelpCircle } from 'lucide-react';

interface NotFoundPageProps {
  onNavigateHome: () => void;
  onNavigateRoleLogin?: (role: 'student' | 'officer' | 'ministry') => void;
  attemptedPath?: string;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onNavigateHome,
  onNavigateRoleLogin,
  attemptedPath
}) => {
  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-between">
      {/* Top ribbon */}
      <div className="h-1.5 bg-gradient-to-r from-amber-600 via-orange-500 to-emerald-700" />

      {/* Header */}
      <header className="bg-white border-b border-stone-200 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <VanavriddhiLogo className="w-8 h-8" />
            <div>
              <span className="text-base font-bold text-stone-900 tracking-tight">
                VANAVRIDDHI (वनवृद्धि)
              </span>
              <p className="text-[11px] text-stone-500">
                Scholarship &amp; Fellowship Portal for Scheduled Tribes
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold cursor-pointer transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </button>
        </div>
      </header>

      {/* Main 404 Content */}
      <main className="max-w-3xl mx-auto w-full px-4 py-12 flex-1 flex flex-col items-center justify-center text-center">
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-stone-200 border border-stone-300 text-stone-700 font-mono text-3xl font-extrabold shadow-inner">
            404
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              The statutory portal page or dashboard view you are trying to access does not exist or may have been moved.
            </p>
            {attemptedPath && (
              <div className="mt-2 text-[11px] font-mono bg-stone-200 text-stone-700 px-3 py-1 rounded-md inline-block">
                Attempted Path: {attemptedPath}
              </div>
            )}
          </div>

          {/* Quick navigation to valid role portals */}
          <div className="pt-4 max-w-md mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <button
              type="button"
              onClick={() => onNavigateRoleLogin ? onNavigateRoleLogin('student') : onNavigateHome()}
              className="p-3 bg-white rounded-xl border border-amber-200 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-2">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-stone-900 group-hover:text-amber-700">
                Student Portal
              </div>
              <div className="text-[10px] text-stone-500">Apply &amp; Track</div>
            </button>

            <button
              type="button"
              onClick={() => onNavigateRoleLogin ? onNavigateRoleLogin('officer') : onNavigateHome()}
              className="p-3 bg-white rounded-xl border border-emerald-200 hover:border-emerald-400 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-2">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-stone-900 group-hover:text-emerald-800">
                Officer Desk
              </div>
              <div className="text-[10px] text-stone-500">Scrutiny Queue</div>
            </button>

            <button
              type="button"
              onClick={() => onNavigateRoleLogin ? onNavigateRoleLogin('ministry') : onNavigateHome()}
              className="p-3 bg-white rounded-xl border border-indigo-200 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-900 flex items-center justify-center mb-2">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-stone-900 group-hover:text-indigo-900">
                Ministry HQ
              </div>
              <div className="text-[10px] text-stone-500">National Analytics</div>
            </button>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Landing Page</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-4 text-center text-xs text-stone-500">
        © 2026 Vanavriddhi. Scholarship &amp; Fellowship Management for Scheduled Tribes
      </footer>
    </div>
  );
};
