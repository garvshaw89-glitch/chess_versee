import React, { useMemo } from 'react';

interface ChessParticleFieldProps {
  progress?: number;
  count?: number;
  className?: string;
}

export const ChessParticleField: React.FC<ChessParticleFieldProps> = ({
  progress = 0,
  count = 42,
  className = '',
}) => {
  // Generate deterministic particles with spatial coordinates and subtle floating speeds
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      // Deterministic pseudo-random seed
      const seed = i * 137.5;
      const x = ((seed * 9.1) % 100);
      const y = ((seed * 17.3) % 100);
      const size = 1.2 + ((seed * 3.7) % 2.4);
      const delay = (i % 7) * 0.4;
      const duration = 6 + (i % 5) * 1.5;
      const isGold = i % 3 === 0;
      const isCyan = i % 3 === 1;

      return {
        id: i,
        x,
        y,
        size,
        delay,
        duration,
        color: isGold ? '#E8C75A' : isCyan ? '#5ED6E6' : '#F5F7FA',
        opacity: isGold ? 0.35 : 0.22,
      };
    });
  }, [count]);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}>
      {particles.map((p) => {
        // Particles concentrate gently towards center as progress increases
        const pullProgress = Math.min(1, progress * 1.2);
        const currentX = p.x + (50 - p.x) * pullProgress * 0.15;
        const currentY = p.y + (50 - p.y) * pullProgress * 0.15;

        return (
          <div
            key={p.id}
            className="absolute rounded-full transition-transform duration-1000 ease-out"
            style={{
              left: `${currentX}%`,
              top: `${currentY}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              opacity: p.opacity * Math.min(1, Math.max(0.2, progress * 1.5)),
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              animation: `float-particle ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
            }}
          />
        );
      })}
    </div>
  );
};
