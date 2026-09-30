import React, { useState } from 'react';
import { 
  StudentProfile, 
  CourseLevel, 
  InstituteType, 
  SchemeRule, 
  EligibilityResult, 
  NearMissResult 
} from '../../types';
import { SCHEMES_DATABASE } from '../../data/schemes';
import { evaluateStudentEligibility } from '../../services/ruleEngine';
import { translations } from '../../locales/translations';
import { 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Mic, 
  MicOff, 
  ArrowRight, 
  FileText, 
  AlertCircle, 
  Code, 
  Check, 
  Info,
  Scale,
  AlertTriangle,
  Send,
  HelpCircle
} from 'lucide-react';

interface EligibilityCheckerProps {
  language: 'en' | 'hi';
  onProceedToApply: (schemeId: string, profile: StudentProfile) => void;
  initialProfile?: StudentProfile;
}

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({
  language,
  onProceedToApply,
  initialProfile
}) => {
  const t = translations[language].eligibility;

  // Active editable schemes database
  const [schemes, setSchemes] = useState<SchemeRule[]>(SCHEMES_DATABASE);
  const [showJsonEditor, setShowJsonEditor] = useState<boolean>(false);
  const [jsonText, setJsonText] = useState<string>(JSON.stringify(SCHEMES_DATABASE, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  // ST Portability Routing State
  const [routedToNodal, setRoutedToNodal] = useState<boolean>(false);

  // Form State
  const [profile, setProfile] = useState<StudentProfile>(() => {
    if (initialProfile) return initialProfile;
    return {
      name: 'Ramu Kumar',
      fatherName: 'Gopal Soren',
      dob: '2003-04-12',
      gender: 'Male',
      state: 'Odisha',
      certificateState: 'Odisha',
      instituteState: 'Odisha',
      district: 'Mayurbhanj',
      courseLevel: 'UG',
      instituteType: 'Central University / Institute of National Importance (IIT, IIM, AIIMS, NIT)',
      instituteName: 'National Institute of Technology (NIT) Rourkela',
      annualFamilyIncome: 185000,
      percentageLastExam: 78.4,
      isPwd: false,
      category: 'ST',
      aadhaarSeededBank: true,
      accountNumberMasked: '••••••••3912'
    };
  });

  // Sync if initialProfile changes (e.g. Persona Demo mode)
  React.useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
      const evaluation = evaluateStudentEligibility(initialProfile, schemes);
      setEligibleResults(evaluation.eligibleSchemes);
      setNearMissResults(evaluation.nearMissSchemes);
      setHasEvaluated(true);
      if (evaluation.eligibleSchemes.length > 0) {
        setExpandedSchemeId(evaluation.eligibleSchemes[0].scheme.id);
      }
    }
  }, [initialProfile]);

  // Results State
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);
  const [eligibleResults, setEligibleResults] = useState<EligibilityResult[]>([]);
  const [nearMissResults, setNearMissResults] = useState<NearMissResult[]>([]);
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(null);

  // Speech Recognition State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechFeedback, setSpeechFeedback] = useState<string | null>(null);

  const handleEvaluate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const evaluation = evaluateStudentEligibility(profile, schemes);
    setEligibleResults(evaluation.eligibleSchemes);
    setNearMissResults(evaluation.nearMissSchemes);
    setHasEvaluated(true);
    if (evaluation.eligibleSchemes.length > 0) {
      setExpandedSchemeId(evaluation.eligibleSchemes[0].scheme.id);
    }
  };

  // Voice Input Handler using Web Speech API
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechFeedback(t.voiceNotSupported);
      setTimeout(() => setSpeechFeedback(null), 5000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      setSpeechFeedback(t.voiceListening);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setSpeechFeedback(`Recognized: "${transcript}"`);
        
        // Intelligent heuristic parser for voice dictation
        if (transcript.includes('pg') || transcript.includes('post graduate') || transcript.includes('master')) {
          setProfile(p => ({ ...p, courseLevel: 'PG' }));
        } else if (transcript.includes('phd') || transcript.includes('doctorate')) {
          setProfile(p => ({ ...p, courseLevel: 'PhD' }));
        } else if (transcript.includes('ug') || transcript.includes('bachelor') || transcript.includes('engineering') || transcript.includes('degree')) {
          setProfile(p => ({ ...p, courseLevel: 'UG' }));
        }

        if (transcript.includes('odisha') || transcript.includes('orissa')) {
          setProfile(p => ({ ...p, state: 'Odisha' }));
        } else if (transcript.includes('jharkhand')) {
          setProfile(p => ({ ...p, state: 'Jharkhand' }));
        } else if (transcript.includes('madhya pradesh') || transcript.includes('mp')) {
          setProfile(p => ({ ...p, state: 'Madhya Pradesh' }));
        } else if (transcript.includes('chhattisgarh')) {
          setProfile(p => ({ ...p, state: 'Chhattisgarh' }));
        }

        // Try extracting numbers for income
        const numberMatch = transcript.match(/(\d+(\.\d+)?)\s*(lakh|lac|k|thousand)/);
        if (numberMatch) {
          const val = parseFloat(numberMatch[1]);
          const multiplier = (numberMatch[3].includes('lakh') || numberMatch[3].includes('lac')) ? 100000 : 1000;
          setProfile(p => ({ ...p, annualFamilyIncome: Math.round(val * multiplier) }));
        }

        setIsListening(false);
        setTimeout(() => setSpeechFeedback(null), 4000);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setSpeechFeedback('Voice recognition could not complete audio stream. Please type directly.');
        setTimeout(() => setSpeechFeedback(null), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      setSpeechFeedback(t.voiceNotSupported);
      setTimeout(() => setSpeechFeedback(null), 5000);
    }
  };

  // Handle JSON Rule Editor Save
  const handleSaveJsonRules = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) throw new Error('Root JSON must be an array of scheme rules.');
      setSchemes(parsed);
      setJsonError(null);
      setShowJsonEditor(false);
      // Re-evaluate with new rules
      if (hasEvaluated) {
        const evaluation = evaluateStudentEligibility(profile, parsed);
        setEligibleResults(evaluation.eligibleSchemes);
        setNearMissResults(evaluation.nearMissSchemes);
      }
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON syntax');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Advisory Banner on Deterministic Rule Engine */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-800 shrink-0 mt-0.5">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <span>{t.title}</span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-mono font-bold">
                100% Deterministic Engine
              </span>
            </h2>
            <p className="text-xs text-emerald-800 mt-0.5">
              {t.subtitle} The decision is calculated mathematically against statutory guideline clauses.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowJsonEditor(!showJsonEditor)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 transition-colors shadow-2xs"
          >
            <Code className="w-3.5 h-3.5 text-emerald-700" />
            <span>{showJsonEditor ? 'Close Rule JSON' : 'Inspect Rule JSON (5 Schemes)'}</span>
          </button>
        </div>
      </div>

      {/* JSON Rule Editor Modal / Drawer */}
      {showJsonEditor && (
        <div className="bg-stone-900 text-stone-100 rounded-lg p-4 border border-stone-700 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-400">
                schemes-rules-registry.json
              </span>
              <span className="text-[11px] text-stone-400">
                (Modify criteria, income caps, or clauses directly to test deterministic behavior)
              </span>
            </div>
            <button
              onClick={() => {
                setJsonText(JSON.stringify(SCHEMES_DATABASE, null, 2));
                setSchemes(SCHEMES_DATABASE);
                setJsonError(null);
              }}
              className="text-xs text-stone-400 hover:text-white underline"
            >
              Reset to Defaults
            </button>
          </div>

          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={12}
            className="w-full font-mono text-xs bg-stone-950 text-emerald-400 p-3 rounded border border-stone-800 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
          />

          {jsonError && (
            <div className="text-xs text-red-400 mt-2 flex items-center gap-1 font-mono">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{jsonError}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => setShowJsonEditor(false)}
              className="px-3 py-1.5 text-xs rounded border border-stone-700 hover:bg-stone-800 text-stone-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveJsonRules}
              className="px-4 py-1.5 text-xs font-semibold rounded bg-amber-500 hover:bg-amber-600 text-stone-950"
            >
              Apply Scheme Rules
            </button>
          </div>
        </div>
      )}

      {/* Voice Assistant Feedback Banner */}
      {speechFeedback && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 text-xs px-4 py-2 rounded-lg flex items-center gap-2">
          <Mic className={`w-4 h-4 text-amber-700 ${isListening ? 'animate-bounce' : ''}`} />
          <span className="font-medium">{speechFeedback}</span>
        </div>
      )}

      {/* Two Column Layout: Form & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Profile Attributes */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Student Educational Profile</h3>
              <p className="text-[11px] text-stone-500">Provide verified educational and socio-economic facts</p>
            </div>
            {/* Voice Input Mic Button */}
            <button
              type="button"
              onClick={handleVoiceInput}
              title={t.voiceSpeak}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                isListening
                  ? 'bg-red-600 border-red-700 text-white animate-pulse'
                  : 'bg-stone-50 border-stone-300 text-stone-700 hover:bg-stone-100 hover:text-emerald-800'
              }`}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-amber-600" />}
              <span>{isListening ? 'Listening...' : 'Voice'}</span>
            </button>
          </div>

          <form onSubmit={handleEvaluate} className="space-y-4 text-xs">
            {/* Category (ST Guaranteed) */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Social Category Mandate
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  disabled
                  value="Scheduled Tribe (ST) - Article 342"
                  className="w-full bg-stone-100 border border-stone-300 text-stone-700 font-semibold px-3 py-2 rounded-md"
                />
                <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-1 rounded font-bold whitespace-nowrap">
                  Mandatory
                </span>
              </div>
            </div>

            {/* ST Status Portability: State of ST Certificate & State of Institute */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1 flex items-center justify-between">
                  <span>State of ST certificate</span>
                  <span className="text-[10px] text-stone-500 font-normal">Domicile</span>
                </label>
                <select
                  value={profile.certificateState || profile.state}
                  onChange={(e) => {
                    const certState = e.target.value;
                    setProfile({ ...profile, certificateState: certState, state: certState });
                    setRoutedToNodal(false);
                  }}
                  className="w-full bg-white border border-stone-300 text-stone-800 px-3 py-2 rounded-md font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                >
                  <option value="Odisha">Odisha</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Assam">Assam</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1 flex items-center justify-between">
                  <span>State of institute</span>
                  <span className="text-[10px] text-stone-500 font-normal">Host Campus</span>
                </label>
                <select
                  value={profile.instituteState || profile.state}
                  onChange={(e) => {
                    const instState = e.target.value;
                    setProfile({ ...profile, instituteState: instState });
                    setRoutedToNodal(false);
                  }}
                  className="w-full bg-white border border-stone-300 text-stone-800 px-3 py-2 rounded-md font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                >
                  <option value="Odisha">Odisha</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Assam">Assam</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>
            </div>

            {/* ST Status Portability Warning Card when Certificate State differs from Institute State */}
            {(profile.certificateState || profile.state) !== (profile.instituteState || profile.state) && (
              <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-3.5 space-y-2.5 animate-fadeIn">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-950 text-xs">
                        ST Status Portability Alert
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-bold">
                        Article 342
                      </span>
                    </div>
                    <p className="text-xs text-amber-900 font-semibold leading-snug">
                      ST status is notified state-wise. Your certificate may need verification for this state.
                    </p>
                    <p className="text-[11px] text-amber-800">
                      Certificate State: <strong>{profile.certificateState || profile.state}</strong> ➔ Institute State: <strong>{profile.instituteState || profile.state}</strong>
                    </p>
                  </div>
                </div>

                {/* Guidance Steps */}
                <div className="bg-white/90 rounded p-2.5 border border-amber-200 text-[11px] text-stone-700 space-y-1.5">
                  <div className="font-bold text-stone-900 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                    <span>Guidance & Verification Steps</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-stone-700">
                    <li>
                      <strong>Presidential Order Cross-Check:</strong> Central sector schemes (Top Class / Fellowship) permit inter-state portability directly for institutes of excellence.
                    </li>
                    <li>
                      <strong>Migration Validation:</strong> For state-funded Post-Matric schemes, obtain an inter-state verification endorsement from your home district Project Administrator.
                    </li>
                    <li>
                      <strong>Direct Desk Forwarding:</strong> Use the button below to fast-track your profile to the Inter-State Nodal Officer desk.
                    </li>
                  </ol>
                </div>

                {/* Route to Nodal Officer Button */}
                <div className="flex items-center justify-between pt-1">
                  {routedToNodal ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Routed to Nodal Officer (Ref #IS-NODAL-{Date.now().toString().slice(-4)})</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-[10px] text-amber-800 italic">
                        Desk: Inter-State Tribal Verification Cell
                      </span>
                      <button
                        type="button"
                        onClick={() => setRoutedToNodal(true)}
                        className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Route to nodal officer</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Course Level */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                {t.courseLevelLabel}
              </label>
              <select
                value={profile.courseLevel}
                onChange={(e) => setProfile({ ...profile, courseLevel: e.target.value as CourseLevel })}
                className="w-full bg-white border border-stone-300 text-stone-800 px-3 py-2 rounded-md font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
              >
                <option value="Pre-Matric">Pre-Matric (Class IX & X)</option>
                <option value="Post-Matric">Post-Matric / Diploma (Class XI & XII / Polytechnic)</option>
                <option value="UG">Undergraduate (B.Tech, MBBS, B.A., B.Sc., B.Com)</option>
                <option value="PG">Postgraduate (M.Tech, M.Sc., M.A., MBA, MD)</option>
                <option value="M.Phil">M.Phil (Master of Philosophy)</option>
                <option value="PhD">Doctor of Philosophy (Ph.D.)</option>
              </select>
            </div>

            {/* Institute Category */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                {t.instituteTypeLabel}
              </label>
              <select
                value={profile.instituteType}
                onChange={(e) => setProfile({ ...profile, instituteType: e.target.value as InstituteType })}
                className="w-full bg-white border border-stone-300 text-stone-800 px-3 py-2 rounded-md font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
              >
                <option value="Central University / Institute of National Importance (IIT, IIM, AIIMS, NIT)">
                  Institute of National Importance / Notified Excellence (IIT, NIT, AIIMS, IIM, NLU)
                </option>
                <option value="State Government University / College">
                  State Government University / Constituent College
                </option>
                <option value="Government Aided Institution">
                  Government Aided Private Educational Institution
                </option>
                <option value="Recognized Private University / College">
                  Recognized Private University / Overseas University
                </option>
              </select>
            </div>

            {/* Institute Name */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                {t.instituteNameLabel}
              </label>
              <input
                type="text"
                value={profile.instituteName}
                onChange={(e) => setProfile({ ...profile, instituteName: e.target.value })}
                className="w-full bg-white border border-stone-300 text-stone-800 px-3 py-2 rounded-md focus:ring-2 focus:ring-emerald-700 focus:outline-hidden font-medium"
              />
            </div>

            {/* Income & Percentage (Two Columns) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {t.incomeLabel}
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-stone-400 font-medium">₹</span>
                  <input
                    type="number"
                    step="5000"
                    min="0"
                    value={profile.annualFamilyIncome}
                    onChange={(e) => setProfile({ ...profile, annualFamilyIncome: Number(e.target.value) })}
                    className="w-full pl-6 pr-2 py-2 bg-white border border-stone-300 text-stone-800 rounded-md focus:ring-2 focus:ring-emerald-700 focus:outline-hidden font-mono"
                  />
                </div>
                <span className="text-[10px] text-stone-500 mt-0.5 block">
                  e.g. ₹1,85,000 / year
                </span>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {t.percentageLabel}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={profile.percentageLastExam}
                    onChange={(e) => setProfile({ ...profile, percentageLastExam: Number(e.target.value) })}
                    className="w-full pr-6 pl-3 py-2 bg-white border border-stone-300 text-stone-800 rounded-md focus:ring-2 focus:ring-emerald-700 focus:outline-hidden font-mono"
                  />
                  <span className="absolute right-2.5 top-2 text-stone-400 font-medium">%</span>
                </div>
                <span className="text-[10px] text-stone-500 mt-0.5 block">
                  Qualifying exam score
                </span>
              </div>
            </div>

            {/* Gender and PwD Checkbox */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {t.genderLabel}
                </label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                  className="w-full bg-white border border-stone-300 text-stone-800 px-3 py-2 rounded-md font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Transgender">Transgender</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 p-2 rounded-md border border-stone-200 bg-stone-50 cursor-pointer hover:bg-stone-100">
                  <input
                    type="checkbox"
                    checked={profile.isPwd}
                    onChange={(e) => setProfile({ ...profile, isPwd: e.target.checked })}
                    className="w-4 h-4 text-emerald-800 rounded border-stone-300 focus:ring-emerald-700"
                  />
                  <span className="text-[11px] font-semibold text-stone-700">
                    PwD (5% relaxation)
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-4 bg-emerald-900 hover:bg-emerald-950 text-white font-semibold py-2.5 px-4 rounded-md transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <span>{t.checkButton}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Output: Ranked Eligible Schemes & Near-Misses */}
        <div className="lg:col-span-7 space-y-4">
          {!hasEvaluated ? (
            <div className="bg-white border border-dashed border-stone-300 rounded-lg p-8 text-center flex flex-col items-center justify-center min-h-[360px]">
              <div className="p-3 bg-stone-100 rounded-full text-stone-400 mb-3">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-bold text-stone-800 mb-1">
                Rule Engine Ready
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mb-4">
                Click "Evaluate Eligibility & Generate Rule Trace" to calculate statutory qualifications across all 5 schemes simultaneously.
              </p>
              <button
                type="button"
                onClick={() => handleEvaluate()}
                className="px-4 py-2 rounded-md bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition-colors"
              >
                Run Evaluation with Current Details
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header Counters */}
              <div className="flex items-center justify-between bg-stone-100 p-3 rounded-lg border border-stone-200 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900">Evaluation Outcome:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                    {eligibleResults.length} {t.eligibleCount}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300">
                    {nearMissResults.length} {t.nearMissCount}
                  </span>
                </div>
                <span className="text-[11px] text-stone-500 font-mono">
                  Engine Version: v2026.04.R1
                </span>
              </div>

              {/* Eligible Schemes Section */}
              {eligibleResults.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Eligible Schemes (Ranked by Statutory Benefit)</span>
                  </h4>

                  {eligibleResults.map((result) => {
                    const isExpanded = expandedSchemeId === result.scheme.id;
                    return (
                      <div
                        key={result.scheme.id}
                        className="bg-white border-2 border-emerald-600 rounded-lg p-4 shadow-xs transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-[11px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                                {result.scheme.code}
                              </span>
                              <span className="text-xs font-semibold text-stone-500">
                                {result.scheme.guidelineClauseRef}
                              </span>
                            </div>

                            <h5 className="text-sm font-bold text-stone-950">
                              {result.scheme.name}
                            </h5>

                            <p className="text-xs text-stone-600 mt-1">
                              {result.scheme.description}
                            </p>

                            <div className="mt-2 text-xs bg-stone-50 p-2 rounded border border-stone-200">
                              <span className="font-semibold text-emerald-900">Statutory Entitlement: </span>
                              <span className="text-stone-800">{result.scheme.benefitAmount}</span>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-700" />
                              <span>100% Eligible</span>
                            </span>

                            <button
                              type="button"
                              onClick={() => onProceedToApply(result.scheme.id, profile)}
                              className="px-3 py-1.5 rounded-md bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                            >
                              <span>Apply Now</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Expander Button for Deterministic Rule Trace */}
                        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setExpandedSchemeId(isExpanded ? null : result.scheme.id)}
                            className="text-xs font-semibold text-emerald-900 hover:text-emerald-700 flex items-center gap-1"
                          >
                            <span>{isExpanded ? 'Hide Rule Trace' : t.explainWhy}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                          <span className="text-[11px] text-stone-500 font-mono">
                            Deterministic Trace: {result.ruleTraces.length} Conditions Passed
                          </span>
                        </div>

                        {/* Rule Trace Explainer Box */}
                        {isExpanded && (
                          <div className="mt-3 bg-stone-50 border border-stone-200 rounded p-3 text-xs space-y-2 font-mono">
                            <div className="font-bold text-stone-900 pb-1 border-b border-stone-200 flex items-center justify-between font-sans">
                              <span>Formal Trace Logs (Guideline Clauses)</span>
                              <span className="text-[10px] text-stone-500">Non-Probabilistic Output</span>
                            </div>
                            {result.ruleTraces.map((trace, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-[11px] py-1 border-b border-stone-200/50 last:border-0">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold text-emerald-950">[{trace.clauseNumber}]</span>{' '}
                                  <span className="text-stone-800 font-semibold">{trace.title}:</span>{' '}
                                  <span className="text-stone-600">{trace.conditionDescription}</span>
                                  <div className="text-stone-500 text-[10px] mt-0.5">
                                    Input Verified: <span className="text-emerald-900 font-bold">{trace.actualValue}</span> | Threshold: {trace.expectedValue}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                  No fully eligible schemes found with the current profile inputs. Review the near-miss opportunities below.
                </div>
              )}

              {/* Near-Miss Opportunities Section */}
              {nearMissResults.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    <span>Near-Miss Opportunities & Necessary Adaptations</span>
                  </h4>

                  {nearMissResults.map((nearMiss) => (
                    <div
                      key={nearMiss.scheme.id}
                      className="bg-white border border-amber-300 rounded-lg p-4 shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h5 className="text-sm font-bold text-stone-900">
                          {nearMiss.scheme.name}
                        </h5>
                        <span className="text-[11px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                          Near Miss (Fails {nearMiss.failedClauses.length} condition)
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 mb-2">
                        {nearMiss.scheme.description}
                      </p>

                      <div className="bg-amber-50/70 border border-amber-200 rounded p-2.5 text-xs space-y-1.5">
                        <div className="font-semibold text-amber-950 flex items-center gap-1 text-[11px]">
                          <Info className="w-3.5 h-3.5 text-amber-700" />
                          <span>{t.whatNeedsToChange}:</span>
                        </div>
                        {nearMiss.changeNeeded.map((change, cIdx) => (
                          <div key={cIdx} className="text-stone-800 text-xs pl-4 relative before:content-['•'] before:absolute before:left-1 before:text-amber-700">
                            {change}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
