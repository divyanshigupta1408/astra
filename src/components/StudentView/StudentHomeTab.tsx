import React from 'react';
import { AuthUser, AppLanguage } from '../../types';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  HelpCircle, 
  PhoneCall, 
  FileText,
  Calendar,
  Volume2
} from 'lucide-react';

interface StudentHomeTabProps {
  user: AuthUser;
  language: AppLanguage;
  onNavigateTab: (tab: any) => void;
  onOpenVoiceAssistant?: () => void;
}

export const StudentHomeTab: React.FC<StudentHomeTabProps> = ({
  user,
  language,
  onNavigateTab,
  onOpenVoiceAssistant
}) => {
  const isMeena = user.identifier === '9876543210' || user.id === 'USR-STU-MEENA';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Personalized Greeting */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>{language === 'hi' ? 'स्वागत है' : 'Welcome back'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {language === 'hi' ? `नमस्ते, ${user.name}!` : `Namaste, ${user.name}!`}
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm max-w-xl">
            {language === 'hi'
              ? 'जनजातीय कार्य मंत्रालय छात्रवृत्ति पोर्टल पर आपका स्वागत है। आपका आवेदन प्रगति पर है।'
              : 'Welcome to the Scheduled Tribe scholarship portal. Your direct benefit transfer is tracking on schedule.'}
          </p>
        </div>

        {/* Speak to Assistant Button */}
        <button
          onClick={onOpenVoiceAssistant}
          className="self-start sm:self-auto px-4 py-2.5 bg-white hover:bg-amber-50 text-stone-900 rounded-xl font-bold text-xs shadow-sm flex items-center gap-2 transition-transform hover:scale-102 cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-amber-600" />
          <span>{language === 'hi' ? 'सहायक से बोलें (Voice)' : 'Speak to Assistant'}</span>
        </button>
      </div>

      {/* BIG "NEXT STEP" CARD + HEALTH SCORE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Next Step Card */}
        <div className="md:col-span-2 bg-white border-2 border-amber-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                {language === 'hi' ? 'अगला कदम (Next Action)' : 'Next Immediate Step'}
              </span>
              <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>On-Track</span>
              </span>
            </div>

            <h3 className="text-base font-bold text-stone-900">
              {language === 'hi'
                ? 'संस्थान सत्यापन प्रगति पर है (Institute Verification)'
                : 'Institute Desk Scrutiny in Progress'}
            </h3>

            <p className="text-xs text-stone-600 leading-relaxed">
              {language === 'hi'
                ? 'आपके सभी 4 अनिवार्य दस्तावेज़ डिजीलाकर पीकेआई द्वारा सत्यापित हैं और बैंक खाता एनपीसीआई डीबीटी मैपर से जुड़ा हुआ है। नोडल अधिकारी 48 घंटों में स्वीकृति देंगे।'
                : 'All 4 statutory documents are cryptographically verified via DigiLocker PKI, and your bank account is active on the NPCI DBT mapper. Approval is anticipated within 48 hours.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
            <span className="text-[11px] font-mono text-stone-500">
              App ID: <strong>{isMeena ? 'VV-2026-CG-088219' : 'VV-2026-OD-091823'}</strong>
            </span>
            <button
              onClick={() => onNavigateTab('track')}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{language === 'hi' ? 'लाइव स्थिति देखें' : 'View Live Timeline'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Application Health Score Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700">Application Health</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-emerald-700">{isMeena ? '98' : '92'}</span>
              <span className="text-xs font-bold text-stone-400">/100</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              {language === 'hi'
                ? 'शून्य असंगति • तीव्र स्वीकृति हेतु तैयार'
                : 'Zero document friction • Ready for instant GFR sign-off'}
            </p>
          </div>

          <div className="space-y-1.5 text-[11px] pt-2 border-t border-stone-100 text-stone-600">
            <div className="flex items-center justify-between">
              <span>DigiLocker PKI:</span>
              <span className="font-bold text-emerald-700">100% Verified</span>
            </div>
            <div className="flex items-center justify-between">
              <span>NPCI DBT Seeding:</span>
              <span className="font-bold text-emerald-700">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE SCHEME CARDS & DEADLINE ALERTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Active Scheme Enrolled */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-700" />
              <span>{language === 'hi' ? 'सक्रिय छात्रवृत्ति योजना' : 'Enrolled MoTA Scheme'}</span>
            </h4>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
              Active FY 2026-27
            </span>
          </div>

          <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3 space-y-1.5">
            <div className="font-bold text-stone-900 text-sm">
              Top Class Education for ST Students (UG / PG)
            </div>
            <p className="text-xs text-stone-600">
              Full tuition fee coverage + ₹2,22,000 living allowance &amp; laptop grant.
            </p>
            <div className="text-[11px] font-mono text-stone-700 pt-1">
              Statutory Clause: Clause 5.2 (Income &lt;= ₹6.0L) &amp; Clause 4.3 (Merit &gt;= 55%)
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('eligibility')}
            className="text-xs font-bold text-amber-800 hover:text-amber-900 hover:underline flex items-center gap-1 pt-1"
          >
            <span>{language === 'hi' ? 'अन्य पात्र योजनाएं देखें' : 'Explore all eligible schemes & rule traces'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Deadline Alerts & Action Notices */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-700" />
              <span>{language === 'hi' ? 'महत्वपूर्ण समय-सीमा' : 'Statutory Deadlines'}</span>
            </h4>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
              Cycle 1
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2.5 p-2.5 bg-stone-50 rounded-lg border border-stone-200">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-stone-800">Institute Scrutiny Closing Date</div>
                <div className="text-[11px] text-stone-500">15 October 2026 • 15 days remaining</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 bg-stone-50 rounded-lg border border-stone-200">
              <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-stone-800">Renewal Cycle Submission Window</div>
                <div className="text-[11px] text-stone-500">01 November 2026 – 30 November 2026</div>
              </div>
            </div>
          </div>

          <div className="pt-1">
            <button
              onClick={() => onNavigateTab('renewal')}
              className="text-xs font-bold text-amber-800 hover:text-amber-900 hover:underline flex items-center gap-1"
            >
              <span>{language === 'hi' ? 'नवीनीकरण आवश्यकताएं देखें' : 'View renewal instructions & pre-fill'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
