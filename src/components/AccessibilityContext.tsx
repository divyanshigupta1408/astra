import React, { createContext, useContext, useState, useEffect } from 'react';

export type FontSizeOption = 'sm' | 'md' | 'lg';

interface AccessibilityContextType {
  fontSize: FontSizeOption;
  setFontSize: (size: FontSizeOption) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  toggleHighContrast: () => void;
  simpleView: boolean;
  setSimpleView: (enabled: boolean) => void;
  toggleSimpleView: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<FontSizeOption>('md');
  const [highContrast, setHighContrastState] = useState<boolean>(false);
  const [simpleView, setSimpleViewState] = useState<boolean>(false);

  const setFontSize = (size: FontSizeOption) => {
    setFontSizeState(size);
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (size === 'sm') root.style.fontSize = '14.5px';
      else if (size === 'md') root.style.fontSize = '16px';
      else if (size === 'lg') root.style.fontSize = '18.5px';
    }
  };

  const setHighContrast = (enabled: boolean) => {
    setHighContrastState(enabled);
    if (typeof document !== 'undefined') {
      if (enabled) {
        document.body.classList.add('app-high-contrast');
      } else {
        document.body.classList.remove('app-high-contrast');
      }
    }
  };

  const toggleHighContrast = () => setHighContrast(!highContrast);

  const setSimpleView = (enabled: boolean) => {
    setSimpleViewState(enabled);
  };

  const toggleSimpleView = () => setSimpleViewState(prev => !prev);

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        toggleHighContrast,
        simpleView,
        setSimpleView,
        toggleSimpleView
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    return {
      fontSize: 'md',
      setFontSize: () => {},
      highContrast: false,
      setHighContrast: () => {},
      toggleHighContrast: () => {},
      simpleView: false,
      setSimpleView: () => {},
      toggleSimpleView: () => {}
    };
  }
  return context;
};
