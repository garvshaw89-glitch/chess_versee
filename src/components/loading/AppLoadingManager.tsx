import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import {
  preload3DAssets,
  PreloadProgress,
  PreloadResult,
  checkWebGLAvailability,
} from '../../services/threeDAssetPreloader';
import { ChessVerseSymbol } from '../splash/ChessVerseSymbol';
import { QualityTier } from '../../services/deviceTier';

interface LoadingContextValue {
  isReady: boolean;
  isWebGLSupported: boolean;
  gpuTier: QualityTier;
}

const LoadingContext = createContext<LoadingContextValue>({
  isReady: false,
  isWebGLSupported: true,
  gpuTier: 'high',
});

export const useAppLoadingState = () => useContext(LoadingContext);

interface AppLoadingManagerProps {
  children: React.ReactNode;
}

export const AppLoadingManager: React.FC<AppLoadingManagerProps> = ({ children }) => {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [progressState, setProgressState] = useState<PreloadProgress>({
    progress: 0.05,
    stage: 'Initializing Engine Optics',
    isComplete: false,
    isWebGLSupported: true,
    gpuTier: 'high',
  });
  const [preloadResult, setPreloadResult] = useState<PreloadResult | null>(null);

  const completePreload = useCallback((result: PreloadResult) => {
    setPreloadResult(result);
    // Smooth fade-out before mounting main application
    setFadeOut(true);
    setTimeout(() => {
      setIsPreloaded(true);
    }, 380);
  }, []);

  useEffect(() => {
    let isMounted = true;

    preload3DAssets((p) => {
      if (!isMounted) return;
      setProgressState(p);
    })
      .then((result) => {
        if (!isMounted) return;
        completePreload(result);
      })
      .catch((err) => {
        console.warn('Preload failed, falling back:', err);
        if (!isMounted) return;
        completePreload({
          isWebGLSupported: checkWebGLAvailability(),
          gpuTier: 'medium',
          loadTimeMs: 0,
        });
      });

    return () => {
      isMounted = false;
    };
  }, [completePreload]);

  const handleForceEnter = () => {
    completePreload({
      isWebGLSupported: checkWebGLAvailability(),
      gpuTier: progressState.gpuTier,
      loadTimeMs: 0,
    });
  };

  const contextValue: LoadingContextValue = {
    isReady: isPreloaded,
    isWebGLSupported: preloadResult?.isWebGLSupported ?? progressState.isWebGLSupported,
    gpuTier: preloadResult?.gpuTier ?? progressState.gpuTier,
  };

  // When preloaded and fadeOut finished, mount the main App component
  if (isPreloaded) {
    return <LoadingContext.Provider value={contextValue}>{children}</LoadingContext.Provider>;
  }

  const percent = Math.min(100, Math.round(progressState.progress * 100));

  return (
    <LoadingContext.Provider value={contextValue}>
      <div
        className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#05070A] text-[#F5F7FA] select-none transition-opacity duration-300 ${
          fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{
          background: 'radial-gradient(ellipse at 50% 45%, #0B1017 0%, #05070A 75%, #020305 100%)',
        }}
        role="status"
        aria-live="polite"
        aria-label="Preloading 3D Chess Assets"
      >
        {/* Subtle Background Radial Gold Flare */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full pointer-events-none transition-all duration-700 ease-out"
          style={{
            background:
              'radial-gradient(circle, rgba(201, 162, 39, 0.08) 0%, rgba(94, 214, 230, 0.04) 40%, transparent 70%)',
          }}
        />

        {/* Central Core Emblem */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm w-full">
          <div className="relative mb-8">
            {/* Spinning Orbital Guide Ring */}
            <div className="absolute -inset-4 border border-[#C9A227]/20 border-dashed rounded-full animate-[spin_16s_linear_infinite]" />
            <div className="absolute -inset-7 border border-[#5ED6E6]/10 rounded-full animate-[spin_24s_linear_infinite_reverse]" />

            {/* Sovereign Chess Emblem */}
            <ChessVerseSymbol size={72} glow={true} animated={false} />
          </div>

          {/* Typography */}
          <div className="space-y-2 mb-8">
            <h1 className="text-xl font-bold tracking-[0.25em] uppercase font-display text-neutral-100 flex items-center justify-center gap-2">
              <span className="text-amber-400">CHESS</span>VERSE
            </h1>
            <p className="text-[11px] font-mono tracking-widest text-[#8D98A8] uppercase">
              {progressState.stage}
            </p>
          </div>

          {/* Precision Hairline Progress Bar */}
          <div className="w-full bg-[#121821] h-1 rounded-full overflow-hidden border border-white/5 relative mb-3">
            <div
              className="h-full bg-gradient-to-r from-[#C9A227] via-[#5ED6E6] to-[#E8C75A] transition-all duration-150 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* Progress Numerical & Diagnostics Readout */}
          <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#8D98A8]/80 mb-6">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>GPU TIER: {progressState.gpuTier.toUpperCase()}</span>
            </span>
            <span className="font-semibold text-neutral-300">{percent}%</span>
          </div>

          {/* Failsafe Bypass Action (appears if taking longer than 2.2 seconds) */}
          {progressState.progress > 0.4 && (
            <button
              onClick={handleForceEnter}
              className="text-[10px] font-mono text-[#8D98A8] hover:text-amber-300 underline underline-offset-4 cursor-pointer transition-colors pt-2"
            >
              Skip preloader &amp; launch now →
            </button>
          )}
        </div>
      </div>
    </LoadingContext.Provider>
  );
};
