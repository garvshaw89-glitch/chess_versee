import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ChessVerseScene3DProps {
  progress: number; // 0.0 to 1.0
  qualityTier?: 'high' | 'medium' | 'low';
}

// -------------------------------------------------------------
// King 3D Procedural Mesh (Gold Crown Finial + Metallic Dark Body)
// -------------------------------------------------------------
const KingMesh: React.FC<{ opacity: number; scale: number; position: [number, number, number] }> = ({
  opacity,
  scale,
  position,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Materials
  const darkMetalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#151A21'),
        metalness: 0.85,
        roughness: 0.2,
        transparent: true,
        opacity: Math.max(0, Math.min(1, opacity)),
      }),
    [opacity]
  );

  const goldCrownMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#E8C75A'),
        emissive: new THREE.Color('#C9A227'),
        emissiveIntensity: 0.35,
        metalness: 0.95,
        roughness: 0.15,
        transparent: true,
        opacity: Math.max(0, Math.min(1, opacity)),
      }),
    [opacity]
  );

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Base Plinth */}
      <mesh position={[0, 0.12, 0]} material={darkMetalMat} castShadow receiveShadow>
        <cylinderGeometry args={[0.44, 0.5, 0.24, 32]} />
      </mesh>
      {/* Gold Trim Ring */}
      <mesh position={[0, 0.25, 0]} material={goldCrownMat} castShadow>
        <cylinderGeometry args={[0.38, 0.44, 0.05, 32]} />
      </mesh>
      {/* Tapered Stem Column */}
      <mesh position={[0, 0.72, 0]} material={darkMetalMat} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.32, 0.9, 32]} />
      </mesh>
      {/* Upper Collar */}
      <mesh position={[0, 1.2, 0]} material={darkMetalMat} castShadow>
        <cylinderGeometry args={[0.38, 0.24, 0.22, 32]} />
      </mesh>
      {/* Gold Crown Band */}
      <mesh position={[0, 1.34, 0]} material={goldCrownMat} castShadow>
        <torusGeometry args={[0.32, 0.04, 16, 32]} />
      </mesh>
      {/* Imperial Cross Apex */}
      <mesh position={[0, 1.55, 0]} material={goldCrownMat} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
      </mesh>
      <mesh position={[0, 1.6, 0]} material={goldCrownMat} castShadow>
        <boxGeometry args={[0.26, 0.08, 0.08]} />
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
}> = ({ position, rotationY, opacity, scale }) => {
  const knightMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1F2733'),
        metalness: 0.8,
        roughness: 0.25,
        transparent: true,
        opacity: Math.max(0, Math.min(1, opacity)),
      }),
    [opacity]
  );

  const goldAccentMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#E8C75A'),
        emissive: new THREE.Color('#C9A227'),
        emissiveIntensity: 0.25,
        metalness: 0.9,
        roughness: 0.15,
        transparent: true,
        opacity: Math.max(0, Math.min(1, opacity)),
      }),
    [opacity]
  );

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={[scale, scale, scale]}>
      {/* Base */}
      <mesh position={[0, 0.1, 0]} material={knightMat} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.44, 0.2, 28]} />
      </mesh>
      {/* Neck arch */}
      <mesh position={[0, 0.5, -0.04]} rotation={[0.26, 0, 0]} material={knightMat} castShadow>
        <boxGeometry args={[0.28, 0.6, 0.36]} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.82, 0.12]} rotation={[-0.2, 0, 0]} material={knightMat} castShadow>
        <boxGeometry args={[0.25, 0.34, 0.44]} />
      </mesh>
      {/* Muzzle */}
      <mesh position={[0, 0.72, 0.32]} rotation={[0.42, 0, 0]} material={knightMat} castShadow>
        <boxGeometry args={[0.2, 0.22, 0.26]} />
      </mesh>
      {/* Gold Crest Ears */}
      <mesh position={[-0.08, 1.05, 0.02]} rotation={[0.2, 0, -0.2]} material={goldAccentMat}>
        <coneGeometry args={[0.06, 0.2, 12]} />
      </mesh>
      <mesh position={[0.08, 1.05, 0.02]} rotation={[0.2, 0, 0.2]} material={goldAccentMat}>
        <coneGeometry args={[0.06, 0.2, 12]} />
      </mesh>
      {/* Eye glint */}
      <mesh position={[0.13, 0.86, 0.22]} material={goldAccentMat}>
        <sphereGeometry args={[0.03, 8, 8]} />
      </mesh>
      <mesh position={[-0.13, 0.86, 0.22]} material={goldAccentMat}>
        <sphereGeometry args={[0.03, 8, 8]} />
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
  // Grid fade in starts at 0.18, completes at 0.45
  const gridAlpha = Math.max(0, Math.min(1, (progress - 0.18) / 0.25));
  const boardY = -0.5 * (1 - gridAlpha);

  const tiles = useMemo(() => {
    const list: { x: number; z: number; isWhite: boolean; distToLanding: number }[] = [];
    const landingX = -0.5;
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

      {/* Gold Inner Perimeter Wire */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(8.05, 0.02, 8.05)]} />
        <lineBasicMaterial color="#C9A227" transparent opacity={gridAlpha * 0.5} />
      </lineSegments>

      {/* Individual 64 Chessboard Squares */}
      {tiles.map((tile, idx) => {
        // Calculate dynamic wave lift from Knight's landing pulse
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
        const isKingSquare = Math.abs(tile.x - 0.5) < 0.1 && Math.abs(tile.z - 0.5) < 0.1;

        let tileColor = tile.isWhite ? '#F2EFE7' : '#151A21';
        let emissiveColor = '#000000';
        let emissiveIntensity = 0;

        if (isLandingSquare && landingPulse > 0) {
          emissiveColor = '#5ED6E6';
          emissiveIntensity = Math.min(1, landingPulse * 1.5);
        } else if (isKingSquare) {
          emissiveColor = '#C9A227';
          emissiveIntensity = 0.25 * gridAlpha;
        } else if (wave > 0.05) {
          emissiveColor = '#5B8CFF';
          emissiveIntensity = wave * 2;
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
  // Knight move occurs between progress 0.65 and 0.82
  const moveT = Math.max(0, Math.min(1, (progress - 0.65) / 0.17));

  // Trajectory curve from start (1.5, 0, 1.5) to destination (-0.5, 0, -0.5)
  const curve = useMemo(() => {
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(1.5, 0.05, 1.5),
      new THREE.Vector3(0.5, 1.7, 0.5), // Peak arc apex
      new THREE.Vector3(-0.5, 0.05, -0.5)
    );
  }, []);

  const linePoints = useMemo(() => curve.getPoints(36), [curve]);
  const activePointCount = Math.floor(moveT * linePoints.length);
  const activePoints = useMemo(() => linePoints.slice(0, Math.max(2, activePointCount)), [
    linePoints,
    activePointCount,
  ]);

  const lineGeo = useMemo(() => {
    if (activePoints.length < 2) return null;
    return new THREE.BufferGeometry().setFromPoints(activePoints);
  }, [activePoints]);

  if (!lineGeo || moveT <= 0.05 || moveT >= 0.98) return null;

  return (
    <primitive object={new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: '#5ED6E6', transparent: true, opacity: 0.8 }))} />
  );
};

// -------------------------------------------------------------
// Digital Celestial Orbital Ring
// -------------------------------------------------------------
const OrbitalRing: React.FC<{ progress: number }> = ({ progress }) => {
  const ringRef = useRef<THREE.Group>(null);
  const ringAlpha = Math.max(0, Math.min(1, (progress - 0.75) / 0.2));

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 0.4;
      ringRef.current.rotation.z += delta * 0.1;
    }
  });

  if (ringAlpha <= 0) return null;

  return (
    <group ref={ringRef} position={[0, 0.6, 0]} rotation={[0.4, 0, 0.3]}>
      {/* Outer Cyan Ring */}
      <mesh>
        <torusGeometry args={[3.8, 0.015, 16, 64]} />
        <meshBasicMaterial color="#5ED6E6" transparent opacity={ringAlpha * 0.6} />
      </mesh>
      {/* Inner Gold Ring */}
      <mesh rotation={[0.6, 0.4, 0]}>
        <torusGeometry args={[3.2, 0.012, 16, 64]} />
        <meshBasicMaterial color="#E8C75A" transparent opacity={ringAlpha * 0.5} />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// Main 3D Canvas Scene Content
// -------------------------------------------------------------
export const ChessVerseScene3D: React.FC<ChessVerseScene3DProps> = ({ progress }) => {
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));

  // Kinematic timeline steps:
  // King emerges at progress 0.42 -> full at 0.60
  const kingOpacity = Math.max(0, Math.min(1, (progress - 0.42) / 0.16));
  const kingScale = 0.8 + 0.2 * kingOpacity;

  // Knight appears at 0.60, moves 0.65 -> 0.82
  const knightOpacity = Math.max(0, Math.min(1, (progress - 0.6) / 0.06));
  const knightMoveT = Math.max(0, Math.min(1, (progress - 0.65) / 0.17));

  // Parabolic Knight position
  const startPos = new THREE.Vector3(1.5, 0.04, 1.5);
  const endPos = new THREE.Vector3(-0.5, 0.04, -0.5);
  const currentPos = useMemo(() => {
    if (knightMoveT <= 0) return startPos;
    if (knightMoveT >= 1) return endPos;

    // Linear horizontal interpolation
    const x = THREE.MathUtils.lerp(startPos.x, endPos.x, knightMoveT);
    const z = THREE.MathUtils.lerp(startPos.z, endPos.z, knightMoveT);
    // Smooth parabolic altitude: 4h * t * (1 - t)
    const y = 4 * 1.6 * knightMoveT * (1 - knightMoveT);
    return new THREE.Vector3(x, y, z);
  }, [knightMoveT]);

  // Landing impact pulse: triggered around progress 0.82
  const landingPulse = Math.max(0, Math.min(1, (progress - 0.81) / 0.19));

  // Camera Cinematic Orbit Animation
  useFrame(({ camera }) => {
    // Initial camera: [0, 8.5, 11] -> moves to [0, 4.5, 6.2] -> slight orbit
    const camProgress = Math.min(1, progress * 1.15);
    const radius = THREE.MathUtils.lerp(12, 6.4, Math.sin(camProgress * (Math.PI / 2)));
    const height = THREE.MathUtils.lerp(8.0, 4.6, Math.sin(camProgress * (Math.PI / 2)));
    const angle = camProgress * 0.45;

    camera.position.x = Math.sin(angle) * radius;
    camera.position.z = Math.cos(angle) * radius;
    camera.position.y = height;

    // Target tracks center or knight when in flight
    if (knightMoveT > 0.1 && knightMoveT < 0.9) {
      cameraTarget.current.lerp(currentPos, 0.08);
    } else {
      cameraTarget.current.lerp(new THREE.Vector3(0, 0.4, 0), 0.05);
    }

    camera.lookAt(cameraTarget.current);
  });

  return (
    <>
      {/* Sophisticated Dual Lighting: Warm Sovereign Gold Key Light + Cool Electric Rim Light */}
      <ambientLight intensity={0.35} color="#0D1117" />
      <directionalLight
        position={[6, 9, 5]}
        intensity={2.2}
        color="#FFF1D0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-6, 4, -5]} intensity={1.2} color="#5ED6E6" />
      <pointLight position={[0, 3, 0]} intensity={1.5} distance={10} color="#E8C75A" />

      {/* 3D Chessboard */}
      <ChessGrid3D progress={progress} landingPulse={landingPulse} />

      {/* Trajectory Guide */}
      <TrajectoryArc progress={progress} />

      {/* The King (Central monarch at e4 square [0.5, 0, 0.5]) */}
      {kingOpacity > 0 && (
        <KingMesh opacity={kingOpacity} scale={kingScale} position={[0.5, 0.04, 0.5]} />
      )}

      {/* The Knight (Kinematic jumper from f3 to d5) */}
      {knightOpacity > 0 && (
        <KnightMesh
          position={[currentPos.x, currentPos.y, currentPos.z]}
          rotationY={-Math.PI / 3}
          opacity={knightOpacity}
          scale={0.9}
        />
      )}

      {/* Orbital Formation Ring */}
      <OrbitalRing progress={progress} />
    </>
  );
};
