import React from 'react';
import { X, ShieldCheck, Scale, FileText, HelpCircle, Mail, Phone, ExternalLink, CheckCircle2, Lock, Eye } from 'lucide-react';

export type InfoModalType = 'privacy' | 'terms' | 'accessibility' | 'help' | 'contact' | 'aboutDecisions' | null;

interface InfoModalProps {
  modalType: InfoModalType;
  onClose: () => void;
}

export const LegalAndInfoModal: React.FC<InfoModalProps> = ({ modalType, onClose }) => {
  if (!modalType) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-xl border border-stone-200 animate-slideUp max-h-[85vh] flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2.5">
            {modalType === 'privacy' && <Lock className="w-5 h-5 text-emerald-700" />}
            {modalType === 'terms' && <FileText className="w-5 h-5 text-indigo-700" />}
            {modalType === 'accessibility' && <CheckCircle2 className="w-5 h-5 text-amber-600" />}
            {modalType === 'help' && <HelpCircle className="w-5 h-5 text-blue-700" />}
            {modalType === 'contact' && <Mail className="w-5 h-5 text-emerald-800" />}
            {modalType === 'aboutDecisions' && <Scale className="w-5 h-5 text-amber-600" />}

            <h3 className="font-bold text-stone-900 text-base">
              {modalType === 'privacy' && 'Privacy Policy & Data Protection (DPDP 2023)'}
              {modalType === 'terms' && 'Terms of Use & Statutory Guidelines'}
              {modalType === 'accessibility' && 'Accessibility Statement (WCAG 2.1 AA)'}
              {modalType === 'help' && 'Vanavriddhi Help Centre & Support'}
              {modalType === 'contact' && 'Contact & Administrative Directory'}
              {modalType === 'aboutDecisions' && 'How Decisions Are Made: Core Product Principle'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto space-y-4 text-xs text-stone-700 leading-relaxed pr-2">
          {modalType === 'privacy' && (
            <>
              <p className="font-semibold text-stone-900">
                Vanavriddhi complies strictly with the Digital Personal Data Protection (DPDP) Act, 2023 and General Financial Rules (GFR).
              </p>
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900">1. Data Minimization &amp; Purpose Limitation</h4>
                <p>
                  Only data essential for statutory scholarship eligibility, admission confirmation, and Direct Benefit Transfer (DBT) is requested. No personal data is commercialized, shared with third parties, or retained longer than statutory audit cycles require.
                </p>
                <h4 className="font-bold text-stone-900">2. Cryptographic Document Vault</h4>
                <p>
                  Identity credentials, income certificates, and marksheets retrieved through DigiLocker PKI are stored with SHA-256 cryptographic hashes. Unauthorized tampering invalidates the verification pipeline automatically.
                </p>
                <h4 className="font-bold text-stone-900">3. Role-Isolated Masking</h4>
                <p>
                  Officers and Ministry analysts are subject to data masking rules: Ministry-level intelligence dashboards view aggregated data only, with raw bank accounts, Aadhaar numbers, and phone numbers masked by law.
                </p>
              </div>
            </>
          )}

          {modalType === 'terms' && (
            <>
              <p className="font-semibold text-stone-900">
                Terms governing access to the Vanavriddhi Scholarship &amp; Fellowship Management Platform.
              </p>
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900">1. Eligibility &amp; Accurate Representation</h4>
                <p>
                  Applicants must belong to recognized Scheduled Tribes notified under Article 342 of the Constitution. Providing fabricated revenue certificates or false family income statements constitutes an offense under statutory regulations and initiates DBT recovery.
                </p>
                <h4 className="font-bold text-stone-900">2. Institutional Scrutiny &amp; Deadlines</h4>
                <p>
                  Heads of Institutions and assigned Nodal Officers are mandated to complete application scrutiny within the stipulated Service Level Agreement (30 calendar days). Delayed files trigger automated escalation to the State Tribal Welfare Directorate.
                </p>
                <h4 className="font-bold text-stone-900">3. Direct Benefit Transfer (DBT) Mandate</h4>
                <p>
                  Scholarship disbursements are made exclusively into the student's individual bank account seeded with Aadhaar on the NPCI mapper. Joint or dormant bank accounts are blocked from electronic credit token release.
                </p>
              </div>
            </>
          )}

          {modalType === 'accessibility' && (
            <>
              <p className="font-semibold text-stone-900">
                Commitment to universal accessibility for tribal students and diverse digital literacy levels.
              </p>
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900">1. Standards Compliance</h4>
                <p>
                  Vanavriddhi aims to meet Level AA of the Web Content Accessibility Guidelines (WCAG 2.1). Visual contrast ratios exceed 4.5:1 for all critical text elements, form controls, and status indicators.
                </p>
                <h4 className="font-bold text-stone-900">2. Keyboard Navigation &amp; Screen Readers</h4>
                <p>
                  The entire student, officer, and ministry workflows can be navigated via keyboard tabs. Logical focus indicators and semantic HTML ARIA landmarks ensure compatibility with NVDA and JAWS screen readers.
                </p>
                <h4 className="font-bold text-stone-900">3. Multilingual Bhashini Voice Input</h4>
                <p>
                  Students from remote forest hamlets can utilize voice queries and bilingual interfaces (English and Hindi), bridging regional linguistic gaps.
                </p>
              </div>
            </>
          )}

          {modalType === 'help' && (
            <>
              <p className="font-semibold text-stone-900">
                Frequently needed assistance for ST scholarship applicants, institutions, and state scrutiny desks.
              </p>
              <div className="space-y-3">
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                  <h4 className="font-bold text-stone-900">Toll-Free National Tribal Helpline</h4>
                  <p className="font-mono text-emerald-800 font-bold text-sm mt-0.5">1800-11-7788</p>
                  <p className="text-[11px] text-stone-500">Operational Monday to Saturday: 09:00 AM – 05:30 PM IST</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-stone-900">Common Support Procedures:</h4>
                  <ul className="list-disc list-inside space-y-1 text-stone-600 pl-1">
                    <li><strong>Bank Seeding Status:</strong> Check your bank's netbanking or mobile app to ensure Aadhaar is mapped for DBT before final submission.</li>
                    <li><strong>Community Attestation Route:</strong> If your revenue sub-division has not digitized caste certificates, select the Gram Sabha attestation option under PESA Section 4(d).</li>
                    <li><strong>Inter-State Portability:</strong> If your college is outside your home state, the portal will automatically initiate inter-state verification with your home district ITDA.</li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {modalType === 'contact' && (
            <>
              <p className="font-semibold text-stone-900">
                Administrative directory for Vanavriddhi operations and scholarship grievance escalations.
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-900">Scholarship &amp; Fellowship Directorate</div>
                  <div>Ministry of Tribal Affairs, Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi – 110001</div>
                  <div className="pt-1 text-emerald-800 font-mono">Email: helpdesk@vanavriddhi.gov.in</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-900">Public Financial Management System (PFMS) Cell</div>
                  <div>DBT Technical Integration Unit, 4th Floor, Shivaji Stadium Annexe, New Delhi – 110001</div>
                  <div className="pt-1 text-stone-600">Electronic Payment Gateway &amp; RBI Settlement Desk</div>
                </div>
              </div>
            </>
          )}

          {modalType === 'aboutDecisions' && (
            <>
              <div className="bg-amber-50 border border-amber-300 p-3 rounded-lg text-amber-950 font-bold">
                "AI assists, rules decide, humans approve."
              </div>
              <p className="font-semibold text-stone-900">
                The three fundamental pillars governing every action in Vanavriddhi:
              </p>
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900">1. AI Assists (Advisory Intelligence)</h4>
                <p>
                  Artificial Intelligence is strictly advisory. It reads scanned documents via OCR, detects potential name variations or missing certificates, alerts officers to bottleneck delays, and flags suspicious rings of shared accounts. AI never rejects or denies any student's application.
                </p>
                <h4 className="font-bold text-stone-900">2. Rules Decide (Deterministic Statutory Logic)</h4>
                <p>
                  Eligibility is calculated exclusively by transparent, deterministic business rule algorithms grounded in official scheme guidelines (e.g. Clause 5.2 family income &lt;= ₹6.00L, Clause 4.3 minimum qualifying marks). Every rule verdict produces an explainable, auditable trace.
                </p>
                <h4 className="font-bold text-stone-900">3. Humans Approve (Statutory Accountability)</h4>
                <p>
                  Under General Financial Rules (GFR 2017), only designated institutional nodal officers and state welfare authorities possess statutory sign-off authority. Officers review recommendations, verify edge cases, and apply human discretion before any sanction order is generated.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-stone-200 pt-3 flex items-center justify-between">
          <span className="text-[11px] text-stone-500 font-mono">Vanavriddhi Portal • Version 3.2</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
