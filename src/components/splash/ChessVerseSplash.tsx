import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ChessVerseScene3D } from './ChessVerseScene3D';
import { ChessVerseLogo } from './ChessVerseLogo';
import { ChessParticleField } from './ChessParticleField';
import { ChessUniverseHUD } from './ChessUniverseHUD';
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
  const { sound, graphics } = useSettingsStore();
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

  // Check if returning user
  const isReturningUser = useRef(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const visited = localStorage.getItem('chessverse_has_visited_intro');
      if (visited && graphics.cinematicIntroOnStartup === false) {
        isReturningUser.current = true;
      }
    }
  }, [graphics.cinematicIntroOnStartup]);

  // Total Duration:
  // - Full cinematic: 12.0 seconds (12000 ms)
  // - Returning user quick version (if enabled): 3.0 seconds
  // - Reduced motion: 1.5 seconds
  const totalDuration = reducedMotion ? 1500 : (isReturningUser.current ? 3000 : 12000);

  // Sound cues fired flags
  const soundCuesRef = useRef({
    void: false,
    board: false,
    pieces: false,
    knightHop: false,
    knightLand: false,
    universe: false,
    logo: false,
  });

  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let animId: number;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const currentProgress = Math.min(1, elapsed / totalDuration);

      setProgress(currentProgress);

      // Acoustic cue triggers synced to the 12-second cinematic timeline
      if (sound.enabled && autoPlaySound) {
        // Stage 1 (0.0s - 1.5s): Void sub-bass drone
        if (currentProgress >= 0.02 && !soundCuesRef.current.void) {
          soundCuesRef.current.void = true;
          soundService.playCinematicVoid();
        }
        // Stage 2 (1.5s - 3.0s): Board emergence sweep
        if (currentProgress >= 0.14 && !soundCuesRef.current.board) {
          soundCuesRef.current.board = true;
          soundService.playBoardEmergence();
        }
        // Stage 3 (3.0s - 5.0s): Piece arrival ethereal chime
        if (currentProgress >= 0.28 && !soundCuesRef.current.pieces) {
          soundCuesRef.current.pieces = true;
          soundService.playPieceChime(1.0);
        }
        // Stage 4 (5.0s - 7.0s): Knight move & landing pulse
        if (currentProgress >= 0.47 && !soundCuesRef.current.knightHop) {
          soundCuesRef.current.knightHop = true;
          soundService.playMove();
        }
        if (currentProgress >= 0.57 && !soundCuesRef.current.knightLand) {
          soundCuesRef.current.knightLand = true;
          soundService.playCapture();
        }
        // Stage 5 (7.0s - 9.0s): Chess universe spatial swell
        if (currentProgress >= 0.60 && !soundCuesRef.current.universe) {
          soundCuesRef.current.universe = true;
          soundService.playUniverseExpansion();
        }
        // Stage 6 (9.0s - 11.0s): ChessVerse logo reveal regal chord
        if (currentProgress >= 0.77 && !soundCuesRef.current.logo) {
          soundCuesRef.current.logo = true;
          soundService.playLogoReveal();
        }
      }

      if (currentProgress < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        // Mark first visit as complete
        if (typeof window !== 'undefined') {
          localStorage.setItem('chessverse_has_visited_intro', 'true');
        }
        // Seamless exit transition into the main application dashboard
        setIsExiting(true);
        const exitTimer = setTimeout(() => {
          onComplete();
        }, 650);
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
    if (typeof window !== 'undefined') {
      localStorage.setItem('chessverse_has_visited_intro', 'true');
    }
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 280);
  };

  // Determine current active cinematic stage for telemetry HUD
  const getStageInfo = () => {
    if (progress < 0.125) return { number: 'STAGE 01', name: 'THE VOID' };
    if (progress < 0.25) return { number: 'STAGE 02', name: 'THE BOARD EMERGES' };
    if (progress < 0.42) return { number: 'STAGE 03', name: 'THE PIECES ARRIVE' };
    if (progress < 0.58) return { number: 'STAGE 04', name: 'THE FIRST MOVE' };
    if (progress < 0.75) return { number: 'STAGE 05', name: 'THE CHESS UNIVERSE' };
    if (progress < 0.92) return { number: 'STAGE 06', name: 'CHESSVERSE FORMATION' };
    return { number: 'STAGE 07', name: 'ENTERING ARENA' };
  };

  const stageInfo = getStageInfo();

  // Logo Reveal Phase:
  // Starts at progress 0.75 (9.0s), completes at 0.92 (11.0s), stays through transition
  const isLogoVisible = progress >= 0.74;
  const logoProgress = Math.max(0, Math.min(1, (progress - 0.74) / 0.18));

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#07090D] flex items-center justify-center overflow-hidden select-none transition-all duration-700 ease-out ${
        isExiting ? 'opacity-0 scale-[1.04] pointer-events-none' : 'opacity-100 scale-100'
      }`}
      aria-label="ChessVerse Cinematic Introduction"
      role="dialog"
      aria-modal="true"
    >
      {/* 1. Deep Atmospheric Spatial Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#121821] via-[#07090D] to-[#040507] opacity-85" />

      {/* 2. Stage 01: The Central Void Light Source */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-1000 ease-out"
        style={{
          width: progress < 0.2 ? `${progress * 500 + 4}px` : '460px',
          height: progress < 0.2 ? `${progress * 500 + 4}px` : '460px',
          background:
            'radial-gradient(circle, rgba(201, 162, 39, 0.28) 0%, rgba(94, 214, 230, 0.12) 42%, rgba(7, 9, 13, 0) 70%)',
          opacity: Math.max(0.2, 1 - (progress > 0.9 ? (progress - 0.9) * 8 : 0)),
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* 3. Ambient Floating Digital Chess Particles */}
      <ChessParticleField progress={progress} count={reducedMotion ? 12 : 48} />

      {/* 4. Cinematic Stage HUD & Floating Notation Guides */}
      <ChessUniverseHUD
        progress={progress}
        stageName={stageInfo.name}
        stageNumber={stageInfo.number}
      />

      {/* 5. 3D WebGL Chessboard & Multi-Stage Scene */}
      {webglSupported && !reducedMotion ? (
        <div
          className="absolute inset-0 z-10 transition-opacity duration-700"
          style={{ opacity: isExiting ? 0.35 : 1 }}
        >
          <Canvas
            shadows
            dpr={[1, 1.75]}
            camera={{ position: [0, 11, 14], fov: 42 }}
            gl={{ antialias: true, alpha: true }}
          >
            <ChessVerseScene3D progress={progress} />
          </Canvas>
        </div>
      ) : (
        /* Graceful 2D Fallback for devices without WebGL */
        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-40">
          <div className="w-64 h-64 border border-[#C9A227]/30 rounded-2xl rotate-45 transform scale-75 animate-pulse" />
        </div>
      )}

      {/* 6. Stage 06: Master Logo Reveal Overlay */}
      {isLogoVisible && (
        <div className="relative z-30 flex flex-col items-center justify-center max-w-xl px-6 animate-in fade-in duration-700">
          <ChessVerseLogo
            progress={logoProgress}
            size="lg"
            showSubtitle={true}
            tagline="YOUR MOVE • YOUR UNIVERSE"
          />
        </div>
      )}

      {/* 7. Subtle Cinematic Skip Control (Bottom-Right) */}
      <div className="absolute bottom-6 right-6 z-40">
        <button
          onClick={handleSkip}
          className="px-4 py-2 rounded-xl bg-[#121821]/85 hover:bg-[#151A21] border border-[#252D38] hover:border-[#C9A227]/60 text-[11px] font-mono tracking-wider uppercase text-[#A7B0BE] hover:text-[#F5F7FA] transition-all backdrop-blur-md flex items-center gap-2.5 cursor-pointer shadow-xl active:scale-95 group"
          title="Skip cinematic introduction (ESC)"
        >
          <span>SKIP INTRO</span>
          <span className="text-[#C9A227] transition-transform group-hover:translate-x-0.5">→</span>
          <span className="text-[9px] px-1 py-0.5 rounded bg-white/10 font-bold text-[#A7B0BE]">ESC</span>
        </button>
      </div>

      {/* 8. Minimal Hairline Timeline Progress Bar (Bottom Edge) */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#121821] z-40">
        <div
          className="h-full bg-gradient-to-r from-[#C9A227] via-[#5ED6E6] to-[#E8C75A] transition-all duration-75 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
};
