import React, { useEffect, useState } from 'react';

interface InitialLoaderProps {
  onComplete?: () => void;
}

export const InitialLoader: React.FC<InitialLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // Check if session has already displayed the loader
    const hasLoaded = sessionStorage.getItem('chessverse_initial_loaded');
    if (hasLoaded) {
      setIsMounted(false);
      onComplete?.();
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFading(true);
            setTimeout(() => {
              setIsMounted(false);
              sessionStorage.setItem('chessverse_initial_loaded', 'true');
              onComplete?.();
            }, 380);
          }, 120);
          return 100;
        }
        const delta = Math.floor(Math.random() * 25) + 15;
        return Math.min(prev + delta, 100);
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#08080a] flex flex-col items-center justify-center transition-opacity duration-300 ease-out select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-6 max-w-xs w-full px-6">
        {/* Sculptural Monogram */}
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center shadow-2xl">
            <span className="font-brand text-2xl text-amber-400 font-serif">♔</span>
          </div>
          <div className="absolute inset-0 rounded-2xl bg-amber-500/10 blur-xl animate-pulse pointer-events-none" />
        </div>

        {/* Wordmark and Subtitle */}
        <div className="text-center">
          <h2 className="font-brand text-lg font-bold tracking-[0.2em] text-neutral-100">
            CHESSVERSE
          </h2>
          <p className="text-[11px] font-mono tracking-widest uppercase text-neutral-400 mt-1">
            Engine Initialization
          </p>
        </div>

        {/* Precision Progress Bar */}
        <div className="w-full">
          <div className="w-full h-0.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2 text-[10px] font-mono text-neutral-400">
            <span>READY</span>
            <span className="tabular-nums text-neutral-300">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
