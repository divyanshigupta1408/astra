import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface ContextualHelpProps {
  term: string;
  explanationEn: string;
  explanationHi: string;
  language?: 'en' | 'hi';
  placement?: 'top' | 'bottom' | 'right';
  className?: string;
}

export const ContextualHelp: React.FC<ContextualHelpProps> = ({
  term,
  explanationEn,
  explanationHi,
  language = 'en',
  placement = 'top',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const explanation = language === 'hi' ? explanationHi : explanationEn;

  return (
    <span className={`relative inline-flex items-center align-middle ml-1 ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Explanation for ${term}`}
        className="text-stone-400 hover:text-amber-700 p-0.5 rounded-full hover:bg-stone-100 transition-colors focus:outline-hidden focus:ring-1 focus:ring-amber-500 cursor-pointer"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div
          role="tooltip"
          className={`absolute z-50 w-64 p-3 bg-stone-900 text-stone-100 text-[11px] rounded-lg shadow-xl ring-1 ring-white/10 leading-relaxed animate-in fade-in zoom-in-95 ${
            placement === 'top'
              ? 'bottom-full left-1/2 -translate-x-1/2 mb-1.5'
              : placement === 'bottom'
              ? 'top-full left-1/2 -translate-x-1/2 mt-1.5'
              : 'left-full top-1/2 -translate-y-1/2 ml-1.5'
          }`}
        >
          <div className="flex items-start justify-between gap-1 mb-1 border-b border-stone-800 pb-1">
            <span className="font-bold text-amber-300 font-mono text-[10px] uppercase tracking-wider">
              {term}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white p-0.5"
              aria-label="Close"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="text-stone-300">{explanation}</p>
        </div>
      )}
    </span>
  );
};
