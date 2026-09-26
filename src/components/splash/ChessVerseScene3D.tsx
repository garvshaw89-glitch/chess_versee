import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { IntroTimelineState } from './IntroTimelineController';

interface ChessVerseScene3DProps {
  progress?: number;
  timelineState?: IntroTimelineState;
  isTransitioningToApp?: boolean;
}

// -------------------------------------------------------------
// Materials Factory
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
// Procedural Chess Pieces
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
      {/* Lower Waist */}
      <mesh position={[0, 0.65, 0]} material={darkObsidian} castShadow>
        <cylinderGeometry args={[0.26, 0.38, 0.75, 32]} />
      </mesh>
      {/* Upper Collar */}
      <mesh position={[0, 1.15, 0]} material={goldMat} castShadow>
        <cylinderGeometry args={[0.36, 0.26, 0.25, 32]} />
      </mesh>
      {/* Head Sphere */}
      <mesh position={[0, 1.45, 0]} material={darkObsidian} castShadow>
        <sphereGeometry args={[0.28, 32, 24]} />
      </mesh>
      {/* Sovereign Crown Cross */}
      <group position={[0, 1.82, 0]}>
        <mesh material={goldMat}>
          <boxGeometry args={[0.07, 0.34, 0.07]} />
        </mesh>
        <mesh position={[0, 0.06, 0]} material={goldMat}>
          <boxGeometry args={[0.24, 0.07, 0.07]} />
        </mesh>
      </group>
    </group>
  );
};

const QueenMesh: React.FC<{
  opacity: number;
  scale: number;
  position: [number, number, number];
}> = ({ opacity, scale, position }) => {
  const { darkObsidian, sovereignGold } = useSharedMaterials(opacity);

  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.12, 0]} material={darkObsidian} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.48, 0.24, 32]} />
      </mesh>
      <mesh position={[0, 0.25, 0]} material={sovereignGold} castShadow>
        <cylinderGeometry args={[0.36, 0.42, 0.05, 32]} />
      </mesh>
      <mesh position={[0, 0.62, 0]} material={darkObsidian} castShadow>
        <cylinderGeometry args={[0.24, 0.35, 0.7, 32]} />
      </mesh>
      <mesh position={[0, 1.1, 0]} material={sovereignGold} castShadow>
        <cylinderGeometry args={[0.38, 0.24, 0.26, 32]} />
      </mesh>
      {/* Coronet Finial */}
      <mesh position={[0, 1.35, 0]} material={sovereignGold} castShadow>
        <sphereGeometry args={[0.12, 24, 24]} />
      </mesh>
    </group>
  );
};

const BishopMesh: React.FC<{
  opacity: number;
  scale: number;
  position: [number, number, number];
}> = ({ opacity, scale, position }) => {
  const { darkObsidian, sovereignGold } = useSharedMaterials(opacity);

  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.1, 0]} material={darkObsidian} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.44, 0.2, 32]} />
      </mesh>
      <mesh position={[0, 0.52, 0]} material={darkObsidian} castShadow>
        <cylinderGeometry args={[0.22, 0.32, 0.64, 32]} />
      </mesh>
      <mesh position={[0, 0.95, 0]} material={sovereignGold} castShadow>
        <cylinderGeometry args={[0.3, 0.22, 0.22, 32]} />
      </mesh>
      {/* Mitre head */}
      <mesh position={[0, 1.2, 0]} material={darkObsidian} castShadow>
        <coneGeometry args={[0.26, 0.42, 32]} />
      </mesh>
      <mesh position={[0, 1.45, 0]} material={sovereignGold}>
        <sphereGeometry args={[0.08, 16, 16]} />
      </mesh>
    </group>
  );
};

const RookMesh: React.FC<{
  opacity: number;
  scale: number;
  position: [number, number, number];
}> = ({ opacity, scale, position }) => {
  const { darkObsidian, sovereignGold } = useSharedMaterials(opacity);

  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.1, 0]} material={darkObsidian} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.46, 0.2, 32]} />
      </mesh>
      <mesh position={[0, 0.5, 0]} material={darkObsidian} castShadow>
        <cylinderGeometry args={[0.3, 0.38, 0.6, 32]} />
      </mesh>
      <mesh position={[0, 0.88, 0]} material={sovereignGold} castShadow>
        <cylinderGeometry args={[0.38, 0.3, 0.16, 32]} />
      </mesh>
      {/* Crenellated Turret */}
      <mesh position={[0, 1.08, 0]} material={darkObsidian} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.24, 16]} />
      </mesh>
    </group>
  );
};

const KnightMesh: React.FC<{
  opacity: number;
  scale: number;
  position: [number, number, number];
  rotationY?: number;
  highlight?: boolean;
}> = ({ opacity, scale, position, rotationY = 0, highlight = false }) => {
  const { darkObsidian, sovereignGold } = useSharedMaterials(opacity);

  const tacticalKnightMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(highlight ? '#FFF5D6' : '#F2EFE7'),
      emissive: new THREE.Color(highlight ? '#E8C75A' : '#C9A227'),
      emissiveIntensity: highlight ? 0.75 : 0.25,
      metalness: 0.85,
      roughness: 0.15,
      transparent: true,
      opacity: Math.max(0, Math.min(1, opacity)),
    });
  }, [opacity, highlight]);

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.1, 0]} material={darkObsidian} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.44, 0.2, 32]} />
      </mesh>
      <mesh position={[0, 0.22, 0]} material={sovereignGold} castShadow>
        <cylinderGeometry args={[0.32, 0.38, 0.05, 32]} />
      </mesh>
      {/* Stylized Horse Torso */}
      <mesh position={[0, 0.65, 0.08]} material={tacticalKnightMat} castShadow>
        <cylinderGeometry args={[0.26, 0.34, 0.8, 24]} />
      </mesh>
      {/* Horse Head */}
      <mesh position={[0, 1.05, 0.24]} rotation={[0.4, 0, 0]} material={tacticalKnightMat} castShadow>
        <boxGeometry args={[0.32, 0.44, 0.48]} />
      </mesh>
      {/* Mane crest */}
      <mesh position={[0, 1.15, -0.06]} material={sovereignGold} castShadow>
        <boxGeometry args={[0.1, 0.35, 0.2]} />
      </mesh>
    </group>
  );
};

const PawnMesh: React.FC<{
  opacity: number;
  scale: number;
  position: [number, number, number];
}> = ({ opacity, scale, position }) => {
  const { darkObsidian, sovereignGold } = useSharedMaterials(opacity);

  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.08, 0]} material={darkObsidian} castShadow receiveShadow>
        <cylinderGeometry args={[0.34, 0.38, 0.16, 32]} />
      </mesh>
      <mesh position={[0, 0.42, 0]} material={darkObsidian} castShadow>
        <cylinderGeometry args={[0.2, 0.28, 0.52, 32]} />
      </mesh>
      <mesh position={[0, 0.72, 0]} material={sovereignGold} castShadow>
        <cylinderGeometry args={[0.24, 0.2, 0.08, 32]} />
      </mesh>
      <mesh position={[0, 0.92, 0]} material={darkObsidian} castShadow>
        <sphereGeometry args={[0.2, 24, 24]} />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// Procedural Standard Starting Layout for Dashboard Morph
// -------------------------------------------------------------
const StandardOpeningBoard: React.FC<{ opacity: number }> = ({ opacity }) => {
  if (opacity <= 0.01) return null;

  return (
    <group>
      {/* White Pieces (Rank 1 & 2) */}
      <RookMesh opacity={opacity} scale={0.88} position={[-3.5, 0.04, 3.5]} />
      <KnightMesh opacity={opacity} scale={0.88} position={[-2.5, 0.04, 3.5]} rotationY={Math.PI / 4} />
      <BishopMesh opacity={opacity} scale={0.85} position={[-1.5, 0.04, 3.5]} />
      <QueenMesh opacity={opacity} scale={0.9} position={[-0.5, 0.04, 3.5]} />
      <KingMesh opacity={opacity} scale={0.95} position={[0.5, 0.04, 3.5]} />
      <BishopMesh opacity={opacity} scale={0.85} position={[1.5, 0.04, 3.5]} />
      <KnightMesh opacity={opacity} scale={0.88} position={[2.5, 0.04, 3.5]} rotationY={-Math.PI / 4} />
      <RookMesh opacity={opacity} scale={0.88} position={[3.5, 0.04, 3.5]} />
      {[-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5].map((x, i) => (
        <PawnMesh key={`wp-${i}`} opacity={opacity} scale={0.78} position={[x, 0.04, 2.5]} />
      ))}

      {/* Black Pieces (Rank 7 & 8) */}
      <RookMesh opacity={opacity} scale={0.88} position={[-3.5, 0.04, -3.5]} />
      <KnightMesh opacity={opacity} scale={0.88} position={[-2.5, 0.04, -3.5]} rotationY={Math.PI * 0.75} />
      <BishopMesh opacity={opacity} scale={0.85} position={[-1.5, 0.04, -3.5]} />
      <QueenMesh opacity={opacity} scale={0.9} position={[-0.5, 0.04, -3.5]} />
      <KingMesh opacity={opacity} scale={0.95} position={[0.5, 0.04, -3.5]} />
      <BishopMesh opacity={opacity} scale={0.85} position={[1.5, 0.04, -3.5]} />
      <KnightMesh opacity={opacity} scale={0.88} position={[2.5, 0.04, -3.5]} rotationY={-Math.PI * 0.75} />
      <RookMesh opacity={opacity} scale={0.88} position={[3.5, 0.04, -3.5]} />
      {[-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5].map((x, i) => (
        <PawnMesh key={`bp-${i}`} opacity={opacity} scale={0.78} position={[x, 0.04, -2.5]} />
      ))}
    </group>
  );
};

// -------------------------------------------------------------
// Dynamic 3D Chessboard
// -------------------------------------------------------------
const ChessGrid3D: React.FC<{
  progress: number;
  landingPulse: number;
}> = ({ progress, landingPulse }) => {
  const boardScale = Math.min(1, Math.max(0, (progress - 0.12) / 0.15));
  const boardAlpha = Math.min(1, Math.max(0, (progress - 0.14) / 0.13));

  const darkSquareMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#10151C'),
      roughness: 0.28,
      metalness: 0.65,
      transparent: true,
      opacity: boardAlpha,
    });
  }, [boardAlpha]);

  const lightSquareMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F2EFE7'),
      roughness: 0.25,
      metalness: 0.2,
      transparent: true,
      opacity: boardAlpha,
    });
  }, [boardAlpha]);

  const chassisMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0A0E13'),
      roughness: 0.45,
      metalness: 0.85,
      transparent: true,
      opacity: boardAlpha,
    });
  }, [boardAlpha]);

  const borderGoldMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#C9A227'),
      roughness: 0.25,
      metalness: 0.95,
      emissive: new THREE.Color('#D6AF36'),
      emissiveIntensity: 0.25,
      transparent: true,
      opacity: boardAlpha,
    });
  }, [boardAlpha]);

  const squares = useMemo(() => {
    const list: { x: number; z: number; isDark: boolean; key: string; distFromCenter: number }[] = [];
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const x = f - 3.5;
        const z = r - 3.5;
        const isDark = (r + f) % 2 === 0;
        const distFromCenter = Math.sqrt(x * x + z * z);
        list.push({ x, z, isDark, key: `${r}-${f}`, distFromCenter });
      }
    }
    return list;
  }, []);

  return (
    <group scale={[boardScale, boardScale, boardScale]}>
      {/* Outer Chassis */}
      <mesh position={[0, -0.22, 0]} material={chassisMat} receiveShadow>
        <boxGeometry args={[9.4, 0.4, 9.4]} />
      </mesh>

      {/* Gold Inlay Trim */}
      <mesh position={[0, -0.015, 0]} material={borderGoldMat}>
        <boxGeometry args={[8.5, 0.03, 8.5]} />
      </mesh>

      {/* 64 Chessboard Squares */}
      {squares.map((sq) => {
        let elev = 0;
        if (landingPulse > 0.01 && landingPulse < 0.99) {
          const waveFront = landingPulse * 6.5;
          const diff = Math.abs(sq.distFromCenter - waveFront);
          if (diff < 1.2) {
            elev = (1 - diff / 1.2) * 0.12 * Math.sin(landingPulse * Math.PI);
          }
        }

        return (
          <mesh
            key={sq.key}
            position={[sq.x, 0.02 + elev, sq.z]}
            material={sq.isDark ? darkSquareMat : lightSquareMat}
            receiveShadow
          >
            <boxGeometry args={[0.96, 0.04, 0.96]} />
          </mesh>
        );
      })}
    </group>
  );
};

// -------------------------------------------------------------
// Knight Trajectory Arc
// -------------------------------------------------------------
const TrajectoryArc: React.FC<{ progress: number }> = ({ progress }) => {
  const isVisible = progress >= 0.46 && progress <= 0.62;
  const alpha = isVisible ? (progress < 0.58 ? 1 : 1 - (progress - 0.58) / 0.04) : 0;

  const curvePoints = useMemo(() => {
    const points: [number, number, number][] = [];
    const pStart = new THREE.Vector3(1.5, 0.08, 1.5);
    const pEnd = new THREE.Vector3(-0.5, 0.08, -0.5);
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      const x = THREE.MathUtils.lerp(pStart.x, pEnd.x, t);
      const z = THREE.MathUtils.lerp(pStart.z, pEnd.z, t);
      const y = 4 * 1.85 * t * (1 - t) + 0.08;
      points.push([x, y, z]);
    }
    return points;
  }, []);

  if (alpha <= 0) return null;

  return (
    <group>
      {curvePoints.map((pt, i) => (
        <mesh key={i} position={pt}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color="#E8C75A" transparent opacity={alpha * 0.85} />
        </mesh>
      ))}
    </group>
  );
};

// -------------------------------------------------------------
// Universe Environment
// -------------------------------------------------------------
const ChessUniverseEnvironment: React.FC<{ progress: number }> = ({ progress }) => {
  const universeAlpha = Math.min(1, Math.max(0, (progress - 0.60) / 0.12));
  if (universeAlpha <= 0) return null;

  return (
    <group>
      {/* Floating secondary miniature boards */}
      <group position={[-11, 2.5, -8]} rotation={[0.4, 0.6, -0.2]} scale={[0.3, 0.3, 0.3]}>
        <mesh>
          <boxGeometry args={[8, 0.2, 8]} />
          <meshStandardMaterial color="#0A0E13" metalness={0.9} roughness={0.3} transparent opacity={universeAlpha * 0.4} />
        </mesh>
      </group>
      <group position={[12, -2, -6]} rotation={[-0.3, -0.5, 0.2]} scale={[0.35, 0.35, 0.35]}>
        <mesh>
          <boxGeometry args={[8, 0.2, 8]} />
          <meshStandardMaterial color="#0A0E13" metalness={0.9} roughness={0.3} transparent opacity={universeAlpha * 0.4} />
        </mesh>
      </group>

      {/* Spatial rings */}
      <group position={[0, 1.2, 0]} rotation={[0.3, 0, 0.18]}>
        <mesh>
          <torusGeometry args={[9.2, 0.018, 16, 64]} />
          <meshBasicMaterial color="#5ED6E6" transparent opacity={universeAlpha * 0.35} />
        </mesh>
        <mesh rotation={[0.45, 0.25, 0]}>
          <torusGeometry args={[12.4, 0.015, 16, 64]} />
          <meshBasicMaterial color="#C9A227" transparent opacity={universeAlpha * 0.3} />
        </mesh>
      </group>
    </group>
  );
};

// -------------------------------------------------------------
// Master Continuous 3D Scene
// -------------------------------------------------------------
export const ChessVerseScene3D: React.FC<ChessVerseScene3DProps> = ({
  progress = 0,
  timelineState,
}) => {
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));

  // Determine active parameters either from GSAP timelineState or fall back to progress
  const camX = timelineState ? timelineState.cameraX : 0;
  const camY = timelineState ? timelineState.cameraY : 12;
  const camZ = timelineState ? timelineState.cameraZ : 18;
  const lookX = timelineState ? timelineState.lookAtX : 0;
  const lookY = timelineState ? timelineState.lookAtY : 0;
  const lookZ = timelineState ? timelineState.lookAtZ : 0;

  const ambIntensity = timelineState ? timelineState.ambientIntensity : 0.3;
  const sunIntensity = timelineState ? timelineState.sunIntensity : 2.5;
  const blueIntensity = timelineState ? timelineState.blueIntensity : 1.2;
  const goldIntensity = timelineState ? timelineState.goldPointIntensity : 1.5;
  const goldY = timelineState ? timelineState.goldPointY : 1.5;

  const currentProg = timelineState ? timelineState.progress : progress;
  const landingPulse = timelineState ? timelineState.landingPulse : 0;
  const morphProgress = timelineState ? timelineState.morphToDashboardProgress : 0;

  // Single Continuous Camera Shot via GSAP Timeline
  useFrame(({ camera }) => {
    camera.position.set(camX, camY, camZ);
    cameraTarget.current.set(lookX, lookY, lookZ);
    camera.lookAt(cameraTarget.current);
  });

  // Knight Leap Coordinates
  const knightMoveT = timelineState ? timelineState.knightMoveProgress : 0;
  const startPos = new THREE.Vector3(1.5, 0.04, 1.5); // f3
  const endPos = new THREE.Vector3(-0.5, 0.04, -0.5); // d5
  const currentKnightPos = useMemo(() => {
    if (knightMoveT <= 0) return startPos;
    if (knightMoveT >= 1) return endPos;

    const x = THREE.MathUtils.lerp(startPos.x, endPos.x, knightMoveT);
    const z = THREE.MathUtils.lerp(startPos.z, endPos.z, knightMoveT);
    const y = 4 * 1.85 * knightMoveT * (1 - knightMoveT);
    return new THREE.Vector3(x, y, z);
  }, [knightMoveT]);

  // Showcase piece opacities (blend down when morphing into standard dashboard board)
  const showcaseFade = Math.max(0, 1 - morphProgress * 1.8);
  const pawnOpacity = (timelineState ? timelineState.pawnOpacity : 0) * showcaseFade;
  const bishopOpacity = (timelineState ? timelineState.bishopOpacity : 0) * showcaseFade;
  const rookOpacity = (timelineState ? timelineState.rookOpacity : 0) * showcaseFade;
  const knightEmergence = (timelineState ? timelineState.knightEmergence : 0) * showcaseFade;
  const knightHighlight = timelineState ? timelineState.knightHighlight > 0.5 : false;
  const queenOpacity = (timelineState ? timelineState.queenOpacity : 0) * showcaseFade;
  const kingOpacity = (timelineState ? timelineState.kingOpacity : 0) * showcaseFade;
  const isKingHero = timelineState ? timelineState.isKingHero > 0.5 : false;

  return (
    <>
      {/* Unified GSAP Lighting Setup */}
      <ambientLight intensity={ambIntensity} color="#0D131C" />
      <directionalLight
        position={[6, 10, 5]}
        intensity={sunIntensity}
        color="#FFF1D0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <directionalLight
        position={[-6, 4, -5]}
        intensity={blueIntensity}
        color="#5ED6E6"
      />
      <pointLight position={[0, goldY, 0]} intensity={goldIntensity} distance={14} color="#C9A227" />

      {/* 3D Chessboard */}
      <ChessGrid3D progress={currentProg} landingPulse={landingPulse} />

      {/* Trajectory Guide for Knight */}
      <TrajectoryArc progress={currentProg} />

      {/* Cinematic Showcase Line (Rank 4 & 3) */}
      {pawnOpacity > 0 && (
        <PawnMesh opacity={pawnOpacity} scale={0.8} position={[-1.5, 0.04, 1.5]} />
      )}
      {bishopOpacity > 0 && (
        <BishopMesh opacity={bishopOpacity} scale={0.85} position={[-2.5, 0.04, 0.5]} />
      )}
      {rookOpacity > 0 && (
        <RookMesh opacity={rookOpacity} scale={0.88} position={[-3.5, 0.04, 2.5]} />
      )}
      {knightEmergence > 0 && (
        <KnightMesh
          position={[currentKnightPos.x, currentKnightPos.y, currentKnightPos.z]}
          rotationY={-Math.PI / 3}
          opacity={knightEmergence}
          scale={0.9}
          highlight={knightHighlight}
        />
      )}
      {queenOpacity > 0 && (
        <QueenMesh opacity={queenOpacity} scale={0.92} position={[-0.5, 0.04, 0.5]} />
      )}
      {kingOpacity > 0 && (
        <KingMesh
          opacity={kingOpacity}
          scale={1.0}
          position={[0.5, 0.04, 0.5]}
          isHeroHighlight={isKingHero}
        />
      )}

      {/* Scene 07: Standard Opening Formation for seamless Dashboard Morph */}
      <StandardOpeningBoard opacity={morphProgress} />

      {/* Chess Universe Background */}
      <ChessUniverseEnvironment progress={currentProg} />
    </>
  );
};
