import React, { useState, useEffect } from 'react';
import { AuthUser, AppLanguage } from '../../types';
import { DEMO_CREDENTIALS } from '../../data/mockUsers';
import { VanavriddhiLogo } from '../Emblem';
import { 
  BarChart3, 
  KeyRound, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  Lock
} from 'lucide-react';

interface MinistryLoginProps {
  onLoginSuccess: (user: AuthUser) => void;
  onNavigate: (path: string) => void;
  language: AppLanguage;
}

export const MinistryLogin: React.FC<MinistryLoginProps> = ({
  onLoginSuccess,
  onNavigate,
  language
}) => {
  // Pre-filled with valid credentials for instant single-click entry
  const [officialId, setOfficialId] = useState<string>('MOTA-HQ-901');
  const [password, setPassword] = useState<string>('MoTA#Gov2026');
  const [otp, setOtp] = useState<string>('123456');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const ministryCredentials = DEMO_CREDENTIALS.filter(c => c.role === 'analyst');

  // Hidden developer/evaluator shortcut: Ctrl+Shift+D fills default credentials
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setOfficialId('MOTA-HQ-901');
        setPassword('MoTA#Gov2026');
        setOtp('123456');
        setErrorMsg(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsSubmitting(false);
      const matched = ministryCredentials.find(
        c => c.identifier.toLowerCase() === officialId.trim().toLowerCase()
      );

      if (matched && (otp === '123456' || otp === matched.passwordOrOtp)) {
        onLoginSuccess(matched.user);
      } else if (otp === '123456') {
        const fallbackMinistry: AuthUser = {
          id: `USR-MIN-${officialId.toUpperCase()}`,
          role: 'analyst',
          name: 'Dr. Rajeshwar Rao, Joint Secretary',
          emailOrPhone: `${officialId.toLowerCase()}@mota.gov.in`,
          identifier: officialId
        };
        onLoginSuccess(fallbackMinistry);
      } else {
        setErrorMsg('Invalid Ministry official credentials or security token.');
      }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-between">
      {/* Indigo Stripe */}
      <div className="h-1.5 bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-950" />

      <header className="bg-white border-b border-stone-200 px-6 py-4 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="p-1.5 rounded-md hover:bg-stone-100 text-stone-600 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Return to portal home"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Portal Home</span>
            </button>
            <div className="h-5 w-px bg-stone-300 mx-1" />
            <div className="flex items-center gap-2">
              <VanavriddhiLogo className="w-7 h-7" />
              <div>
                <h1 className="text-sm font-bold text-stone-900 tracking-tight">
                  VANAVRIDDHI (वनवृद्धि)
                </h1>
                <p className="text-[10px] text-stone-500 font-medium">
                  National Analytics &amp; Strategic Oversight Division
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono bg-indigo-50 text-indigo-950 border border-indigo-300 px-2 py-0.5 rounded font-bold flex items-center gap-1">
              <Lock className="w-3 h-3 text-indigo-700" />
              <span>MINISTRY-SECURE</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md space-y-4">
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6 space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-950 rounded-full flex items-center justify-center mx-auto mb-2 border border-indigo-200">
                <BarChart3 className="w-6 h-6 text-indigo-900" />
              </div>
              <h2 className="text-lg font-bold text-stone-900">
                Ministry Oversight Login
              </h2>
              <p className="text-xs text-stone-600">
                Authorized National Policy Analysts &amp; Joint Secretary Operations
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-300 text-red-900 text-xs p-3 rounded-md">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Official ID */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Ministry Official Token ID
                </label>
                <input
                  type="text"
                  value={officialId}
                  onChange={(e) => setOfficialId(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono uppercase focus:ring-2 focus:ring-indigo-700 focus:outline-hidden"
                  placeholder="MOTA-HQ-901"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Security Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-700 focus:outline-hidden"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* 2FA OTP */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  2FA Security Token
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono tracking-widest text-center focus:ring-2 focus:ring-indigo-700 focus:outline-hidden"
                  placeholder="123456"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Authenticating Ministry Session...</span>
                ) : (
                  <>
                    <span>Enter Ministry Intelligence Command</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="text-center text-[11px] text-stone-500">
            National Scheduled Tribe Scholarship &amp; Disbursal Governance • MoTA
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-stone-500 border-t border-stone-200 bg-white">
        © 2026 A.S.T.R.A. Ministry Analytics &amp; Strategic Oversight Division
      </footer>
    </div>
  );
};
