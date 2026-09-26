import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ChessVerseScene3D } from './ChessVerseScene3D';
import { ChessVerseLogo } from './ChessVerseLogo';
import { ChessParticleField } from './ChessParticleField';
import { ChessUniverseHUD } from './ChessUniverseHUD';
import { IntroTimelineController, IntroTimelineState } from './IntroTimelineController';
import { soundService } from '../../services/sound';
import { useSettingsStore } from '../../store/settingsStore';
import { useNavigationStore } from '../../store/navigationStore';

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
  const { setSplashMorphProgress } = useNavigationStore();
  const [webglSupported] = useState<boolean>(() => checkWebGLSupport());

  // Check prefers-reduced-motion
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
    }
  }, []);

  // Check if returning user with disabled startup cinematic
  const isReturningUser = useRef(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const visited = localStorage.getItem('chessverse_has_visited_intro');
      if (visited && graphics.cinematicIntroOnStartup === false) {
        isReturningUser.current = true;
      }
    }
  }, [graphics.cinematicIntroOnStartup]);

  const controllerRef = useRef<IntroTimelineController | null>(null);
  const [state, setState] = useState<IntroTimelineState | null>(null);

  useEffect(() => {
    const controller = new IntroTimelineController({
      reducedMotion,
      isReturningUser: isReturningUser.current,
      onUpdate: (updatedState) => {
        setState({ ...updatedState });
        setSplashMorphProgress(updatedState.morphToDashboardProgress);
      },
      onComplete: () => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('chessverse_has_visited_intro', 'true');
        }
        setSplashMorphProgress(1.0);
        onComplete();
      },
      onSoundCue: (cue) => {
        if (!sound.enabled || !autoPlaySound) return;
        switch (cue) {
          case 'void':
            soundService.playCinematicVoid();
            break;
          case 'board':
            soundService.playBoardEmergence();
            break;
          case 'pieces':
            soundService.playPieceChime(1.0);
            break;
          case 'king':
            soundService.playPieceChime(1.3);
            break;
          case 'knightMove':
            soundService.playMove();
            break;
          case 'knightLand':
            soundService.playCapture();
            break;
          case 'universe':
            soundService.playUniverseExpansion();
            break;
          case 'logo':
            soundService.playLogoReveal();
            break;
          case 'entry':
            soundService.playPieceChime(1.5);
            break;
        }
      },
    });

    controllerRef.current = controller;
    setState(controller.getState());
    controller.play();

    // Keyboard shortcut to skip intro: ESC or SPACE
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      controller.destroy();
    };
  }, [reducedMotion, sound.enabled, autoPlaySound, onComplete, setSplashMorphProgress]);

  const handleSkip = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chessverse_has_visited_intro', 'true');
    }
    controllerRef.current?.skip();
  };

  if (!state) return null;

  const isDollyActive = state.dollyPassThrough > 0.05;
  const isLogoVisible = state.logoOpacity > 0.01;
  const isMorphing = state.morphToDashboardProgress > 0.05;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden select-none transition-opacity duration-300 ${
        state.splashScrimOpacity <= 0.01 ? 'pointer-events-none' : ''
      }`}
      aria-label="ChessVerse Cinematic Journey"
      role="dialog"
      aria-modal="true"
    >
      {/* 1. Deep Unified Spatial Background (#05070A) that morphs to transparent as dashboard emerges */}
      <div
        className="absolute inset-0 bg-[#05070A] transition-opacity ease-out"
        style={{ opacity: state.splashScrimOpacity }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0D131C] via-[#05070A] to-[#020305] opacity-90" />
      </div>

      {/* 2. Scene 01: Physical Point of Light with Soft Falloff & Depth */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-700 ease-out"
        style={{
          width: state.progress < 0.18 ? `${state.progress * 540 + 4}px` : '480px',
          height: state.progress < 0.18 ? `${state.progress * 540 + 4}px` : '480px',
          background:
            'radial-gradient(circle, rgba(240, 212, 119, 0.32) 0%, rgba(93, 214, 230, 0.14) 40%, rgba(5, 7, 10, 0) 70%)',
          opacity: Math.max(0, state.splashScrimOpacity * (1 - state.dollyPassThrough)),
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* 3. Restrained Digital Chess Particles */}
      <div style={{ opacity: state.splashScrimOpacity }}>
        <ChessParticleField progress={state.progress} count={reducedMotion ? 12 : 44} />
      </div>

      {/* 4. Cinematic Stage HUD & Floating Notation Guides */}
      <div style={{ opacity: state.hudOpacity }} className="transition-opacity duration-500">
        <ChessUniverseHUD
          progress={state.progress}
          stageName={state.stageName}
          stageNumber={state.stageNumber}
          isDollyPassThrough={isDollyActive}
        />
      </div>

      {/* 5. Master Three.js Continuous Camera Shot Viewport */}
      {webglSupported && !reducedMotion ? (
        <div
          className="absolute inset-0 z-10 transition-opacity duration-500 pointer-events-none"
          style={{ opacity: state.splashScrimOpacity }}
        >
          <Canvas
            shadows
            dpr={[1, 1.75]}
            camera={{ position: [state.cameraX, state.cameraY, state.cameraZ], fov: state.fov }}
            gl={{ antialias: true, alpha: true }}
          >
            <ChessVerseScene3D
              timelineState={state}
              progress={state.progress}
              isTransitioningToApp={isDollyActive}
            />
          </Canvas>
        </div>
      ) : (
        /* Graceful 2D Fallback */
        <div
          className="absolute inset-0 z-10 flex items-center justify-center opacity-40"
          style={{ opacity: state.splashScrimOpacity * 0.4 }}
        >
          <div className="w-64 h-64 border border-[#C9A227]/30 rounded-2xl rotate-45 transform scale-75 animate-pulse" />
        </div>
      )}

      {/* 6. Scene 06 & 07: Master Logo Reveal & Continuous Camera Pass-Through */}
      {isLogoVisible && (
        <div
          className="relative z-30 flex flex-col items-center justify-center max-w-xl px-6 pointer-events-none"
          style={{
            opacity: state.logoOpacity,
            transform: `scale(${state.logoScale})`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          <ChessVerseLogo
            progress={state.logoProgress}
            size="lg"
            showSubtitle={true}
            tagline="YOUR MOVE • YOUR UNIVERSE"
            isDollyPassThrough={isDollyActive}
          />
        </div>
      )}

      {/* 7. Subtle Cinematic Skip Control (Bottom-Right) */}
      {!isMorphing && (
        <div
          className="absolute bottom-6 right-6 z-40 transition-opacity duration-300"
          style={{ opacity: state.hudOpacity }}
        >
          <button
            onClick={handleSkip}
            className="px-4 py-2 rounded-xl bg-[#0B1017]/85 hover:bg-[#121821] border border-[#252D38] hover:border-[#C9A227]/60 text-[11px] font-mono tracking-wider uppercase text-[#8D98A8] hover:text-[#F5F7FA] transition-all backdrop-blur-md flex items-center gap-2.5 cursor-pointer shadow-xl active:scale-95 group"
            title="Skip cinematic introduction (ESC)"
          >
            <span>SKIP INTRO</span>
            <span className="text-[#C9A227] transition-transform group-hover:translate-x-0.5">→</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 font-bold text-[#8D98A8]">ESC</span>
          </button>
        </div>
      )}

      {/* 8. Minimal Hairline Progress Bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0B1017] z-40 transition-opacity duration-300"
        style={{ opacity: state.hudOpacity }}
      >
        <div
          className="h-full bg-gradient-to-r from-[#C9A227] via-[#5ED6E6] to-[#E8C75A] transition-all duration-75 ease-out"
          style={{ width: `${state.progress * 100}%` }}
        />
      </div>
    </div>
  );
};
