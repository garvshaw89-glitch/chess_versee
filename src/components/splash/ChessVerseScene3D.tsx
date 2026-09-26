import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ChessVerseScene3DProps {
  progress: number; // 0.0 to 1.0 (corresponds to 0s to 12s)
  qualityTier?: 'high' | 'medium' | 'low';
}

// -------------------------------------------------------------
// Materials Factory (Memoized for optimal WebGL performance)
// -------------------------------------------------------------
const usePieceMaterials = (opacity: number) => {
  return useMemo(() => {
    const clampedOpacity = Math.max(0, Math.min(1, opacity));
    const darkMetal = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#151A21'),
      metalness: 0.85,
      roughness: 0.22,
      transparent: true,
      opacity: clampedOpacity,
    });

    const warmIvory = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F2EFE7'),
      metalness: 0.12,
      roughness: 0.35,
      transparent: true,
      opacity: clampedOpacity,
    });

    const goldAccent = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#E8C75A'),
      emissive: new THREE.Color('#C9A227'),
      emissiveIntensity: 0.35,
      metalness: 0.95,
      roughness: 0.15,
      transparent: true,
      opacity: clampedOpacity,
    });

    return { darkMetal, warmIvory, goldAccent };
  }, [opacity]);
};

// -------------------------------------------------------------
// King 3D Procedural Mesh
// -------------------------------------------------------------
const KingMesh: React.FC<{ opacity: number; scale: number; position: [number, number, number] }> = ({
  opacity,
  scale,
  position,
}) => {
  const { darkMetal, goldAccent } = usePieceMaterials(opacity);

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Base Plinth */}
      <mesh position={[0, 0.12, 0]} material={darkMetal} castShadow receiveShadow>
        <cylinderGeometry args={[0.44, 0.5, 0.24, 28]} />
      </mesh>
      {/* Gold Trim Ring */}
      <mesh position={[0, 0.25, 0]} material={goldAccent} castShadow>
        <cylinderGeometry args={[0.38, 0.44, 0.05, 28]} />
      </mesh>
      {/* Tapered Stem Column */}
      <mesh position={[0, 0.72, 0]} material={darkMetal} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.32, 0.9, 28]} />
      </mesh>
      {/* Upper Collar */}
      <mesh position={[0, 1.2, 0]} material={darkMetal} castShadow>
        <cylinderGeometry args={[0.38, 0.24, 0.22, 28]} />
      </mesh>
      {/* Gold Crown Band */}
      <mesh position={[0, 1.34, 0]} material={goldAccent} castShadow>
        <torusGeometry args={[0.32, 0.04, 16, 28]} />
      </mesh>
      {/* Imperial Cross Apex */}
      <mesh position={[0, 1.55, 0]} material={goldAccent} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
      </mesh>
      <mesh position={[0, 1.6, 0]} material={goldAccent} castShadow>
        <boxGeometry args={[0.26, 0.08, 0.08]} />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// Queen 3D Procedural Mesh
// -------------------------------------------------------------
const QueenMesh: React.FC<{ opacity: number; scale: number; position: [number, number, number] }> = ({
  opacity,
  scale,
  position,
}) => {
  const { darkMetal, goldAccent } = usePieceMaterials(opacity);

  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.12, 0]} material={darkMetal} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.48, 0.24, 24]} />
      </mesh>
      <mesh position={[0, 0.68, 0]} material={darkMetal} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.32, 0.88, 24]} />
      </mesh>
      <mesh position={[0, 1.18, 0]} rotation={[Math.PI / 2, 0, 0]} material={goldAccent} castShadow>
        <torusGeometry args={[0.24, 0.05, 12, 24]} />
      </mesh>
      <mesh position={[0, 1.3, 0]} material={goldAccent} castShadow>
        <sphereGeometry args={[0.13, 20, 20]} />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// Rook 3D Procedural Mesh
// -------------------------------------------------------------
const RookMesh: React.FC<{ opacity: number; scale: number; position: [number, number, number] }> = ({
  opacity,
  scale,
  position,
}) => {
  const { darkMetal, goldAccent } = usePieceMaterials(opacity);

  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.1, 0]} material={darkMetal} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.42, 0.2, 24]} />
      </mesh>
      <mesh position={[0, 0.55, 0]} material={darkMetal} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.33, 0.7, 24]} />
      </mesh>
      <mesh position={[0, 0.95, 0]} material={goldAccent} castShadow receiveShadow>
        <cylinderGeometry args={[0.36, 0.28, 0.12, 24]} />
      </mesh>
      <mesh position={[0, 1.08, 0]} material={darkMetal} castShadow receiveShadow>
        <cylinderGeometry args={[0.36, 0.36, 0.16, 24, 1, true]} />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// Bishop 3D Procedural Mesh
// -------------------------------------------------------------
const BishopMesh: React.FC<{ opacity: number; scale: number; position: [number, number, number] }> = ({
  opacity,
  scale,
  position,
}) => {
  const { darkMetal, goldAccent } = usePieceMaterials(opacity);

  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.1, 0]} material={darkMetal} castShadow receiveShadow>
        <cylinderGeometry args={[0.36, 0.42, 0.2, 24]} />
      </mesh>
      <mesh position={[0, 0.58, 0]} material={darkMetal} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.26, 0.6, 24]} />
      </mesh>
      <mesh position={[0, 1.15, 0]} material={darkMetal} castShadow receiveShadow>
        <sphereGeometry args={[0.23, 20, 20]} />
      </mesh>
      <mesh position={[0, 1.42, 0]} material={goldAccent} castShadow>
        <sphereGeometry args={[0.07, 12, 12]} />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// Knight 3D Procedural Mesh
// -------------------------------------------------------------
const KnightMesh: React.FC<{
  position: [number, number, number];
  rotationY: number;
  opacity: number;
  scale: number;
  highlight?: boolean;
}> = ({ position, rotationY, opacity, scale, highlight = false }) => {
  const { darkMetal, goldAccent } = usePieceMaterials(opacity);

  const highlightMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#5ED6E6'),
      emissive: new THREE.Color('#5B8CFF'),
      emissiveIntensity: highlight ? 0.6 : 0.0,
      metalness: 0.9,
      roughness: 0.18,
      transparent: true,
      opacity: Math.max(0, Math.min(1, opacity)),
    });
  }, [opacity, highlight]);

  const bodyMat = highlight ? highlightMat : darkMetal;

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
      <mesh position={[-0.08, 1.05, 0.02]} rotation={[0.2, 0, -0.2]} material={goldAccent}>
        <coneGeometry args={[0.06, 0.2, 12]} />
      </mesh>
      <mesh position={[0.08, 1.05, 0.02]} rotation={[0.2, 0, 0.2]} material={goldAccent}>
        <coneGeometry args={[0.06, 0.2, 12]} />
      </mesh>
      <mesh position={[0.13, 0.86, 0.22]} material={goldAccent}>
        <sphereGeometry args={[0.03, 8, 8]} />
      </mesh>
      <mesh position={[-0.13, 0.86, 0.22]} material={goldAccent}>
        <sphereGeometry args={[0.03, 8, 8]} />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// Pawn 3D Procedural Mesh
// -------------------------------------------------------------
const PawnMesh: React.FC<{ opacity: number; scale: number; position: [number, number, number] }> = ({
  opacity,
  scale,
  position,
}) => {
  const { darkMetal, goldAccent } = usePieceMaterials(opacity);

  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.08, 0]} material={darkMetal} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.36, 0.16, 20]} />
      </mesh>
      <mesh position={[0, 0.44, 0]} material={darkMetal} castShadow receiveShadow>
        <cylinderGeometry args={[0.16, 0.24, 0.48, 20]} />
      </mesh>
      <mesh position={[0, 0.74, 0]} material={goldAccent} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.18, 0.06, 20]} />
      </mesh>
      <mesh position={[0, 0.94, 0]} material={darkMetal} castShadow receiveShadow>
        <sphereGeometry args={[0.22, 20, 20]} />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// Interactive 3D Chessboard Grid with Progressive Emergence & Ripple
// -------------------------------------------------------------
const ChessGrid3D: React.FC<{
  progress: number;
  landingPulse: number;
}> = ({ progress, landingPulse }) => {
  // Stage 02: Board emerges 1.5s -> 3.0s (progress 0.125 -> 0.25)
  const gridAlpha = Math.max(0, Math.min(1, (progress - 0.12) / 0.13));
  const boardY = -0.6 * (1 - gridAlpha);

  const tiles = useMemo(() => {
    const list: { x: number; z: number; isWhite: boolean; distToLanding: number }[] = [];
    const landingX = -0.5; // d5 square
    const landingZ = -0.5;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const x = c - 3.5;
        const z = r - 3.5;
        const isWhite = (r + c) % 2 === 1;
        const dist = Math.hypot(x - landingX, z - landingZ);
        list.push({ x, z, isWhite, distToLanding: dist });
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
          color="#0D1117"
          roughness={0.4}
          metalness={0.7}
          transparent={true}
          opacity={gridAlpha * 0.95}
        />
      </mesh>

      {/* Gold Inner Perimeter Laser Wire */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(8.05, 0.02, 8.05)]} />
        <lineBasicMaterial color="#C9A227" transparent opacity={gridAlpha * 0.6} />
      </lineSegments>

      {/* Individual 64 Chessboard Squares */}
      {tiles.map((tile, idx) => {
        // Dynamic ripple from Knight landing
        const wave =
          landingPulse > 0
            ? Math.max(
                0,
                Math.sin(Math.max(0, landingPulse * 4 - tile.distToLanding * 0.75)) *
                  Math.exp(-tile.distToLanding * 0.3) *
                  0.15
              )
            : 0;

        const isLandingSquare = Math.abs(tile.x - -0.5) < 0.1 && Math.abs(tile.z - -0.5) < 0.1;
        const isStartSquare = Math.abs(tile.x - 1.5) < 0.1 && Math.abs(tile.z - 1.5) < 0.1;
        const isKingSquare = Math.abs(tile.x - 0.5) < 0.1 && Math.abs(tile.z - 0.5) < 0.1;

        let tileColor = tile.isWhite ? '#F2EFE7' : '#151A21';
        let emissiveColor = '#000000';
        let emissiveIntensity = 0;

        // Tactical highlight before jump (5.0s to 5.6s -> progress 0.41 to 0.47)
        if (progress >= 0.41 && progress < 0.48) {
          if (isStartSquare) {
            emissiveColor = '#5ED6E6';
            emissiveIntensity = 0.5;
          } else if (isLandingSquare) {
            emissiveColor = '#C9A227';
            emissiveIntensity = 0.4;
          }
        }

        if (isLandingSquare && landingPulse > 0) {
          emissiveColor = '#5ED6E6';
          emissiveIntensity = Math.min(1, landingPulse * 1.5);
        } else if (isKingSquare) {
          emissiveColor = '#C9A227';
          emissiveIntensity = 0.25 * gridAlpha;
        } else if (wave > 0.05) {
          emissiveColor = '#5B8CFF';
          emissiveIntensity = wave * 2.2;
        }

        return (
          <mesh
            key={idx}
            position={[tile.x, wave, tile.z]}
            receiveShadow
            castShadow={wave > 0.02}
          >
            <boxGeometry args={[0.96, 0.08, 0.96]} />
            <meshStandardMaterial
              color={tileColor}
              emissive={emissiveColor}
              emissiveIntensity={emissiveIntensity}
              roughness={tile.isWhite ? 0.35 : 0.2}
              metalness={tile.isWhite ? 0.08 : 0.65}
              transparent={true}
              opacity={gridAlpha}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// -------------------------------------------------------------
// Knight Trajectory Arc & Particles
// -------------------------------------------------------------
const TrajectoryArc: React.FC<{ progress: number }> = ({ progress }) => {
  // Knight move occurs between progress 0.46 and 0.57 (5.5s to 6.8s)
  const moveT = Math.max(0, Math.min(1, (progress - 0.46) / 0.11));

  // Trajectory curve from f3 (1.5, 0, 1.5) to d5 (-0.5, 0, -0.5)
  const curve = useMemo(() => {
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(1.5, 0.05, 1.5),
      new THREE.Vector3(0.5, 1.8, 0.5), // Peak arc apex
      new THREE.Vector3(-0.5, 0.05, -0.5)
    );
  }, []);

  const linePoints = useMemo(() => curve.getPoints(40), [curve]);
  const activePointCount = Math.floor(moveT * linePoints.length);
  const activePoints = useMemo(() => linePoints.slice(0, Math.max(2, activePointCount)), [
    linePoints,
    activePointCount,
  ]);

  const lineGeo = useMemo(() => {
    if (activePoints.length < 2) return null;
    return new THREE.BufferGeometry().setFromPoints(activePoints);
  }, [activePoints]);

  // Also show tentative glowing line right before move (0.42 to 0.46)
  if (progress >= 0.42 && progress < 0.46) {
    const fullGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    return (
      <primitive
        object={
          new THREE.Line(
            fullGeo,
            new THREE.LineDashedMaterial({
              color: '#5ED6E6',
              dashSize: 0.2,
              gapSize: 0.1,
              transparent: true,
              opacity: 0.4,
            })
          )
        }
      />
    );
  }

  if (!lineGeo || moveT <= 0.05 || moveT >= 0.98) return null;

  return (
    <primitive
      object={
        new THREE.Line(
          lineGeo,
          new THREE.LineBasicMaterial({ color: '#5ED6E6', transparent: true, opacity: 0.85 })
        )
      }
    />
  );
};

// -------------------------------------------------------------
// Digital Chess Universe Spatial Elements (0.58 -> 0.75, 7s - 9s)
// -------------------------------------------------------------
const ChessUniverseEnvironment: React.FC<{ progress: number }> = ({ progress }) => {
  // Emerges between 0.58 and 0.75 (7.0s - 9.0s), persists through logo
  const universeAlpha = Math.max(0, Math.min(1, (progress - 0.58) / 0.14));
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  if (universeAlpha <= 0) return null;

  return (
    <group ref={groupRef}>
      {/* 1. Distant Floating Secondary Chessboard Platforms */}
      {[
        { pos: [-14, 4, -12] as [number, number, number], rot: [0.3, 0.4, -0.2] as [number, number, number], scale: 0.35 },
        { pos: [15, -3, -14] as [number, number, number], rot: [-0.2, -0.5, 0.1] as [number, number, number], scale: 0.4 },
        { pos: [-12, -5, 10] as [number, number, number], rot: [0.4, -0.2, 0.3] as [number, number, number], scale: 0.3 },
      ].map((plat, idx) => (
        <group key={idx} position={plat.pos} rotation={plat.rot} scale={[plat.scale, plat.scale, plat.scale]}>
          <mesh>
            <boxGeometry args={[8.8, 0.2, 8.8]} />
            <meshStandardMaterial
              color="#0D1117"
              wireframe
              transparent
              opacity={universeAlpha * 0.3}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(8.8, 0.2, 8.8)]} />
            <lineBasicMaterial color="#5B8CFF" transparent opacity={universeAlpha * 0.4} />
          </lineSegments>
        </group>
      ))}

      {/* 2. Concentric Digital Spatial Rings */}
      <group position={[0, 1.2, 0]} rotation={[0.35, 0, 0.2]}>
        <mesh>
          <torusGeometry args={[8.5, 0.02, 16, 64]} />
          <meshBasicMaterial color="#5ED6E6" transparent opacity={universeAlpha * 0.45} />
        </mesh>
        <mesh rotation={[0.5, 0.3, 0]}>
          <torusGeometry args={[11.2, 0.015, 16, 64]} />
          <meshBasicMaterial color="#C9A227" transparent opacity={universeAlpha * 0.35} />
        </mesh>
      </group>

      {/* 3. Celestial Orbit Spheres */}
      {[
        { pos: [7.2, 2.5, -4] as [number, number, number], color: '#5ED6E6', r: 0.12 },
        { pos: [-8.1, 3.2, 5] as [number, number, number], color: '#E8C75A', r: 0.15 },
        { pos: [4.5, -2.8, 9] as [number, number, number], color: '#5B8CFF', r: 0.1 },
      ].map((node, i) => (
        <mesh key={i} position={node.pos}>
          <sphereGeometry args={[node.r, 12, 12]} />
          <meshBasicMaterial color={node.color} transparent opacity={universeAlpha * 0.7} />
        </mesh>
      ))}
    </group>
  );
};

// -------------------------------------------------------------
// Main 3D Canvas Scene Content with 12-Second Choreography
// -------------------------------------------------------------
export const ChessVerseScene3D: React.FC<ChessVerseScene3DProps> = ({ progress }) => {
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));

  // ---------------------------------------------------------
  // TIMELINE CHOREOGRAPHY:
  // 0.0s - 1.5s (0.00 - 0.125): The Void (pure dark, faint light)
  // 1.5s - 3.0s (0.125 - 0.25): The Board Emerges
  // 3.0s - 5.0s (0.25 - 0.42): The Pieces Arrive (Pawn -> Bishop -> Rook -> Knight -> Queen -> King)
  // 5.0s - 7.0s (0.42 - 0.58): The First Move (Knight focus, pause, leap to d5, pulse)
  // 7.0s - 9.0s (0.58 - 0.75): The Chess Universe (Pull-back, floating platforms, notation rings)
  // 9.0s - 11.0s (0.75 - 0.92): ChessVerse Logo Formation (Perspective convergence)
  // 11.0s - 12.0s (0.92 - 1.00): Transition to Main App
  // ---------------------------------------------------------

  // Piece progressive emergence (Stage 03: 0.25 to 0.42)
  const pawnOpacity = Math.max(0, Math.min(1, (progress - 0.25) / 0.04));
  const bishopOpacity = Math.max(0, Math.min(1, (progress - 0.28) / 0.04));
  const rookOpacity = Math.max(0, Math.min(1, (progress - 0.31) / 0.04));
  const knightEmergence = Math.max(0, Math.min(1, (progress - 0.34) / 0.04));
  const queenOpacity = Math.max(0, Math.min(1, (progress - 0.37) / 0.04));
  const kingOpacity = Math.max(0, Math.min(1, (progress - 0.39) / 0.05));

  // The Knight highlight & move (Stage 04: 0.42 to 0.58)
  const knightHighlight = progress >= 0.42 && progress < 0.47;
  const knightMoveT = Math.max(0, Math.min(1, (progress - 0.47) / 0.1)); // 5.6s to 6.8s

  // Parabolic Knight coordinate positions
  const startPos = new THREE.Vector3(1.5, 0.04, 1.5); // f3
  const endPos = new THREE.Vector3(-0.5, 0.04, -0.5); // d5
  const currentKnightPos = useMemo(() => {
    if (knightMoveT <= 0) return startPos;
    if (knightMoveT >= 1) return endPos;

    const x = THREE.MathUtils.lerp(startPos.x, endPos.x, knightMoveT);
    const z = THREE.MathUtils.lerp(startPos.z, endPos.z, knightMoveT);
    // Smooth parabolic altitude: 4h * t * (1 - t)
    const y = 4 * 1.8 * knightMoveT * (1 - knightMoveT);
    return new THREE.Vector3(x, y, z);
  }, [knightMoveT]);

  // Landing impact pulse: triggered at progress ~0.57 (6.8s)
  const landingPulse = Math.max(0, Math.min(1, (progress - 0.57) / 0.12));

  // King scale adjustment
  const kingScale = 0.8 + 0.25 * kingOpacity;

  // Camera Cinematic Path Across 12 Seconds:
  useFrame(({ camera }) => {
    if (progress < 0.125) {
      // Stage 1: The Void (Deep distance, tiny drift)
      camera.position.set(0, 11, 14 - progress * 8);
      cameraTarget.current.set(0, 0, 0);
    } else if (progress < 0.25) {
      // Stage 2: Board Emergence (Slow forward glide down to board)
      const t = (progress - 0.125) / 0.125;
      const r = THREE.MathUtils.lerp(13, 9, t);
      const h = THREE.MathUtils.lerp(10, 6.8, t);
      camera.position.set(0, h, r);
      cameraTarget.current.set(0, 0, 0);
    } else if (progress < 0.42) {
      // Stage 3: Pieces Arrive (Gentle orbital angle, admiring pieces)
      const t = (progress - 0.25) / 0.17;
      const angle = t * 0.35;
      camera.position.x = Math.sin(angle) * 8.5;
      camera.position.z = Math.cos(angle) * 8.5;
      camera.position.y = 5.8;
      cameraTarget.current.lerp(new THREE.Vector3(0.5, 0.4, 0.5), 0.05);
    } else if (progress < 0.58) {
      // Stage 4: The First Move (Focus shifts to Knight on f3, follows flight to d5)
      const t = (progress - 0.42) / 0.16;
      if (knightMoveT > 0.05 && knightMoveT < 0.95) {
        cameraTarget.current.lerp(currentKnightPos, 0.1);
        camera.position.set(currentKnightPos.x + 3.2, 4.2, currentKnightPos.z + 4.8);
      } else {
        camera.position.set(3.8, 4.6, 5.8);
        cameraTarget.current.lerp(endPos, 0.06);
      }
    } else if (progress < 0.75) {
      // Stage 5: The Chess Universe (Grand pull-back revealing wide universe)
      const t = (progress - 0.58) / 0.17;
      const pullDist = THREE.MathUtils.lerp(6.5, 14.5, t);
      const pullHeight = THREE.MathUtils.lerp(4.5, 9.8, t);
      const angle = 0.4 + t * 0.3;
      camera.position.x = Math.sin(angle) * pullDist;
      camera.position.z = Math.cos(angle) * pullDist;
      camera.position.y = pullHeight;
      cameraTarget.current.lerp(new THREE.Vector3(0, 0.2, 0), 0.08);
    } else if (progress < 0.92) {
      // Stage 6: ChessVerse Logo Formation (Elevated perspective, pointing into center)
      const t = (progress - 0.75) / 0.17;
      camera.position.set(0, THREE.MathUtils.lerp(9.8, 6.2, t), THREE.MathUtils.lerp(14.5, 10.0, t));
      cameraTarget.current.lerp(new THREE.Vector3(0, 1.2, 0), 0.08);
    } else {
      // Stage 7: Transition to Main App (Slight zoom inward to merge with dashboard)
      const t = (progress - 0.92) / 0.08;
      camera.position.set(0, THREE.MathUtils.lerp(6.2, 4.8, t), THREE.MathUtils.lerp(10.0, 7.5, t));
      cameraTarget.current.set(0, 0.4, 0);
    }

    camera.lookAt(cameraTarget.current);
  });

  return (
    <>
      {/* Cinematic Dual Warm Gold + Electric Cyan Lighting */}
      <ambientLight intensity={0.3} color="#0D1117" />
      <directionalLight
        position={[6, 9, 5]}
        intensity={2.4}
        color="#FFF1D0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-6, 4, -5]} intensity={1.4} color="#5ED6E6" />
      <pointLight position={[0, 3, 0]} intensity={1.6} distance={12} color="#E8C75A" />

      {/* 3D Chessboard */}
      <ChessGrid3D progress={progress} landingPulse={landingPulse} />

      {/* Trajectory Guide for Knight */}
      <TrajectoryArc progress={progress} />

      {/* Revealed Pieces (Curated showcase line on rank 4 & 3) */}
      {/* 1. Pawn at e2 / d3 */}
      {pawnOpacity > 0 && (
        <PawnMesh opacity={pawnOpacity} scale={0.8} position={[-1.5, 0.04, 1.5]} />
      )}

      {/* 2. Bishop at c1 / c4 */}
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

      {/* 5. Queen at d1 / d4 */}
      {queenOpacity > 0 && (
        <QueenMesh opacity={queenOpacity} scale={0.92} position={[-0.5, 0.04, 0.5]} />
      )}

      {/* 6. The Sovereign King at e4 (Centerpiece) */}
      {kingOpacity > 0 && (
        <KingMesh opacity={kingOpacity} scale={kingScale} position={[0.5, 0.04, 0.5]} />
      )}

      {/* The Chess Universe Environment (Floating platforms, notation halos) */}
      <ChessUniverseEnvironment progress={progress} />
    </>
  );
};
