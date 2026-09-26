import React, { useState, useEffect } from 'react';
import { Search, X, Users, Trophy, Puzzle, Play, ChevronRight, Hash } from 'lucide-react';
import { NavPage } from '../ui/Navbar';
import { soundService } from '../../services/sound';
import { AI_OPPONENTS } from '../../services/chessAI';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: NavPage) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickNavs = [
    { label: 'Battle Arena (AI / Local)', page: 'play' as NavPage, icon: Play, category: 'Game' },
    { label: '2-Player Pass & Play', page: '2player' as NavPage, icon: Users, category: 'Game' },
    { label: 'Tactical Puzzle Hub', page: 'puzzles' as NavPage, icon: Puzzle, category: 'Training' },
    { label: 'Interactive Academy Curriculum', page: 'learn' as NavPage, icon: Trophy, category: 'Study' },
    { label: 'Stockfish Deep Analysis Engine', page: 'analysis' as NavPage, icon: Hash, category: 'Engine' },
    { label: 'Player Dossier & FIDE Elo Stats', page: 'profile' as NavPage, icon: Users, category: 'Career' },
    { label: 'Tournaments & Open Brackets', page: 'tournaments' as NavPage, icon: Trophy, category: 'Competition' },
    { label: 'Global Grandmaster Leaderboard', page: 'leaderboard' as NavPage, icon: Trophy, category: 'Rankings' },
  ];

  const filteredNavs = quickNavs.filter(
    (item) => item.label.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredBots = AI_OPPONENTS.filter(
    (bot) => bot.name.toLowerCase().includes(query.toLowerCase()) || bot.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-[#0A0E13] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/5 gap-3 bg-[#10151C]/60">
          <Search className="w-5 h-5 text-[#8D98A8]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Arena, Academy, Puzzles, Openings, Bots, or Players..."
            className="flex-1 bg-transparent text-sm text-[#F5F7FA] placeholder-[#667080] outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8D98A8] hover:text-[#F5F7FA] hover:bg-white/5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Quick Page Destinations */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#8D98A8] px-3 pb-1.5">
              Destinations
            </div>
            <div className="space-y-1">
              {filteredNavs.map((dest, idx) => {
                const Icon = dest.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      soundService.playClick();
                      onNavigate(dest.page);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#151C25] text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#E8C75A] group-hover:bg-[#C9A227]/20">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#F5F7FA]">{dest.label}</div>
                        <div className="text-[10px] text-[#667080]">{dest.category}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#667080] group-hover:text-[#F5F7FA]" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Bots */}
          {filteredBots.length > 0 && (
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#8D98A8] px-3 pb-1.5">
                AI Opponents
              </div>
              <div className="space-y-1">
                {filteredBots.map((bot) => (
                  <button
                    key={bot.id}
                    onClick={() => {
                      soundService.playClick();
                      onNavigate('play');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#151C25] text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-lg">
                        {bot.avatar}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#F5F7FA]">{bot.name}</div>
                        <div className="text-[10px] text-[#667080]">{bot.title} · Elo {bot.rating}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#E8C75A]">Challenge</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Key Guide */}
        <div className="px-4 py-2 bg-[#05070A] border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#667080]">
          <span>Tip: Press ESC to close</span>
          <span>ChessVerse Universal Engine</span>
        </div>
      </div>
    </div>
  );
};
