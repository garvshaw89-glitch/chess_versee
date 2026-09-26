import React, { useMemo } from 'react';

interface ChessUniverseHUDProps {
  progress: number; // 0.0 to 1.0 (corresponds to 0s to 12s)
  stageName: string;
  stageNumber: string;
}

export const ChessUniverseHUD: React.FC<ChessUniverseHUDProps> = ({
  progress,
  stageName,
  stageNumber,
}) => {
  // Stage 5 (Universe expansion, 7.0s - 9.0s -> 0.58 to 0.75) floating notations
  const universeAlpha = Math.max(0, Math.min(1, (progress - 0.58) / 0.12));
  const isLogoStage = progress >= 0.75;

  const notations = useMemo(() => [
    { text: '1. e4 e5', top: '22%', left: '14%', delay: '0s' },
    { text: '2. Nf3 Nc6', top: '34%', right: '12%', delay: '0.4s' },
    { text: '3. Bb5 a6', top: '68%', left: '16%', delay: '0.8s' },
    { text: '4. Ba4 Nf6', top: '78%', right: '15%', delay: '1.2s' },
    { text: 'ELO 2882 // STOCKFISH 17', top: '18%', right: '18%', delay: '0.6s' },
    { text: 'DEPTH 38 // EVAL +0.45', bottom: '24%', left: '20%', delay: '1.0s' },
  ], []);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden select-none">
      {/* 1. Subtle Stage Indicator (Top-Left corner) */}
      <div className="absolute top-6 left-6 flex items-center gap-3 font-mono text-[11px] text-[#A7B0BE]/70">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E8C75A] animate-pulse" />
        <span className="text-[#C9A227] font-bold">{stageNumber}</span>
        <span className="text-white/20">/</span>
        <span className="tracking-[0.2em] uppercase">{stageName}</span>
      </div>

      {/* 2. Floating Chess Universe Notations (7.0s to 9.5s) */}
      {universeAlpha > 0 && !isLogoStage && (
        <div
          className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
          style={{ opacity: universeAlpha * 0.7 }}
        >
          {notations.map((note, idx) => (
            <div
              key={idx}
              className="absolute font-mono text-[10px] sm:text-xs text-[#5ED6E6]/60 tracking-widest px-2.5 py-1 rounded bg-[#0D1117]/40 border border-[#5ED6E6]/20 backdrop-blur-[2px] transition-all animate-pulse"
              style={{
                top: note.top,
                bottom: (note as any).bottom,
                left: note.left,
                right: note.right,
                animationDuration: '3s',
              }}
            >
              {note.text}
            </div>
          ))}

          {/* Abstract Dimension Coordinate Crosshairs */}
          <div className="absolute top-1/4 left-1/3 w-8 h-8 border-l border-t border-[#5ED6E6]/20 pointer-events-none" />
          <div className="absolute bottom-1/3 right-1/4 w-8 h-8 border-r border-b border-[#E8C75A]/20 pointer-events-none" />
        </div>
      )}

      {/* 3. Subtle Timestamp Gauge (Top-Right) */}
      <div className="absolute top-6 right-24 sm:right-32 font-mono text-[10px] text-[#667080] tracking-widest">
        <span>T+{(progress * 12).toFixed(1)}s</span>
      </div>
    </div>
  );
};
