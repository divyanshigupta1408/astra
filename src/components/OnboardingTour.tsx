import React, { useState } from 'react';
import { UserRole } from '../types';
import { CheckCircle2, ChevronRight, X, UserCheck, Building2, BarChart3, ShieldCheck } from 'lucide-react';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isOpen,
  onClose,
  onSelectRole
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      title: 'Step 1: Student Pre-Qualification & Smart Ingest',
      role: 'student' as UserRole,
      badge: 'Student View',
      icon: <UserCheck className="w-6 h-6 text-emerald-700" />,
      description: 'Experience the 100% deterministic eligibility engine. Enter study details, hear guideline clauses, extract documents via 2-second simulated OCR, and check cross-document consistency.',
      keyHighlight: 'Core Mandate: "AI assists, rules decide, humans approve." The decision shows the exact statutory clause trace.'
    },
    {
      title: 'Step 2: Nodal Officer Triage & Syndicate Fraud Graph',
      role: 'officer' as UserRole,
      badge: 'Officer View',
      icon: <Building2 className="w-6 h-6 text-emerald-700" />,
      description: 'Review 25 priority applications segregated by Green, Amber, and Red risk lanes. Inspect extracted documents side-by-side and explore the interactive node-link fraud ring visualization.',
      keyHighlight: 'Statutory Safeguard: "AI flag is advisory. Officer decision is final."'
    },
    {
      title: 'Step 3: Ministry Policy Simulator & Algorithmic Fairness Audit',
      role: 'analyst' as UserRole,
      badge: 'Analyst View',
      icon: <BarChart3 className="w-6 h-6 text-emerald-700" />,
      description: 'View national state-by-state reach gaps with PVTG focus, interactive Recharts trend graphs, dropout early warning tables, and live sliders for fiscal policy simulation.',
      keyHighlight: 'Demographic Parity: Auditing flag rates across genders and PVTG groups to verify 0% bias.'
    }
  ];

  const current = tourSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleJumpToView = (role: UserRole) => {
    onSelectRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-70 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-xs relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step Counter */}
        <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
          <span>Platform Capability Walkthrough</span>
          <span>Step {currentStep + 1} of {tourSteps.length}</span>
        </div>

        {/* Header Content */}
        <div className="flex items-start gap-3">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 shrink-0">
            {current.icon}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-mono">
              {current.badge}
            </span>
            <h3 className="text-base font-bold text-stone-950 mt-1">
              {current.title}
            </h3>
          </div>
        </div>

        <p className="text-stone-700 leading-relaxed text-xs">
          {current.description}
        </p>

        <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-3 text-emerald-950 space-y-1">
          <span className="font-bold flex items-center gap-1 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            Key Evaluator Highlight:
          </span>
          <p className="text-[11px] text-emerald-900 font-medium">
            {current.keyHighlight}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-200">
          <button
            onClick={() => handleJumpToView(current.role)}
            className="text-emerald-800 hover:text-emerald-950 font-bold underline text-xs"
          >
            Jump to {current.badge} now
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded text-stone-500 hover:text-stone-800 font-medium text-xs"
            >
              Skip Tour
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded bg-emerald-900 hover:bg-emerald-950 text-white font-semibold text-xs flex items-center gap-1 shadow-2xs"
            >
              <span>{currentStep === tourSteps.length - 1 ? 'Start Exploring' : 'Next Step'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
