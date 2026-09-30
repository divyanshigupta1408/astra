import React from 'react';
import { AppLanguage } from '../types';
import { translations } from '../locales/translations';
import { VanavriddhiLogo } from './Emblem';
import { CheckCircle2, ShieldCheck, Scale, ExternalLink } from 'lucide-react';
import { InfoModalType } from './LegalAndInfoModals';

interface FooterProps {
  language: AppLanguage;
  onOpenSystemDesign?: () => void;
  onOpenAuditLog?: () => void;
  onOpenPrivacy?: () => void;
  onOpenInfoModal?: (type: NonNullable<InfoModalType>) => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onOpenSystemDesign,
  onOpenAuditLog,
  onOpenPrivacy,
  onOpenInfoModal
}) => {
  const t = translations[language];

  const handleOpen = (type: NonNullable<InfoModalType>) => {
    if (onOpenInfoModal) {
      onOpenInfoModal(type);
    } else if (type === 'privacy' && onOpenPrivacy) {
      onOpenPrivacy();
    }
  };

  return (
    <footer className="mt-16 bg-stone-900 text-white border-t-2 border-stone-800">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          {/* Col 1: Identity */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <VanavriddhiLogo className="w-9 h-9 shrink-0" />
              <div>
                <h4 className="font-bold text-base text-white tracking-tight">
                  VANAVRIDDHI (वनवृद्धि)
                </h4>
                <p className="text-[11px] text-stone-400">
                  Scholarship &amp; Fellowship Management for Scheduled Tribes
                </p>
              </div>
            </div>
            <p className="text-stone-300 text-xs leading-relaxed max-w-md">
              A transparent, affirmative student welfare platform for Scheduled Tribe scholars across India, integrating Digital Public Infrastructure with deterministic statutory rules and human officer approvals.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => handleOpen('aboutDecisions')}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
              >
                How Decisions Are Made (Product Principle) →
              </button>
            </div>
          </div>

          {/* Col 2: Legal & Governance */}
          <div className="space-y-2">
            <h5 className="font-bold uppercase tracking-wider text-amber-400 text-[11px]">
              Platform &amp; Legal
            </h5>
            <ul className="space-y-1.5 text-stone-300">
              <li>
                <button 
                  onClick={() => handleOpen('privacy')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Privacy Policy &amp; DPDP Act
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleOpen('terms')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Terms of Use
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleOpen('accessibility')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Accessibility Statement
                </button>
              </li>
              {onOpenAuditLog && (
                <li>
                  <button 
                    onClick={onOpenAuditLog} 
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Cryptographic Audit Ledger
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: Support & Contact */}
          <div className="space-y-2">
            <h5 className="font-bold uppercase tracking-wider text-amber-400 text-[11px]">
              Support &amp; Redressal
            </h5>
            <ul className="space-y-1.5 text-stone-300">
              <li>
                <button 
                  onClick={() => handleOpen('help')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Help Centre &amp; FAQs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleOpen('contact')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Contact &amp; Administrative Directory
                </button>
              </li>
              <li>
                <span className="text-stone-400 font-mono text-[11px]">Toll-Free: 1800-11-7788</span>
              </li>
              <li>
                <span className="text-stone-400 font-mono text-[11px]">helpdesk@vanavriddhi.gov.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-400">
          <div>
            © 2026 Vanavriddhi. Scholarship &amp; Fellowship Management for Scheduled Tribes
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>WCAG 2.1 AA Compliant</span>
            </span>
            <span>•</span>
            <span className="font-mono text-stone-400">Production Build v3.2</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
