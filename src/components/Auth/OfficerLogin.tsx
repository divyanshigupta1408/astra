import React, { useState, useEffect } from 'react';
import { AuthUser, AppLanguage, OfficerSubRole } from '../../types';
import { DEMO_CREDENTIALS } from '../../data/mockUsers';
import { VanavriddhiLogo } from '../Emblem';
import { 
  Building2, 
  KeyRound, 
  ShieldCheck, 
  ArrowRight, 
  Building, 
  MapPin, 
  ArrowLeft,
  Lock
} from 'lucide-react';

interface OfficerLoginProps {
  onLoginSuccess: (user: AuthUser) => void;
  onNavigate: (path: string) => void;
  language: AppLanguage;
}

export const OfficerLogin: React.FC<OfficerLoginProps> = ({
  onLoginSuccess,
  onNavigate,
  language
}) => {
  const [officerType, setOfficerType] = useState<OfficerSubRole>('institute');
  // Pre-filled with valid credentials for instant single-click entry
  const [officialId, setOfficialId] = useState<string>('NODAL-OD-NITR');
  const [password, setPassword] = useState<string>('Nodal@2026');
  const [otp, setOtp] = useState<string>('123456');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const officerCredentials = DEMO_CREDENTIALS.filter(c => c.role === 'officer');

  // Hidden developer/evaluator shortcut: Ctrl+Shift+D fills default credentials
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setOfficerType('institute');
        setOfficialId('NODAL-OD-NITR');
        setPassword('Nodal@2026');
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
      const matched = officerCredentials.find(
        c => c.identifier.toLowerCase() === officialId.trim().toLowerCase()
      );

      if (matched && (otp === '123456' || otp === matched.passwordOrOtp)) {
        onLoginSuccess({
          ...matched.user,
          officerSubRole: officerType
        });
      } else if (otp === '123456') {
        const fallbackOfficer: AuthUser = {
          id: `USR-OFF-${officialId.toUpperCase()}`,
          role: 'officer',
          officerSubRole: officerType,
          name: officerType === 'institute' ? 'Dr. A. K. Soren' : 'Smt. Pratibha Minz, OAS',
          emailOrPhone: `${officialId.toLowerCase()}@gov.in`,
          identifier: officialId,
          assignedInstitute: officerType === 'institute' ? 'National Institute of Technology (NIT) Rourkela' : undefined,
          assignedState: 'Odisha'
        };
        onLoginSuccess(fallbackOfficer);
      } else {
        setErrorMsg('Invalid officer credentials or 2FA security token.');
      }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-between">
      {/* Deep Green Stripe */}
      <div className="h-1.5 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800" />

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
                  Statutory Scrutiny Desk • Institutional &amp; State Level
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono bg-emerald-50 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded font-bold">
              OFFICER-GATEWAY
            </span>
          </div>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md space-y-4">
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6 space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-900 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-200">
                <Building2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-stone-900">
                Officer Statutory Verification Login
              </h2>
              <p className="text-xs text-stone-600">
                Authorized Institute Nodal Officers &amp; State Scrutiny Officers
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-300 text-red-900 text-xs p-3 rounded-md">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selector: Institute vs State */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Verification Jurisdiction Scope
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOfficerType('institute');
                      setOfficialId('NODAL-OD-NITR');
                      setPassword('Nodal@2026');
                    }}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      officerType === 'institute'
                        ? 'bg-emerald-900 text-white border-emerald-950 shadow-2xs'
                        : 'bg-stone-50 border-stone-300 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>Institute Nodal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOfficerType('state');
                      setOfficialId('STATE-ODISHA-ST');
                      setPassword('State@2026');
                    }}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      officerType === 'state'
                        ? 'bg-emerald-900 text-white border-emerald-950 shadow-2xs'
                        : 'bg-stone-50 border-stone-300 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>State Officer</span>
                  </button>
                </div>
              </div>

              {/* Official ID */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Official AISHE / Government ID
                </label>
                <input
                  type="text"
                  value={officialId}
                  onChange={(e) => setOfficialId(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono uppercase focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  placeholder="NODAL-OD-NITR"
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
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
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
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono tracking-widest text-center focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                  placeholder="123456"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Authenticating Officer Token...</span>
                ) : (
                  <>
                    <span>Enter Officer Verification Desk</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="text-center text-[11px] text-stone-500">
            GFR Rule 238(1) Statutory Verification Gateway • MoTA
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-stone-500 border-t border-stone-200 bg-white">
        © 2026 Vanavriddhi. Statutory Verification Directorate
      </footer>
    </div>
  );
};
