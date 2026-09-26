import React from 'react';

interface ChessVerseSymbolProps {
  className?: string;
  size?: number | string;
  glow?: boolean;
  animated?: boolean;
}

export const ChessVerseSymbol: React.FC<ChessVerseSymbolProps> = ({
  className = '',
  size = 48,
  glow = true,
  animated = false,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
      aria-label="ChessVerse Symbol"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${animated ? 'transition-transform duration-700 hover:scale-105' : ''}`}
      >
        <defs>
          {/* Sovereign Gold Gradient */}
          <linearGradient id="cvs-gold-grad" x1="20" y1="15" x2="80" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF2B2" />
            <stop offset="25%" stopColor="#E8C75A" />
            <stop offset="70%" stopColor="#C9A227" />
            <stop offset="100%" stopColor="#8A6A12" />
          </linearGradient>

          {/* Deep Chess Slate Gradient */}
          <linearGradient id="cvs-slate-grad" x1="30" y1="20" x2="70" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#252D38" />
            <stop offset="60%" stopColor="#151A21" />
            <stop offset="100%" stopColor="#0B0E13" />
          </linearGradient>

          {/* Cyan/Electric Blue Spatial Ring */}
          <linearGradient id="cvs-orbit-grad" x1="0" y1="50" x2="100" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5ED6E6" stopOpacity="0.8" />
            <stop offset="45%" stopColor="#5B8CFF" stopOpacity="0.6" />
            <stop offset="85%" stopColor="#C9A227" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#5ED6E6" stopOpacity="0.1" />
          </linearGradient>

          {/* Subtle Ambient Glow */}
          <filter id="cvs-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Back Glow */}
        {glow && (
          <circle cx="50" cy="50" r="32" fill="#C9A227" opacity="0.12" filter="url(#cvs-glow)" />
        )}

        {/* 1. Digital Spatial Orbit (Angled ellipse around the core) */}
        <ellipse
          cx="50"
          cy="50"
          rx="44"
          ry="17"
          transform="rotate(-26 50 50)"
          stroke="url(#cvs-orbit-grad)"
          strokeWidth="1.25"
          strokeDasharray="4 2"
          opacity="0.85"
          className={animated ? 'animate-[spin_18s_linear_infinite]' : ''}
          style={{ transformOrigin: '50px 50px' }}
        />
        {/* Orbital celestial node */}
        <circle cx="84" cy="34" r="2.2" fill="#5ED6E6" filter="url(#cvs-glow)">
          {animated && (
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2.4s" repeatCount="indefinite" />
          )}
        </circle>

        {/* 2. Isometric Chessboard Base Tile (Diamond perspective) */}
        <path
          d="M 50 84 L 80 69 L 50 54 L 20 69 Z"
          fill="url(#cvs-slate-grad)"
          stroke="#252D38"
          strokeWidth="1"
        />
        {/* Board Facet Division Lines */}
        <path d="M 50 54 L 50 84" stroke="#252D38" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
        <path d="M 35 61.5 L 65 76.5" stroke="#252D38" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
        <path d="M 35 76.5 L 65 61.5" stroke="#252D38" strokeWidth="0.8" strokeDasharray="1.5 1.5" />

        {/* 3. The Central Hybrid Monarch (Knight posture + King Crown Finial) */}
        {/* Neck and Mane Silhouette */}
        <path
          d="M 38 68 C 38 60 41 53 43 47 C 40 46 35 44 33 48 C 32 50 33 53 32 55 C 31 58 29 60 27 61 C 28 64 33 67 38 68 Z"
          fill="url(#cvs-gold-grad)"
          opacity="0.9"
        />

        {/* Main Sovereign Torso & Head */}
        <path
          d="M 50 25 
             C 52 25 58 28 61 33 
             C 64 38 65 44 65 52 
             C 65 60 62 66 50 68 
             C 43 68 40 64 42 54 
             C 43 47 48 40 50 36 
             C 50 32 49 28 50 25 Z"
          fill="url(#cvs-slate-grad)"
          stroke="url(#cvs-gold-grad)"
          strokeWidth="1.5"
        />

        {/* Knight Muzzle / Forehead facet */}
        <path
          d="M 50 36 C 53 38 57 40 56 46 C 53 48 49 46 47 44 Z"
          fill="url(#cvs-gold-grad)"
        />

        {/* Knight Eye Facet (Electric Blue Spark) */}
        <polygon points="56,41 59,42.5 56.5,43" fill="#5ED6E6" />

        {/* 4. Royal King Crown Crest & Cross Finial */}
        {/* Crown Base Band */}
        <path d="M 44 26 L 56 26 L 54 28 L 46 28 Z" fill="url(#cvs-gold-grad)" />

        {/* 3 Crown Points */}
        <polygon points="45,26 44,21 47,24" fill="url(#cvs-gold-grad)" />
        <polygon points="55,26 56,21 53,24" fill="url(#cvs-gold-grad)" />

        {/* Imperial King Cross at Apex */}
        <rect x="49" y="14" width="2" height="10" rx="0.5" fill="url(#cvs-gold-grad)" />
        <rect x="46" y="16.5" width="8" height="2" rx="0.5" fill="url(#cvs-gold-grad)" />
        <circle cx="50" cy="14" r="1" fill="#FFF2B2" />
      </svg>
    </div>
  );
};
