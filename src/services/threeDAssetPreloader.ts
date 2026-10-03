import * as THREE from 'three';
import { detectDevicePerformanceTier, QualityTier } from './deviceTier';

export interface PreloadProgress {
  progress: number; // 0.0 to 1.0
  stage: string;
  isComplete: boolean;
  isWebGLSupported: boolean;
  gpuTier: QualityTier;
  error?: string;
}

export interface PreloadResult {
  isWebGLSupported: boolean;
  gpuTier: QualityTier;
  loadTimeMs: number;
}

// Global cached preload result
let cachedPreloadResult: PreloadResult | null = null;
let preloadPromise: Promise<PreloadResult> | null = null;

/**
 * Checks whether WebGL is supported by the current environment.
 */
export function checkWebGLAvailability(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
}

/**
 * Pre-compiles Three.js shaders and initializes scene graph assets
 * to prevent frame hitching and render pipeline stalling on startup.
 */
async function precompileThreeShaders(gpuTier: QualityTier): Promise<void> {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;

  let renderer: THREE.WebGLRenderer | null = null;

  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: gpuTier === 'low' ? 'low-power' : 'high-performance',
    });

    if (gpuTier === 'high') {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 7.5, 10.5);
    camera.lookAt(0, 0, 0);

    // 1. Lights
    const ambient = new THREE.AmbientLight(0x0d131c, 0.3);
    const sun = new THREE.DirectionalLight(0xfff1d0, 2.5);
    sun.position.set(6, 10, 5);
    if (gpuTier === 'high') sun.castShadow = true;
    const blue = new THREE.DirectionalLight(0x5ed6e6, 1.2);
    blue.position.set(-6, 4, -5);
    const point = new THREE.PointLight(0xc9a227, 1.5, 14);
    point.position.set(0, 1.5, 0);

    scene.add(ambient, sun, blue, point);

    // 2. Representative Materials from ChessVerseScene3D
    const darkObsidian = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0D131C'),
      metalness: 0.88,
      roughness: 0.2,
      transparent: true,
      opacity: 1,
    });

    const warmIvory = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F2EFE7'),
      metalness: 0.1,
      roughness: 0.32,
      transparent: true,
      opacity: 1,
    });

    const sovereignGold = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F0D477'),
      emissive: new THREE.Color('#D6AF36'),
      emissiveIntensity: 0.4,
      metalness: 0.95,
      roughness: 0.15,
      transparent: true,
      opacity: 1,
    });

    const tacticalKnight = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFF5D6'),
      emissive: new THREE.Color('#E8C75A'),
      emissiveIntensity: 0.75,
      metalness: 0.85,
      roughness: 0.15,
      transparent: true,
      opacity: 1,
    });

    const boardDark = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#10151C'),
      roughness: 0.28,
      metalness: 0.65,
    });

    const boardLight = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F2EFE7'),
      roughness: 0.25,
      metalness: 0.2,
    });

    const particleBasic = new THREE.MeshBasicMaterial({
      color: 0xe8c75a,
      transparent: true,
      opacity: 0.8,
    });

    // 3. Representative Geometries
    const geometries = [
      new THREE.CylinderGeometry(0.45, 0.52, 0.24, 16),
      new THREE.SphereGeometry(0.28, 16, 12),
      new THREE.BoxGeometry(0.96, 0.04, 0.96),
      new THREE.BoxGeometry(0.32, 0.44, 0.48),
      new THREE.ConeGeometry(0.26, 0.42, 16),
      new THREE.TorusGeometry(9.2, 0.018, 8, 32),
    ];

    // Combine meshes into scene
    const materials = [
      darkObsidian,
      warmIvory,
      sovereignGold,
      tacticalKnight,
      boardDark,
      boardLight,
    ];

    geometries.forEach((geom, idx) => {
      const mat = materials[idx % materials.length];
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set((idx - 3) * 1.5, 0, 0);
      if (gpuTier === 'high') {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
      scene.add(mesh);
    });

    const particleMesh = new THREE.Mesh(geometries[1], particleBasic);
    scene.add(particleMesh);

    // Precompile WebGL pipeline shaders upfront
    renderer.compile(scene, camera);

    // Clean up temporary precompile allocations to reclaim memory
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    particleBasic.dispose();
  } catch (err) {
    console.warn('Three.js shader precompilation warning (safe fallback):', err);
  } finally {
    if (renderer) {
      renderer.dispose();
      renderer.forceContextLoss();
    }
  }
}

/**
 * Pre-checks and awaits web fonts used in ChessVerse HUD & Splash.
 */
async function preloadDisplayFonts(): Promise<void> {
  if (typeof document === 'undefined' || !('fonts' in document)) return;

  try {
    const fontPromises = [
      document.fonts.load('600 16px Cinzel'),
      document.fonts.load('500 14px "JetBrains Mono"'),
      document.fonts.load('600 18px "Space Grotesk"'),
      document.fonts.load('400 14px Manrope'),
    ];

    // Wait for fonts with a tight 800ms ceiling
    await Promise.race([
      Promise.all(fontPromises),
      new Promise((resolve) => setTimeout(resolve, 800)),
    ]);
  } catch {
    // Non-fatal font fallback
  }
}

/**
 * Warm up browser audio context capability.
 */
function warmupAudioEngine(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      // Passive check without autoplay blocking
      const isAvailable = typeof AudioCtx === 'function';
      if (!isAvailable) {
        console.info('Web Audio not supported in this client environment.');
      }
    }
  } catch {
    // Non-fatal audio fallback
  }
}

/**
 * Master 3D Asset & Runtime Preloader
 */
export function preload3DAssets(
  onProgress?: (progress: PreloadProgress) => void
): Promise<PreloadResult> {
  if (cachedPreloadResult) {
    onProgress?.({
      progress: 1.0,
      stage: 'Engine Ready',
      isComplete: true,
      isWebGLSupported: cachedPreloadResult.isWebGLSupported,
      gpuTier: cachedPreloadResult.gpuTier,
    });
    return Promise.resolve(cachedPreloadResult);
  }

  if (preloadPromise) {
    return preloadPromise;
  }

  const startTime = Date.now();

  preloadPromise = new Promise<PreloadResult>((resolve) => {
    // Safety fallback timeout: never hang loading beyond 3.2 seconds
    const safetyTimer = setTimeout(() => {
      const fallbackResult: PreloadResult = {
        isWebGLSupported: checkWebGLAvailability(),
        gpuTier: detectDevicePerformanceTier(),
        loadTimeMs: Date.now() - startTime,
      };
      cachedPreloadResult = fallbackResult;
      onProgress?.({
        progress: 1.0,
        stage: 'Engine Ready',
        isComplete: true,
        isWebGLSupported: fallbackResult.isWebGLSupported,
        gpuTier: fallbackResult.gpuTier,
      });
      resolve(fallbackResult);
    }, 3200);

    const runPreload = async () => {
      // Step 1: Probe WebGL & GPU hardware
      onProgress?.({
        progress: 0.15,
        stage: 'Inspecting GPU & Spatial Engine',
        isComplete: false,
        isWebGLSupported: false,
        gpuTier: 'medium',
      });

      const isWebGL = checkWebGLAvailability();
      const gpuTier = detectDevicePerformanceTier();

      await new Promise((r) => setTimeout(r, 60));

      // Step 2: Precompile shaders & materials
      onProgress?.({
        progress: 0.45,
        stage: 'Compiling Physical Shaders & Lighting',
        isComplete: false,
        isWebGLSupported: isWebGL,
        gpuTier,
      });

      if (isWebGL) {
        await precompileThreeShaders(gpuTier);
      }

      await new Promise((r) => setTimeout(r, 60));

      // Step 3: Typography & HUD assets
      onProgress?.({
        progress: 0.75,
        stage: 'Synchronizing Dimensional Typography',
        isComplete: false,
        isWebGLSupported: isWebGL,
        gpuTier,
      });

      await preloadDisplayFonts();

      // Step 4: Acoustics & Finalizing
      onProgress?.({
        progress: 0.92,
        stage: 'Calibrating Acoustic Synthesizer',
        isComplete: false,
        isWebGLSupported: isWebGL,
        gpuTier,
      });

      warmupAudioEngine();

      await new Promise((r) => setTimeout(r, 50));

      clearTimeout(safetyTimer);

      const result: PreloadResult = {
        isWebGLSupported: isWebGL,
        gpuTier,
        loadTimeMs: Date.now() - startTime,
      };

      cachedPreloadResult = result;

      onProgress?.({
        progress: 1.0,
        stage: 'Engine Primed & Verified',
        isComplete: true,
        isWebGLSupported: isWebGL,
        gpuTier,
      });

      // Brief frame to let UI show completion state gracefully
      await new Promise((r) => setTimeout(r, 120));
      resolve(result);
    };

    runPreload().catch((err) => {
      console.warn('Preload sequence encountered error, recovering:', err);
      clearTimeout(safetyTimer);
      const fallbackResult: PreloadResult = {
        isWebGLSupported: checkWebGLAvailability(),
        gpuTier: detectDevicePerformanceTier(),
        loadTimeMs: Date.now() - startTime,
      };
      cachedPreloadResult = fallbackResult;
      resolve(fallbackResult);
    });
  });

  return preloadPromise;
}
