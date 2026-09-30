import React from 'react';
import { Keyboard, X } from 'lucide-react';
import { AppLanguage } from '../../types';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: AppLanguage;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  language = 'en'
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'A', action: language === 'hi' ? 'आवेदन स्वीकृत करें (GFR अनुमोदन)' : 'Statutory Approval (Sign-Off)' },
    { key: 'S', action: language === 'hi' ? 'सुधार हेतु वापस भेजें (Send Back)' : 'Return for Correction (Send Back)' },
    { key: 'E', action: language === 'hi' ? 'राज्य नोडल अधिकारी को अग्रेषित करें' : 'Escalate to State Directorate' },
    { key: 'J', action: language === 'hi' ? 'अगला आवेदन (Next application)' : 'Navigate to Next Application' },
    { key: 'K', action: language === 'hi' ? 'पिछला आवेदन (Previous application)' : 'Navigate to Previous Application' },
    { key: '?', action: language === 'hi' ? 'शॉर्टकट सहायता तालिका खोलें' : 'Open Shortcut Cheat Sheet' }
  ];

  return (
    <div className="fixed inset-0 z-70 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
          <Keyboard className="w-5 h-5 text-emerald-800" />
          <h3 className="text-sm font-bold text-stone-900">
            {language === 'hi' ? 'अधिकारी समीक्षा: कीबोर्ड शॉर्टकट तालिका' : 'Officer Review: Keyboard Shortcuts'}
          </h3>
        </div>

        <p className="text-stone-500 text-xs">
          {language === 'hi'
            ? 'समीक्षा पृष्ठ पर रहते हुए इन कुंजियों को दबाकर त्वरित कार्यवाही करें:'
            : 'Accelerate institutional scrutiny. Press these single keys while reviewing applications:'}
        </p>

        <div className="divide-y divide-stone-100 bg-stone-50 rounded-xl border border-stone-200 p-2 space-y-1">
          {shortcuts.map((sc) => (
            <div key={sc.key} className="py-2 px-2.5 flex items-center justify-between text-xs">
              <span className="font-medium text-stone-800">{sc.action}</span>
              <kbd className="px-2 py-1 bg-white border border-stone-300 rounded shadow-xs font-mono font-bold text-stone-900 text-xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs"
          >
            {language === 'hi' ? 'समझ गया' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
