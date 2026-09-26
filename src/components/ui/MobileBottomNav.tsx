import React from 'react';
import { NavPage } from './Navbar';
import { 
  Compass, 
  Play, 
  Puzzle, 
  GraduationCap, 
  BarChart2, 
  Trophy, 
  User 
} from 'lucide-react';
import { soundService } from '../../services/sound';

interface MobileBottomNavProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onNavigate,
}) => {
  const items: { id: NavPage; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'landing', label: 'Citadel', icon: Compass },
    { id: 'play', label: 'Arena', icon: Play },
    { id: 'puzzles', label: 'Puzzles', icon: Puzzle },
    { id: 'learn', label: 'Academy', icon: GraduationCap },
    { id: 'analysis', label: 'Analyze', icon: BarChart2 },
    { id: 'profile', label: 'Career', icon: User },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#05070A]/95 border-t border-white/5 backdrop-blur-2xl px-2 py-1.5 flex items-center justify-around"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              soundService.playClick();
              onNavigate(item.id);
            }}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              isActive 
                ? 'text-[#E8C75A] font-bold' 
                : 'text-[#8D98A8] hover:text-[#F5F7FA]'
            }`}
          >
            <div className="relative">
              <Icon className="w-4 h-4" />
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#E8C75A]" />
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
