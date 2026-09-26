import React, { useEffect, useState } from 'react';
import { ChessVerseSymbol } from './ChessVerseSymbol';

interface ChessVerseLoaderProps {
  progress?: number; // 0 to 100 optional
  statusText?: string;
  className?: string;
  onFinished?: () => void;
}

// 4x4 Mini Tactical Board for the Knight's Tour Loading Dance
const KNIGHT_PATH: [number, number][] = [
  [0, 0], // a1
  [1, 2], // b3
  [2, 0], // c1
  [3, 2], // d3
  [1, 1], // b2
  [3, 0], // d1
  [2, 2], // c3
  [0, 1], // a2
];

export const ChessVerseLoader: React.FC<ChessVerseLoaderProps> = ({
  progress,
  statusText = 'SYNCHRONIZING DIGITAL BOARD',
  className = '',
  onFinished,
}) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % KNIGHT_PATH.length);
    }, 450);

    return () => clearInterval(interval);
  }, []);

  const [currentR, currentC] = KNIGHT_PATH[step];

  return (
    <div className={`flex flex-col items-center justify-center gap-5 text-center select-none ${className}`}>
      {/* 4x4 Mini Tactical Board */}
      <div className="relative p-2 rounded-xl bg-[#0D1117] border border-[#252D38] shadow-2xl">
        <div className="grid grid-cols-4 grid-rows-4 gap-1 w-32 h-32">
          {Array.from({ length: 16 }).map((_, idx) => {
            const r = Math.floor(idx / 4);
            const c = idx % 4;
            const isWhite = (r + c) % 2 === 1;
            const isOccupied = currentR === r && currentC === c;

            return (
              <div
                key={idx}
                className={`relative rounded-md transition-all duration-300 flex items-center justify-center ${
                  isOccupied
                    ? 'bg-[#C9A227]/25 border border-[#E8C75A] shadow-[0_0_12px_rgba(201,162,39,0.35)]'
                    : isWhite
                    ? 'bg-[#151A21] border border-white/5'
                    : 'bg-[#0A0D12] border border-white/[0.02]'
                }`}
              >
                {/* Leaping Knight Token */}
                {isOccupied && (
                  <span className="text-sm font-serif text-[#E8C75A] transition-all transform scale-110 drop-shadow-md">
                    ♘
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Ambient Ring Glow */}
        <div className="absolute -inset-1 rounded-2xl bg-[#C9A227]/10 blur-lg pointer-events-none -z-10" />
      </div>

      {/* Status Line */}
      <div className="space-y-2">
        <div className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#A7B0BE] flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5ED6E6] animate-pulse" />
          <span>{statusText}</span>
        </div>

        {/* Optional Percentage / Gauge */}
        {typeof progress === 'number' && (
          <div className="w-36 mx-auto">
            <div className="w-full h-1 bg-[#121821] rounded-full overflow-hidden border border-[#252D38]">
              <div
                className="h-full bg-gradient-to-r from-[#C9A227] to-[#5ED6E6] transition-all duration-200"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <div className="text-[10px] font-mono text-[#667080] mt-1">
              {Math.round(progress)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
