import React, { useState } from 'react';
import { StudentProfile, CrossDocMismatch } from '../../types';
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
  Sparkles,
  Info,
  Check,
  Tent,
  Users,
  Landmark,
  Scale
} from 'lucide-react';
import { useToast } from '../Toast';

interface SmartApplicationProps {
  language: 'en' | 'hi';
  selectedSchemeId?: string;
  initialProfile?: StudentProfile;
  onSubmitSuccess: (applicationId: string, isGramSabhaFallback?: boolean) => void;
}

export const SmartApplication: React.FC<SmartApplicationProps> = ({
  language,
  selectedSchemeId = 'TOP-CLASS-ST',
  initialProfile,
  onSubmitSuccess
}) => {
  const { showToast } = useToast();
  const t = translations[language].smartApply;

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
    caste: boolean;
    income: boolean;
    marksheet: boolean;
    bank: boolean;
  }>({
    caste: true,
    income: true,
    marksheet: true,
    bank: true
  });

  // OCR Processing Simulation State
  const [isOcrProcessing, setIsOcrProcessing] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [ocrStepText, setOcrStepText] = useState<string>('');
  const [isExtracted, setIsExtracted] = useState<boolean>(true); // initially extracted for instant demo

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

  // Mismatches state
  const [mismatches, setMismatches] = useState<CrossDocMismatch[]>([
    {
      field: 'Student Full Name',
      docA: { name: 'ST Caste Certificate', value: 'Ramu' },
      docB: { name: 'Bank Passbook & Marksheet', value: 'Ramu Kumar' },
      severity: 'medium',
      description: 'Middle name "Kumar" is absent on Caste Certificate (OD/MBJ/ST/2022/49102), but present on bank account and academic marksheet.',
      suggestedAction: 'Upload self-declaration affidavit or Tahsil endorsement to eliminate officer query.'
    }
  ]);

  // Bank DBT Seeding status
  const [bankSeeded, setBankSeeded] = useState<boolean>(true);

  // Health Score Calculation: 100 - penalties (accounting for Community Attestation Fallback)
  const healthScore = noCasteCertificate
    ? 75
    : Math.max(0, 100 - (mismatches.length * 22) - (bankSeeded ? 0 : 35));

  // Trigger 2-second animated OCR simulation
  const runOcrSimulation = (scenario: 'mismatch' | 'clean') => {
    setIsOcrProcessing(true);
    setOcrProgress(10);
    setOcrStepText('Step 1/4: Ingesting high-resolution PDF scans & performing layout de-skewing...');

    setTimeout(() => {
      setOcrProgress(40);
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
            description: 'Middle name "Kumar" is absent on Caste Certificate (OD/MBJ/ST/2022/49102), but present on bank account and academic marksheet.',
            suggestedAction: 'Upload self-declaration affidavit or Tahsil endorsement.'
          }
        ]);
        setBankSeeded(true);
      } else {
        // Clean 100% scenario
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
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      {/* Header Info */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                Scheme: {selectedSchemeId}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                Target Desk: District Nodal Verification Cell
              </span>
            </div>
            <h3 className="text-base font-bold text-stone-900 mt-1">
              {t.title}
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              {t.subtitle}
            </p>
          </div>

          {/* Quick Demo Pre-load buttons */}
          <div className="flex items-center gap-2 shrink-0">
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
      </div>

      {/* Community Attestation Fallback Toggle (Special FRA / PESA Provision) */}
      <div className={`rounded-lg border p-4 transition-all ${
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
              onChange={(e) => setNoCasteCertificate(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
            />
            <div>
              <label htmlFor="noCasteCertToggle" className="text-xs font-bold text-stone-900 cursor-pointer flex items-center gap-2">
                <span>I don't have a caste certificate yet</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-200 text-amber-900">
                  Community Attestation Route
                </span>
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

        {/* If checked: Expand Gram Sabha & ITDA Attestation Desk fields */}
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
        <div className="bg-emerald-950 text-white rounded-lg p-4 border border-emerald-800 shadow-md animate-pulse">
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

      {/* 4 Mandatory Documents Upload Grid */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-3 flex items-center justify-between">
          <span>{t.uploadDocsHeader}</span>
          <span className="text-stone-500 font-normal font-mono">Digitally signed PDF or JPEG (Max 5MB each)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Doc 1: Caste */}
          <div className={`border rounded-lg p-3 transition-colors ${
            noCasteCertificate 
              ? 'border-amber-300 bg-amber-50/70' 
              : 'border-stone-200 bg-stone-50 hover:bg-stone-100/80'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-stone-900">{t.casteCert}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                noCasteCertificate ? 'bg-amber-200 text-amber-900' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {noCasteCertificate ? 'Gram Sabha Route' : 'Uploaded'}
              </span>
            </div>
            <p className="text-[11px] text-stone-600 font-mono truncate">
              {noCasteCertificate ? 'community_attestation_affidavit.pdf' : 'caste_cert_ramu_santhal.pdf'}
            </p>
            <div className="mt-2 text-[10px] text-stone-600 flex items-center justify-between border-t border-stone-200 pt-1.5">
              <span>{noCasteCertificate ? 'Attestation: Gram Sabha & ITDA' : 'Authority: SDM Baripada'}</span>
              <span className="font-semibold text-amber-800">{noCasteCertificate ? 'Field Inquiry' : '1.4 MB'}</span>
            </div>
          </div>

          {/* Doc 2: Income */}
          <div className="border border-stone-200 rounded-lg p-3 bg-stone-50 hover:bg-stone-100/80 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-stone-900">{t.incomeCert}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                Uploaded
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-mono truncate">revenue_income_cert_2026.pdf</p>
            <div className="mt-2 text-[10px] text-stone-600 flex items-center justify-between border-t border-stone-200 pt-1.5">
              <span>Authority: Tahsildar</span>
              <span className="font-semibold text-emerald-700">890 KB</span>
            </div>
          </div>

          {/* Doc 3: Marksheet */}
          <div className="border border-stone-200 rounded-lg p-3 bg-stone-50 hover:bg-stone-100/80 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-stone-900">{t.marksheet}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                Uploaded
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-mono truncate">class12_marksheet_chse.pdf</p>
            <div className="mt-2 text-[10px] text-stone-600 flex items-center justify-between border-t border-stone-200 pt-1.5">
              <span>Authority: CHSE Board</span>
              <span className="font-semibold text-emerald-700">2.1 MB</span>
            </div>
          </div>

          {/* Doc 4: Bank Passbook */}
          <div className="border border-stone-200 rounded-lg p-3 bg-stone-50 hover:bg-stone-100/80 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-stone-900">{t.bankPassbook}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                Uploaded
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-mono truncate">sbi_passbook_page1.pdf</p>
            <div className="mt-2 text-[10px] text-stone-600 flex items-center justify-between border-t border-stone-200 pt-1.5">
              <span>Bank: SBI Rourkela Main</span>
              <span className="font-semibold text-emerald-700">1.1 MB</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <button
            type="button"
            disabled={isOcrProcessing}
            onClick={() => runOcrSimulation('mismatch')}
            className="px-4 py-2 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isOcrProcessing ? 'animate-spin' : ''}`} />
            <span>{t.runOcr}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Analysis: Extracted Attributes & Consistency Report */}
      {isExtracted && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Extracted Entities from OCR */}
          <div className="lg:col-span-6 bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-4">
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
              <div className="p-2.5 bg-stone-50 rounded border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-medium">Candidate Name</span>
                <span className="font-bold text-stone-900">{extractedData.name}</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-medium">Father / Guardian Name</span>
                <span className="font-bold text-stone-900">{extractedData.fatherName}</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-medium">Date of Birth (DOB)</span>
                <span className="font-bold text-stone-900 font-mono">{extractedData.dob}</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-medium">Statutory Social Category</span>
                <span className="font-bold text-emerald-900">{extractedData.category}</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-medium">Annual Family Income</span>
                <span className="font-bold text-stone-900 font-mono">{extractedData.income}</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-medium">Masked Bank Account</span>
                <span className="font-bold text-stone-900 font-mono">{extractedData.accountMasked}</span>
              </div>
            </div>

            {/* Bank Seeding & DBT Status Box */}
            <div className={`p-3.5 rounded-lg border text-xs ${
              bankSeeded 
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                : 'bg-red-50 border-red-300 text-red-950'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <span>{t.bankSeedingStatus}</span>
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

          {/* Right Column: Cross-Doc Mismatches & Health Score */}
          <div className="lg:col-span-6 space-y-4">
            {/* Application Health Score Box */}
            <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
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

              {/* Health Score Meter */}
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
                    Pristine file: Highly recommended for automated Green-lane straight-through processing.
                  </span>
                ) : (
                  <span className="text-amber-800 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Minor document discrepancy identified. Officer may raise an advisory clarification request.
                  </span>
                )}
              </div>

              {/* Checklist before submission */}
              <div className="space-y-1.5 text-xs border-t border-stone-200 pt-3">
                <div className="flex items-center justify-between text-stone-700">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ST Caste Certificate Authenticated</span>
                  </span>
                  <span className="text-emerald-700 font-semibold text-[11px]">Pass</span>
                </div>
                <div className="flex items-center justify-between text-stone-700">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Annual Income Within Ceiling (₹1.85L &lt;= ₹6.0L)</span>
                  </span>
                  <span className="text-emerald-700 font-semibold text-[11px]">Pass</span>
                </div>
                <div className="flex items-center justify-between text-stone-700">
                  <span className="flex items-center gap-1.5">
                    {mismatches.length === 0 ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span>Cross-Document Entity Alignment</span>
                  </span>
                  <span className={`font-semibold text-[11px] ${mismatches.length === 0 ? 'text-emerald-700' : 'text-amber-600'}`}>
                    {mismatches.length === 0 ? '100% Aligned' : '1 Minor Flag'}
                  </span>
                </div>
              </div>
            </div>

            {/* Cross-Document Consistency Analysis Box */}
            <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>{t.crossDocHeader}</span>
              </h4>

              {mismatches.length === 0 ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>No discrepancies found. All names, dates of birth, and identity numbers match identically across all 4 documents.</span>
                </div>
              ) : (
                mismatches.map((mismatch, idx) => (
                  <div key={idx} className="p-3 bg-amber-50 border border-amber-300 rounded text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-950">{mismatch.field} Discrepancy</span>
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                        {mismatch.severity} Severity
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2 rounded border border-amber-200">
                      <div>
                        <span className="text-stone-500 block">{mismatch.docA.name}:</span>
                        <span className="font-mono font-bold text-stone-900">{mismatch.docA.value}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block">{mismatch.docB.name}:</span>
                        <span className="font-mono font-bold text-stone-900">{mismatch.docB.value}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-700">
                      {mismatch.description}
                    </p>

                    <div className="text-[11px] text-amber-900 font-semibold bg-amber-100/70 p-2 rounded">
                      <span className="underline">Suggested Student Action:</span> {mismatch.suggestedAction}
                    </div>
                  </div>
                ))
              )}

              {/* Submit Button */}
              <form onSubmit={handleSubmit} className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-900 hover:bg-emerald-950 text-white font-semibold py-2.5 px-4 rounded-md transition-all shadow-xs flex items-center justify-center gap-2 text-xs"
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
  );
};
