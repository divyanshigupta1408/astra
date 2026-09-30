import React from 'react';
import { UserRole } from '../types';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  CheckCircle2, 
  User, 
  GraduationCap, 
  ShieldCheck, 
  Building2, 
  BarChart3,
  MapPin,
  HeartHandshake
} from 'lucide-react';

export interface PersonaStep {
  stepNumber: number;
  role: UserRole;
  studentTab?: string;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
  highlightTarget: string;
  badge: string;
}

export const PERSONA_STEPS: PersonaStep[] = [
  {
    stepNumber: 1,
    role: 'student',
    studentTab: 'eligibility',
    titleHi: 'कदम 1: पात्रता जांच व नियम ट्रेस (Deterministic Rule Engine)',
    titleEn: 'Step 1: Eligibility Checker & Explainable Rule Trace',
    descHi: 'मीना बस्तर के सुदूर दंतेवाड़ा जिले की प्रथम पीढ़ी की छात्रा हैं। नियम इंजन ने आय सीमा (₹1.20L <= ₹6.0L) और 84.5% अंकों के आधार पर "टॉप क्लास एजुकेशन" योजना में 100% पारदर्शी पात्रता निर्धारित की है।',
    descEn: 'Meena is a first-generation ST student from remote Dantewada (Chhattisgarh). The deterministic rule engine evaluates her against statutory clauses (5.2 & 4.3), identifying complete eligibility for Top Class Education.',
    highlightTarget: 'eligibility',
    badge: 'पात्रता निर्धारण (Rules Decide)'
  },
  {
    stepNumber: 2,
    role: 'student',
    studentTab: 'apply',
    titleHi: 'कदम 2: स्मार्ट आवेदन व डिजीटल दस्तावेज (Smart Application)',
    titleEn: 'Step 2: Smart Application & OCR Cross-Reconciliation',
    descHi: 'मीना के सभी 4 दस्तावेज (जाति, आय, अंकपत्र, बैंक पासबुक) डिजीलाकर पीकेआई से सत्यापित हैं। बैंक खाता एनपीसीआई डीबीटी मैपर से जुड़ा है। आवेदन स्वास्थ्य स्कोर 98/100 है।',
    descEn: 'Meena’s 4 mandatory documents are verified via DigiLocker PKI. Her bank account is actively seeded with NPCI DBT Mapper. Application Health Score is 98/100 with zero discrepancies.',
    highlightTarget: 'apply',
    badge: 'स्वास्थ्य स्कोर: 98/100'
  },
  {
    stepNumber: 3,
    role: 'student',
    studentTab: 'track',
    titleHi: 'कदम 3: आवेदन ट्रैकर व भाषिणी बहुभाषी सूचना (Application Tracker)',
    titleEn: 'Step 3: Live Application Tracker & Multilingual Notifications',
    descHi: 'आवेदन संख्या VV-2026-CG-088219 का लाइव टाइमलाइन। भाषिणी भाषा सेतु द्वारा मीना को सीधे हिंदी व स्थानीय गोंडी/हल्बी में एसएमएस व व्हाट्सएप अलर्ट मिलता है।',
    descEn: 'Live tracking of application VV-2026-CG-088219. Through Bhashini language bridge, Meena receives real-time SMS and WhatsApp notifications in Hindi.',
    highlightTarget: 'track',
    badge: 'लाइव ट्रैकर व व्हाट्सएप'
  },
  {
    stepNumber: 4,
    role: 'officer',
    titleHi: 'कदम 4: अधिकारी सत्यापन डेस्क (Officer Verification Queue)',
    titleEn: 'Step 4: Officer Queue & Statutory Human Sign-off',
    descHi: 'संस्थान नोडल अधिकारी डेस्क: मीना का आवेदन "ग्रीन लेन" (Green Lane) में है। नियम ट्रेस और डिजिटल हस्ताक्षर से 1-क्लिक स्वीकृति संभव है। "एआई सलाह है, अंतिम निर्णय अधिकारी का है।"',
    descEn: 'Institutional Nodal Officer View: Meena’s file is triaged in the Green Lane. The officer verifies the rule trace and executes statutory sign-off. "AI flag is advisory. Officer decision is final."',
    highlightTarget: 'officer-queue',
    badge: 'ग्रीन लेन (Human Sign-off)'
  },
  {
    stepNumber: 5,
    role: 'analyst',
    titleHi: 'कदम 5: मंत्रालय विश्लेषण व शिविर योजना (Ministry Camp Planner)',
    titleEn: 'Step 5: Ministry Gap Analytics & District Camp Planner',
    descHi: 'मंत्रालय विश्लेषक दृश्य: बस्तर संभाग में पात्रता-पहुंच अंतर (Reach Gap) को पाटने हेतु सुकमा/दंतेवाड़ा में विशेष नामांकन व बैंक-सीडिंग शिविर को स्वीकृति दें।',
    descEn: 'Ministry Analyst View: Visualizing the eligible-vs-reached gap in Bastar division. The Camp Planner targets Sukma/Dantewada for mobile VLE vans and NPCI bank seeding.',
    highlightTarget: 'analyst-camps',
    badge: 'संतृप्ति अभियान (Saturation)'
  }
];

interface PersonaDemoControllerProps {
  currentStepIndex: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onExitDemo: () => void;
  onJumpToStep: (index: number) => void;
}

export const PersonaDemoController: React.FC<PersonaDemoControllerProps> = ({
  currentStepIndex,
  onNextStep,
  onPrevStep,
  onExitDemo,
  onJumpToStep
}) => {
  const currentStep = PERSONA_STEPS[currentStepIndex];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-11/12 max-w-4xl z-50 animate-slideUp">
      <div className="bg-stone-900/95 backdrop-blur-md text-white rounded-xl shadow-2xl border-2 border-amber-400 p-4 sm:p-5">
        {/* Top bar: Persona Identity & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center font-bold text-stone-950 text-sm shadow-xs">
              मी
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-400 text-sm">
                  मीना कुमारी मंडावी (Meena Kumari Mandavi)
                </span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded font-bold">
                  {currentStep.badge}
                </span>
              </div>
              <p className="text-[11px] text-stone-300 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>दंतेवाड़ा, छत्तीसगढ़ • प्रथम पीढ़ी जनजातीय छात्रा (NIT Raipur)</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 mr-2">
              {PERSONA_STEPS.map((s, idx) => (
                <button
                  key={s.stepNumber}
                  type="button"
                  onClick={() => onJumpToStep(idx)}
                  className={`w-6 h-6 rounded-full text-[11px] font-bold transition-all ${
                    idx === currentStepIndex
                      ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-300 ring-offset-1 ring-offset-stone-900'
                      : idx < currentStepIndex
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                  }`}
                  title={s.titleHi}
                >
                  {s.stepNumber}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onExitDemo}
              className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="डेमो समाप्त करें (Exit Demo)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Content */}
        <div className="py-3 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-base text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{currentStep.titleHi}</span>
            </h4>
            <span className="text-xs font-mono font-semibold text-amber-300">
              चरण {currentStep.stepNumber} / 5
            </span>
          </div>

          <p className="text-xs text-stone-200 leading-relaxed pt-0.5">
            {currentStep.descHi}
          </p>

          <p className="text-[11px] text-stone-400 italic">
            {currentStep.descEn}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-xs">
          <button
            type="button"
            onClick={onPrevStep}
            disabled={currentStepIndex === 0}
            className={`px-3 py-1.5 rounded flex items-center gap-1 font-semibold transition-colors ${
              currentStepIndex === 0
                ? 'opacity-40 cursor-not-allowed text-stone-500'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>पिछला (Back)</span>
          </button>

          <div className="text-[11px] text-stone-400 hidden sm:block">
            मूल सिद्धांत: <strong>"AI assists, rules decide, humans approve"</strong>
          </div>

          {currentStepIndex < PERSONA_STEPS.length - 1 ? (
            <button
              type="button"
              onClick={onNextStep}
              className="px-4 py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <span>अगला चरण (Next Step)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onExitDemo}
              className="px-4 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>डेमो पूर्ण (Finish Demo)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
