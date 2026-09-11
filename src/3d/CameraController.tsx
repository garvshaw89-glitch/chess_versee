import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CameraPreset } from '../types/chess';

interface CameraControllerProps {
  preset: CameraPreset;
  isCinematicActive?: boolean;
}

const PRESET_POSITIONS: Record<CameraPreset, [number, number, number]> = {
  player_w: [0, 8.2, 9.2],
  player_b: [0, 8.2, -9.2],
  top: [0, 13.5, 0.001],
  isometric: [8.5, 8.8, 8.5],
  cinematic: [7.5, 5.5, 8.5]
};

export const CameraController: React.FC<CameraControllerProps> = ({
  preset,
  isCinematicActive = false
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const targetPos = useRef<THREE.Vector3>(new THREE.Vector3(...PRESET_POSITIONS[preset]));
  const lookAtTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const angleRef = useRef<number>(0);
  const isTransitioningRef = useRef<boolean>(true);

  useEffect(() => {
    const [x, y, z] = PRESET_POSITIONS[preset] || PRESET_POSITIONS.player_w;
    targetPos.current.set(x, y, z);
    isTransitioningRef.current = true;
  }, [preset]);

  useFrame((_, delta) => {
    if (isCinematicActive || preset === 'cinematic') {
      // Gentle cinematic orbit
      angleRef.current += delta * 0.15;
      const radius = 10.5;
      const x = Math.sin(angleRef.current) * radius;
      const z = Math.cos(angleRef.current) * radius;
      camera.position.lerp(new THREE.Vector3(x, 7.5, z), 0.04);
      camera.lookAt(0, 0, 0);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
    } else if (isTransitioningRef.current) {
      // Smooth lerp towards preset position
      camera.position.lerp(targetPos.current, 0.08);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(lookAtTarget.current, 0.08);
        controlsRef.current.update();
      }

      // When close enough, stop lerping so manual dragging feels 100% fluid
      if (camera.position.distanceTo(targetPos.current) < 0.03) {
        camera.position.copy(targetPos.current);
        isTransitioningRef.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2 - 0.05} // don't go below the ground board
      minDistance={4}
      maxDistance={22}
      rotateSpeed={0.8}
      zoomSpeed={0.9}
      panSpeed={0.7}
      onStart={() => {
        // User initiated manual orbit or zoom - stop programmatic lerping
        isTransitioningRef.current = false;
      }}
    />
  );
};
