import gsap from 'gsap';

export interface IntroTimelineState {
  time: number;
  progress: number; // 0.0 to 1.0
  stageNumber: string;
  stageName: string;

  // Spatial Camera Coordinates
  cameraX: number;
  cameraY: number;
  cameraZ: number;
  lookAtX: number;
  lookAtY: number;
  lookAtZ: number;
  fov: number;

  // Cinematic Lighting System
  ambientIntensity: number;
  sunIntensity: number;
  blueIntensity: number;
  goldPointIntensity: number;
  goldPointY: number;

  // 3D Geometry & Kinetic FX
  voidProgress: number;
  gridProgress: number;
  pawnOpacity: number;
  bishopOpacity: number;
  rookOpacity: number;
  knightEmergence: number;
  knightHighlight: number;
  knightMoveProgress: number;
  landingPulse: number;
  queenOpacity: number;
  kingOpacity: number;
  isKingHero: number;
  universeProgress: number;
  trajectoryOpacity: number;

  // Brand, HUD & Morph Transitions
  logoProgress: number;
  logoOpacity: number;
  logoScale: number;
  hudOpacity: number;
  dollyPassThrough: number;
  morphToDashboardProgress: number;
  splashScrimOpacity: number;
}

export interface IntroTimelineControllerOptions {
  duration?: number; // Total duration in seconds (default: 13.8s)
  isReturningUser?: boolean;
  reducedMotion?: boolean;
  onUpdate?: (state: IntroTimelineState) => void;
  onComplete?: () => void;
  onSoundCue?: (cue: string) => void;
}

export class IntroTimelineController {
  private timeline: gsap.core.Timeline | null = null;
  private state: IntroTimelineState;
  private options: IntroTimelineControllerOptions;
  private firedSoundCues: Set<string> = new Set();
  private isDestroyed = false;

  constructor(options: IntroTimelineControllerOptions = {}) {
    this.options = options;
    const baseDuration = options.reducedMotion
      ? 2.0
      : options.isReturningUser
      ? 4.5
      : (options.duration || 13.8);

    // Initial state matching absolute darkness in Scene 01: THE VOID
    this.state = {
      time: 0,
      progress: 0,
      stageNumber: 'SCENE 01',
      stageName: 'THE VOID',

      cameraX: 0,
      cameraY: 12.0,
      cameraZ: 18.0,
      lookAtX: 0,
      lookAtY: 0,
      lookAtZ: 0,
      fov: 42,

      ambientIntensity: 0.05,
      sunIntensity: 0.2,
      blueIntensity: 0.1,
      goldPointIntensity: 0.4,
      goldPointY: 0.1,

      voidProgress: 0,
      gridProgress: 0,
      pawnOpacity: 0,
      bishopOpacity: 0,
      rookOpacity: 0,
      knightEmergence: 0,
      knightHighlight: 0,
      knightMoveProgress: 0,
      landingPulse: 0,
      queenOpacity: 0,
      kingOpacity: 0,
      isKingHero: 0,
      universeProgress: 0,
      trajectoryOpacity: 0,

      logoProgress: 0,
      logoOpacity: 0,
      logoScale: 1.0,
      hudOpacity: 1.0,
      dollyPassThrough: 0,
      morphToDashboardProgress: 0,
      splashScrimOpacity: 1.0,
    };

    this.buildTimeline(baseDuration);
  }

  private buildTimeline(totalDuration: number) {
    if (this.timeline) {
      this.timeline.kill();
    }

    // Timeline normalized scale factors
    const s = totalDuration / 13.8;

    this.timeline = gsap.timeline({
      paused: true,
      onUpdate: () => {
        if (this.isDestroyed || !this.timeline) return;
        this.state.time = this.timeline.time();
        this.state.progress = this.timeline.progress();
        this.checkSoundCues(this.state.time);
        this.options.onUpdate?.(this.state);
      },
      onComplete: () => {
        if (this.isDestroyed) return;
        this.options.onComplete?.();
      },
    });

    const tl = this.timeline;

    // -------------------------------------------------------------
    // SCENE 01: THE VOID (0.0s – 2.0s * s)
    // -------------------------------------------------------------
    tl.set(this.state, {
      stageNumber: 'SCENE 01',
      stageName: 'THE VOID',
    }, 0);

    tl.to(this.state, {
      voidProgress: 1.0,
      goldPointIntensity: 1.2,
      cameraZ: 14.5,
      cameraY: 10.2,
      duration: 2.0 * s,
      ease: 'power1.inOut',
    }, 0);

    // -------------------------------------------------------------
    // SCENE 02: THE WORLD FORMS (2.0s – 4.2s * s)
    // Light passes under camera, 3D chessboard emerges progressively
    // -------------------------------------------------------------
    tl.set(this.state, {
      stageNumber: 'SCENE 02',
      stageName: 'THE WORLD FORMS',
    }, 2.0 * s);

    tl.to(this.state, {
      cameraZ: 10.5,
      cameraY: 7.2,
      gridProgress: 1.0,
      ambientIntensity: 0.28,
      sunIntensity: 2.2,
      blueIntensity: 1.0,
      goldPointIntensity: 1.8,
      goldPointY: 1.5,
      duration: 2.2 * s,
      ease: 'power2.inOut',
    }, 2.0 * s);

    // -------------------------------------------------------------
    // SCENE 03: THE GAME AWAKENS & SOVEREIGN KING (4.2s – 6.8s * s)
    // Sequential piece arrivals + King hero moment
    // -------------------------------------------------------------
    tl.set(this.state, {
      stageNumber: 'SCENE 03',
      stageName: 'THE GAME AWAKENS',
    }, 4.2 * s);

    // Camera gentle orbit toward centerpiece
    tl.to(this.state, {
      cameraX: 2.2,
      cameraY: 5.6,
      cameraZ: 8.2,
      lookAtX: 0.4,
      lookAtY: 0.4,
      lookAtZ: 0.4,
      duration: 2.6 * s,
      ease: 'sine.inOut',
    }, 4.2 * s);

    // Piece sequence
    tl.to(this.state, { pawnOpacity: 1.0, duration: 0.6 * s, ease: 'power1.out' }, 4.2 * s);
    tl.to(this.state, { bishopOpacity: 1.0, duration: 0.6 * s, ease: 'power1.out' }, 4.6 * s);
    tl.to(this.state, { rookOpacity: 1.0, duration: 0.6 * s, ease: 'power1.out' }, 5.0 * s);
    tl.to(this.state, { knightEmergence: 1.0, duration: 0.6 * s, ease: 'power1.out' }, 5.4 * s);
    tl.to(this.state, { queenOpacity: 1.0, duration: 0.6 * s, ease: 'power1.out' }, 5.7 * s);
    
    // King arrival & spotlight
    tl.to(this.state, {
      kingOpacity: 1.0,
      isKingHero: 1.0,
      sunIntensity: 3.2,
      duration: 0.8 * s,
      ease: 'power2.out',
    }, 6.0 * s);

    // -------------------------------------------------------------
    // SCENE 04: THE MOVE & ENERGY SHOCKWAVE (6.8s – 8.8s * s)
    // Knight tactical trajectory, leap, and radiant landing pulse
    // -------------------------------------------------------------
    tl.set(this.state, {
      stageNumber: 'SCENE 04',
      stageName: 'THE FIRST MOVE',
    }, 6.8 * s);

    // Knight glows & trajectory reveals
    tl.to(this.state, {
      knightHighlight: 1.0,
      trajectoryOpacity: 1.0,
      duration: 0.5 * s,
      ease: 'power1.out',
    }, 6.8 * s);

    // Knight moves along arc
    tl.to(this.state, {
      knightMoveProgress: 1.0,
      cameraX: 2.6,
      cameraY: 4.4,
      cameraZ: 6.8,
      lookAtX: 1.5,
      lookAtY: 0.3,
      lookAtZ: 1.5,
      duration: 0.9 * s,
      ease: 'power2.inOut',
    }, 7.3 * s);

    // Landing shockwave pulse
    tl.to(this.state, {
      landingPulse: 1.0,
      duration: 0.8 * s,
      ease: 'power1.out',
    }, 8.1 * s);

    // Fade trajectory after landing
    tl.to(this.state, {
      trajectoryOpacity: 0,
      duration: 0.4 * s,
    }, 8.2 * s);

    // -------------------------------------------------------------
    // SCENE 05: THE CHESS UNIVERSE (8.8s – 10.6s * s)
    // Grand camera pull-back, orbital boards and constellation grid
    // -------------------------------------------------------------
    tl.set(this.state, {
      stageNumber: 'SCENE 05',
      stageName: 'THE CHESSVERSE',
    }, 8.8 * s);

    tl.to(this.state, {
      universeProgress: 1.0,
      cameraX: 4.8,
      cameraY: 9.6,
      cameraZ: 13.8,
      lookAtX: 0,
      lookAtY: 0.4,
      lookAtZ: 0,
      duration: 1.8 * s,
      ease: 'power2.inOut',
    }, 8.8 * s);

    // -------------------------------------------------------------
    // SCENE 06: THE IDENTITY (10.6s – 12.2s * s)
    // Camera centers, logo reveals with gold edge illumination
    // -------------------------------------------------------------
    tl.set(this.state, {
      stageNumber: 'SCENE 06',
      stageName: 'THE IDENTITY',
    }, 10.6 * s);

    tl.to(this.state, {
      logoProgress: 1.0,
      logoOpacity: 1.0,
      cameraX: 0,
      cameraY: 6.4,
      cameraZ: 10.2,
      lookAtX: 0,
      lookAtY: 0.8,
      lookAtZ: 0,
      duration: 1.6 * s,
      ease: 'power2.inOut',
    }, 10.6 * s);

    // -------------------------------------------------------------
    // SCENE 07: SEAMLESS SPATIAL MORPH TO DASHBOARD (12.2s – 13.8s * s)
    // Camera passes through logo; coordinates seamlessly match the
    // dashboard hero board [0, 7.5, 10.5]; splash scrim dissolves,
    // and dashboard UI elements emerge in spatial harmony.
    // -------------------------------------------------------------
    tl.set(this.state, {
      stageNumber: 'SCENE 07',
      stageName: 'ENTER THE ARENA',
    }, 12.2 * s);

    // Logo expands and dissolves
    tl.to(this.state, {
      dollyPassThrough: 1.0,
      logoScale: 2.6,
      logoOpacity: 0,
      hudOpacity: 0,
      duration: 1.2 * s,
      ease: 'power2.in',
    }, 12.2 * s);

    // Camera and lights smoothly morph into the dashboard's initial state
    tl.to(this.state, {
      morphToDashboardProgress: 1.0,
      splashScrimOpacity: 0,
      // Target camera coordinates matching ChessCanvas hero initial viewpoint:
      cameraX: 0,
      cameraY: 7.5,
      cameraZ: 10.5,
      lookAtX: 0,
      lookAtY: 0,
      lookAtZ: 0,
      ambientIntensity: 0.35,
      sunIntensity: 2.5,
      blueIntensity: 1.2,
      duration: 1.6 * s,
      ease: 'power2.out',
    }, 12.2 * s);
  }

  private checkSoundCues(time: number) {
    if (!this.options.onSoundCue) return;

    if (time >= 0.2 && !this.firedSoundCues.has('void')) {
      this.firedSoundCues.add('void');
      this.options.onSoundCue('void');
    }
    if (time >= 2.0 && !this.firedSoundCues.has('board')) {
      this.firedSoundCues.add('board');
      this.options.onSoundCue('board');
    }
    if (time >= 4.3 && !this.firedSoundCues.has('pieces')) {
      this.firedSoundCues.add('pieces');
      this.options.onSoundCue('pieces');
    }
    if (time >= 6.0 && !this.firedSoundCues.has('king')) {
      this.firedSoundCues.add('king');
      this.options.onSoundCue('king');
    }
    if (time >= 7.3 && !this.firedSoundCues.has('knightMove')) {
      this.firedSoundCues.add('knightMove');
      this.options.onSoundCue('knightMove');
    }
    if (time >= 8.1 && !this.firedSoundCues.has('knightLand')) {
      this.firedSoundCues.add('knightLand');
      this.options.onSoundCue('knightLand');
    }
    if (time >= 8.9 && !this.firedSoundCues.has('universe')) {
      this.firedSoundCues.add('universe');
      this.options.onSoundCue('universe');
    }
    if (time >= 10.8 && !this.firedSoundCues.has('logo')) {
      this.firedSoundCues.add('logo');
      this.options.onSoundCue('logo');
    }
    if (time >= 12.4 && !this.firedSoundCues.has('entry')) {
      this.firedSoundCues.add('entry');
      this.options.onSoundCue('entry');
    }
  }

  public play() {
    this.timeline?.play();
  }

  public pause() {
    this.timeline?.pause();
  }

  public seek(progress: number) {
    this.timeline?.progress(Math.max(0, Math.min(1, progress)));
  }

  /**
   * Smoothly skips to the spatial morph transition rather than a hard cut,
   * guaranteeing continuity into the dashboard.
   */
  public skip() {
    if (!this.timeline || this.isDestroyed) return;

    const currentProg = this.timeline.progress();
    if (currentProg >= 0.88) {
      // Already near or in morph phase, just finish swiftly
      this.timeline.timeScale(3.0);
    } else {
      // Fast-forward GSAP tween directly into the morph phase
      const totalDur = this.timeline.duration();
      gsap.to(this.timeline, {
        time: totalDur,
        duration: 0.5,
        ease: 'power3.inOut',
        onComplete: () => {
          this.options.onComplete?.();
        },
      });
    }
  }

  public getState(): IntroTimelineState {
    return this.state;
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }
  }
}
