import React, { useState } from 'react';
import { translations } from '../../locales/translations';
import { 
  CheckCircle2, 
  Clock, 
  Send, 
  MessageSquare, 
  Smartphone, 
  Building, 
  Landmark, 
  ShieldCheck, 
  CreditCard,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

interface ApplicationTrackerProps {
  language: 'en' | 'hi';
  applicationId?: string;
  isGramSabhaFallback?: boolean;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  language,
  applicationId = 'VV-2026-OD-091823',
  isGramSabhaFallback = false
}) => {
  const t = translations[language].tracker;

  const [activeChannel, setActiveChannel] = useState<'sms' | 'whatsapp'>('sms');

  // Timeline Stages
  const baseStages = [
    {
      id: 'submitted',
      label: t.stages.submitted,
      date: '14 Aug 2026, 11:32 AM',
      officer: 'Candidate Online Portal',
      status: 'completed',
      detail: isGramSabhaFallback 
        ? 'Application & Gram Sabha community attestation declaration submitted.' 
        : 'Application & 4 mandatory documents uploaded and hashed.'
    },
    ...(isGramSabhaFallback ? [
      {
        id: 'gramSabhaAttestation',
        label: language === 'hi' ? 'ग्राम सभा / ITDA अधिकारी सत्यापन' : 'Gram Sabha / ITDA Officer Attestation',
        date: 'Pending Field Inquiry',
        officer: 'Project Administrator, ITDA & Gram Sabha Sachiv',
        status: 'current',
        detail: 'Field inquiry initiated under PESA Section 4(d). AI flag is advisory. Officer decision is statutory and final.'
      }
    ] : []),
    {
      id: 'instituteVerified',
      label: t.stages.instituteVerified,
      date: isGramSabhaFallback ? 'Expected: 15 Oct 2026' : '02 Sep 2026, 04:15 PM',
      officer: 'Dr. A. K. Soren (NIT Rourkela Nodal Desk)',
      status: isGramSabhaFallback ? 'upcoming' : 'completed',
      detail: 'Academic enrollment & attendance requirements verified.'
    },
    {
      id: 'stateVerified',
      label: t.stages.stateVerified,
      date: isGramSabhaFallback ? 'Expected: 22 Oct 2026' : '18 Sep 2026, 02:40 PM',
      officer: 'ST & SC Development Dept, Odisha',
      status: isGramSabhaFallback ? 'upcoming' : 'current',
      detail: 'State scrutiny active. Pre-sanction eligibility ledger confirmed.'
    },
    {
      id: 'ministrySanctioned',
      label: t.stages.ministrySanctioned,
      date: 'Expected: 05 Nov 2026',
      officer: 'MoTA Scholarship Division, New Delhi',
      status: 'upcoming',
      detail: 'Statutory sanction order generation and fund allotment.'
    },
    {
      id: 'pfmsReleased',
      label: t.stages.pfmsReleased,
      date: 'Expected: 10 Nov 2026',
      officer: 'Public Financial Management System (PFMS)',
      status: 'upcoming',
      detail: 'Electronic credit advice token generation for RBI payment gateway.'
    },
    {
      id: 'bankCredited',
      label: t.stages.bankCredited,
      date: 'Expected: 12 Nov 2026',
      officer: 'State Bank of India (NPCI DBT Mapper)',
      status: 'upcoming',
      detail: 'Direct benefit transfer into student individual bank account.'
    }
  ];

  const stages = baseStages;

  // SMS & WhatsApp Notification Previews
  const smsText = language === 'hi'
    ? `भारत सरकार (MoTA): प्रिय रामू कुमार, आपका आवेदन ${applicationId} राज्य स्तरीय सत्यापन स्तर पर सफलतापूर्वक स्वीकृत कर लिया गया है। पीएफएमएस वितरण टोकन शीघ्र जारी होगा। - जनजातीय कार्य मंत्रालय`
    : `Govt of India (MoTA): Dear Ramu Kumar, your application ${applicationId} has advanced to State Level Verification. PFMS credit advice token will be notified upon release. - Ministry of Tribal Affairs`;

  const whatsappText = language === 'hi'
    ? `🇮🇳 *जनजातीय कार्य मंत्रालय, भारत सरकार*\n\nनमस्ते *रामू कुमार*,\n\nआपकी छात्रवृत्ति आवेदन संख्या: *${applicationId}*\nयोजना: *टॉप क्लास एजुकेशन (ST Students)*\n\n📌 *वर्तमान स्थिति:* राज्य नोडल सत्यापन प्रक्रियाधीन\n🏛️ *संस्थान:* NIT Rourkela (सत्यापित)\n💳 *बैंक खाता:* ••••••••3912 (NPCI आधार सीडेड)\n\n🔔 *अगला चरण:* मंत्रालय द्वारा संस्वीकृति आदेश (Sanction Order) निर्गत किया जाना।\n\n_यह संदेश भाषिणी (Bhashini) भाषा सेतु द्वारा प्रेषित किया गया है।_\nपोर्टल: https://tribal.gov.in`
    : `🇮🇳 *Ministry of Tribal Affairs, Govt of India*\n\nNamaste *Ramu Kumar*,\n\nApplication ID: *${applicationId}*\nScheme: *Top Class Education for ST Students*\n\n📌 *Current Stage:* State Verification In-Progress\n🏛️ *Institute:* NIT Rourkela (Approved)\n💳 *Disbursement Bank:* ••••••••3912 (NPCI Aadhaar Seeded)\n\n🔔 *Next Milestone:* MoTA Sanction Order & PFMS Treasury Token.\n\n_Bhashini Multilingual Bridge Enabled._\nPortal: https://tribal.gov.in`;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                App ID: {applicationId}
              </span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Top Class Education Scheme
              </span>
            </div>
            <h3 className="text-base font-bold text-stone-900 mt-1">
              {t.title}
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              {t.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>{isGramSabhaFallback ? 'Current: Gram Sabha / ITDA Attestation' : 'Current: State Verified Desk'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Community Attestation Fallback Notice Card */}
      {isGramSabhaFallback && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-3.5 flex items-start gap-3 animate-fadeIn">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-amber-950">
                Community Attestation Fallback Active (Gram Sabha PESA Resolution)
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">
                Clause 6.4
              </span>
            </div>
            <p className="text-xs text-amber-900">
              Your application is routed to the local ITDA Project Administrator and Gram Sabha for physical community verification.
            </p>
            <p className="text-[11px] font-semibold text-amber-950 pt-0.5">
              Statutory Label: AI flag is advisory. Officer decision on Community Attestation is statutory and final.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 6-Stage Timeline */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-4 pb-2 border-b border-stone-200">
            Statutory Disbursement Workflow Timeline
          </h4>

          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
            {stages.map((stage, idx) => {
              const isDone = stage.status === 'completed';
              const isCurrent = stage.status === 'current';

              return (
                <div key={stage.id} className="relative">
                  {/* Dot */}
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] ${
                      isDone
                        ? 'bg-emerald-700 ring-4 ring-emerald-50'
                        : isCurrent
                        ? 'bg-amber-500 ring-4 ring-amber-100 animate-pulse'
                        : 'bg-stone-300'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : isCurrent ? (
                      <Clock className="w-3 h-3" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className={`p-3 rounded-lg border text-xs ${
                      isCurrent
                        ? 'bg-amber-50/70 border-amber-300'
                        : isDone
                        ? 'bg-stone-50 border-stone-200'
                        : 'bg-white border-stone-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`font-bold ${isCurrent ? 'text-amber-950 font-sans' : 'text-stone-900'}`}>
                        {idx + 1}. {stage.label}
                      </span>
                      <span className="text-[11px] font-mono text-stone-500">
                        {stage.date}
                      </span>
                    </div>

                    <p className="text-stone-600 text-xs mb-1.5">
                      {stage.detail}
                    </p>

                    <div className="text-[10px] text-stone-500 flex items-center gap-1 font-mono">
                      <span>Authority:</span>
                      <span className="font-semibold text-stone-700">{stage.officer}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: SMS & WhatsApp Multilingual Notification Previews */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-700" />
                <span>Multilingual Realtime Citizen Alerts</span>
              </h4>

              <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded text-xs font-medium">
                <button
                  onClick={() => setActiveChannel('sms')}
                  className={`px-2 py-1 rounded text-[11px] transition-all ${
                    activeChannel === 'sms'
                      ? 'bg-white text-stone-900 shadow-2xs font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  SMS
                </button>
                <button
                  onClick={() => setActiveChannel('whatsapp')}
                  className={`px-2 py-1 rounded text-[11px] transition-all ${
                    activeChannel === 'whatsapp'
                      ? 'bg-emerald-800 text-white shadow-2xs font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  WhatsApp
                </button>
              </div>
            </div>

            {/* Mobile Mock Frame */}
            <div className="bg-stone-950 p-3 rounded-xl shadow-inner max-w-sm mx-auto">
              <div className="bg-stone-100 rounded-lg p-3 min-h-[220px] flex flex-col justify-between text-xs">
                {activeChannel === 'sms' ? (
                  <div>
                    <div className="text-center text-[10px] text-stone-400 font-mono mb-2">
                      MoTA-GOV-SMS • Today 02:40 PM
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-2xs text-stone-800 font-sans text-xs leading-relaxed">
                      {smsText}
                    </div>
                    <div className="mt-2 text-[10px] text-stone-500 text-center font-mono">
                      Sent via CDAC National Mobile Gateway
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between bg-emerald-800 text-white p-2 rounded mb-2">
                      <span className="font-bold text-xs flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        Ministry of Tribal Affairs Verified
                      </span>
                      <span className="text-[10px] bg-emerald-700 px-1.5 py-0.5 rounded font-mono">
                        Official
                      </span>
                    </div>
                    <div className="bg-emerald-50/80 p-3 rounded-lg border border-emerald-200 text-stone-900 text-xs whitespace-pre-line leading-relaxed font-sans">
                      {whatsappText}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-stone-200 mt-3 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    Bhashini Certified
                  </span>
                  <span className="font-mono">Language: {language.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Direct PFMS Disbursement Factcard */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-xs space-y-2">
            <h5 className="font-bold text-emerald-950 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-700" />
              <span>Direct Benefit Transfer (DBT) Safeguards</span>
            </h5>
            <p className="text-emerald-900 leading-relaxed text-[11px]">
              Funds are never routed through intermediaries or third-party college accounts. The treasury credit advice is dispatched directly into the Aadhaar-seeded individual bank account of the beneficiary via PFMS (Public Financial Management System).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
