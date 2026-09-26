import React, { useMemo } from 'react';

interface ChessUniverseHUDProps {
  progress: number; // 0.0 to 1.0 (corresponds to 0s to 14.5s)
  stageName: string;
  stageNumber: string;
  isDollyPassThrough?: boolean;
}

export const ChessUniverseHUD: React.FC<ChessUniverseHUDProps> = ({
  progress,
  stageName,
  stageNumber,
  isDollyPassThrough = false,
}) => {
  // Scene 05 (Universe expansion, 9.0s - 11.0s -> 0.60 to 0.76) floating notations
  const universeAlpha = Math.max(0, Math.min(1, (progress - 0.60) / 0.12));
  const isLogoStage = progress >= 0.74;

  const notations = useMemo(
    () => [
      { text: '1. e4 e5', top: '22%', left: '12%', delay: '0s' },
      { text: '2. Nf3 Nc6', top: '34%', right: '10%', delay: '0.4s' },
      { text: '3. Bb5 a6', top: '68%', left: '14%', delay: '0.8s' },
      { text: '4. Ba4 Nf6', top: '78%', right: '14%', delay: '1.2s' },
      { text: 'ELO 2882 // STOCKFISH 17', top: '18%', right: '16%', delay: '0.6s' },
      { text: 'DEPTH 38 // EVAL +0.45', bottom: '22%', left: '18%', delay: '1.0s' },
    ],
    []
  );

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-20 overflow-hidden select-none transition-opacity duration-700 ease-out ${
        isDollyPassThrough ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* 1. Subtle Stage Indicator (Top-Left corner) */}
      <div className="absolute top-6 left-6 flex items-center gap-3 font-mono text-[11px] text-[#8D98A8]/80">
        <span className="w-1.5 h-1.5 rounded-full bg-[#F0D477] animate-pulse" />
        <span className="text-[#D6AF36] font-bold">{stageNumber}</span>
        <span className="text-white/20">/</span>
        <span className="tracking-[0.2em] uppercase">{stageName}</span>
      </div>

      {/* 2. Floating Chess Universe Spatial Notations */}
      {universeAlpha > 0 && !isLogoStage && (
        <div
          className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
          style={{ opacity: universeAlpha * 0.75 }}
        >
          {notations.map((note, idx) => (
            <div
              key={idx}
              className="absolute font-mono text-[10px] sm:text-xs text-[#5DD6E6]/70 tracking-widest px-2.5 py-1 rounded bg-[#0B1017]/60 border border-[#5DD6E6]/25 backdrop-blur-[4px] transition-all animate-pulse"
              style={{
                top: note.top,
                bottom: (note as any).bottom,
                left: note.left,
                right: note.right,
                animationDuration: '3.2s',
              }}
            >
              {note.text}
            </div>
          ))}

          {/* Coordinate Crosshairs */}
          <div className="absolute top-1/4 left-1/3 w-8 h-8 border-l border-t border-[#5DD6E6]/25 pointer-events-none" />
          <div className="absolute bottom-1/3 right-1/4 w-8 h-8 border-r border-b border-[#D6AF36]/25 pointer-events-none" />
        </div>
      )}

      {/* 3. Subtle Timestamp Gauge (Top-Right) */}
      <div className="absolute top-6 right-24 sm:right-32 font-mono text-[10px] text-[#8D98A8]/60 tracking-widest">
        <span>T+{(progress * 14.5).toFixed(1)}s</span>
      </div>
    </div>
  );
};
