import React, { useState, useEffect } from 'react';
import { StudentProfile, CrossDocMismatch, StudentDraftState } from '../../types';
import { translations } from '../../locales/translations';
import { 
  FileCheck, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  CreditCard, 
  FileText, 
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  Check,
  Tent,
  Camera,
  Download,
  Volume2,
  VolumeX,
  Clock,
  Layers,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { useToast } from '../Toast';
import { CameraHelperModal } from './CameraHelperModal';
import { DocumentChecklistModal } from './DocumentChecklistModal';
import { ContextualHelp } from '../ContextualHelp';

interface SmartApplicationProps {
  language: 'en' | 'hi';
  selectedSchemeId?: string;
  initialProfile?: StudentProfile;
  onSubmitSuccess: (applicationId: string, isGramSabhaFallback?: boolean) => void;
  onDraftUpdate?: (draft: StudentDraftState) => void;
}

export const SmartApplication: React.FC<SmartApplicationProps> = ({
  language,
  selectedSchemeId = 'TOP-CLASS-ST',
  initialProfile,
  onSubmitSuccess,
  onDraftUpdate
}) => {
  const { showToast } = useToast();
  const t = translations[language].smartApply;

  // Auto-Save & Resume in-memory state
  const [lastSavedTime, setLastSavedTime] = useState<string>('Saved just now');
  const [guidedMode, setGuidedMode] = useState<boolean>(false);
  const [guidedStep, setGuidedStep] = useState<number>(1);
  const totalGuidedSteps = 5;

  // Modals
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [activeCameraDocTitle, setActiveCameraDocTitle] = useState<string>('');
  const [activeCameraDocKey, setActiveCameraDocKey] = useState<string>('caste');
  const [isChecklistOpen, setIsChecklistOpen] = useState<boolean>(false);

  // Community Attestation Fallback State
  const [noCasteCertificate, setNoCasteCertificate] = useState<boolean>(false);
  const [gramSabhaDetails, setGramSabhaDetails] = useState({
    village: 'Bada Jamuda, Ward 03',
    panchayat: 'Gorkha Gram Panchayat',
    block: 'Karanjia Block',
    itdaOffice: 'ITDA Karanjia, Mayurbhanj',
    reason: 'First-generation forest dweller / digitization pending under PESA Section 4(d)'
  });

  // Uploaded Files State
  const [uploadedDocs, setUploadedDocs] = useState<{
    caste: { uploaded: boolean; name: string; reused?: boolean; fromCamera?: boolean };
    income: { uploaded: boolean; name: string; reused?: boolean; fromCamera?: boolean };
    marksheet: { uploaded: boolean; name: string; reused?: boolean; fromCamera?: boolean };
    bank: { uploaded: boolean; name: string; reused?: boolean; fromCamera?: boolean };
  }>({
    caste: { uploaded: true, name: 'caste_cert_ramu_santhal.pdf' },
    income: { uploaded: true, name: 'revenue_income_cert_2026.pdf' },
    marksheet: { uploaded: true, name: 'class12_marksheet_chse.pdf' },
    bank: { uploaded: true, name: 'sbi_passbook_page1.pdf' }
  });

  // OCR Processing Simulation State
  const [isOcrProcessing, setIsOcrProcessing] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [ocrStepText, setOcrStepText] = useState<string>('');
  const [isExtracted, setIsExtracted] = useState<boolean>(true);

  // Profile data extracted from OCR
  const [extractedData, setExtractedData] = useState({
    name: 'Ramu Kumar',
    casteDocName: 'Ramu',
    fatherName: 'Gopal Soren',
    dob: '12-04-2003',
    category: 'Scheduled Tribe (Santhal)',
    income: '₹1,85,000',
    accountMasked: '••••••••3912',
    ifsc: 'SBIN0001842',
    institute: 'National Institute of Technology (NIT) Rourkela'
  });

  // Smart Mismatches: plain-language guidance naming the two conflicting values and suggesting exact fix
  const [mismatches, setMismatches] = useState<CrossDocMismatch[]>([
    {
      field: 'Student Full Name',
      docA: { name: 'ST Caste Certificate', value: 'Ramu' },
      docB: { name: 'Bank Passbook & Marksheet', value: 'Ramu Kumar' },
      severity: 'medium',
      description: language === 'hi' 
        ? "असंगति: आपके एसटी जाति प्रमाण पत्र पर नाम 'Ramu' दर्ज है, जबकि बैंक पासबुक और अंकसूची पर 'Ramu Kumar' दर्ज है।"
        : "Discrepancy: Your ST Caste Certificate lists the name 'Ramu', whereas your Bank Passbook and Marksheet list 'Ramu Kumar'.",
      suggestedAction: language === 'hi'
        ? "इसे कैसे ठीक करें: जाति प्रमाण पत्र और बैंक खाते में नाम एक समान प्रमाणित करने हेतु तहसीलदार से निर्गत उपनाम/alias शपथ पत्र (Affidavit) अपलोड करें।"
        : "How to fix: Upload an attested alias/same-person affidavit from the Tahsildar to allow the officer to clear the Green lane without raising a clarification query."
    }
  ]);

  // Bank DBT Seeding status
  const [bankSeeded, setBankSeeded] = useState<boolean>(true);

  // Speech synthesis for guided mode "Read aloud"
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast('Text-to-speech is not supported in this browser.', 'info');
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Auto-Save after every modification
  const triggerAutoSave = (stepName: string, stepIndex: number, pct: number) => {
    const timeStr = 'Saved just now';
    setLastSavedTime(timeStr);
    if (onDraftUpdate) {
      onDraftUpdate({
        currentStep: stepIndex,
        totalSteps: 4,
        stepName,
        completionPercentage: pct,
        lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        schemeId: selectedSchemeId
      });
    }
  };

  // Health Score Calculation
  const healthScore = noCasteCertificate
    ? 75
    : Math.max(0, 100 - (mismatches.length * 22) - (bankSeeded ? 0 : 35));

  // Trigger 2-second animated OCR simulation
  const runOcrSimulation = (scenario: 'mismatch' | 'clean') => {
    setIsOcrProcessing(true);
    setOcrProgress(15);
    setOcrStepText('Step 1/4: Ingesting high-resolution PDF scans & performing layout de-skewing...');

    setTimeout(() => {
      setOcrProgress(45);
      setOcrStepText('Step 2/4: Optical Character Recognition (OCR) & Entity Boundary Detection...');
    }, 600);

    setTimeout(() => {
      setOcrProgress(75);
      setOcrStepText('Step 3/4: Querying DigiLocker & State e-District Public Key Infrastructure...');
    }, 1200);

    setTimeout(() => {
      setOcrProgress(100);
      setOcrStepText('Step 4/4: Cross-document entity reconciliation & NPCI Mapper check completed.');

      if (scenario === 'mismatch') {
        setExtractedData({
          name: 'Ramu Kumar',
          casteDocName: 'Ramu',
          fatherName: 'Gopal Soren',
          dob: '12-04-2003',
          category: 'Scheduled Tribe (Santhal)',
          income: '₹1,85,000',
          accountMasked: '••••••••3912',
          ifsc: 'SBIN0001842',
          institute: 'National Institute of Technology (NIT) Rourkela'
        });
        setMismatches([
          {
            field: 'Student Full Name',
            docA: { name: 'ST Caste Certificate', value: 'Ramu' },
            docB: { name: 'Bank Passbook & Marksheet', value: 'Ramu Kumar' },
            severity: 'medium',
            description: language === 'hi' 
              ? "असंगति: आपके एसटी जाति प्रमाण पत्र पर नाम 'Ramu' दर्ज है, जबकि बैंक पासबुक और अंकसूची पर 'Ramu Kumar' दर्ज है।"
              : "Discrepancy: Your ST Caste Certificate lists the name 'Ramu', whereas your Bank Passbook and Marksheet list 'Ramu Kumar'.",
            suggestedAction: language === 'hi'
              ? "इसे कैसे ठीक करें: तहसीलदार से निर्गत उपनाम/alias शपथ पत्र अपलोड करें।"
              : "How to fix: Upload an attested alias/same-person affidavit from the Tahsildar to clear scrutiny."
          }
        ]);
        setBankSeeded(true);
      } else {
        setExtractedData({
          name: 'Sunita Marandi',
          casteDocName: 'Sunita Marandi',
          fatherName: 'Birsa Marandi',
          dob: '05-11-2001',
          category: 'Scheduled Tribe (Santhal)',
          income: '₹2,10,000',
          accountMasked: '••••••••7721',
          ifsc: 'BOI0004910',
          institute: 'Ranchi University, Morabadi'
        });
        setMismatches([]);
        setBankSeeded(true);
      }

      setIsOcrProcessing(false);
      setIsExtracted(true);
      triggerAutoSave('OCR Verification & Consistency Scrutiny', 3, 85);
    }, 2000);
  };

  const handleDocumentReuse = (type: 'caste' | 'income' | 'marksheet' | 'bank', docName: string) => {
    setUploadedDocs(prev => ({
      ...prev,
      [type]: { uploaded: true, name: docName, reused: true }
    }));
    showToast(
      language === 'hi' ? `सत्यापित दस्तावेज़ ${docName} पुनः उपयोग हेतु जोड़ा गया।` : `Previously verified document ${docName} reused!`,
      'success',
      'Document Reused'
    );
    triggerAutoSave('Document Vault Reuse', 2, 70);
  };

  const handleOpenPhotoCapture = (key: string, title: string) => {
    setActiveCameraDocKey(key);
    setActiveCameraDocTitle(title);
    setIsCameraOpen(true);
  };

  const handleCameraCaptured = (fileName: string) => {
    setUploadedDocs(prev => ({
      ...prev,
      [activeCameraDocKey as 'caste' | 'income' | 'marksheet' | 'bank']: {
        uploaded: true,
        name: fileName,
        fromCamera: true
      }
    }));
    showToast(`High quality document photo captured: ${fileName}`, 'success', 'Photo Attached');
    triggerAutoSave('Camera Document Attached', 2, 75);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const newAppId = noCasteCertificate ? 'VV-2026-OD-077402' : 'VV-2026-CG-088219';
    showToast(
      `Application ${newAppId} successfully submitted to Institutional Scrutiny Queue.`,
      'success',
      'Application Submitted'
    );
    onSubmitSuccess(newAppId, noCasteCertificate);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card with Auto-save & Guided Mode Toggle */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                Scheme: {selectedSchemeId}
              </span>
              {/* Live Save Status */}
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                <Clock className="w-3 h-3 text-emerald-600" />
                <span>{lastSavedTime}</span>
              </span>
            </div>
            <h3 className="text-base font-bold text-stone-900">
              {t.title}
            </h3>
            <p className="text-xs text-stone-600">
              {t.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Download Printable Checklist Button */}
            <button
              type="button"
              onClick={() => setIsChecklistOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-stone-600" />
              <span>{language === 'hi' ? 'दस्तावेज़ चेकलिस्ट' : 'Download Checklist'}</span>
            </button>

            {/* Guided Mode Toggle */}
            <button
              type="button"
              onClick={() => {
                setGuidedMode(!guidedMode);
                triggerAutoSave(guidedMode ? 'Standard Mode' : 'Guided Mode', 2, 60);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                guidedMode
                  ? 'bg-amber-600 text-white shadow-xs ring-2 ring-amber-300'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{guidedMode ? 'Guided Mode: ON' : (language === 'hi' ? 'आवेदन सहायता (Guided Mode)' : 'Help me apply')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* GUIDED MODE INTERACTION (ONE QUESTION PER SCREEN) */}
      {guidedMode ? (
        <div className="bg-white border-2 border-amber-400 rounded-2xl p-6 shadow-md space-y-6 animate-in zoom-in-95">
          {/* Progress Bar & Read Aloud Header */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                Step {guidedStep} of {totalGuidedSteps}
              </span>
              <div className="w-48 bg-stone-200 h-2 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${(guidedStep / totalGuidedSteps) * 100}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const stepPrompts = [
                  "Question 1: Are you enrolled in an accredited higher educational institution?",
                  "Question 2: Does your annual household income strictly stay below the statutory ceiling of 2.5 to 6 Lakhs?",
                  "Question 3: Is your individual bank account seeded with Aadhaar on the NPCI mapper for Direct Benefit Transfer?",
                  "Question 4: Do you want to reuse your previously verified ST Caste and Income documents?",
                  "Question 5: Review your application consistency score and submit for Institutional officer sign-off."
                ];
                speakText(stepPrompts[guidedStep - 1]);
              }}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-700 animate-pulse" /> : <Volume2 className="w-4 h-4 text-amber-700" />}
              <span>{isSpeaking ? (language === 'hi' ? 'रोकें (Stop)' : 'Stop Speech') : (language === 'hi' ? 'प्रश्न सुनें (Read aloud)' : 'Read aloud')}</span>
            </button>
          </div>

          {/* Guided Questions Content */}
          {guidedStep === 1 && (
            <div className="space-y-4 py-2">
              <h3 className="text-lg font-bold text-stone-900">
                {language === 'hi' ? '1. क्या आप किसी मान्यता प्राप्त उच्च शिक्षण संस्थान में नामांकित हैं?' : '1. Are you enrolled in an accredited higher educational institution?'}
              </h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                {language === 'hi'
                  ? 'जैसे कि एनआईटी, आईआईटी, आईआईएम, केंद्रीय या राज्य सरकारी विश्वविद्यालय।'
                  : 'Such as NIT Raipur, NIT Rourkela, Central Universities, or notified AICTE/UGC recognized institutes.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    triggerAutoSave('Enrolled: Yes', 1, 20);
                    setGuidedStep(2);
                  }}
                  className="p-4 rounded-xl border-2 border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-sm text-left transition-all cursor-pointer flex items-center justify-between"
                >
                  <span>Yes, I am enrolled as a regular ST student</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast('Admission proof is mandatory for higher education scholarships.', 'info');
                    setGuidedStep(2);
                  }}
                  className="p-4 rounded-xl border-2 border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-800 font-bold text-sm text-left transition-all cursor-pointer"
                >
                  <span>Provisional Admission in progress</span>
                </button>
              </div>
            </div>
          )}

          {guidedStep === 2 && (
            <div className="space-y-4 py-2">
              <h3 className="text-lg font-bold text-stone-900">
                {language === 'hi' ? '2. क्या आपकी वार्षिक पारिवारिक आय निर्धारित सीमा के भीतर है?' : '2. Is your annual family income within the statutory ceiling?'}
              </h3>
              <p className="text-stone-600 text-xs">
                {language === 'hi'
                  ? 'टॉप क्लास एसटी योजना हेतु अधिकतम ₹6,00,000 तथा पोस्ट-मैट्रिक हेतु ₹2,50,000 प्रति वर्ष।'
                  : 'Under MoTA Top Class Scheme: maximum ₹6,00,000 per annum (Clause 5.2). Post-Matric: ₹2,50,000.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    triggerAutoSave('Income verified: Yes', 2, 40);
                    setGuidedStep(3);
                  }}
                  className="p-4 rounded-xl border-2 border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-sm text-left transition-all cursor-pointer flex items-center justify-between"
                >
                  <span>Yes, less than ₹6,00,000 (Current: ₹1.85L)</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast('Family income above ₹6.0L may exceed the statutory ceiling for this scheme.', 'info');
                    setGuidedStep(3);
                  }}
                  className="p-4 rounded-xl border-2 border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-800 font-bold text-sm text-left transition-all cursor-pointer"
                >
                  <span>Need Tahsil income recalculation</span>
                </button>
              </div>
            </div>
          )}

          {guidedStep === 3 && (
            <div className="space-y-4 py-2">
              <h3 className="text-lg font-bold text-stone-900">
                {language === 'hi' ? '3. क्या आपका बैंक खाता आधार से एनपीसीआई मैपर पर जुड़ा है?' : '3. Is your bank account Aadhaar-seeded on NPCI mapper for Direct Benefit Transfer?'}
              </h3>
              <p className="text-stone-600 text-xs">
                {language === 'hi'
                  ? 'डीबीटी छात्रवृत्ति राशि सीधे आपके व्यक्तिगत बैंक खाते में अंतरित की जाती है।'
                  : 'Mandated by Ministry guidelines. NPCI mapper ensures PFMS releases go straight into your account.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setBankSeeded(true);
                    triggerAutoSave('NPCI DBT active', 3, 60);
                    setGuidedStep(4);
                  }}
                  className="p-4 rounded-xl border-2 border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-sm text-left transition-all cursor-pointer flex items-center justify-between"
                >
                  <span>Yes, NPCI mapper is Active (SBI ending 3912)</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast('You can seed your account at any nearby branch or CSC center.', 'info');
                    setGuidedStep(4);
                  }}
                  className="p-4 rounded-xl border-2 border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-sm text-left transition-all cursor-pointer"
                >
                  <span>Unsure / Need help at CSC Kendra</span>
                </button>
              </div>
            </div>
          )}

          {guidedStep === 4 && (
            <div className="space-y-4 py-2">
              <h3 className="text-lg font-bold text-stone-900">
                {language === 'hi' ? '4. दस्तावेज़ अपलोड अथवा पूर्व-सत्यापित रिकॉर्ड का पुनः उपयोग' : '4. Upload or Reuse Your Verified Documents'}
              </h3>
              <p className="text-stone-600 text-xs">
                {language === 'hi'
                  ? 'आप डिजीलाकर के सत्यापित दस्तावेज़ों को एक क्लिक में जोड़ सकते हैं अथवा कैमरे से फोटो ले सकते हैं।'
                  : 'You can reuse previously verified documents or capture crisp copies via Camera Helper.'}
              </p>

              {/* Reuse Chips */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 space-y-2">
                <div className="text-[11px] font-bold text-stone-700">Quick Reuse Verified Documents:</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleDocumentReuse('caste', 'caste_cert_ramu_santhal.pdf')}
                    className="px-2.5 py-1 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-1 border border-emerald-300 cursor-pointer"
                  >
                    <Check className="w-3 h-3 text-emerald-700" />
                    <span>Reuse ST Caste Cert (OD/MBJ/2022)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDocumentReuse('income', 'revenue_income_cert_2026.pdf')}
                    className="px-2.5 py-1 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-1 border border-emerald-300 cursor-pointer"
                  >
                    <Check className="w-3 h-3 text-emerald-700" />
                    <span>Reuse Income Cert (₹1.85L)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenPhotoCapture('caste', 'ST Caste Certificate')}
                    className="px-2.5 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-1 border border-amber-300 cursor-pointer"
                  >
                    <Camera className="w-3 h-3 text-amber-700" />
                    <span>Take Photo with Camera Helper</span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    triggerAutoSave('Docs completed', 4, 85);
                    setGuidedStep(5);
                  }}
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Proceed to Final Verification Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {guidedStep === 5 && (
            <div className="space-y-4 py-2">
              <h3 className="text-lg font-bold text-stone-900">
                {language === 'hi' ? '5. अंतिम समीक्षा एवं स्वीकृति हेतु अग्रेषण' : '5. Final Scrutiny Review & Statutory Submission'}
              </h3>
              
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-emerald-950 text-sm">Application Health: {healthScore}/100</div>
                  <div className="text-xs text-emerald-800">Deterministic statutory checks satisfied. Ready for sign-off.</div>
                </div>
                <ShieldCheck className="w-8 h-8 text-emerald-700" />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setGuidedMode(false)}
                  className="px-4 py-2 border border-stone-300 hover:bg-stone-100 rounded-xl text-xs font-bold text-stone-700"
                >
                  Open Full Form View
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2"
                >
                  <span>Confirm &amp; Submit Application</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Navigation Controls in Guided Mode */}
          <div className="flex items-center justify-between border-t border-stone-200 pt-4">
            <button
              type="button"
              disabled={guidedStep === 1}
              onClick={() => setGuidedStep(prev => Math.max(1, prev - 1))}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                guidedStep === 1 ? 'opacity-40 cursor-not-allowed bg-stone-100 text-stone-400' : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {guidedStep < totalGuidedSteps && (
              <button
                type="button"
                onClick={() => setGuidedStep(prev => Math.min(totalGuidedSteps, prev + 1))}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 shadow-xs"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* STANDARD APPLICATION VIEW */}
      {!guidedMode && (
        <div className="space-y-6">
          {/* Document Reuse Bar */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <span className="text-xs font-bold text-emerald-950">
                  {language === 'hi' ? 'दस्तावेज़ पुनः उपयोग (Document Reuse)' : 'Verified Documents Available for Instant Reuse'}
                </span>
                <p className="text-[11px] text-emerald-800">
                  {language === 'hi'
                    ? 'पूर्व में डिजीलाकर पीकेआई द्वारा सत्यापित प्रमाण पत्रों को पुनः अपलोड करने की आवश्यकता नहीं है।'
                    : 'Verified records from your document vault can be attached with one click.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleDocumentReuse('caste', 'caste_cert_ramu_santhal.pdf')}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-emerald-100 text-emerald-900 text-[11px] font-bold border border-emerald-300 shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3 text-emerald-700" />
                <span>Reuse ST Caste Cert</span>
              </button>
              <button
                type="button"
                onClick={() => handleDocumentReuse('income', 'revenue_income_cert_2026.pdf')}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-emerald-100 text-emerald-900 text-[11px] font-bold border border-emerald-300 shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3 text-emerald-700" />
                <span>Reuse Income Cert</span>
              </button>
            </div>
          </div>

          {/* Quick Demo Pre-load buttons */}
          <div className="flex items-center justify-between bg-white border border-stone-200 rounded-xl p-3 shadow-xs text-xs">
            <span className="font-semibold text-stone-600">Simulate OCR Verification Engine Scenarios:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => runOcrSimulation('mismatch')}
                className="px-3 py-1.5 rounded-md border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.loadSampleMismatch}</span>
              </button>
              <button
                type="button"
                onClick={() => runOcrSimulation('clean')}
                className="px-3 py-1.5 rounded-md border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.loadSampleClean}</span>
              </button>
            </div>
          </div>

          {/* Community Attestation Fallback Toggle */}
          <div className={`rounded-xl border p-4 transition-all ${
            noCasteCertificate 
              ? 'bg-amber-50/90 border-amber-300 shadow-xs' 
              : 'bg-white border-stone-200 shadow-2xs'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="noCasteCertToggle"
                  checked={noCasteCertificate}
                  onChange={(e) => {
                    setNoCasteCertificate(e.target.checked);
                    triggerAutoSave('Community Attestation Route', 2, 60);
                  }}
                  className="mt-1 h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <div>
                  <label htmlFor="noCasteCertToggle" className="text-xs font-bold text-stone-900 cursor-pointer flex items-center gap-2">
                    <span>{language === 'hi' ? 'मेरे पास अभी डिजिटल जाति प्रमाण पत्र नहीं है' : "I don't have a caste certificate yet"}</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-200 text-amber-900">
                      Community Attestation Route
                    </span>
                    <ContextualHelp
                      term="PESA Section 4(d)"
                      explanationEn="Statutory provision allowing forest dwelling Scheduled Tribe members to obtain community inquiry attestation from the Gram Sabha when digitized revenue records are pending."
                      explanationHi="पेसा धारा 4(d) के तहत वन निवासी अनुसूचित जनजाति के विद्यार्थियों हेतु ग्राम सभा द्वारा सामाजिक सत्यापन की विशेष व्यवस्था।"
                      language={language}
                    />
                  </label>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Special provision under PESA / FRA guidelines for remote forest villages without digitized revenue records.
                    Your application will be routed to your local <strong>Gram Sabha &amp; ITDA Project Administrator</strong> for physical community inquiry.
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-1 rounded shrink-0 border border-amber-200 hidden sm:inline-block">
                PESA Section 4(d)
              </span>
            </div>

            {/* If checked: Expand Gram Sabha details */}
            {noCasteCertificate && (
              <div className="mt-3 pt-3 border-t border-amber-200 space-y-3 animate-fadeIn text-xs">
                <div className="bg-amber-100/70 text-amber-950 p-2.5 rounded border border-amber-300 flex items-center justify-between">
                  <span className="font-semibold text-xs">
                    Statutory Safeguard: AI flag is advisory. Officer decision on Community Attestation is statutory and final.
                  </span>
                  <span className="font-mono text-[10px] bg-amber-200 px-2 py-0.5 rounded font-bold">
                    ITDA Desk
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Village / Hamlet</label>
                    <input
                      type="text"
                      value={gramSabhaDetails.village}
                      onChange={(e) => setGramSabhaDetails({ ...gramSabhaDetails, village: e.target.value })}
                      className="w-full bg-white border border-stone-300 text-stone-800 px-2.5 py-1.5 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Gram Panchayat</label>
                    <input
                      type="text"
                      value={gramSabhaDetails.panchayat}
                      onChange={(e) => setGramSabhaDetails({ ...gramSabhaDetails, panchayat: e.target.value })}
                      className="w-full bg-white border border-stone-300 text-stone-800 px-2.5 py-1.5 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Block / Tahsil</label>
                    <input
                      type="text"
                      value={gramSabhaDetails.block}
                      onChange={(e) => setGramSabhaDetails({ ...gramSabhaDetails, block: e.target.value })}
                      className="w-full bg-white border border-stone-300 text-stone-800 px-2.5 py-1.5 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">ITDA Project Office</label>
                    <input
                      type="text"
                      value={gramSabhaDetails.itdaOffice}
                      onChange={(e) => setGramSabhaDetails({ ...gramSabhaDetails, itdaOffice: e.target.value })}
                      className="w-full bg-white border border-stone-300 text-stone-800 px-2.5 py-1.5 rounded text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* OCR Animated Progress Banner */}
          {isOcrProcessing && (
            <div className="bg-emerald-950 text-white rounded-xl p-4 border border-emerald-800 shadow-md animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  {t.ocrExtracting}
                </span>
                <span className="text-xs font-mono text-amber-300 font-bold">{ocrProgress}%</span>
              </div>
              <div className="w-full bg-emerald-900 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${ocrProgress}%` }}
                />
              </div>
              <p className="text-xs text-stone-300 font-mono">
                {ocrStepText}
              </p>
            </div>
          )}

          {/* 4 Mandatory Documents Upload Grid + Camera Helper Option */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-3 flex items-center justify-between">
              <span>{t.uploadDocsHeader}</span>
              <span className="text-stone-500 font-normal font-mono">Digitally signed PDF or JPEG (Max 5MB each)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Doc 1: Caste */}
              <div className={`border rounded-xl p-3 transition-colors ${
                noCasteCertificate 
                  ? 'border-amber-300 bg-amber-50/70' 
                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100/80'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-stone-900">{t.casteCert}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    noCasteCertificate ? 'bg-amber-200 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {noCasteCertificate ? 'Gram Sabha' : (uploadedDocs.caste.fromCamera ? 'Camera Photo' : 'Uploaded')}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 font-mono truncate">
                  {uploadedDocs.caste.name}
                </p>
                <div className="mt-2 text-[10px] text-stone-600 flex items-center justify-between border-t border-stone-200 pt-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenPhotoCapture('caste', 'ST Caste Certificate')}
                    className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Take Photo</span>
                  </button>
                  <span className="font-semibold text-emerald-800">1.4 MB</span>
                </div>
              </div>

              {/* Doc 2: Income */}
              <div className="border border-stone-200 rounded-xl p-3 bg-stone-50 hover:bg-stone-100/80 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-stone-900">{t.incomeCert}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                    {uploadedDocs.income.fromCamera ? 'Camera Photo' : 'Uploaded'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-mono truncate">{uploadedDocs.income.name}</p>
                <div className="mt-2 text-[10px] text-stone-600 flex items-center justify-between border-t border-stone-200 pt-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenPhotoCapture('income', 'Annual Income Certificate')}
                    className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Take Photo</span>
                  </button>
                  <span className="font-semibold text-emerald-700">890 KB</span>
                </div>
              </div>

              {/* Doc 3: Marksheet */}
              <div className="border border-stone-200 rounded-xl p-3 bg-stone-50 hover:bg-stone-100/80 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-stone-900">{t.marksheet}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                    {uploadedDocs.marksheet.fromCamera ? 'Camera Photo' : 'Uploaded'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-mono truncate">{uploadedDocs.marksheet.name}</p>
                <div className="mt-2 text-[10px] text-stone-600 flex items-center justify-between border-t border-stone-200 pt-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenPhotoCapture('marksheet', 'Qualifying Marksheet')}
                    className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Take Photo</span>
                  </button>
                  <span className="font-semibold text-emerald-700">2.1 MB</span>
                </div>
              </div>

              {/* Doc 4: Bank Passbook */}
              <div className="border border-stone-200 rounded-xl p-3 bg-stone-50 hover:bg-stone-100/80 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-stone-900">{t.bankPassbook}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                    {uploadedDocs.bank.fromCamera ? 'Camera Photo' : 'Uploaded'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-mono truncate">{uploadedDocs.bank.name}</p>
                <div className="mt-2 text-[10px] text-stone-600 flex items-center justify-between border-t border-stone-200 pt-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenPhotoCapture('bank', 'Bank Passbook & Mandate')}
                    className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Take Photo</span>
                  </button>
                  <span className="font-semibold text-emerald-700">1.1 MB</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end">
              <button
                type="button"
                disabled={isOcrProcessing}
                onClick={() => runOcrSimulation('mismatch')}
                className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isOcrProcessing ? 'animate-spin' : ''}`} />
                <span>{t.runOcr}</span>
              </button>
            </div>
          </div>

          {/* Extracted Attributes & Smart Error Guidance Analysis */}
          {isExtracted && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Extracted Entities from OCR */}
              <div className="lg:col-span-6 bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-700" />
                    <span>{t.extractedFields}</span>
                  </h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-mono font-bold">
                    OCR Confidence: 94.6%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-500 block font-medium">Candidate Name</span>
                    <span className="font-bold text-stone-900">{extractedData.name}</span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-500 block font-medium">Father / Guardian Name</span>
                    <span className="font-bold text-stone-900">{extractedData.fatherName}</span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-500 block font-medium">Date of Birth (DOB)</span>
                    <span className="font-bold text-stone-900 font-mono">{extractedData.dob}</span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-500 block font-medium">Statutory Social Category</span>
                    <span className="font-bold text-emerald-900">{extractedData.category}</span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-500 block font-medium">Annual Family Income</span>
                    <span className="font-bold text-stone-900 font-mono">{extractedData.income}</span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-500 block font-medium">Masked Bank Account</span>
                    <span className="font-bold text-stone-900 font-mono">{extractedData.accountMasked}</span>
                  </div>
                </div>

                {/* Bank Seeding & DBT Status Box */}
                <div className={`p-3.5 rounded-xl border text-xs ${
                  bankSeeded 
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                    : 'bg-red-50 border-red-300 text-red-950'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-emerald-700" />
                      <span>{t.bankSeedingStatus}</span>
                      <ContextualHelp
                        term="NPCI DBT Mapper"
                        explanationEn="The National Payments Corporation of India (NPCI) mapper links your unique Aadhaar number to your specific bank account for direct scholarship disbursal without middleman friction."
                        explanationHi="भारतीय राष्ट्रीय भुगतान निगम (NPCI) मैपर आपके आधार को बैंक खाते से जोड़ता है ताकि छात्रवृत्ति राशि सीधे खाते में पहुंचे।"
                        language={language}
                      />
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold">
                      NPCI MAPPER ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-emerald-900 mt-1">
                    {bankSeeded ? t.dbtReady : t.dbtPending}
                  </p>
                  <div className="text-[11px] text-emerald-800 mt-1 font-mono">
                    Aadhaar Token: ••••••••8192 | Direct PFMS Credit Status: Ready
                  </div>
                </div>
              </div>

              {/* Right Column: SMART ERROR GUIDANCE & Health Score */}
              <div className="lg:col-span-6 space-y-4">
                {/* Application Health Score Box */}
                <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>{t.healthScoreHeader}</span>
                    </h4>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-black font-mono ${
                        healthScore >= 90 ? 'text-emerald-700' : healthScore >= 60 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {healthScore}
                      </span>
                      <span className="text-xs text-stone-400 font-mono">/ 100</span>
                    </div>
                  </div>

                  <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full transition-all duration-500 ${
                        healthScore >= 90 ? 'bg-emerald-600' : healthScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${healthScore}%` }}
                    />
                  </div>

                  <div className="text-xs text-stone-600 mb-3">
                    {healthScore >= 90 ? (
                      <span className="text-emerald-800 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Pristine file: Recommended for automated Green-lane straight-through processing.
                      </span>
                    ) : (
                      <span className="text-amber-800 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Minor document discrepancy identified. Officer may raise an advisory query.
                      </span>
                    )}
                  </div>
                </div>

                {/* SMART ERROR MESSAGES: Plain Language Guidance naming conflicting values and exact fix */}
                <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>{t.crossDocHeader}</span>
                  </h4>

                  {mismatches.length === 0 ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>No discrepancies found. All names, dates of birth, and identity numbers match identically across all 4 documents.</span>
                    </div>
                  ) : (
                    mismatches.map((mismatch, idx) => (
                      <div key={idx} className="p-3.5 bg-amber-50/90 border border-amber-300 rounded-xl text-xs space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-950">{mismatch.field} Discrepancy</span>
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                            {mismatch.severity} Severity
                          </span>
                        </div>

                        {/* Plain Language Conflict Display */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-lg border border-amber-200">
                          <div>
                            <span className="text-stone-500 block">{mismatch.docA.name}:</span>
                            <span className="font-mono font-bold text-stone-900">"{mismatch.docA.value}"</span>
                          </div>
                          <div>
                            <span className="text-stone-500 block">{mismatch.docB.name}:</span>
                            <span className="font-mono font-bold text-stone-900">"{mismatch.docB.value}"</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-stone-800 leading-relaxed font-medium">
                          {mismatch.description}
                        </p>

                        {/* Exact Plain Language Action Guidance */}
                        <div className="text-[11px] text-amber-950 font-medium bg-amber-100/90 p-2.5 rounded-lg border border-amber-300 space-y-1">
                          <div className="font-bold text-amber-900 flex items-center gap-1">
                            <Info className="w-3.5 h-3.5 text-amber-700" />
                            <span>{language === 'hi' ? 'इसे कैसे ठीक करें (Exact Fix):' : 'How to Fix This Exactly:'}</span>
                          </div>
                          <p>{mismatch.suggestedAction}</p>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Submit Button */}
                  <form onSubmit={handleSubmit} className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-emerald-900 hover:bg-emerald-950 text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 text-xs cursor-pointer"
                    >
                      <span>{t.submitApplication}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Camera Helper Modal */}
      <CameraHelperModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        documentTitle={activeCameraDocTitle}
        language={language}
        onCapture={handleCameraCaptured}
      />

      {/* Printable Document Checklist Modal */}
      <DocumentChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        language={language}
        initialSchemeId={selectedSchemeId}
      />
    </div>
  );
};
