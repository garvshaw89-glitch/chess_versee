import React from 'react';
import { ChessVerseSymbol } from './ChessVerseSymbol';

interface ChessVerseLogoProps {
  progress?: number; // 0 to 1
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  tagline?: string;
}

export const ChessVerseLogo: React.FC<ChessVerseLogoProps> = ({
  progress = 1,
  size = 'lg',
  showSubtitle = true,
  className = '',
  tagline = 'STRATEGY • PRECISION • DIGITAL DIMENSION',
}) => {
  // Dimensions and typography scales
  const sizeConfig = {
    sm: { symbol: 28, text: 'text-lg', letterSpacing: 'tracking-[0.18em]', gap: 'gap-2.5', sub: 'text-[9px]' },
    md: { symbol: 40, text: 'text-2xl', letterSpacing: 'tracking-[0.24em]', gap: 'gap-3.5', sub: 'text-[10px]' },
    lg: { symbol: 64, text: 'text-4xl sm:text-5xl', letterSpacing: 'tracking-[0.26em]', gap: 'gap-5', sub: 'text-xs' },
    xl: { symbol: 88, text: 'text-5xl sm:text-6xl md:text-7xl', letterSpacing: 'tracking-[0.28em]', gap: 'gap-6', sub: 'text-xs sm:text-sm' },
  }[size];

  // Stage animation interpolation
  // 0.0 - 0.4: Symbol emergence
  // 0.4 - 0.7: CHESS text reveal
  // 0.7 - 0.9: VERSE text reveal + orbit
  // 0.9 - 1.0: Tagline reveal
  const symbolOpacity = Math.min(1, progress / 0.4);
  const symbolScale = 0.85 + Math.min(0.15, (progress / 0.4) * 0.15);

  const chessOpacity = progress < 0.35 ? 0 : Math.min(1, (progress - 0.35) / 0.3);
  const chessY = progress < 0.35 ? 12 : Math.max(0, 12 - ((progress - 0.35) / 0.3) * 12);

  const verseOpacity = progress < 0.6 ? 0 : Math.min(1, (progress - 0.6) / 0.3);
  const verseY = progress < 0.6 ? 12 : Math.max(0, 12 - ((progress - 0.6) / 0.3) * 12);

  const subtitleOpacity = progress < 0.85 ? 0 : Math.min(1, (progress - 0.85) / 0.15);

  return (
    <div className={`flex flex-col items-center justify-center text-center select-none relative ${className}`}>
      {/* Subtle Orbital Ring behind the logo */}
      <div
        className="absolute -inset-10 pointer-events-none flex items-center justify-center transition-opacity duration-1000"
        style={{ opacity: verseOpacity * 0.45 }}
      >
        <div className="w-[125%] h-24 rounded-full border border-cyan-400/25 -rotate-6 scale-y-50 animate-[spin_24s_linear_infinite]" />
        <div className="absolute w-[110%] h-28 rounded-full border border-amber-400/20 rotate-12 scale-y-45 animate-[spin_32s_linear_infinite_reverse]" />
      </div>

      {/* Symbol Component */}
      <div
        style={{
          opacity: symbolOpacity,
          transform: `scale(${symbolScale})`,
          transition: 'transform 0.4s ease-out, opacity 0.4s ease-out',
        }}
        className="relative mb-3 sm:mb-4"
      >
        <ChessVerseSymbol size={sizeConfig.symbol} glow={true} animated={true} />
      </div>

      {/* Brand Wordmark with Asymmetric Weight: CHESS (Medium Ivory) + VERSE (Bold Gold) */}
      <div className={`relative flex items-center justify-center ${sizeConfig.text} font-display uppercase font-bold leading-none`}>
        {/* "CHESS" */}
        <span
          style={{
            opacity: chessOpacity,
            transform: `translate3d(0, ${chessY}px, 0)`,
            transition: 'transform 0.35s ease-out, opacity 0.35s ease-out',
          }}
          className="text-[#F5F7FA] font-medium tracking-[0.16em] drop-shadow-md"
        >
          CHESS
        </span>

        {/* Space divider */}
        <span className="w-1.5 sm:w-2" />

        {/* "VERSE" with Gold Gradient and Cosmic Highlight */}
        <span
          style={{
            opacity: verseOpacity,
            transform: `translate3d(0, ${verseY}px, 0)`,
            transition: 'transform 0.35s ease-out, opacity 0.35s ease-out',
          }}
          className="relative font-black tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-r from-[#FFF2B2] via-[#E8C75A] to-[#C9A227] drop-shadow-[0_0_20px_rgba(201,162,39,0.3)]"
        >
          VERSE
          {/* Subtle light glint accent point */}
          <span className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-[#5ED6E6] shadow-[0_0_8px_#5ED6E6] opacity-80" />
        </span>
      </div>

      {/* Subtitle / Tagline */}
      {showSubtitle && (
        <div
          style={{
            opacity: subtitleOpacity,
            transition: 'opacity 0.5s ease-out',
          }}
          className={`mt-3 sm:mt-4 font-mono ${sizeConfig.sub} tracking-[0.3em] uppercase text-[#A7B0BE] flex items-center justify-center gap-2`}
        >
          <span className="w-6 h-px bg-gradient-to-r from-transparent to-[#C9A227]/60" />
          <span>{tagline}</span>
          <span className="w-6 h-px bg-gradient-to-l from-transparent to-[#C9A227]/60" />
        </div>
      )}
    </div>
  );
};
