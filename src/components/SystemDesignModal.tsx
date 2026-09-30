import React from 'react';
import { X, Layers, ShieldCheck, Cpu, Database, Network, Globe, ArrowDown, CheckCircle2 } from 'lucide-react';

interface SystemDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemDesignModal: React.FC<SystemDesignModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full p-6 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-800">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                A.S.T.R.A Layered System Architecture
              </h2>
              <p className="text-xs text-stone-500">
                Statutory Governance & AI Safety Architecture — Ministry of Tribal Affairs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Architectural Principle Banner */}
        <div className="bg-emerald-950 text-white rounded-lg p-4 border border-emerald-900 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-amber-300 text-sm block">
              Architectural Separation of Concerns: "AI assists, rules decide, humans approve."
            </span>
            <p className="text-stone-300 leading-relaxed">
              In A.S.T.R.A, generative or predictive AI models are strictly prohibited from emitting binding legal verdicts. AI operates as a sensory and advisory copilot (OCR ingestion, multi-document alignment, syndicate graph detection), whereas the legal verdict is determined by a deterministic statutory rule engine. Sanction orders require authenticated human officer sign-off.
            </p>
          </div>
        </div>

        {/* 6-Layer Architecture Stack Diagram */}
        <div className="space-y-3">
          {/* Layer 1: Channels */}
          <div className="p-3.5 rounded-lg border border-sky-300 bg-sky-50/70 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-sky-950 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-sky-700" />
                <span>Layer 1: Citizen & Administrative Access Channels</span>
              </span>
              <span className="font-mono text-[10px] text-sky-800 bg-sky-100 px-2 py-0.5 rounded font-bold">
                Omnichannel Ingest
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-medium text-stone-700">
              <div className="bg-white p-2 rounded border border-sky-200">Mobile & Web Responsive App</div>
              <div className="bg-white p-2 rounded border border-sky-200">CSC Village Kiosk Portal</div>
              <div className="bg-white p-2 rounded border border-sky-200">Bhashini Multilingual Speech IVR</div>
              <div className="bg-white p-2 rounded border border-sky-200">Offline-First Service Worker Cache</div>
            </div>
          </div>

          <div className="flex justify-center text-stone-400">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Layer 2: Security & Privacy */}
          <div className="p-3.5 rounded-lg border border-purple-300 bg-purple-50/70 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-purple-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-700" />
                <span>Layer 2: Trust, Security & DPDP Act 2023 Compliance</span>
              </span>
              <span className="font-mono text-[10px] text-purple-800 bg-purple-100 px-2 py-0.5 rounded font-bold">
                Zero-Trust Security
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-medium text-stone-700">
              <div className="bg-white p-2 rounded border border-purple-200">Aadhaar Virtual Tokenization (No Raw UIDAI)</div>
              <div className="bg-white p-2 rounded border border-purple-200">DPDP Consent Artifact Ledger</div>
              <div className="bg-white p-2 rounded border border-purple-200">RBAC Role-Based Access Control</div>
              <div className="bg-white p-2 rounded border border-purple-200">Tamper-Evident SHA-256 Hash Chain</div>
            </div>
          </div>

          <div className="flex justify-center text-stone-400">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Layer 3: Statutory Core */}
          <div className="p-3.5 rounded-lg border border-emerald-400 bg-emerald-50/80 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-700" />
                <span>Layer 3: Core Statutory Decision & Disbursement Services</span>
              </span>
              <span className="font-mono text-[10px] text-emerald-900 bg-emerald-200 px-2 py-0.5 rounded font-bold">
                100% Deterministic Engine
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-medium text-stone-700">
              <div className="bg-white p-2 rounded border border-emerald-300 font-bold text-emerald-950">Formal Rule Evaluation Engine</div>
              <div className="bg-white p-2 rounded border border-emerald-300 font-bold text-emerald-950">Statutory Clause Trace Generator</div>
              <div className="bg-white p-2 rounded border border-emerald-300 font-bold text-emerald-950">3-Tier Verification Workflow</div>
              <div className="bg-white p-2 rounded border border-emerald-300 font-bold text-emerald-950">DBT Payment Advice Formatter</div>
            </div>
          </div>

          <div className="flex justify-center text-stone-400">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Layer 4: AI & Advisory Services */}
          <div className="p-3.5 rounded-lg border border-amber-300 bg-amber-50/70 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-amber-950 flex items-center gap-1.5">
                <Network className="w-4 h-4 text-amber-700" />
                <span>Layer 4: AI & Advisory Sensory Layer (Advisory Only)</span>
              </span>
              <span className="font-mono text-[10px] text-amber-900 bg-amber-200 px-2 py-0.5 rounded font-bold">
                Advisory Safeguards
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-medium text-stone-700">
              <div className="bg-white p-2 rounded border border-amber-200">Multi-Document OCR & Entity Ingest</div>
              <div className="bg-white p-2 rounded border border-amber-200">Cross-Doc Mismatch Detector</div>
              <div className="bg-white p-2 rounded border border-amber-200">Syndicate Fraud Graph Analytics</div>
              <div className="bg-white p-2 rounded border border-amber-200">Conversational Mitra Assistant</div>
            </div>
          </div>

          <div className="flex justify-center text-stone-400">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Layer 5: Data & Immutable Storage */}
          <div className="p-3.5 rounded-lg border border-stone-300 bg-stone-50 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-stone-700" />
                <span>Layer 5: Enterprise Persistence & Immutable Ledgers</span>
              </span>
              <span className="font-mono text-[10px] text-stone-700 bg-stone-200 px-2 py-0.5 rounded font-bold">
                Storage Core
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-medium text-stone-700">
              <div className="bg-white p-2 rounded border border-stone-200">PostgreSQL Relational Scheme Records</div>
              <div className="bg-white p-2 rounded border border-stone-200">Cryptographic SHA-256 Audit Trail</div>
              <div className="bg-white p-2 rounded border border-stone-200">Document Vault with At-Rest AES-256</div>
            </div>
          </div>

          <div className="flex justify-center text-stone-400">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Layer 6: National Integrations */}
          <div className="p-3.5 rounded-lg border border-emerald-600 bg-emerald-900 text-white text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-emerald-200 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-300" />
                <span>Layer 6: National Digital Public Infrastructure (DPI) Integrations</span>
              </span>
              <span className="font-mono text-[10px] text-amber-300 bg-emerald-950 px-2 py-0.5 rounded font-bold">
                National Stacks
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-medium text-stone-900">
              <div className="bg-white p-2 rounded font-bold text-center">DigiLocker PKI</div>
              <div className="bg-white p-2 rounded font-bold text-center">State e-District</div>
              <div className="bg-white p-2 rounded font-bold text-center">PFMS Treasury</div>
              <div className="bg-white p-2 rounded font-bold text-center">NPCI Aadhaar DBT</div>
              <div className="bg-white p-2 rounded font-bold text-center">Bhashini AI Language</div>
            </div>
          </div>
        </div>

        {/* How It Works Explanatory Notes */}
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 text-xs space-y-2">
          <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Operational Verification Flow: How It Works</span>
          </h4>
          <ol className="list-decimal pl-4 space-y-1 text-stone-700">
            <li><strong>Student Pre-qualification:</strong> The student inputs criteria. The client-side rule engine deterministically tests clauses (income cap, course level, ST community mandate) and outputs the legal rule trace.</li>
            <li><strong>Document Verification:</strong> High-resolution document scans are ingested. OCR extracts text and compares names, DOBs, and fathers' names across certificates. Mismatches are flagged to prevent administrative rejection.</li>
            <li><strong>Financial Routing Verification:</strong> The bank account is checked against the NPCI Aadhaar mapper to guarantee DBT readiness before transmission.</li>
            <li><strong>Triage & Fraud Prevention:</strong> Applications are sorted into Green (straight-through), Amber (minor queries), and Red (syndicate risk). An interactive node-link graph flags cyber kiosk collusions.</li>
            <li><strong>Tamper-Evident Accountability:</strong> Every decision made by rules, AI algorithms, or officers is sealed in a cryptographic hash chain.</li>
          </ol>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-semibold"
          >
            Close Architecture View
          </button>
        </div>
      </div>
    </div>
  );
};
