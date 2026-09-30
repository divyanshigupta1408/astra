import React from 'react';
import { VanavriddhiLogo } from './Emblem';
import { AlertTriangle, RefreshCw, Home, PhoneCall } from 'lucide-react';

interface ErrorPageProps {
  error?: Error;
  onReset?: () => void;
  onNavigateHome?: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  error,
  onReset,
  onNavigateHome = () => window.location.href = '/'
}) => {
  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-between">
      <div className="h-1.5 bg-gradient-to-r from-rose-600 via-amber-600 to-emerald-700" />

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
        </div>
      </header>

      <main className="max-w-xl mx-auto w-full px-4 py-12 flex-1 flex flex-col items-center justify-center text-center">
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 shadow-inner">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              An Unexpected System Interruption Occurred
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              The portal encountered a transient issue processing your request. Your application data and cryptographic audit ledger are securely preserved.
            </p>
            {error && (
              <div className="mt-3 p-3 bg-stone-200/70 border border-stone-300 rounded-lg text-left text-[11px] font-mono text-stone-800 break-words">
                {error.message || 'Unknown runtime error'}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onReset || (() => window.location.reload())}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs shadow-xs cursor-pointer transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Session</span>
            </button>
            <button
              type="button"
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-bold text-xs shadow-xs cursor-pointer transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Return to Portal Home</span>
            </button>
          </div>

          <div className="pt-4 text-xs text-stone-500 flex items-center justify-center gap-2">
            <PhoneCall className="w-3.5 h-3.5 text-stone-400" />
            <span>National Helpdesk Support: <strong>1800-11-7788</strong> (Toll Free)</span>
          </div>
        </div>
      </main>

      <footer className="border-t border-stone-200 bg-white py-4 text-center text-xs text-stone-500">
        © 2026 Vanavriddhi. Scholarship &amp; Fellowship Management for Scheduled Tribes
      </footer>
    </div>
  );
};
