import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type IntroStage =
  | 'INTRO_VOID'
  | 'INTRO_BOARD'
  | 'INTRO_PIECES'
  | 'INTRO_KING'
  | 'INTRO_MOVE'
  | 'INTRO_UNIVERSE'
  | 'INTRO_IDENTITY'
  | 'APP_TRANSITION';

interface ChessVerseScene3DProps {
  progress: number; // Continuous 0.0 to 1.0 (corresponds to 0s to 14.5s)
  isTransitioningToApp?: boolean;
}

// -------------------------------------------------------------
// Shared Smooth Interpolation Easing Utilities
// -------------------------------------------------------------
// Smooth hermite smoothstep
const smoothstep = (min: number, max: number, value: number) => {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
};

// -------------------------------------------------------------
// Materials Factory
// Palette: #05070A (void), #0B1017 (chassis), #D6AF36 (gold), #F0D477 (bright gold), #4D7CFE (blue), #5DD6E6 (cyan)
// -------------------------------------------------------------
const useSharedMaterials = (opacity: number) => {
  return useMemo(() => {
    const clampedOpacity = Math.max(0, Math.min(1, opacity));
    const darkObsidian = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0D131C'),
      metalness: 0.88,
      roughness: 0.2,
      transparent: true,
      opacity: clampedOpacity,
    });

    const warmIvory = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F2EFE7'),
      metalness: 0.1,
      roughness: 0.32,
      transparent: true,
      opacity: clampedOpacity,
    });

    const sovereignGold = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F0D477'),
      emissive: new THREE.Color('#D6AF36'),
      emissiveIntensity: 0.4,
      metalness: 0.95,
      roughness: 0.15,
      transparent: true,
      opacity: clampedOpacity,
    });

    return { darkObsidian, warmIvory, sovereignGold };
  }, [opacity]);
};

// -------------------------------------------------------------
// Procedural Chess Pieces (King, Queen, Rook, Bishop, Knight, Pawn)
// -------------------------------------------------------------
const KingMesh: React.FC<{
  opacity: number;
  scale: number;
  position: [number, number, number];
  isHeroHighlight?: boolean;
}> = ({ opacity, scale, position, isHeroHighlight = false }) => {
  const { darkObsidian, sovereignGold } = useSharedMaterials(opacity);

  const heroGold = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFF1BE'),
      emissive: new THREE.Color('#D6AF36'),
      emissiveIntensity: isHeroHighlight ? 0.65 : 0.35,
      metalness: 0.95,
      roughness: 0.12,
      transparent: true,
      opacity: Math.max(0, Math.min(1, opacity)),
    });
  }, [opacity, isHeroHighlight]);

  const goldMat = isHeroHighlight ? heroGold : sovereignGold;

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Base Plinth */}
      <mesh position={[0, 0.12, 0]} material={darkObsidian} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.52, 0.24, 32]} />
      </mesh>
      {/* Gold Trim Ring */}
      <mesh position={[0, 0.25, 0]} material={goldMat} castShadow>
        <cylinderGeometry args={[0.39, 0.45, 0.05, 32]} />
      </mesh>
      {/* Tapered Stem Column */}
      <mesh position={[0, 0.72, 0]} material={darkObsidian} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.33, 0.9, 32]} />
      </mesh>
      {/* Upper Collar */}
      <mesh position={[0, 1.2, 0]} material={darkObsidian} castShadow>
        <cylinderGeometry args={[0.38, 0.24, 0.22, 32]} />
      </mesh>
      {/* Gold Crown Band */}
      <mesh position={[0, 1.34, 0]} material={goldMat} castShadow>
        <torusGeometry args={[0.33, 0.045, 16, 32]} />
      </mesh>
      {/* Imperial Cross Apex */}
      <mesh position={[0, 1.55, 0]} material={goldMat} castShadow>
        <boxGeometry args={[0.08, 0.32, 0.08]} />
      </mesh>
      <mesh position={[0, 1.6, 0]} material={goldMat} castShadow>
        <boxGeometry args={[0.28, 0.08, 0.08]} />
      </mesh>
    </group>
  );
};

const QueenMesh: React.FC<{ opacity: number; scale: number; position: [number, number, number] }> = ({
  opacity,
  scale,
  position,
}) => {
  const { darkObsidian, sovereignGold } = useSharedMaterials(opacity);

  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.12, 0]} material={darkObsidian} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.48, 0.24, 24]} />
      </mesh>
      <mesh position={[0, 0.68, 0]} material={darkObsidian} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.32, 0.88, 24]} />
      </mesh>
      <mesh position={[0, 1.18, 0]} rotation={[Math.PI / 2, 0, 0]} material={sovereignGold} castShadow>
        <torusGeometry args={[0.24, 0.05, 12, 24]} />
      </mesh>
      <mesh position={[0, 1.3, 0]} material={sovereignGold} castShadow>
        <sphereGeometry args={[0.13, 20, 20]} />
      </mesh>
    </group>
  );
};

const RookMesh: React.FC<{ opacity: number; scale: number; position: [number, number, number] }> = ({
  opacity,
  scale,
  position,
}) => {
  const { darkObsidian, sovereignGold } = useSharedMaterials(opacity);

  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.1, 0]} material={darkObsidian} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.42, 0.2, 24]} />
      </mesh>
      <mesh position={[0, 0.55, 0]} material={darkObsidian} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.33, 0.7, 24]} />
      </mesh>
      <mesh position={[0, 0.95, 0]} material={sovereignGold} castShadow receiveShadow>
        <cylinderGeometry args={[0.36, 0.28, 0.12, 24]} />
      </mesh>
      <mesh position={[0, 1.08, 0]} material={darkObsidian} castShadow receiveShadow>
        <cylinderGeometry args={[0.36, 0.36, 0.16, 24, 1, true]} />
      </mesh>
    </group>
  );
};

const BishopMesh: React.FC<{ opacity: number; scale: number; position: [number, number, number] }> = ({
  opacity,
  scale,
  position,
}) => {
  const { darkObsidian, sovereignGold } = useSharedMaterials(opacity);

  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.1, 0]} material={darkObsidian} castShadow receiveShadow>
        <cylinderGeometry args={[0.36, 0.42, 0.2, 24]} />
      </mesh>
      <mesh position={[0, 0.58, 0]} material={darkObsidian} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.26, 0.6, 24]} />
      </mesh>
      <mesh position={[0, 1.15, 0]} material={darkObsidian} castShadow receiveShadow>
        <sphereGeometry args={[0.23, 20, 20]} />
      </mesh>
      <mesh position={[0, 1.42, 0]} material={sovereignGold} castShadow>
        <sphereGeometry args={[0.07, 12, 12]} />
      </mesh>
    </group>
  );
};

const KnightMesh: React.FC<{
  position: [number, number, number];
  rotationY: number;
  opacity: number;
  scale: number;
  highlight?: boolean;
}> = ({ position, rotationY, opacity, scale, highlight = false }) => {
  const { darkObsidian, sovereignGold } = useSharedMaterials(opacity);

  const highlightMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#5DD6E6'),
      emissive: new THREE.Color('#4D7CFE'),
      emissiveIntensity: highlight ? 0.7 : 0.0,
      metalness: 0.9,
      roughness: 0.16,
      transparent: true,
      opacity: Math.max(0, Math.min(1, opacity)),
    });
  }, [opacity, highlight]);

  const bodyMat = highlight ? highlightMat : darkObsidian;

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.1, 0]} material={bodyMat} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.44, 0.2, 24]} />
      </mesh>
      <mesh position={[0, 0.5, -0.04]} rotation={[0.26, 0, 0]} material={bodyMat} castShadow>
        <boxGeometry args={[0.28, 0.6, 0.36]} />
      </mesh>
      <mesh position={[0, 0.82, 0.12]} rotation={[-0.2, 0, 0]} material={bodyMat} castShadow>
        <boxGeometry args={[0.25, 0.34, 0.44]} />
      </mesh>
      <mesh position={[0, 0.72, 0.32]} rotation={[0.42, 0, 0]} material={bodyMat} castShadow>
        <boxGeometry args={[0.2, 0.22, 0.26]} />
      </mesh>
      <mesh position={[-0.08, 1.05, 0.02]} rotation={[0.2, 0, -0.2]} material={sovereignGold}>
        <coneGeometry args={[0.06, 0.2, 12]} />
      </mesh>
      <mesh position={[0.08, 1.05, 0.02]} rotation={[0.2, 0, 0.2]} material={sovereignGold}>
        <coneGeometry args={[0.06, 0.2, 12]} />
      </mesh>
      <mesh position={[0.13, 0.86, 0.22]} material={sovereignGold}>
        <sphereGeometry args={[0.03, 8, 8]} />
      </mesh>
      <mesh position={[-0.13, 0.86, 0.22]} material={sovereignGold}>
        <sphereGeometry args={[0.03, 8, 8]} />
      </mesh>
    </group>
  );
};

const PawnMesh: React.FC<{ opacity: number; scale: number; position: [number, number, number] }> = ({
  opacity,
  scale,
  position,
}) => {
  const { darkObsidian, sovereignGold } = useSharedMaterials(opacity);

  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.08, 0]} material={darkObsidian} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.36, 0.16, 20]} />
      </mesh>
      <mesh position={[0, 0.44, 0]} material={darkObsidian} castShadow receiveShadow>
        <cylinderGeometry args={[0.16, 0.24, 0.48, 20]} />
      </mesh>
      <mesh position={[0, 0.74, 0]} material={sovereignGold} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.18, 0.06, 20]} />
      </mesh>
      <mesh position={[0, 0.94, 0]} material={darkObsidian} castShadow receiveShadow>
        <sphereGeometry args={[0.22, 20, 20]} />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// Interactive 3D Chessboard Grid: Progressive Tile Materialization
// -------------------------------------------------------------
const ChessGrid3D: React.FC<{
  progress: number;
  landingPulse: number;
}> = ({ progress, landingPulse }) => {
  // Scene 02: 2.0s -> 4.0s (0.13 to 0.27). As camera glides over, tiles materialize from center out
  const boardBuildProgress = smoothstep(0.13, 0.28, progress);
  const boardY = -0.5 * (1 - boardBuildProgress);

  const tiles = useMemo(() => {
    const list: { x: number; z: number; isWhite: boolean; distToCenter: number; distToLanding: number }[] = [];
    const landingX = -0.5; // d5
    const landingZ = -0.5;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const x = c - 3.5;
        const z = r - 3.5;
        const isWhite = (r + c) % 2 === 1;
        const distToCenter = Math.hypot(x, z);
        const distToLanding = Math.hypot(x - landingX, z - landingZ);
        list.push({ x, z, isWhite, distToCenter, distToLanding });
      }
    }
    return list;
  }, []);

  return (
    <group position={[0, boardY, 0]}>
      {/* Outer Border Bezel */}
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <boxGeometry args={[8.8, 0.12, 8.8]} />
        <meshStandardMaterial
          color="#0B1017"
          roughness={0.4}
          metalness={0.75}
          transparent={true}
          opacity={boardBuildProgress * 0.98}
        />
      </mesh>

      {/* Gold Inner Perimeter Laser Line */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(8.05, 0.02, 8.05)]} />
        <lineBasicMaterial color="#D6AF36" transparent opacity={boardBuildProgress * 0.7} />
      </lineSegments>

      {/* Individual 64 Chessboard Squares */}
      {tiles.map((tile, idx) => {
        // Tiles emerge based on wave outward from center
        const tileDelay = (tile.distToCenter / 5.2) * 0.12;
        const tileAlpha = smoothstep(0.14 + tileDelay, 0.26 + tileDelay, progress);
        const tileLift = (1 - tileAlpha) * -0.4;

        // Dynamic wave ripple from Knight's landing impact
        const rippleWave =
          landingPulse > 0
            ? Math.max(
                0,
                Math.sin(Math.max(0, landingPulse * 4.2 - tile.distToLanding * 0.8)) *
                  Math.exp(-tile.distToLanding * 0.28) *
                  0.18
              )
            : 0;

        const isLandingSquare = Math.abs(tile.x - -0.5) < 0.1 && Math.abs(tile.z - -0.5) < 0.1;
        const isStartSquare = Math.abs(tile.x - 1.5) < 0.1 && Math.abs(tile.z - 1.5) < 0.1;
        const isKingSquare = Math.abs(tile.x - 0.5) < 0.1 && Math.abs(tile.z - 0.5) < 0.1;

        let tileColor = tile.isWhite ? '#F2EFE7' : '#0D131C';
        let emissiveColor = '#000000';
        let emissiveIntensity = 0;

        // Tactical highlight before jump (Scene 04: 0.46 to 0.53)
        if (progress >= 0.46 && progress < 0.53) {
          if (isStartSquare) {
            emissiveColor = '#5DD6E6';
            emissiveIntensity = 0.55;
          } else if (isLandingSquare) {
            emissiveColor = '#D6AF36';
            emissiveIntensity = 0.45;
          }
        }

        if (isLandingSquare && landingPulse > 0) {
          emissiveColor = '#5DD6E6';
          emissiveIntensity = Math.min(1, landingPulse * 1.6);
        } else if (isKingSquare) {
          emissiveColor = '#D6AF36';
          emissiveIntensity = 0.28 * boardBuildProgress;
        } else if (rippleWave > 0.04) {
          emissiveColor = '#4D7CFE';
          emissiveIntensity = rippleWave * 2.4;
        }

        return (
          <mesh
            key={idx}
            position={[tile.x, tileLift + rippleWave, tile.z]}
            receiveShadow
            castShadow={rippleWave > 0.02}
          >
            <boxGeometry args={[0.96, 0.08, 0.96]} />
            <meshStandardMaterial
              color={tileColor}
              emissive={emissiveColor}
              emissiveIntensity={emissiveIntensity}
              roughness={tile.isWhite ? 0.32 : 0.18}
              metalness={tile.isWhite ? 0.08 : 0.72}
              transparent={true}
              opacity={tileAlpha}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// -------------------------------------------------------------
// Knight Move Trajectory Arc
// -------------------------------------------------------------
const TrajectoryArc: React.FC<{ progress: number }> = ({ progress }) => {
  // Knight move takes place smoothly between 0.50 and 0.60 (7.2s to 8.7s)
  const moveT = smoothstep(0.50, 0.60, progress);

  const curve = useMemo(() => {
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(1.5, 0.05, 1.5),
      new THREE.Vector3(0.5, 1.85, 0.5), // Peak arc apex
      new THREE.Vector3(-0.5, 0.05, -0.5)
    );
  }, []);

  const linePoints = useMemo(() => curve.getPoints(42), [curve]);
  const activePointCount = Math.floor(moveT * linePoints.length);
  const activePoints = useMemo(() => linePoints.slice(0, Math.max(2, activePointCount)), [
    linePoints,
    activePointCount,
  ]);

  const lineGeo = useMemo(() => {
    if (activePoints.length < 2) return null;
    return new THREE.BufferGeometry().setFromPoints(activePoints);
  }, [activePoints]);

  // Tentative guiding line right before move (0.46 to 0.50)
  if (progress >= 0.46 && progress < 0.50) {
    const fullGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    return (
      <primitive
        object={
          new THREE.Line(
            fullGeo,
            new THREE.LineDashedMaterial({
              color: '#5DD6E6',
              dashSize: 0.25,
              gapSize: 0.12,
              transparent: true,
              opacity: 0.45,
            })
          )
        }
      />
    );
  }

  if (!lineGeo || moveT <= 0.04 || moveT >= 0.98) return null;

  return (
    <primitive
      object={
        new THREE.Line(
          lineGeo,
          new THREE.LineBasicMaterial({ color: '#5DD6E6', transparent: true, opacity: 0.85 })
        )
      }
    />
  );
};

// -------------------------------------------------------------
// Scene 05: The Chess Universe Spatial Environment
// -------------------------------------------------------------
const ChessUniverseEnvironment: React.FC<{ progress: number }> = ({ progress }) => {
  const universeAlpha = smoothstep(0.60, 0.74, progress);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06;
    }
  });

  if (universeAlpha <= 0) return null;

  return (
    <group ref={groupRef}>
      {/* 1. Distant Floating Secondary Platforms */}
      {[
        { pos: [-15, 5, -14] as [number, number, number], rot: [0.25, 0.35, -0.15] as [number, number, number], scale: 0.38 },
        { pos: [16, -4, -16] as [number, number, number], rot: [-0.18, -0.42, 0.1] as [number, number, number], scale: 0.42 },
        { pos: [-14, -6, 12] as [number, number, number], rot: [0.35, -0.15, 0.25] as [number, number, number], scale: 0.34 },
      ].map((plat, idx) => (
        <group key={idx} position={plat.pos} rotation={plat.rot} scale={[plat.scale, plat.scale, plat.scale]}>
          <mesh>
            <boxGeometry args={[8.8, 0.2, 8.8]} />
            <meshStandardMaterial
              color="#0B1017"
              wireframe
              transparent
              opacity={universeAlpha * 0.35}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(8.8, 0.2, 8.8)]} />
            <lineBasicMaterial color="#4D7CFE" transparent opacity={universeAlpha * 0.45} />
          </lineSegments>
        </group>
      ))}

      {/* 2. Concentric Digital Spatial Rings */}
      <group position={[0, 1.2, 0]} rotation={[0.3, 0, 0.18]}>
        <mesh>
          <torusGeometry args={[9.2, 0.018, 16, 64]} />
          <meshBasicMaterial color="#5DD6E6" transparent opacity={universeAlpha * 0.4} />
        </mesh>
        <mesh rotation={[0.45, 0.25, 0]}>
          <torusGeometry args={[12.4, 0.015, 16, 64]} />
          <meshBasicMaterial color="#D6AF36" transparent opacity={universeAlpha * 0.35} />
        </mesh>
      </group>

      {/* 3. Celestial Orbital Node Markers */}
      {[
        { pos: [8.5, 3.2, -5] as [number, number, number], color: '#5DD6E6', r: 0.14 },
        { pos: [-9.2, 4.1, 6] as [number, number, number], color: '#F0D477', r: 0.16 },
        { pos: [5.8, -3.2, 10] as [number, number, number], color: '#4D7CFE', r: 0.12 },
      ].map((node, i) => (
        <mesh key={i} position={node.pos}>
          <sphereGeometry args={[node.r, 12, 12]} />
          <meshBasicMaterial color={node.color} transparent opacity={universeAlpha * 0.75} />
        </mesh>
      ))}
    </group>
  );
};

// -------------------------------------------------------------
// Master Continuous 3D Scene Controller
// -------------------------------------------------------------
export const ChessVerseScene3D: React.FC<ChessVerseScene3DProps> = ({
  progress,
  isTransitioningToApp = false,
}) => {
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));

  // ---------------------------------------------------------
  // UNIFIED MOTION TIMELINE (12 - 15 Seconds continuous shot):
  // 0.00 - 0.13 (0s - 2s):   THE VOID (Point of light in deep distance, slow glide forward)
  // 0.13 - 0.27 (2s - 4s):   THE WORLD FORMS (Light passes below, board tiles materialize)
  // 0.27 - 0.47 (4s - 7s):   THE GAME AWAKENS (Pawn -> Bishop -> Rook -> Knight -> Queen -> King)
  //                          At 0.40 - 0.47: King moment with controlled rim light & subtle 8° orbit
  // 0.47 - 0.60 (7s - 9s):   THE MOVE (Attention glides to Knight, smooth leap to d5, energy pulse)
  // 0.60 - 0.72 (9s - 10.5s): THE CHESSVERSE (Camera pulls back, floating secondary platforms, universe)
  // 0.72 - 0.86 (10.5s - 12.5s): THE IDENTITY (Particles & lines converge toward center)
  // 0.86 - 1.00 (12.5s - 15s): ENTER THE APP (Continuous camera dolly THROUGH logo into main board)
  // ---------------------------------------------------------

  // Piece appearance sequence
  const pawnOpacity = smoothstep(0.26, 0.31, progress);
  const bishopOpacity = smoothstep(0.29, 0.34, progress);
  const rookOpacity = smoothstep(0.32, 0.37, progress);
  const knightEmergence = smoothstep(0.35, 0.40, progress);
  const queenOpacity = smoothstep(0.38, 0.43, progress);
  const kingOpacity = smoothstep(0.40, 0.46, progress);

  // The King Moment (0.42 to 0.47): Heroic pause & rim highlight
  const isKingHeroMoment = progress >= 0.41 && progress <= 0.48;

  // Knight Jump (0.50 to 0.60):
  const knightHighlight = progress >= 0.46 && progress < 0.50;
  const knightMoveT = smoothstep(0.50, 0.60, progress);

  const startPos = new THREE.Vector3(1.5, 0.04, 1.5); // f3
  const endPos = new THREE.Vector3(-0.5, 0.04, -0.5); // d5
  const currentKnightPos = useMemo(() => {
    if (knightMoveT <= 0) return startPos;
    if (knightMoveT >= 1) return endPos;

    const x = THREE.MathUtils.lerp(startPos.x, endPos.x, knightMoveT);
    const z = THREE.MathUtils.lerp(startPos.z, endPos.z, knightMoveT);
    // Smooth parabolic arc
    const y = 4 * 1.85 * knightMoveT * (1 - knightMoveT);
    return new THREE.Vector3(x, y, z);
  }, [knightMoveT]);

  // Landing impact pulse: triggered at progress 0.60
  const landingPulse = smoothstep(0.60, 0.70, progress);

  // King scale
  const kingScale = 0.8 + 0.25 * kingOpacity;

  // ---------------------------------------------------------
  // ONE CONTINUOUS CAMERA SHOT (No hard cuts, no teleportation)
  // ---------------------------------------------------------
  useFrame(({ camera }) => {
    if (progress < 0.13) {
      // Scene 01: THE VOID (0s - 2s)
      const t = progress / 0.13;
      const z = THREE.MathUtils.lerp(18, 14, t);
      const y = THREE.MathUtils.lerp(12, 10, t);
      camera.position.set(0, y, z);
      cameraTarget.current.set(0, 0, 0);
    } else if (progress < 0.27) {
      // Scene 02: THE WORLD FORMS (2s - 4s)
      const t = (progress - 0.13) / 0.14;
      const z = THREE.MathUtils.lerp(14, 9.2, t);
      const y = THREE.MathUtils.lerp(10, 6.4, t);
      camera.position.set(0, y, z);
      cameraTarget.current.set(0, 0, 0);
    } else if (progress < 0.47) {
      // Scene 03 & THE KING MOMENT (4s - 7s)
      const t = (progress - 0.27) / 0.20;
      // Gentle cinematic orbit of 8 degrees around King at [0.5, 0, 0.5]
      const angle = t * 0.18; // ~10 degrees
      const radius = THREE.MathUtils.lerp(9.2, 7.8, t);
      const height = THREE.MathUtils.lerp(6.4, 5.2, t);

      camera.position.x = Math.sin(angle) * radius;
      camera.position.z = Math.cos(angle) * radius;
      camera.position.y = height;
      cameraTarget.current.lerp(new THREE.Vector3(0.5, 0.6, 0.5), 0.06);
    } else if (progress < 0.60) {
      // Scene 04: THE MOVE (7s - 9s)
      // Camera smoothly shifts attention from King to Knight flight
      if (knightMoveT > 0.05 && knightMoveT < 0.95) {
        cameraTarget.current.lerp(currentKnightPos, 0.12);
        camera.position.set(currentKnightPos.x + 3.0, 4.2, currentKnightPos.z + 4.5);
      } else {
        camera.position.lerp(new THREE.Vector3(2.5, 4.4, 5.6), 0.06);
        cameraTarget.current.lerp(endPos, 0.08);
      }
    } else if (progress < 0.72) {
      // Scene 05: THE CHESSVERSE (9s - 10.5s)
      // Grand pull-back revealing wide universe
      const t = (progress - 0.60) / 0.12;
      const pullDist = THREE.MathUtils.lerp(6.2, 14.8, t);
      const pullHeight = THREE.MathUtils.lerp(4.4, 9.6, t);
      const angle = THREE.MathUtils.lerp(0.2, 0.48, t);

      camera.position.x = Math.sin(angle) * pullDist;
      camera.position.z = Math.cos(angle) * pullDist;
      camera.position.y = pullHeight;
      cameraTarget.current.lerp(new THREE.Vector3(0, 0.2, 0), 0.08);
    } else if (progress < 0.86) {
      // Scene 06: THE IDENTITY (10.5s - 12.5s)
      // Camera centers, looking toward central horizon where logo forms
      const t = (progress - 0.72) / 0.14;
      const y = THREE.MathUtils.lerp(9.6, 6.2, t);
      const z = THREE.MathUtils.lerp(14.8, 10.2, t);
      const x = THREE.MathUtils.lerp(camera.position.x, 0, t);

      camera.position.set(x, y, z);
      cameraTarget.current.lerp(new THREE.Vector3(0, 1.2, 0), 0.08);
    } else {
      // Scene 07: ENTER THE APP (12.5s - 15s)
      // Continuous camera dolly THROUGH the logo plane into the active application board
      const t = (progress - 0.86) / 0.14;
      const y = THREE.MathUtils.lerp(6.2, 4.8, t);
      const z = THREE.MathUtils.lerp(10.2, 7.2, t);

      camera.position.set(0, y, z);
      cameraTarget.current.lerp(new THREE.Vector3(0, 0.2, 0), 0.1);
    }

    camera.lookAt(cameraTarget.current);
  });

  return (
    <>
      {/* Cinematic Lighting System: Warm Gold (#F0D477) + Cool Electric Blue (#4D7CFE) */}
      <ambientLight intensity={0.3} color="#0D131C" />
      <directionalLight
        position={[6, 10, 5]}
        intensity={isKingHeroMoment ? 3.0 : 2.5}
        color="#FFF1D0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <directionalLight
        position={[-6, 4, -5]}
        intensity={isKingHeroMoment ? 1.8 : 1.3}
        color="#5DD6E6"
      />
      <pointLight position={[0, 3, 0]} intensity={1.6} distance={14} color="#D6AF36" />

      {/* 3D Chessboard */}
      <ChessGrid3D progress={progress} landingPulse={landingPulse} />

      {/* Trajectory Guide for Knight */}
      <TrajectoryArc progress={progress} />

      {/* Revealed Pieces (Curated showcase line on rank 4 & 3) */}
      {/* 1. Pawn at d3 */}
      {pawnOpacity > 0 && (
        <PawnMesh opacity={pawnOpacity} scale={0.8} position={[-1.5, 0.04, 1.5]} />
      )}

      {/* 2. Bishop at c4 */}
      {bishopOpacity > 0 && (
        <BishopMesh opacity={bishopOpacity} scale={0.85} position={[-2.5, 0.04, 0.5]} />
      )}

      {/* 3. Rook at a1 */}
      {rookOpacity > 0 && (
        <RookMesh opacity={rookOpacity} scale={0.88} position={[-3.5, 0.04, 2.5]} />
      )}

      {/* 4. The Knight (f3 -> d5) */}
      {knightEmergence > 0 && (
        <KnightMesh
          position={[currentKnightPos.x, currentKnightPos.y, currentKnightPos.z]}
          rotationY={-Math.PI / 3}
          opacity={knightEmergence}
          scale={0.9}
          highlight={knightHighlight}
        />
      )}

      {/* 5. Queen at d4 */}
      {queenOpacity > 0 && (
        <QueenMesh opacity={queenOpacity} scale={0.92} position={[-0.5, 0.04, 0.5]} />
      )}

      {/* 6. The Sovereign King at e4 (Centerpiece) */}
      {kingOpacity > 0 && (
        <KingMesh
          opacity={kingOpacity}
          scale={kingScale}
          position={[0.5, 0.04, 0.5]}
          isHeroHighlight={isKingHeroMoment}
        />
      )}

      {/* Scene 05: The Chess Universe Environment */}
      <ChessUniverseEnvironment progress={progress} />
    </>
  );
};
