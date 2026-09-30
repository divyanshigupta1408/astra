import React, { useState } from 'react';
import { useAccessibility } from './AccessibilityContext';
import { Eye, Type, SlidersHorizontal, Check } from 'lucide-react';
import { UserRole } from '../types';

interface AccessibilityToolbarProps {
  userRole?: UserRole;
  language?: 'en' | 'hi';
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  userRole = 'student',
  language = 'en'
}) => {
  const {
    fontSize,
    setFontSize,
    highContrast,
    toggleHighContrast,
    simpleView,
    toggleSimpleView
  } = useAccessibility();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      {/* Quick compact pill bar */}
      <div className="flex items-center gap-1 bg-stone-100/90 border border-stone-200 rounded-lg p-0.5 text-xs">
        {/* Font size adjustments */}
        <div className="flex items-center border-r border-stone-200 pr-1 mr-1">
          <button
            type="button"
            onClick={() => setFontSize('sm')}
            title="Smaller font size (A-)"
            className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
              fontSize === 'sm' ? 'bg-amber-600 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            A-
          </button>
          <button
            type="button"
            onClick={() => setFontSize('md')}
            title="Standard font size (A)"
            className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
              fontSize === 'md' ? 'bg-amber-600 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            A
          </button>
          <button
            type="button"
            onClick={() => setFontSize('lg')}
            title="Larger font size (A+)"
            className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
              fontSize === 'lg' ? 'bg-amber-600 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            A+
          </button>
        </div>

        {/* High contrast toggle */}
        <button
          type="button"
          onClick={toggleHighContrast}
          title={highContrast ? 'Disable High Contrast' : 'Enable High Contrast'}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
            highContrast ? 'bg-stone-900 text-amber-300 ring-1 ring-amber-400' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Eye className="w-3 h-3" />
          <span className="hidden sm:inline">{highContrast ? 'Contrast: ON' : 'Contrast'}</span>
        </button>

        {/* Student-only "Simple View" toggle */}
        {userRole === 'student' && (
          <button
            type="button"
            onClick={toggleSimpleView}
            title={simpleView ? 'Switch to Detailed View' : 'Switch to Simple Clutter-Free View'}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer border-l border-stone-200 ml-1 ${
              simpleView ? 'bg-emerald-800 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>{language === 'hi' ? 'सरल दृश्य' : 'Simple View'}</span>
            {simpleView && <Check className="w-3 h-3 text-emerald-300" />}
          </button>
        )}
      </div>
    </div>
  );
};
