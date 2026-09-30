import React, { useState } from 'react';
import { AuthUser, AppLanguage, StudentDraftState, CscBooking } from '../../types';
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
  Volume2,
  Building2,
  Bell,
  Download,
  RotateCcw,
  Smartphone,
  MessageCircle,
  ExternalLink,
  Check
} from 'lucide-react';
import { CscBookingModal } from './CscBookingModal';
import { HelpfulFeedback } from '../HelpfulFeedback';
import { useAccessibility } from '../AccessibilityContext';
import { useToast } from '../Toast';
import { ContextualHelp } from '../ContextualHelp';

interface StudentHomeTabProps {
  user: AuthUser;
  language: AppLanguage;
  onNavigateTab: (tab: any) => void;
  onOpenVoiceAssistant?: () => void;
  applicationDraft?: StudentDraftState;
}

export const StudentHomeTab: React.FC<StudentHomeTabProps> = ({
  user,
  language,
  onNavigateTab,
  onOpenVoiceAssistant,
  applicationDraft = {
    currentStep: 2,
    totalSteps: 4,
    stepName: 'Document Upload & Cross-Reconciliation',
    completionPercentage: 65,
    lastSavedAt: 'Just now',
    schemeId: 'TOP-CLASS-ST'
  }
}) => {
  const { simpleView } = useAccessibility();
  const { showToast } = useToast();
  const isMeena = user.identifier === '9876543210' || user.id === 'USR-STU-MEENA';

  // Modals & Panels State
  const [isCscBookingOpen, setIsCscBookingOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState<CscBooking | null>(null);

  // Notification Preferences Panel State
  const [notifPreferences, setNotifPreferences] = useState({
    sms: true,
    whatsapp: true,
    app: true,
    deadlines: true,
    disbursalAlerts: true
  });

  // Calendar .ics download generator
  const handleAddToCalendar = (title: string, description: string, dateString: string) => {
    // Generate valid RFC 5545 iCalendar string
    const dateFormatted = dateString.replace(/-/g, '');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//A.S.T.R.A MoTA//Scholarship Deadlines//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `DTSTART;VALUE=DATE:${dateFormatted}`,
      `DTEND;VALUE=DATE:${dateFormatted}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(
      language === 'hi' ? 'कैलेंडर रिमाइंडर (.ics) डाउनलोड हो गया।' : `Downloaded calendar reminder: ${title}.ics`,
      'success',
      'Calendar Event Added'
    );
  };

  const deadlineList = [
    {
      id: 'd1',
      title: 'Institutional Scrutiny Closing Date',
      titleHi: 'संस्थान स्तर सत्यापन अंतिम तिथि',
      dateStr: '2026-10-15',
      displayDate: '15 October 2026',
      badge: '15 days remaining',
      desc: 'Nodal verification window for Top Class Education & National Fellowship applications.'
    },
    {
      id: 'd2',
      title: 'Annual Renewal Window Opens',
      titleHi: 'वार्षिक नवीनीकरण आवेदन विंडो प्रारंभ',
      dateStr: '2026-11-01',
      displayDate: '01 November 2026',
      badge: 'Upcoming Cycle',
      desc: 'Submit semester marksheet and 75% attendance certification for ongoing fellowship grant.'
    },
    {
      id: 'd3',
      title: 'Mobile Saturation Camp in District',
      titleHi: 'जिला मोबाइल शिविर एवं आधार लिंकिंग',
      dateStr: '2026-10-12',
      displayDate: '12-14 October 2026',
      badge: 'Local Camp',
      desc: 'Free physical biometric eKYC, NPCI mapper bank-seeding, and Gram Sabha PESA inquiries.'
    }
  ];

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

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Book Help at CSC / ITDA Button */}
          <button
            onClick={() => setIsCscBookingOpen(true)}
            className="px-3.5 py-2.5 bg-emerald-950/80 hover:bg-emerald-950 text-emerald-100 border border-emerald-400/40 rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 transition-transform hover:scale-102 cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-emerald-300" />
            <span>{language === 'hi' ? 'सीएससी सहायता बुक करें' : 'Book Help at CSC / ITDA'}</span>
          </button>

          {/* Voice Assistant Button */}
          <button
            onClick={onOpenVoiceAssistant}
            className="px-4 py-2.5 bg-white hover:bg-amber-50 text-stone-900 rounded-xl font-bold text-xs shadow-sm flex items-center gap-2 transition-transform hover:scale-102 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-amber-600" />
            <span>{language === 'hi' ? 'सहायक से बोलें (Voice)' : 'Speak to Assistant'}</span>
          </button>
        </div>
      </div>

      {/* 1. SAVE & RESUME: "CONTINUE WHERE YOU LEFT OFF" CARD */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 border-2 border-amber-300 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-200 text-amber-950 px-2 py-0.5 rounded border border-amber-300">
              {language === 'hi' ? 'ड्राफ़्ट सुरक्षित (In-Memory Draft)' : 'Auto-Saved Draft'}
            </span>
            <span className="text-[11px] text-stone-500 font-mono flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              <span>{language === 'hi' ? `अंतिम बार सुरक्षित: ${applicationDraft.lastSavedAt}` : `Last saved: ${applicationDraft.lastSavedAt}`}</span>
            </span>
          </div>

          <h3 className="text-base font-extrabold text-stone-950 flex items-center gap-2">
            <span>{language === 'hi' ? 'जहाँ छोड़ा था, वहीं से जारी रखें' : 'Continue Where You Left Off'}</span>
          </h3>

          <p className="text-xs text-stone-700">
            {language === 'hi'
              ? `चरण ${applicationDraft.currentStep} / ${applicationDraft.totalSteps}: ${applicationDraft.stepName}`
              : `Step ${applicationDraft.currentStep} of ${applicationDraft.totalSteps}: ${applicationDraft.stepName} (${applicationDraft.schemeId})`}
          </p>

          {/* Completion Progress Bar */}
          <div className="space-y-1 pt-1 max-w-md">
            <div className="flex justify-between text-[11px] font-bold text-amber-950 font-mono">
              <span>{language === 'hi' ? 'पूर्णता प्रतिशत' : 'Application Progress'}</span>
              <span>{applicationDraft.completionPercentage}%</span>
            </div>
            <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${applicationDraft.completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('apply')}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <span>{language === 'hi' ? 'आवेदन जारी रखें' : 'Resume Application'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* BIG "NEXT STEP" CARD + HEALTH SCORE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Next Step Card */}
        <div className="md:col-span-2 bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-200">
                {language === 'hi' ? 'सक्रिय स्थिति (Active Status)' : 'Scrutiny Stage'}
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
              className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
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

      {/* DEADLINE REMINDERS WITH "ADD TO CALENDAR" (.ICS) & NOTIFICATION PREFERENCES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Reminders List with "Add to calendar" */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-700" />
              <span>{language === 'hi' ? 'महत्वपूर्ण समय-सीमा एवं कैलेंडर रिमाइंडर' : 'Statutory Deadlines & Calendar Reminders'}</span>
            </h4>
            <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
              Cycle 1
            </span>
          </div>

          <div className="space-y-2.5">
            {deadlineList.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-stone-50/80 hover:bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-xs">
                      {language === 'hi' ? item.titleHi : item.title}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                      {item.badge}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 font-medium">
                    {item.displayDate}
                  </div>
                  <p className="text-[10px] text-stone-600 italic">
                    {item.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddToCalendar(item.title, item.desc, item.dateStr)}
                  className="px-3 py-1.5 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold flex items-center gap-1.5 self-start sm:self-center shrink-0 cursor-pointer shadow-2xs transition-colors"
                  title="Download .ics file to add to Google Calendar, Apple Calendar, or Outlook"
                >
                  <Download className="w-3.5 h-3.5 text-amber-700" />
                  <span>{language === 'hi' ? 'कैलेंडर में जोड़ें' : 'Add to calendar'}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Feedback control */}
          <div className="pt-2 border-t border-stone-100 flex justify-end">
            <HelpfulFeedback articleId="deadline-reminders" language={language} />
          </div>
        </div>

        {/* Notification Preferences Panel */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-emerald-700" />
              <span>{language === 'hi' ? 'अधिसूचना प्राथमिकताएं' : 'Notification Preferences'}</span>
            </h4>
            <span className="text-[10px] text-stone-400 font-mono">Real-time alerts</span>
          </div>

          <p className="text-stone-500 text-xs leading-relaxed">
            {language === 'hi'
              ? 'चुनें कि आप समय-सीमा, सत्यापन स्थिति तथा डीबीटी भुगतान के अपडेट कहाँ पाना चाहते हैं।'
              : 'Configure how you receive critical verification alerts, officer clarifications, and PFMS payment confirmations.'}
          </p>

          <div className="space-y-3 text-xs">
            {/* SMS Toggle */}
            <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-stone-600" />
                <div>
                  <div className="font-bold text-stone-800">SMS Alerts</div>
                  <div className="text-[11px] text-stone-500">To: ••••••••8210</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifPreferences.sms}
                onChange={(e) => {
                  setNotifPreferences({ ...notifPreferences, sms: e.target.checked });
                  showToast('SMS preferences updated.', 'success');
                }}
                className="h-4 w-4 rounded text-emerald-700 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            {/* WhatsApp Toggle */}
            <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200">
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="font-bold text-stone-800">WhatsApp Dispatch</div>
                  <div className="text-[11px] text-stone-500">With PDF sanction copies</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifPreferences.whatsapp}
                onChange={(e) => {
                  setNotifPreferences({ ...notifPreferences, whatsapp: e.target.checked });
                  showToast('WhatsApp preferences updated.', 'success');
                }}
                className="h-4 w-4 rounded text-emerald-700 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            {/* In-App Notifications */}
            <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200">
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-amber-600" />
                <div>
                  <div className="font-bold text-stone-800">In-App Notification Bell</div>
                  <div className="text-[11px] text-stone-500">Instant badge on top bar</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifPreferences.app}
                onChange={(e) => {
                  setNotifPreferences({ ...notifPreferences, app: e.target.checked });
                  showToast('In-app preferences updated.', 'success');
                }}
                className="h-4 w-4 rounded text-emerald-700 focus:ring-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE SCHEME CARDS (Hidden if simpleView is active) */}
      {!simpleView && (
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

          <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3.5 space-y-1.5">
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

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => onNavigateTab('eligibility')}
              className="text-xs font-bold text-amber-800 hover:text-amber-900 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'hi' ? 'अन्य पात्र योजनाएं देखें' : 'Explore all eligible schemes & rule traces'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <HelpfulFeedback articleId="scheme-info" language={language} />
          </div>
        </div>
      )}

      {/* CSC Booking Modal */}
      <CscBookingModal
        isOpen={isCscBookingOpen}
        onClose={() => setIsCscBookingOpen(false)}
        user={user}
        language={language}
        onBookingConfirmed={(booking) => {
          setActiveBooking(booking);
          showToast(`Slot confirmed at ${booking.centreName}!`, 'success', 'Booking Confirmed');
        }}
      />
    </div>
  );
};
