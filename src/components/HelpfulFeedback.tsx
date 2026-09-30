import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Check } from 'lucide-react';

interface HelpfulFeedbackProps {
  articleId?: string;
  language?: 'en' | 'hi';
  className?: string;
}

export const HelpfulFeedback: React.FC<HelpfulFeedbackProps> = ({
  articleId,
  language = 'en',
  className = ''
}) => {
  const [voted, setVoted] = useState<'yes' | 'no' | null>(null);

  const handleVote = (vote: 'yes' | 'no') => {
    setVoted(vote);
  };

  return (
    <div className={`flex items-center gap-2 text-xs text-stone-600 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-lg ${className}`}>
      {voted ? (
        <span className="flex items-center gap-1.5 text-emerald-800 font-semibold text-[11px] animate-in fade-in">
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>{language === 'hi' ? 'आपकी प्रतिक्रिया के लिए धन्यवाद!' : 'Thank you for your feedback!'}</span>
        </span>
      ) : (
        <>
          <span className="text-[11px] font-medium text-stone-700">
            {language === 'hi' ? 'क्या यह उपयोगी था?' : 'Was this helpful?'}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleVote('yes')}
              className="p-1 rounded hover:bg-emerald-100 text-stone-600 hover:text-emerald-800 transition-colors cursor-pointer"
              title={language === 'hi' ? 'हाँ, यह उपयोगी था' : 'Yes, helpful'}
              aria-label="Yes, helpful"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleVote('no')}
              className="p-1 rounded hover:bg-rose-100 text-stone-600 hover:text-rose-800 transition-colors cursor-pointer"
              title={language === 'hi' ? 'नहीं, सुधार की आवश्यकता है' : 'No, need improvement'}
              aria-label="No, not helpful"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
