import React from 'react';

/**
 * Vanavriddhi Original Logo Mark
 * A stylized growing sapling / twin leaves embracing an academic graduation mortarboard.
 * Represents nature, growth, and tribal higher education.
 */
export const VanavriddhiLogo: React.FC<{ className?: string; size?: number }> = ({ 
  className = 'w-8 h-8',
}) => {
  return (
    <svg 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="Vanavriddhi Portal Logo"
      role="img"
    >
      <defs>
        <linearGradient id="leafGradLeft" x1="12" y1="38" x2="22" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#047857" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <linearGradient id="leafGradRight" x1="36" y1="38" x2="26" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="capGrad" x1="14" y1="8" x2="34" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>

      {/* Base stem / roots of growth */}
      <path 
        d="M24 44 V30" 
        stroke="#047857" 
        strokeWidth="3" 
        strokeLinecap="round" 
      />

      {/* Left Leaf (Nature / Forest) */}
      <path 
        d="M24 34 C16 34 10 26 12 18 C18 18 24 24 24 30 Z" 
        fill="url(#leafGradLeft)" 
      />

      {/* Right Leaf (Flourishing / Opportunity) */}
      <path 
        d="M24 32 C32 32 38 24 36 16 C30 16 24 22 24 28 Z" 
        fill="url(#leafGradRight)" 
      />

      {/* Center Rising Bud */}
      <path 
        d="M24 26 C22 22 22 17 24 14 C26 17 26 22 24 26 Z" 
        fill="#059669" 
      />

      {/* Academic Cap (Mortarboard diamond) */}
      <path 
        d="M24 6 L37 12 L24 18 L11 12 Z" 
        fill="url(#capGrad)" 
      />

      {/* Cap Skull cap / Underneath */}
      <path 
        d="M17 15.5 V20.5 C17 22.5 20.1 24 24 24 C27.9 24 31 22.5 31 20.5 V15.5" 
        stroke="#1E293B" 
        strokeWidth="1.8" 
        fill="#0F172A" 
      />

      {/* Golden Cap Tassel */}
      <path 
        d="M37 12 L39 19 C39 21 38 22 37 22" 
        stroke="#F59E0B" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
      />
      <circle cx="37" cy="22" r="1.2" fill="#D97706" />

      {/* Center cap button */}
      <circle cx="24" cy="12" r="1.5" fill="#F59E0B" />
    </svg>
  );
};

// Export as GovtEmblem as well for seamless compatibility without broken imports
export const GovtEmblem = VanavriddhiLogo;
