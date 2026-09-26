import React, { useRef, useState } from 'react';
import { soundService } from '../../services/sound';

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  magnetic?: boolean;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  iconPosition = 'left',
  magnetic = true,
  className = '',
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!magnetic || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * 0.14;
    const distanceY = (e.clientY - centerY) * 0.14;
    setOffset({ x: distanceX, y: distanceY });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundService.playClick();
    if (onClick) onClick(e);
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 min-h-[34px]',
    md: 'px-4 py-2 text-xs font-semibold gap-2 min-h-[40px]',
    lg: 'px-6 py-3 text-sm font-semibold gap-2.5 min-h-[48px]',
  }[size];

  const variantClasses = {
    primary:
      'bg-gradient-to-b from-amber-400 to-amber-500 text-neutral-950 font-bold hover:brightness-105 active:scale-[0.98] shadow-lg shadow-amber-500/20 border border-amber-300/40',
    amber:
      'bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 active:scale-[0.98]',
    secondary:
      'bg-neutral-900/80 text-neutral-200 border border-white/10 hover:border-white/20 hover:bg-neutral-800/90 hover:text-white active:scale-[0.98] backdrop-blur-sm',
    ghost:
      'bg-transparent text-neutral-400 hover:text-neutral-100 hover:bg-white/5 active:scale-[0.98]',
  }[variant];

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.15s, border-color 0.15s',
      }}
      className={`relative inline-flex items-center justify-center rounded-xl cursor-pointer select-none whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span className="truncate tracking-wide">{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
