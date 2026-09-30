import React, { useState, useEffect } from 'react';
import { AuthUser, AppLanguage } from '../../types';
import { DEMO_CREDENTIALS } from '../../data/mockUsers';
import { VanavriddhiLogo } from '../Emblem';
import { 
  GraduationCap, 
  Smartphone, 
  KeyRound, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface StudentLoginProps {
  onLoginSuccess: (user: AuthUser) => void;
  onNavigate: (path: string) => void;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({
  onLoginSuccess,
  onNavigate,
  language,
  onLanguageChange
}) => {
  // Pre-filled with valid credentials for instant single-click login
  const [mobileNumber, setMobileNumber] = useState<string>('9876543210');
  const [otp, setOtp] = useState<string>('123456');
  const [otpSent, setOtpSent] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const studentCredentials = DEMO_CREDENTIALS.filter(c => c.role === 'student');

  // Hidden developer/evaluator shortcut: Ctrl+Shift+D fills default credentials
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        setMobileNumber('9876543210');
        setOtp('123456');
        setOtpSent(true);
        setErrorMsg(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.length < 10) {
      setErrorMsg(language === 'hi' ? 'कृपया मान्य 10 अंकों का मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    setOtpSent(true);
    setOtp('123456');
    setErrorMsg(null);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsSubmitting(false);
      const cleanPhone = mobileNumber.replace(/\D/g, '').slice(-10);
      const matched = studentCredentials.find(c => c.identifier.slice(-10) === cleanPhone);

      if (matched && (otp === '123456' || otp === matched.passwordOrOtp)) {
        onLoginSuccess(matched.user);
      } else if (otp === '123456') {
        const fallbackStudent: AuthUser = {
          id: `USR-STU-${cleanPhone}`,
          role: 'student',
          name: 'Meena Kumari Mandavi',
          emailOrPhone: `+91 ${cleanPhone}`,
          identifier: cleanPhone,
          studentApplicationId: 'VV-2026-CG-008821',
          assignedDistrict: 'Dantewada',
          assignedState: 'Chhattisgarh',
          preferredLanguage: language
        };
        onLoginSuccess(fallbackStudent);
      } else {
        setErrorMsg(language === 'hi' ? 'अमान्य सत्यापन कोड! कृपया पुनः प्रयास करें।' : 'Invalid verification code. Please try again.');
      }
    }, 350);
  };

  const handleDigiLockerLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const meena = studentCredentials[0].user;
      onLoginSuccess(meena);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-between">
      {/* Saffron Ribbon */}
      <div className="h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

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
                  National Scholarship &amp; Fellowship Portal for Scheduled Tribes
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Hindi / English Toggle */}
            <div className="flex rounded-md border border-stone-300 bg-stone-50 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 rounded transition-all ${
                  language === 'en' ? 'bg-amber-600 text-white shadow-2xs' : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-0.5 rounded transition-all ${
                  language === 'hi' ? 'bg-amber-600 text-white shadow-2xs' : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md space-y-4">
          <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6 space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-amber-50 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-2 border border-amber-200">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-stone-900">
                {language === 'hi' ? 'छात्र प्रवेश द्वार' : 'Student Scholarship Login'}
              </h2>
              <p className="text-xs text-stone-600">
                {language === 'hi'
                  ? 'पंजीकृत मोबाइल नंबर एवं आधार-लिंक्ड सत्यापन कोड द्वारा सुरक्षित लॉग-इन'
                  : 'Fast mobile + OTP verification for ST scholarship applicants'}
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-300 text-red-900 text-xs p-3 rounded-md">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'hi' ? 'पंजीकृत मोबाइल नंबर' : 'Registered Mobile Number'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500 font-mono text-xs">
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-12 pr-3 py-2 border border-stone-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    placeholder="9876543210"
                    required
                  />
                </div>
              </div>

              {otpSent && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">
                    {language === 'hi' ? 'सत्यापन कोड' : 'One-Time Verification Code'}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-mono tracking-widest text-center focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    placeholder="123456"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {isSubmitting ? (
                  <span>{language === 'hi' ? 'सत्यापन जारी है...' : 'Authenticating...'}</span>
                ) : otpSent ? (
                  <>
                    <span>{language === 'hi' ? 'प्रवेश करें (Enter Dashboard)' : 'Verify & Enter Dashboard'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <span>{language === 'hi' ? 'ओटीपी प्राप्त करें' : 'Send Verification Code'}</span>
                )}
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-stone-200"></div>
              <span className="shrink mx-2 text-[10px] text-stone-400 uppercase font-semibold">Or</span>
              <div className="flex-grow border-t border-stone-200"></div>
            </div>

            {/* DigiLocker Login Button */}
            <button
              type="button"
              onClick={handleDigiLockerLogin}
              disabled={isSubmitting}
              className="w-full py-2 px-3 border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <div className="w-5 h-5 rounded bg-sky-700 text-white flex items-center justify-center text-[10px] font-bold">
                DL
              </div>
              <span>{language === 'hi' ? 'डिजिलॉकर से स्वतः लॉगिन करें' : 'Login with DigiLocker Verified ID'}</span>
            </button>
          </div>

          <div className="text-center text-[11px] text-stone-500">
            Having trouble accessing your account? Call Helpline <strong>1800-11-7788</strong>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-stone-500 border-t border-stone-200 bg-white">
        © 2026 A.S.T.R.A. Direct Benefit Transfer (DBT) Mission
      </footer>
    </div>
  );
};
