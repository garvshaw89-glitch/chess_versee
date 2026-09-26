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
  const [progress, setProgress] = useState(0); // 0.0 to 1.0 (corresponds to 14.5s)
  const [isDollyPassThrough, setIsDollyPassThrough] = useState(false);
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
  // - Full Cinematic: 14000ms (~14 seconds)
  // - Returning User Fast Version (if startup intro disabled in settings): 3500ms
  // - Reduced Motion: 1800ms
  const totalDuration = reducedMotion ? 1800 : (isReturningUser.current ? 3500 : 14000);

  // Sound cues fired flags
  const soundCuesRef = useRef({
    void: false,
    board: false,
    pieces: false,
    knightHop: false,
    knightLand: false,
    universe: false,
    logo: false,
    appEntry: false,
  });

  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let animId: number;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const currentProgress = Math.min(1, elapsed / totalDuration);

      setProgress(currentProgress);

      // Acoustic cue triggers synced to the continuous cinematic timeline
      if (sound.enabled && autoPlaySound) {
        // Scene 01 (0s - 2s): Void sub-bass drone
        if (currentProgress >= 0.02 && !soundCuesRef.current.void) {
          soundCuesRef.current.void = true;
          soundService.playCinematicVoid();
        }
        // Scene 02 (2s - 4s): Board emergence sweep
        if (currentProgress >= 0.15 && !soundCuesRef.current.board) {
          soundCuesRef.current.board = true;
          soundService.playBoardEmergence();
        }
        // Scene 03 (4s - 7s): Piece arrival ethereal chime
        if (currentProgress >= 0.28 && !soundCuesRef.current.pieces) {
          soundCuesRef.current.pieces = true;
          soundService.playPieceChime(1.0);
        }
        // Scene 04 (7s - 9s): Knight move & landing pulse
        if (currentProgress >= 0.50 && !soundCuesRef.current.knightHop) {
          soundCuesRef.current.knightHop = true;
          soundService.playMove();
        }
        if (currentProgress >= 0.60 && !soundCuesRef.current.knightLand) {
          soundCuesRef.current.knightLand = true;
          soundService.playCapture();
        }
        // Scene 05 (9s - 10.5s): Chess universe spatial swell
        if (currentProgress >= 0.63 && !soundCuesRef.current.universe) {
          soundCuesRef.current.universe = true;
          soundService.playUniverseExpansion();
        }
        // Scene 06 (10.5s - 12.5s): ChessVerse logo reveal regal chord
        if (currentProgress >= 0.75 && !soundCuesRef.current.logo) {
          soundCuesRef.current.logo = true;
          soundService.playLogoReveal();
        }
        // Scene 07 (12.5s - 15s): Soft entrance chime into the arena
        if (currentProgress >= 0.88 && !soundCuesRef.current.appEntry) {
          soundCuesRef.current.appEntry = true;
          soundService.playPieceChime(1.5);
        }
      }

      // Enter App Pass-Through Trigger: At 88% progress (12.5s)
      if (currentProgress >= 0.88 && !isDollyPassThrough) {
        setIsDollyPassThrough(true);
      }

      if (currentProgress < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        if (typeof window !== 'undefined') {
          localStorage.setItem('chessverse_has_visited_intro', 'true');
        }
        // Final seamless crossfade into main application
        setIsExiting(true);
        const exitTimer = setTimeout(() => {
          onComplete();
        }, 750);
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
  }, [totalDuration, sound.enabled, autoPlaySound, onComplete, reducedMotion, isDollyPassThrough]);

  const handleSkip = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chessverse_has_visited_intro', 'true');
    }
    // Smooth camera dolly pass-through on skip
    setIsDollyPassThrough(true);
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 450);
  };

  // Determine current active cinematic stage for telemetry HUD
  const getStageInfo = () => {
    if (progress < 0.13) return { number: 'SCENE 01', name: 'THE VOID' };
    if (progress < 0.27) return { number: 'SCENE 02', name: 'THE WORLD FORMS' };
    if (progress < 0.47) return { number: 'SCENE 03', name: 'THE GAME AWAKENS' };
    if (progress < 0.60) return { number: 'SCENE 04', name: 'THE MOVE' };
    if (progress < 0.72) return { number: 'SCENE 05', name: 'THE CHESSVERSE' };
    if (progress < 0.86) return { number: 'SCENE 06', name: 'THE IDENTITY' };
    return { number: 'SCENE 07', name: 'ENTER THE ARENA' };
  };

  const stageInfo = getStageInfo();

  // Logo Reveal Phase:
  // Starts at progress 0.72 (10.5s), completes at 0.86 (12.5s)
  const isLogoVisible = progress >= 0.72;
  const logoProgress = Math.max(0, Math.min(1, (progress - 0.72) / 0.14));

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#05070A] flex items-center justify-center overflow-hidden select-none transition-all duration-1000 ease-out ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="ChessVerse Cinematic Journey"
      role="dialog"
      aria-modal="true"
    >
      {/* 1. Deep Unified Spatial Background (#05070A) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0D131C] via-[#05070A] to-[#020305] opacity-90" />

      {/* 2. Scene 01: Physical Point of Light with Soft Falloff & Depth */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-1000 ease-out"
        style={{
          width: progress < 0.18 ? `${progress * 540 + 4}px` : '480px',
          height: progress < 0.18 ? `${progress * 540 + 4}px` : '480px',
          background:
            'radial-gradient(circle, rgba(240, 212, 119, 0.32) 0%, rgba(93, 214, 230, 0.14) 40%, rgba(5, 7, 10, 0) 70%)',
          opacity: Math.max(0.15, 1 - (progress > 0.86 ? (progress - 0.86) * 7 : 0)),
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* 3. Restrained Digital Chess Particles */}
      <ChessParticleField progress={progress} count={reducedMotion ? 12 : 44} />

      {/* 4. Cinematic Stage HUD & Floating Notation Guides */}
      <ChessUniverseHUD
        progress={progress}
        stageName={stageInfo.name}
        stageNumber={stageInfo.number}
        isDollyPassThrough={isDollyPassThrough}
      />

      {/* 5. Master Three.js Continuous Camera Shot Viewport */}
      {webglSupported && !reducedMotion ? (
        <div
          className="absolute inset-0 z-10 transition-opacity duration-1000"
          style={{ opacity: isExiting ? 0.2 : 1 }}
        >
          <Canvas
            shadows
            dpr={[1, 1.75]}
            camera={{ position: [0, 12, 18], fov: 42 }}
            gl={{ antialias: true, alpha: true }}
          >
            <ChessVerseScene3D
              progress={progress}
              isTransitioningToApp={isDollyPassThrough}
            />
          </Canvas>
        </div>
      ) : (
        /* Graceful 2D Fallback */
        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-40">
          <div className="w-64 h-64 border border-[#D6AF36]/30 rounded-2xl rotate-45 transform scale-75 animate-pulse" />
        </div>
      )}

      {/* 6. Scene 06 & 07: Master Logo Reveal & Camera Pass-Through */}
      {isLogoVisible && (
        <div className="relative z-30 flex flex-col items-center justify-center max-w-xl px-6">
          <ChessVerseLogo
            progress={logoProgress}
            size="lg"
            showSubtitle={true}
            tagline="YOUR MOVE • YOUR UNIVERSE"
            isDollyPassThrough={isDollyPassThrough}
          />
        </div>
      )}

      {/* 7. Subtle Cinematic Skip Control (Bottom-Right) */}
      <div className="absolute bottom-6 right-6 z-40">
        <button
          onClick={handleSkip}
          className="px-4 py-2 rounded-xl bg-[#0B1017]/85 hover:bg-[#121821] border border-[#252D38] hover:border-[#D6AF36]/60 text-[11px] font-mono tracking-wider uppercase text-[#8D98A8] hover:text-[#F5F7FA] transition-all backdrop-blur-md flex items-center gap-2.5 cursor-pointer shadow-xl active:scale-95 group"
          title="Skip cinematic introduction (ESC)"
        >
          <span>SKIP INTRO</span>
          <span className="text-[#D6AF36] transition-transform group-hover:translate-x-0.5">→</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 font-bold text-[#8D98A8]">ESC</span>
        </button>
      </div>

      {/* 8. Minimal Hairline Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0B1017] z-40">
        <div
          className="h-full bg-gradient-to-r from-[#D6AF36] via-[#5DD6E6] to-[#F0D477] transition-all duration-75 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
};
