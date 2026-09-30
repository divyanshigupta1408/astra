import React, { useState } from 'react';
import { AppLanguage, SchemeRule } from '../../types';
import { SCHEMES_DATABASE } from '../../data/schemes';
import { Printer, Download, CheckSquare, X, ShieldCheck, FileText } from 'lucide-react';
import { GovtEmblem } from '../Emblem';

interface DocumentChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  initialSchemeId?: string;
}

export const DocumentChecklistModal: React.FC<DocumentChecklistModalProps> = ({
  isOpen,
  onClose,
  language,
  initialSchemeId = 'TOP-CLASS-ST'
}) => {
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(initialSchemeId);

  if (!isOpen) return null;

  const currentScheme = SCHEMES_DATABASE.find(s => s.id === selectedSchemeId) || SCHEMES_DATABASE[0];

  const handlePrint = () => {
    window.print();
  };

  const getDocRequirements = (scheme: SchemeRule) => {
    return [
      {
        name: language === 'hi' ? 'अनुसूचित जनजाति (एसटी) जाति प्रमाण पत्र' : 'Scheduled Tribe (ST) Caste Certificate',
        authority: language === 'hi' ? 'अनुविभागीय अधिकारी (एसडीएम) / तहसीलदार' : 'Sub-Divisional Magistrate (SDM) / Tahsildar / Revenue Authority',
        note: language === 'hi' ? 'डिजिटल हस्ताक्षरित या मूल बारकोड सहित मान्य। यदि उपलब्ध नहीं है तो पेसा 4(d) ग्राम सभा सत्यापन मार्ग लागू है।' : 'Digitally verifiable with QR/Barcode or PESA Section 4(d) Gram Sabha Attestation for remote hamlets.',
        mandatory: true
      },
      {
        name: language === 'hi' ? 'वर्तमान वित्तीय वर्ष का आय प्रमाण पत्र' : 'Current FY Income Certificate (Form 16 / Revenue)',
        authority: language === 'hi' ? 'राजस्व विभाग / सक्षम प्राधिकारी' : 'Revenue Department / Tahsildar / Competent State Authority',
        note: language === 'hi' ? `वार्षिक परिवार आय ₹${(scheme.maxAnnualIncome / 100000).toFixed(2)} लाख से अधिक नहीं होनी चाहिए (नियम खंड 5.2)।` : `Annual family income must not exceed ₹${(scheme.maxAnnualIncome / 100000).toFixed(2)} Lakhs (Guideline Clause 5.2).`,
        mandatory: true
      },
      {
        name: language === 'hi' ? 'अंतिम उत्तीर्ण परीक्षा की अंकसूची' : 'Marksheet / Grade Card of Last Qualifying Exam',
        authority: language === 'hi' ? 'मान्यता प्राप्त शिक्षा बोर्ड / विश्वविद्यालय' : 'Recognized Education Board / University Registrar',
        note: language === 'hi' ? `न्यूनतम अंक: ${scheme.minPercentage}% (नियम खंड 4.1)। बैकलाग मुक्त विवरण।` : `Minimum qualifying marks: ${scheme.minPercentage}%. Clear pass without pending backlogs.`,
        mandatory: true
      },
      {
        name: language === 'hi' ? 'संस्थान में प्रवेश एवं गैर-वापसी शुल्क रसीद' : 'Institutional Admission & Non-Refundable Fee Receipt',
        authority: language === 'hi' ? 'अधिसूचित संस्थान / विश्वविद्यालय वित्त विभाग' : 'Notified Institute Registrar / Dean of Student Affairs',
        note: language === 'hi' ? 'पाठ्यक्रम स्तर एवं शुल्क विवरण का स्पष्ट उल्लेख होना अनिवार्य है।' : 'Clear itemized break-up of tuition fees, library, and examination dues.',
        mandatory: true
      },
      {
        name: language === 'hi' ? 'व्यक्तिगत बैंक पासबुक (एनपीसीआई डीबीटी मैपर)' : 'Individual Bank Passbook / Mandate (NPCI Seeded)',
        authority: language === 'hi' ? 'अनुसूचित वाणिज्यिक बैंक (एसबीआई, पीएनबी आदि)' : 'Scheduled Commercial Bank / Core Banking Branch',
        note: language === 'hi' ? 'खाता छात्र के नाम पर आधार नंबर से एनपीसीआई मैपर में सीडेड होना चाहिए।' : 'Active bank account seeded with Aadhaar on NPCI mapper for Direct Benefit Transfer.',
        mandatory: true
      }
    ];
  };

  const docList = getDocRequirements(currentScheme);

  return (
    <div className="fixed inset-0 z-70 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-xs relative max-h-[90vh] overflow-y-auto print:p-0 print:shadow-none print:max-h-full">
        {/* Header Controls (Hidden on Print) */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-3 print:hidden">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-800" />
            <h3 className="font-bold text-stone-900 text-sm">
              {language === 'hi' ? 'योजनानुसार दस्तावेज चेकलिस्ट' : 'Scheme Document Verification Checklist'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'प्रिंट / पीडीएफ' : 'Print / Save PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-stone-400 hover:text-stone-700"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scheme Selector (Hidden on Print) */}
        <div className="print:hidden">
          <label className="block text-[11px] font-bold text-stone-700 mb-1">
            {language === 'hi' ? 'छात्रवृत्ति योजना चुनें' : 'Select MoTA Scholarship Scheme'}
          </label>
          <select
            value={selectedSchemeId}
            onChange={(e) => setSelectedSchemeId(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-semibold text-stone-800"
          >
            {SCHEMES_DATABASE.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>

        {/* PRINTABLE OFFICIAL DOCUMENT BODY */}
        <div className="border border-stone-200 rounded-xl p-5 space-y-4 print:border-none print:p-0">
          {/* Government Official Header */}
          <div className="text-center space-y-1 border-b border-stone-200 pb-3">
            <GovtEmblem className="w-10 h-10 mx-auto" />
            <div className="text-xs font-bold text-stone-900 uppercase tracking-wide">
              {language === 'hi' ? 'जनजातीय कार्य मंत्रालय • भारत सरकार' : 'Ministry of Tribal Affairs • Government of India'}
            </div>
            <div className="text-[11px] text-stone-600 font-medium">
              National Scheduled Tribe (ST) Scholarship &amp; Fellowship Management System
            </div>
            <div className="inline-block mt-1 font-mono text-[10px] font-bold bg-stone-100 text-stone-800 px-2.5 py-0.5 rounded border border-stone-300">
              Form VV-DOC-CKL-2026 • Statutory Verification Standard
            </div>
          </div>

          {/* Scheme Summary */}
          <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-1 text-xs">
            <div className="font-extrabold text-stone-950 text-sm">
              {currentScheme.name} ({currentScheme.code})
            </div>
            <div className="text-stone-600 text-[11px]">{currentScheme.description}</div>
            <div className="flex flex-wrap gap-2 text-[10px] font-mono text-stone-700 pt-1">
              <span>Guideline Ref: {currentScheme.guidelineClauseRef}</span>
              <span>•</span>
              <span>Income Limit: &lt;= ₹{(currentScheme.maxAnnualIncome / 100000).toFixed(2)}L</span>
              <span>•</span>
              <span>Benefit: {currentScheme.benefitAmount}</span>
            </div>
          </div>

          {/* Required Documents Table */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
              {language === 'hi' ? 'अनिवार्य दस्तावेज़ एवं सत्यापन मानक' : 'Mandatory Documents & Verification Standards'}
            </h4>
            <div className="space-y-2">
              {docList.map((doc, idx) => (
                <div key={idx} className="p-2.5 bg-white border border-stone-200 rounded-lg flex items-start gap-3">
                  <div className="mt-0.5 w-4 h-4 border-2 border-stone-400 rounded shrink-0 print:border-black" />
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-xs">{doc.name}</span>
                      <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        Mandatory
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-600 font-medium">
                      Authority: <span className="text-stone-800">{doc.authority}</span>
                    </div>
                    <div className="text-[10px] text-stone-500 italic">
                      {doc.note}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Declaration Footer */}
          <div className="border-t border-stone-200 pt-3 text-[10px] text-stone-500 space-y-1">
            <p>
              • All scanned copies must be high-resolution (300 DPI), clearly showing digital signatures and QR validation stamps.
            </p>
            <p>
              • In accordance with GFR 2017 &amp; DPDP Act 2023, documents are stored in zero-knowledge encrypted vaults solely for statutory scholarship verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
