import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PieceType, PieceColor, PieceThemeId } from '../types/chess';
import { Piece3D } from './Piece3D';
import { squareToCoords } from './Board3D';

interface AnimatedPieceProps {
  id: string;
  type: PieceType;
  color: PieceColor;
  square: string;
  theme: PieceThemeId;
  isSelected: boolean;
  isUnderCheck: boolean;
  isHovered: boolean;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}

export const AnimatedPiece: React.FC<AnimatedPieceProps> = ({
  type,
  color,
  square,
  theme,
  isSelected,
  isUnderCheck,
  isHovered,
  onClick,
  onPointerOver,
  onPointerOut
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [targetX, , targetZ] = squareToCoords(square);

  const prevCoords = useRef<[number, number]>([targetX, targetZ]);
  const isMoving = useRef<boolean>(false);
  const moveProgress = useRef<number>(1);

  useEffect(() => {
    if (prevCoords.current[0] !== targetX || prevCoords.current[1] !== targetZ) {
      if (groupRef.current) {
        prevCoords.current = [groupRef.current.position.x, groupRef.current.position.z];
      }
      isMoving.current = true;
      moveProgress.current = 0;
    }
  }, [targetX, targetZ]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (isMoving.current) {
      moveProgress.current = Math.min(1, moveProgress.current + delta * 3.8);
      const t = moveProgress.current;

      // Smooth step
      const ease = t * t * (3 - 2 * t);
      const currentX = THREE.MathUtils.lerp(prevCoords.current[0], targetX, ease);
      const currentZ = THREE.MathUtils.lerp(prevCoords.current[1], targetZ, ease);

      // Parabolic arc lift during transit
      const arcHeight = Math.sin(t * Math.PI) * 0.8;
      const targetY = (isSelected ? 0.4 : 0) + arcHeight;

      groupRef.current.position.set(currentX, targetY, currentZ);

      if (t >= 1) {
        isMoving.current = false;
        prevCoords.current = [targetX, targetZ];
      }
    } else {
      // Resting position with lift on selection
      const targetY = isSelected ? 0.42 : isHovered ? 0.12 : 0;
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.2);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.2);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.2);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[targetX, isSelected ? 0.42 : 0, targetZ]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver();
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onPointerOut();
      }}
    >
      <Piece3D
        type={type}
        color={color}
        theme={theme}
        isSelected={isSelected}
        isHovered={isHovered}
        isUnderCheck={isUnderCheck}
      />
    </group>
  );
};
