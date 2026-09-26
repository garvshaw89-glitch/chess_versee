/**
 * Centralized Animation Configuration for ChessVerse
 * All durations, easings, perspective values, and sound triggers
 */

export const ANIMATION_CONFIG = {
  // Button Interactions
  button: {
    pressDurationMs: 110,
    releaseDurationMs: 140,
    totalClickLockMs: 380, // Prevent spam double-clicks during press & transition start
    depthZ: -6, // px pushed into Z-plane
    hoverLiftZ: 5, // px lifted on hover
    particleCount: 12,
  },

  // Page Transitions
  pageTransition: {
    exitDurationMs: 260,
    curtainPeakMs: 320,
    enterDurationMs: 400,
    totalDurationMs: 620,
    depthOffsetZ: -120, // Page recedes into depth
    enterStartScale: 0.95,
  },

  // Modal 3D Animations
  modal: {
    durationMs: 320,
    startScale: 0.92,
    startTranslateZ: -160,
    startRotateX: 4, // degrees
  },

  // Context-aware metadata for pages
  pageThemes: {
    landing: {
      label: 'Returning to Citadel',
      symbol: '♔',
      pieceName: 'King',
      accentColor: '#f59e0b', // amber-500
      tagline: 'MASTER THE BOARD',
      cameraPreset: 'cinematic' as const,
    },
    play: {
      label: 'Deploying Tactical Battlefield',
      symbol: '♜',
      pieceName: 'Rook',
      accentColor: '#f59e0b',
      tagline: 'PREPARE YOUR FIRST MOVE',
      cameraPreset: 'player_w' as const,
    },
    '2player': {
      label: 'Setting Up 2-Player Battlefield',
      symbol: '⚔',
      pieceName: 'Swords',
      accentColor: '#38bdf8', // sky-400
      tagline: 'PASS & PLAY ON ONE DEVICE',
      cameraPreset: 'player_w' as const,
    },
    puzzles: {
      label: 'Assembling Tactical Puzzle',
      symbol: '♟',
      pieceName: 'Pawn',
      accentColor: '#10b981', // emerald-500
      tagline: 'FIND THE WINNING MOVE',
      cameraPreset: 'top' as const,
    },
    learn: {
      label: 'Opening Grandmaster Archives',
      symbol: '♝',
      pieceName: 'Bishop',
      accentColor: '#a855f7', // purple-500
      tagline: 'STUDY CLASSICAL STRATEGIES',
      cameraPreset: 'isometric' as const,
    },
    profile: {
      label: 'Synchronizing Player Dossier',
      symbol: '♛',
      pieceName: 'Queen',
      accentColor: '#eab308', // yellow-500
      tagline: 'CAREER STATISTICS & TROPHIES',
      cameraPreset: 'cinematic' as const,
    },
    analysis: {
      label: 'Initializing Deep Stockfish Analysis',
      symbol: '📊',
      pieceName: 'Analysis',
      accentColor: '#5ED6E6',
      tagline: 'EVALUATE EVERY VARIATION',
      cameraPreset: 'top' as const,
    },
    tournaments: {
      label: 'Connecting to Championship Brackets',
      symbol: '🏆',
      pieceName: 'Trophy',
      accentColor: '#C9A227',
      tagline: 'COMPETE IN SWISS ARENAS',
      cameraPreset: 'cinematic' as const,
    },
    leaderboard: {
      label: 'Fetching FIDE Calibration Standings',
      symbol: '🌐',
      pieceName: 'Rankings',
      accentColor: '#E8C75A',
      tagline: 'WORLD GRANDMASTER RANKINGS',
      cameraPreset: 'cinematic' as const,
    }
  }
};

/**
 * Check if the user has requested reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
