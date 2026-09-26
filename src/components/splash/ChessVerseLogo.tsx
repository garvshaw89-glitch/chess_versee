import React from 'react';
import { ChessVerseSymbol } from './ChessVerseSymbol';

interface ChessVerseLogoProps {
  progress?: number; // 0 to 1
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  tagline?: string;
  isDollyPassThrough?: boolean;
}

export const ChessVerseLogo: React.FC<ChessVerseLogoProps> = ({
  progress = 1,
  size = 'lg',
  showSubtitle = true,
  className = '',
  tagline = 'YOUR MOVE • YOUR UNIVERSE',
  isDollyPassThrough = false,
}) => {
  const sizeConfig = {
    sm: { symbol: 28, text: 'text-lg', letterSpacing: 'tracking-[0.18em]', gap: 'gap-2.5', sub: 'text-[9px]' },
    md: { symbol: 40, text: 'text-2xl', letterSpacing: 'tracking-[0.24em]', gap: 'gap-3.5', sub: 'text-[10px]' },
    lg: { symbol: 64, text: 'text-4xl sm:text-5xl md:text-6xl', letterSpacing: 'tracking-[0.26em]', gap: 'gap-5', sub: 'text-xs sm:text-sm' },
    xl: { symbol: 88, text: 'text-5xl sm:text-6xl md:text-7xl', letterSpacing: 'tracking-[0.28em]', gap: 'gap-6', sub: 'text-xs sm:text-sm' },
  }[size];

  // Stage animation interpolation:
  // 0.0 - 0.35: Symbol emerges from environment
  // 0.35 - 0.65: CHESS text reveals
  // 0.65 - 0.85: VERSE text + thin orbital ring reveals
  // 0.85 - 1.00: Tagline reveals
  // When dolly pass-through occurs (12.5s - 15s), logo expands outward and fades smoothly as camera flies through
  const symbolOpacity = Math.min(1, progress / 0.35);
  const symbolScale = 0.88 + Math.min(0.12, (progress / 0.35) * 0.12);

  const chessOpacity = progress < 0.32 ? 0 : Math.min(1, (progress - 0.32) / 0.28);
  const chessY = progress < 0.32 ? 10 : Math.max(0, 10 - ((progress - 0.32) / 0.28) * 10);

  const verseOpacity = progress < 0.55 ? 0 : Math.min(1, (progress - 0.55) / 0.28);
  const verseY = progress < 0.55 ? 10 : Math.max(0, 10 - ((progress - 0.55) / 0.28) * 10);

  const subtitleOpacity = progress < 0.82 ? 0 : Math.min(1, (progress - 0.82) / 0.18);

  return (
    <div
      className={`flex flex-col items-center justify-center text-center select-none relative transition-all duration-700 ease-out ${
        isDollyPassThrough ? 'scale-[1.35] opacity-0 blur-[4px]' : 'scale-100 opacity-100'
      } ${className}`}
    >
      {/* 1. Extremely Thin Orbital Ring with Single Traveling Particle */}
      <div
        className="absolute -inset-10 pointer-events-none flex items-center justify-center transition-opacity duration-1000"
        style={{ opacity: verseOpacity * 0.55 }}
      >
        <div className="relative w-[130%] h-24 rounded-full border border-[#5DD6E6]/25 -rotate-6 scale-y-50 animate-[spin_28s_linear_infinite]">
          {/* Single traveling light particle along the orbit */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#5DD6E6] shadow-[0_0_8px_#5DD6E6]" />
        </div>
      </div>

      {/* 2. Custom Hybrid Symbol (King Crown + Knight + Digital Orbit) */}
      <div
        style={{
          opacity: symbolOpacity,
          transform: `scale(${symbolScale})`,
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease-out',
        }}
        className="relative mb-3 sm:mb-4 drop-shadow-[0_0_24px_rgba(214,175,54,0.25)]"
      >
        <ChessVerseSymbol size={sizeConfig.symbol} glow={true} animated={true} />
      </div>

      {/* 3. Wordmark: CHESS (#F5F7FA, bold) + VERSE (#D6AF36, gold accent) */}
      <div className={`relative flex items-center justify-center ${sizeConfig.text} font-display uppercase font-bold leading-none`}>
        {/* "CHESS" in Crisp Primary Text (#F5F7FA) */}
        <span
          style={{
            opacity: chessOpacity,
            transform: `translate3d(0, ${chessY}px, 0)`,
            transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease-out',
          }}
          className="text-[#F5F7FA] font-bold tracking-[0.16em] drop-shadow-md"
        >
          CHESS
        </span>

        {/* Space divider */}
        <span className="w-1.5 sm:w-2" />

        {/* "VERSE" in Refined Sovereign Gold (#D6AF36) with subtle particle glint */}
        <span
          style={{
            opacity: verseOpacity,
            transform: `translate3d(0, ${verseY}px, 0)`,
            transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease-out',
          }}
          className="relative font-black tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-r from-[#FFF1BE] via-[#F0D477] to-[#D6AF36] drop-shadow-[0_0_24px_rgba(214,175,54,0.35)]"
        >
          VERSE
          {/* Subtle light glint node */}
          <span className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-[#5DD6E6] shadow-[0_0_8px_#5DD6E6] opacity-80" />
        </span>
      </div>

      {/* 4. Brand Subtitle / Tagline */}
      {showSubtitle && (
        <div
          style={{
            opacity: subtitleOpacity,
            transition: 'opacity 0.6s ease-out',
          }}
          className={`mt-3 sm:mt-4 font-mono ${sizeConfig.sub} tracking-[0.32em] uppercase text-[#8D98A8] flex items-center justify-center gap-2`}
        >
          <span className="w-6 h-px bg-gradient-to-r from-transparent to-[#D6AF36]/60" />
          <span>{tagline}</span>
          <span className="w-6 h-px bg-gradient-to-l from-transparent to-[#D6AF36]/60" />
        </div>
      )}
    </div>
  );
};
