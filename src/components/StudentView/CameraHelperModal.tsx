import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle2, AlertTriangle, RefreshCw, X, Sparkles, Sliders } from 'lucide-react';

interface CameraHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  language?: 'en' | 'hi';
  onCapture: (simulatedFileName: string) => void;
}

export const CameraHelperModal: React.FC<CameraHelperModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  language = 'en',
  onCapture
}) => {
  type QualityState = 'closer' | 'glare' | 'perfect';
  const [quality, setQuality] = useState<QualityState>('closer');
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  // Auto-cycle quality check to simulate live camera adjustment
  useEffect(() => {
    if (!isOpen) return;
    setQuality('closer');
    const t1 = setTimeout(() => {
      setQuality('glare');
    }, 1500);
    const t2 = setTimeout(() => {
      setQuality('perfect');
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      const cleanDocName = `${documentTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_camera_scan.jpg`;
      onCapture(cleanDocName);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-70 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-5 shadow-2xl text-stone-100 text-xs relative space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-sm text-white">
              {language === 'hi' ? 'कैमरा स्कैनर: दस्तावेज़ फ़ोटो लें' : 'Camera Helper: Capture Document'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-md"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-stone-400 text-[11px]">
          Target: <span className="text-amber-300 font-bold">{documentTitle}</span>
        </p>

        {/* Viewfinder Frame with Overlay */}
        <div className="relative aspect-4/3 w-full bg-stone-950 rounded-xl overflow-hidden border-2 border-stone-800 flex items-center justify-center shadow-inner">
          {/* Simulated camera feed / document preview */}
          <div className="absolute inset-4 border-2 border-dashed border-amber-400/70 rounded-lg pointer-events-none flex flex-col justify-between p-3">
            {/* 4 Corner brackets */}
            <div className="flex justify-between">
              <div className="w-4 h-4 border-t-2 border-l-2 border-amber-300" />
              <div className="w-4 h-4 border-t-2 border-r-2 border-amber-300" />
            </div>

            {/* Document mock lines */}
            <div className="opacity-25 space-y-2 px-4 py-2">
              <div className="h-2 bg-stone-200 rounded w-1/3 mx-auto" />
              <div className="h-1.5 bg-stone-300 rounded w-full" />
              <div className="h-1.5 bg-stone-300 rounded w-5/6" />
              <div className="h-1.5 bg-stone-300 rounded w-4/6" />
            </div>

            <div className="flex justify-between">
              <div className="w-4 h-4 border-b-2 border-l-2 border-amber-300" />
              <div className="w-4 h-4 border-b-2 border-r-2 border-amber-300" />
            </div>
          </div>

          {/* Center scan line animation if adjusting */}
          {quality !== 'perfect' && (
            <div className="absolute inset-x-4 h-0.5 bg-amber-400/80 animate-pulse top-1/2" />
          )}
        </div>

        {/* Quality Guidance Banner */}
        <div className="space-y-2">
          <div className="text-[10px] uppercase font-mono font-bold text-stone-400 flex items-center justify-between">
            <span>Automated Quality Scrutiny:</span>
            {/* Quick manual simulation overrides for testing */}
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setQuality('closer')}
                className={`px-1.5 py-0.5 rounded text-[9px] ${quality === 'closer' ? 'bg-amber-600 text-white' : 'bg-stone-800 text-stone-400'}`}
              >
                Closer
              </button>
              <button
                type="button"
                onClick={() => setQuality('glare')}
                className={`px-1.5 py-0.5 rounded text-[9px] ${quality === 'glare' ? 'bg-amber-600 text-white' : 'bg-stone-800 text-stone-400'}`}
              >
                Glare
              </button>
              <button
                type="button"
                onClick={() => setQuality('perfect')}
                className={`px-1.5 py-0.5 rounded text-[9px] ${quality === 'perfect' ? 'bg-emerald-700 text-white' : 'bg-stone-800 text-stone-400'}`}
              >
                Good
              </button>
            </div>
          </div>

          {quality === 'closer' && (
            <div className="p-3 bg-amber-950/80 border border-amber-700 rounded-xl text-amber-200 flex items-center gap-2.5 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="font-bold text-xs">{language === 'hi' ? 'पास लाएं (Move closer)' : 'Move closer'}</div>
                <div className="text-[11px] text-amber-300">
                  {language === 'hi' ? 'दस्तावेज़ के किनारों को फ्रेम के अंदर रखें।' : 'Document boundaries are too far; align corners with overlay markers.'}
                </div>
              </div>
            </div>
          )}

          {quality === 'glare' && (
            <div className="p-3 bg-amber-950/80 border border-amber-700 rounded-xl text-amber-200 flex items-center gap-2.5 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="font-bold text-xs">{language === 'hi' ? 'चमक कम करें (Reduce glare)' : 'Reduce glare'}</div>
                <div className="text-[11px] text-amber-300">
                  {language === 'hi' ? 'प्रकाश की चमक से अक्षर अस्पष्ट हैं। कोण थोड़ा बदलें।' : 'Light reflection obscures text. Tilt phone slightly to avoid direct bulb glare.'}
                </div>
              </div>
            </div>
          )}

          {quality === 'perfect' && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-600 rounded-xl text-emerald-200 flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-xs">{language === 'hi' ? 'बिल्कुल सही! (Looks good)' : 'Looks good! Perfect alignment and lighting'}</div>
                <div className="text-[11px] text-emerald-300">
                  {language === 'hi' ? 'उच्च रिज़ॉल्यूशन एवं स्पष्ट पाठ का पता चला है।' : 'Crisp characters detected. 100% ready for OCR and DigiLocker PKI extraction.'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Capture Action Button */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-lg border border-stone-700 text-stone-300 hover:bg-stone-800"
          >
            {language === 'hi' ? 'रद्द करें' : 'Cancel'}
          </button>

          <button
            type="button"
            disabled={isCapturing}
            onClick={handleCapture}
            className={`flex-1 py-2 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
              quality === 'perfect'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            {isCapturing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
            <span>
              {quality === 'perfect' 
                ? (language === 'hi' ? 'फ़ोटो लें एवं संलग्न करें' : 'Capture & Attach') 
                : (language === 'hi' ? 'फिर भी फ़ोटो लें' : 'Capture Photo')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
