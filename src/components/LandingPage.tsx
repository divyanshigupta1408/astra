import React, { useState } from 'react';
import { VanavriddhiLogo } from './Emblem';
import { AppLanguage } from '../types';
import { 
  GraduationCap, 
  Building2, 
  BarChart3, 
  ArrowRight, 
  ShieldCheck, 
  FileCheck2, 
  Lock, 
  Users, 
  Sparkles,
  HelpCircle,
  History,
  Scale,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Globe2,
  CreditCard,
  Building,
  HeartHandshake,
  PhoneCall,
  Mail,
  Zap,
  BookOpen,
  Search
} from 'lucide-react';
import { InfoModalType } from './LegalAndInfoModals';

interface LandingPageProps {
  onNavigate: (path: string) => void;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onOpenAuditLog: () => void;
  onOpenSystemDesign: () => void;
  onOpenInfoModal: (type: NonNullable<InfoModalType>) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  language,
  onLanguageChange,
  onOpenAuditLog,
  onOpenSystemDesign,
  onOpenInfoModal
}) => {
  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(prev => prev === idx ? null : idx);
  };

  const faqs = [
    {
      q: language === 'hi' 
        ? 'क्या कोई भी अनुसूचित जनजाति (ST) विद्यार्थी वनवृद्धि पोर्टल पर आवेदन कर सकता है?' 
        : 'Who is eligible to apply for scholarships on Vanavriddhi?',
      a: language === 'hi'
        ? 'हां, भारत के किसी भी राज्य या केंद्र शासित प्रदेश में अधिसूचित अनुसूचित जनजाति समुदाय के विद्यार्थी, जो मान्यता प्राप्त विद्यालयों, विश्वविद्यालयों अथवा राष्ट्रीय महत्व के संस्थानों में अध्ययनरत हैं, पात्रता नियमों (जैसे पारिवारिक आय सीमा) के अनुरूप आवेदन कर सकते हैं।'
        : 'All students belonging to Scheduled Tribes recognized under Article 342 of the Constitution, enrolled in recognized schools, colleges, universities, or Institutes of National Importance (IITs, NITs, AIIMS), subject to scheme-specific criteria such as family annual income ceilings.'
    },
    {
      q: language === 'hi'
        ? 'यदि मेरे गांव में जाति प्रमाण पत्र ऑनलाइन डिजिटाइज़ नहीं हुआ है तो क्या होगा?'
        : 'What if I do not possess a digitized caste certificate from revenue office?',
      a: language === 'hi'
        ? 'वनवृद्धि में पेसा अधिनियम धारा 4(d) के तहत "सामुदायिक प्रमाणीकरण (Community Attestation Fallback)" का विशेष प्रावधान है। आप ग्राम सभा प्रस्ताव एवं आईटीडीए सत्यापन के माध्यम से आवेदन अग्रेषित कर सकते हैं।'
        : 'Vanavriddhi features the statutory Community Attestation Fallback provision under PESA Section 4(d) and Forest Rights Act guidelines. Remote forest village applicants can submit a Gram Sabha resolution and ITDA field inquiry request directly through the portal.'
    },
    {
      q: language === 'hi'
        ? 'छात्रवृत्ति राशि किस बैंक खाते में भेजी जाती है?'
        : 'How and where is the scholarship amount credited?',
      a: language === 'hi'
        ? 'राशि सीधे विद्यार्थी के व्यक्तिगत बैंक खाते में डीबीटी (Direct Benefit Transfer) एवं एनपीसीआई आधार मैपर के माध्यम से अंतरित की जाती है। संयुक्त या निष्क्रिय खाते स्वीकार्य नहीं हैं।'
        : 'Disbursements are made directly to the student\'s Aadhaar-seeded individual bank account through the Public Financial Management System (PFMS) and NPCI DBT mapper, ensuring 100% direct delivery without intermediaries.'
    },
    {
      q: language === 'hi'
        ? '"एआई सहायता करता है, नियम निर्णय लेते हैं, मानव स्वीकृति देते हैं" का क्या अर्थ है?'
        : 'What does "AI assists, rules decide, humans approve" mean in practice?',
      a: language === 'hi'
        ? 'एआई केवल दस्तावेज़ स्कैनिंग (OCR) और त्रुटि सुधार में सहायता करता है। पात्रता का निर्णय वैधानिक नियमों द्वारा होता है, और अंतिम अनुमोदन हमेशा अधिकृत नोडल अधिकारी द्वारा ही दिया जाता है।'
        : 'Artificial Intelligence is strictly advisory—it performs OCR document extraction, cross-matching, and delay alerts. Eligibility verdicts are calculated solely by deterministic rule engines, and final sign-off is legally granted by human Nodal Officers under GFR 2017.'
    },
    {
      q: language === 'hi'
        ? 'यदि मेरा कॉलेज मेरे गृह राज्य के बाहर है तो क्या होगा?'
        : 'What if my institute is located in a different state from my ST domicile state?',
      a: language === 'hi'
        ? 'पोर्टल का अंतर-राज्यीय पोर्टेबिलिटी इंजन (Article 342) स्वचालित रूप से आपके गृह जिले के आईटीडीए कार्यालय एवं मेजबान संस्थान के मध्य ऑनलाइन सत्यापन समन्वय स्थापित करता है।'
        : 'The platform\'s built-in Inter-State Portability Engine cross-indexes Article 342 Presidential Orders and automatically routes inter-state clearance between your home ITDA office and host campus desk.'
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between">
      {/* Top Saffron-to-Emerald Ribbon */}
      <div className="h-1.5 bg-gradient-to-r from-amber-600 via-orange-500 to-emerald-700" />

      {/* Navigation Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <VanavriddhiLogo className="w-8 h-8" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-stone-900 tracking-tight leading-none">
                  VANAVRIDDHI (वनवृद्धि)
                </span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-950 font-bold px-1.5 py-0.5 rounded border border-emerald-300">
                  Release v3.2
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                Scholarship &amp; Fellowship Portal for Scheduled Tribes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <div className="flex rounded-md border border-stone-300 bg-stone-50 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                  language === 'en' ? 'bg-emerald-900 text-white shadow-2xs' : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('hi')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                  language === 'hi' ? 'bg-emerald-900 text-white shadow-2xs' : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Audit log shortcut */}
            <button
              onClick={onOpenAuditLog}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-stone-600" />
              <span>Audit Ledger</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-stone-100 to-stone-50 py-12 sm:py-16 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 text-center">
          <div className="space-y-4 max-w-3xl mx-auto">
            {/* Product Principle Badge */}
            <button
              onClick={() => onOpenInfoModal('aboutDecisions')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-bold shadow-2xs hover:bg-amber-200 transition-colors cursor-pointer"
            >
              <Scale className="w-4 h-4 text-amber-700" />
              <span>Product Principle: AI assists, rules decide, humans approve.</span>
              <span className="text-[10px] text-amber-800 underline ml-1">Learn how →</span>
            </button>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-950 tracking-tight leading-tight">
              {language === 'hi' 
                ? 'अनुसूचित जनजाति छात्रवृत्ति एवं प्रत्यक्ष लाभ अंतरण मंच'
                : 'National Scheduled Tribe Scholarship & Direct Benefit Transfer Platform'}
            </h1>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              {language === 'hi'
                ? 'पारदर्शी नियम इंजन, डिजीलाकर पीकेआई सत्यापन, एनपीसीआई डीबीटी मैपर एवं ग्राम सभा सामुदायिक प्रमाणीकरण द्वारा संचालित सुरक्षित एवं भूमिका-आधारित पोर्टल।'
                : 'A modern, role-isolated scholarship platform designed for tribal students, educational institutions, and welfare directorates. Built on transparent statutory rules, cryptographic auditability, and direct bank transfer.'}
            </p>
          </div>

          {/* THREE CLEAR ROLE ENTRY POINTS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-left">
            {/* Card 1: Student Login */}
            <div className="bg-white border-2 border-amber-300 hover:border-amber-500 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    Student Portal
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 mt-1.5">
                    {language === 'hi' ? 'छात्र प्रवेश द्वार' : 'Student Login'}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {language === 'hi'
                      ? 'पात्रता जांचें, डिजीलाकर से दस्तावेज़ जोड़ें, आवेदन ट्रैक करें और डीबीटी नवीनीकरण प्राप्त करें।'
                      : 'Check scheme eligibility with explainable rule traces, upload documents, track application progress, and claim DBT renewal.'}
                  </p>
                </div>

                <div className="bg-amber-50/60 rounded-lg p-2.5 text-[11px] text-amber-950 space-y-1 border border-amber-200">
                  <div className="font-semibold">Student Features:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-stone-600">
                    <li>Deterministic eligibility checking</li>
                    <li>Application health check before submit</li>
                    <li>Community attestation fallback (PESA)</li>
                    <li>Bilingual Hindi / English support</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => onNavigate('/login/student')}
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>{language === 'hi' ? 'छात्र लॉगिन करें' : 'Login as Student'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2: Officer Login */}
            <div className="bg-white border-2 border-emerald-800 hover:border-emerald-950 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center justify-center">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Scrutiny Desk
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 mt-1.5">
                    {language === 'hi' ? 'सत्यापन अधिकारी प्रवेश' : 'Officer Login'}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {language === 'hi'
                      ? 'संस्थान एवं राज्य स्तरीय नोडल अधिकारियों हेतु वैधानिक सत्यापन एवं त्वरित अनुमोदन डेस्क।'
                      : 'Institutional Nodal Officers & State Welfare Officers: triage queues, SLA risk lanes, and statutory human sign-off.'}
                  </p>
                </div>

                <div className="bg-emerald-50/60 rounded-lg p-2.5 text-[11px] text-emerald-950 space-y-1 border border-emerald-200">
                  <div className="font-semibold">Officer Capabilities:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-stone-600">
                    <li>Strict jurisdiction scoping (Institute/State)</li>
                    <li>Fast-track Green Lane verification</li>
                    <li>Cross-document mismatch detection</li>
                    <li>Delay prediction &amp; SLA monitoring</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => onNavigate('/login/officer')}
                className="w-full py-2.5 px-4 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>{language === 'hi' ? 'अधिकारी लॉगिन करें' : 'Login as Officer'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 3: Ministry Login */}
            <div className="bg-white border-2 border-indigo-900 hover:border-indigo-950 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-300 text-indigo-900 flex items-center justify-center">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded">
                    Command &amp; Policy
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 mt-1.5">
                    {language === 'hi' ? 'मंत्रालय विश्लेषण एवं नियंत्रण' : 'Ministry Login'}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {language === 'hi'
                      ? 'राष्ट्रीय स्तर पर पहुंच अंतर (Reach Gap), शिविर स्वीकृति और संस्थान स्कोरकार्ड की निगरानी।'
                      : 'Aggregated national telemetry: district gap saturation, District Camp Planner, and Institutional UC Compliance.'}
                  </p>
                </div>

                <div className="bg-indigo-50/60 rounded-lg p-2.5 text-[11px] text-indigo-950 space-y-1 border border-indigo-200">
                  <div className="font-semibold">Oversight Operations:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-stone-600">
                    <li>National reach gap saturation heatmap</li>
                    <li>Targeted district camp planning (Top 5)</li>
                    <li>Institutional Verification &amp; UC scorecards</li>
                    <li>Zero-PII compliance under DPDP Act 2023</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => onNavigate('/login/ministry')}
                className="w-full py-2.5 px-4 bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>{language === 'hi' ? 'मंत्रालय लॉगिन करें' : 'Login as Ministry'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* GENERIC CAPABILITY STATEMENTS STRIP */}
      <section className="bg-stone-900 text-white py-6 border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-amber-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Deterministic Rules</span>
              </div>
              <p className="text-xs text-stone-300">
                Application health check before you submit with full rule transparency.
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-400 font-bold text-xs">
                <CreditCard className="w-4 h-4" />
                <span>Direct Benefit Transfer</span>
              </div>
              <p className="text-xs text-stone-300">
                Track every rupee from sanction order generation to individual bank credit.
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-sky-400 font-bold text-xs">
                <FileCheck2 className="w-4 h-4" />
                <span>Cross-Doc Reconciliation</span>
              </div>
              <p className="text-xs text-stone-300">
                Automated name and date matching across caste, income, and bank records.
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-400 font-bold text-xs">
                <Lock className="w-4 h-4" />
                <span>Data Isolation</span>
              </div>
              <p className="text-xs text-stone-300">
                Cryptographic role scoping and strict DPDP Act 2023 privacy boundaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: HOW IT WORKS (4 STEPS) */}
      <section className="py-14 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
              Clear 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              How Vanavriddhi Delivers Scholarships
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Designed to eliminate paperwork friction and ensure verifiable affirmative action.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3 relative">
              <div className="w-9 h-9 rounded-lg bg-emerald-900 text-white font-mono font-bold flex items-center justify-center text-sm">
                01
              </div>
              <h3 className="font-bold text-sm text-stone-900">Check Eligibility</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Enter academic level, family income, and ST state. The rule engine generates an explainable verdict with clause-level rule traces.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3 relative">
              <div className="w-9 h-9 rounded-lg bg-amber-600 text-white font-mono font-bold flex items-center justify-center text-sm">
                02
              </div>
              <h3 className="font-bold text-sm text-stone-900">DigiLocker Verification</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Connect your DigiLocker identity to auto-fill records. Automated OCR highlights discrepancies before you commit your application.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3 relative">
              <div className="w-9 h-9 rounded-lg bg-indigo-900 text-white font-mono font-bold flex items-center justify-center text-sm">
                03
              </div>
              <h3 className="font-bold text-sm text-stone-900">Statutory Scrutiny</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Your assigned Institute Nodal Officer signs off on enrollment. High-confidence clean files are placed in the Green Lane for instant approval.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3 relative">
              <div className="w-9 h-9 rounded-lg bg-teal-800 text-white font-mono font-bold flex items-center justify-center text-sm">
                04
              </div>
              <h3 className="font-bold text-sm text-stone-900">Direct Bank Credit</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Funds are disbursed through the Public Financial Management System (PFMS) directly into your Aadhaar-seeded bank account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: SCHEMES COVERED */}
      <section className="py-14 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded">
              Affirmative Welfare Programs
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              National ST Schemes Covered
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Administered in strict accordance with statutory criteria and budget ceilings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white border border-stone-200 rounded-xl p-4.5 space-y-2 shadow-2xs">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-950">
                Excellence Institutes
              </span>
              <h3 className="font-bold text-sm text-stone-900">Top Class Education for ST Students</h3>
              <p className="text-xs text-stone-600">
                Full tuition fee coverage at IITs, IIMs, AIIMS, and NITs plus ₹2,22,000 living &amp; book allowances.
              </p>
              <div className="text-[11px] text-stone-500 font-mono pt-1">Income Ceiling: ≤ ₹6.00L</div>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-4.5 space-y-2 shadow-2xs">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-950">
                Doctoral Research
              </span>
              <h3 className="font-bold text-sm text-stone-900">National Fellowship (NFHET)</h3>
              <p className="text-xs text-stone-600">
                Monthly fellowship (₹37,000 JRF / ₹42,000 SRF) for 750 Scheduled Tribe researchers pursuing M.Phil/Ph.D.
              </p>
              <div className="text-[11px] text-stone-500 font-mono pt-1">Income Ceiling: No Cap (Merit)</div>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-4.5 space-y-2 shadow-2xs">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-950">
                College &amp; University
              </span>
              <h3 className="font-bold text-sm text-stone-900">Post-Matric Scholarship (PMS-ST)</h3>
              <p className="text-xs text-stone-600">
                Comprehensive maintenance allowance and non-refundable institutional fee reimbursement for post-secondary studies.
              </p>
              <div className="text-[11px] text-stone-500 font-mono pt-1">Income Ceiling: ≤ ₹2.50L</div>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-4.5 space-y-2 shadow-2xs">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-950">
                School Retention
              </span>
              <h3 className="font-bold text-sm text-stone-900">Pre-Matric Scholarship (Class 9–10)</h3>
              <p className="text-xs text-stone-600">
                Day scholar &amp; hosteller grants supporting transition through senior secondary education and minimizing dropouts.
              </p>
              <div className="text-[11px] text-stone-500 font-mono pt-1">Income Ceiling: ≤ ₹2.50L</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: LANGUAGES & ACCESSIBILITY */}
      <section className="py-14 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 text-xs font-bold">
                <Globe2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Bhashini Multilingual Language Bridge</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                Accessible to Every Hamlet &amp; Dialect
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Language should never be a barrier to higher education. Vanavriddhi supports native bilingual workflows with voice queries and mobile alerts translated into regional languages including Hindi, English, Odia, Santali, Gondi, and regional tribal dialects.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-900">Voice Assistant Input</div>
                  <div className="text-stone-500 text-[11px]">Speak your query in your language to receive guidance.</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-900">SMS &amp; WhatsApp Alerts</div>
                  <div className="text-stone-500 text-[11px]">Direct mobile status updates in the candidate's preferred tongue.</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Security &amp; Privacy Architecture</span>
              </h3>
              <div className="space-y-3 text-xs text-stone-600">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                    ✓
                  </div>
                  <div>
                    <strong className="text-stone-800">Zero-PII Leakage Policy:</strong> Ministry and state analytical views access aggregated data only. Student Aadhaar, raw bank accounts, and contact numbers are strictly masked under the DPDP Act 2023.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                    ✓
                  </div>
                  <div>
                    <strong className="text-stone-800">SHA-256 Tamper-Evident Ledger:</strong> Every login, scrutiny action, and sanction event is chained cryptographically to guarantee complete audit compliance.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                    ✓
                  </div>
                  <div>
                    <strong className="text-stone-800">Strict Role Isolation:</strong> Dashboard boundaries are enforced at the data retrieval layer, preventing unauthorized crossover across student, officer, and ministry roles.
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenSystemDesign}
                  className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Inspect System Architecture Documentation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: FREQUENTLY ASKED QUESTIONS */}
      <section className="py-14 bg-stone-50 border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-600 bg-stone-200 px-2 py-0.5 rounded">
              Support &amp; Clarity
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-2xs transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-5 py-4 text-left font-bold text-xs sm:text-sm text-stone-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/80"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-stone-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-100 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION: NEED HELP? HELPLINE */}
      <section className="py-12 bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold">
                <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
                <span>Dedicated National Support Desk</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">
                Need Guidance with Your Application?
              </h3>
              <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
                Connect with our multilingual tribal support officers or speak to your local ITDA Project Administrator.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <div className="text-center sm:text-right bg-white/10 px-4 py-2.5 rounded-xl border border-white/20">
                <span className="text-[10px] text-emerald-200 block uppercase font-mono">Toll-Free Helpline</span>
                <span className="font-mono text-lg font-bold text-amber-300">1800-11-7788</span>
              </div>
              <button
                onClick={() => onOpenInfoModal('contact')}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Contact Directory
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-stone-200 bg-white py-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <VanavriddhiLogo className="w-5 h-5 opacity-80" />
            <span>© 2026 Vanavriddhi. Scholarship &amp; Fellowship Management for Scheduled Tribes</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <button onClick={() => onOpenInfoModal('privacy')} className="hover:text-stone-900 cursor-pointer">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => onOpenInfoModal('terms')} className="hover:text-stone-900 cursor-pointer">
              Terms of Use
            </button>
            <span>•</span>
            <button onClick={() => onOpenInfoModal('accessibility')} className="hover:text-stone-900 cursor-pointer">
              Accessibility
            </button>
            <span>•</span>
            <button onClick={() => onOpenInfoModal('help')} className="hover:text-stone-900 cursor-pointer">
              Help Centre
            </button>
            <span>•</span>
            <button onClick={() => onOpenInfoModal('contact')} className="hover:text-stone-900 cursor-pointer">
              Contact
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
