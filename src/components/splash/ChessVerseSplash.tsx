import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { ChessVerseScene3D } from './ChessVerseScene3D';
import { ChessVerseLogo } from './ChessVerseLogo';
import { ChessParticleField } from './ChessParticleField';
import { soundService } from '../../services/sound';
import { useSettingsStore } from '../../store/settingsStore';

interface ChessVerseSplashProps {
  onComplete: () => void;
  autoPlaySound?: boolean;
}

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const ChessVerseSplash: React.FC<ChessVerseSplashProps> = ({
  onComplete,
  autoPlaySound = true,
}) => {
  const { sound } = useSettingsStore();
  const [progress, setProgress] = useState(0); // 0.0 to 1.0
  const [isExiting, setIsExiting] = useState(false);
  const [webglSupported] = useState<boolean>(() => checkWebGLSupport());

  // Check prefers-reduced-motion
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
    }
  }, []);

  const soundPlayedRef = useRef({ knight: false, landing: false, logo: false });
  const startTimeRef = useRef<number | null>(null);

  // Total duration: 3.8 seconds for full cinematic story, or 1.2s for reduced motion
  const totalDuration = reducedMotion ? 1200 : 3800;

  useEffect(() => {
    let animId: number;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const currentProgress = Math.min(1, elapsed / totalDuration);

      setProgress(currentProgress);

      // Acoustic cue triggers
      if (sound.enabled && autoPlaySound) {
        // Knight Jump Sound
        if (currentProgress >= 0.65 && !soundPlayedRef.current.knight) {
          soundPlayedRef.current.knight = true;
          soundService.playMove();
        }
        // Landing Pulse Sound
        if (currentProgress >= 0.81 && !soundPlayedRef.current.landing) {
          soundPlayedRef.current.landing = true;
          soundService.playCapture();
        }
      }

      if (currentProgress < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        // Trigger smooth exit transition into the main application
        setIsExiting(true);
        const exitTimer = setTimeout(() => {
          onComplete();
        }, 550);
        return () => clearTimeout(exitTimer);
      }
    };

    animId = requestAnimationFrame(animate);

    // Keyboard shortcut to skip: ESC or SPACE
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [totalDuration, sound.enabled, autoPlaySound, onComplete, reducedMotion]);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 280);
  };

  // Phase computation
  // Frame 1: 0 - 0.20 (The Void & Central Light)
  // Frame 2: 0.20 - 0.45 (Grid Emergence)
  // Frame 3: 0.45 - 0.65 (The King)
  // Frame 4: 0.65 - 0.82 (The Knight Move)
  // Frame 5: 0.82 - 1.0 (ChessVerse Formation & Logo)
  const isLogoVisible = progress >= 0.78;
  const logoProgress = Math.max(0, Math.min(1, (progress - 0.78) / 0.22));

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#07090D] flex items-center justify-center overflow-hidden transition-all duration-500 select-none ${
        isExiting ? 'opacity-0 scale-[1.03] pointer-events-none' : 'opacity-100 scale-100'
      }`}
      aria-label="ChessVerse Opening Cinematic"
      role="dialog"
      aria-modal="true"
    >
      {/* 1. Ambient Background Gradients & Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#121821] via-[#07090D] to-[#040507] opacity-80" />

      {/* Frame 01: The Central Void Light Source */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-1000 ease-out"
        style={{
          width: progress < 0.25 ? `${progress * 400 + 4}px` : '420px',
          height: progress < 0.25 ? `${progress * 400 + 4}px` : '420px',
          background: 'radial-gradient(circle, rgba(201, 162, 39, 0.25) 0%, rgba(94, 214, 230, 0.12) 40%, rgba(7, 9, 13, 0) 70%)',
          opacity: Math.max(0.2, 1 - (progress > 0.85 ? (progress - 0.85) * 4 : 0)),
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* 2. Ambient Floating Digital Chess Particles */}
      <ChessParticleField progress={progress} count={reducedMotion ? 12 : 36} />

      {/* 3. 3D WebGL Chessboard & Kinematic Piece Scene */}
      {webglSupported && !reducedMotion ? (
        <div
          className="absolute inset-0 z-10 transition-opacity duration-700"
          style={{ opacity: isExiting ? 0.4 : 1 }}
        >
          <Canvas
            shadows
            dpr={[1, 1.75]}
            camera={{ position: [0, 8, 12], fov: 42 }}
            gl={{ antialias: true, alpha: true }}
          >
            <ChessVerseScene3D progress={progress} />
          </Canvas>
        </div>
      ) : (
        /* Graceful 2D Vector Fallback for devices without WebGL or with reduced motion */
        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-40">
          <div className="w-64 h-64 border border-[#C9A227]/30 rounded-2xl rotate-45 transform scale-75 animate-pulse" />
        </div>
      )}

      {/* 4. Frame 05: Master Logo Reveal Overlay */}
      {isLogoVisible && (
        <div className="relative z-20 flex flex-col items-center justify-center max-w-lg px-6 animate-in fade-in duration-500">
          <ChessVerseLogo
            progress={logoProgress}
            size="lg"
            showSubtitle={true}
            tagline="STRATEGY • PRECISION • DIGITAL DIMENSION"
          />
        </div>
      )}

      {/* 5. Minimal Cinematic Skip Control */}
      <div className="absolute bottom-6 right-6 z-30">
        <button
          onClick={handleSkip}
          className="px-3.5 py-1.5 rounded-lg bg-[#121821]/80 hover:bg-[#151A21] border border-[#252D38] hover:border-[#C9A227]/50 text-[11px] font-mono tracking-wider uppercase text-[#A7B0BE] hover:text-[#F5F7FA] transition-all backdrop-blur-md flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
          title="Skip cinematic introduction (ESC)"
        >
          <span>Skip Cinematic</span>
          <span className="text-[9px] px-1 py-0.5 rounded bg-white/10 font-bold text-[#C9A227]">ESC</span>
        </button>
      </div>

      {/* 6. Subtle Timeline Progress Indicator (Minimal Hairline at bottom) */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#121821]">
        <div
          className="h-full bg-gradient-to-r from-[#C9A227] via-[#5ED6E6] to-[#E8C75A] transition-all duration-75 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
};
