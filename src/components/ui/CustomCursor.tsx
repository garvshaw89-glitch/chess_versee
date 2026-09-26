import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState<string | null>(null);

  useEffect(() => {
    // Only activate cursor on devices that support hover (desktop/mouse)
    if (typeof window === 'undefined') return;
    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasHover) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('button, a, input, select, textarea, [data-cursor], [role="button"]');
      if (interactive) {
        setIsHovering(true);
        const customText = interactive.getAttribute('data-cursor-text');
        setCursorText(customText);
      } else {
        setIsHovering(false);
        setCursorText(null);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  // Smooth lerping for the outer ring
  useEffect(() => {
    let animationFrameId: number;
    const lerp = () => {
      setTrailingPos((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.22,
        y: prev.y + (position.y - prev.y) * 0.22,
      }));
      animationFrameId = requestAnimationFrame(lerp);
    };

    animationFrameId = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden transition-opacity duration-300">
      {/* Inner Precision Dot */}
      <div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-amber-400 -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out shadow-sm"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isClicking ? 0.6 : 1})`,
        }}
      />

      {/* Outer Magnetic Ring */}
      <div
        className={`fixed top-0 left-0 rounded-full border border-amber-400/40 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out flex items-center justify-center ${
          isHovering
            ? 'w-10 h-10 bg-amber-400/10 border-amber-400/70 backdrop-blur-[1px]'
            : 'w-7 h-7 bg-transparent border-white/25'
        }`}
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0) scale(${
            isClicking ? 0.85 : 1
          })`,
        }}
      >
        {cursorText && (
          <span className="text-[8px] font-mono tracking-wider uppercase text-amber-300 font-bold whitespace-nowrap">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
};
