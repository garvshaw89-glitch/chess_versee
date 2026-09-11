import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { NavPage } from '../components/ui/Navbar';
import { 
  User, 
  Trophy, 
  Award, 
  ShieldCheck, 
  RotateCcw, 
  Calendar, 
  Zap, 
  Swords, 
  CheckCircle2, 
  Flame,
  ChevronRight
} from 'lucide-react';
import { storage } from '../services/storage';
import { Button3D } from '../components/ui/Button3D';
import { StaggerContainer } from '../components/transitions/StaggerContainer';

interface ProfileViewProps {
  onNavigate: (page: NavPage) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  const { stats, showToast } = useGameStore();

  const [username, setUsername] = useState('Grandmaster');
  const [editingName, setEditingName] = useState(false);

  const totalMatches = stats.wins + stats.losses + stats.draws;
  const winRate = totalMatches > 0 ? Math.round((stats.wins / totalMatches) * 100) : 0;

  const achievements = [
    { id: 'first_win', name: 'First Blood', desc: 'Secure your first victory', unlocked: stats.wins >= 1 },
    { id: 'tactician', name: 'Tactical Mind', desc: 'Execute 5 checkmates', unlocked: stats.wins >= 5 },
    { id: 'grandmaster', name: 'Centurion', desc: 'Play 10 total games', unlocked: totalMatches >= 10 },
    { id: 'streak', name: 'Hot Streak', desc: 'Reach a 3-game win streak', unlocked: stats.winStreak >= 3 }
  ];

  return (
    <div className="w-full min-h-[calc(100vh-60px)] p-4 sm:p-8 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 overflow-y-auto">
      <StaggerContainer staggerMs={60} baseDelayMs={40} className="max-w-5xl mx-auto space-y-6">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-xl backdrop-blur-md">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20 text-neutral-950 font-serif font-black">
              ♔
            </div>
            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-neutral-950 border border-amber-500 text-[10px] font-mono font-bold text-amber-400">
              PRO
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-2xl font-bold text-neutral-100 font-display">
                {username}
              </h2>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold w-max mx-auto sm:mx-0">
                ELO 1540 (RAPID)
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Member since 2026 • 3D Chess Master Candidate
            </p>

            {/* Rating Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4 font-mono text-xs">
              <div className="px-3 py-1 rounded-lg bg-neutral-950/80 border border-neutral-800 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-neutral-400">Blitz:</span>
                <span className="font-bold text-neutral-200">1490</span>
              </div>
              <div className="px-3 py-1 rounded-lg bg-neutral-950/80 border border-neutral-800 flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-neutral-400">Rapid:</span>
                <span className="font-bold text-neutral-200">1540</span>
              </div>
              <div className="px-3 py-1 rounded-lg bg-neutral-950/80 border border-neutral-800 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-400" />
                <span className="text-neutral-400">Streak:</span>
                <span className="font-bold text-neutral-200">{stats.winStreak}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lifetime Match Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 font-mono">
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400">Total Games</span>
            <div className="text-2xl sm:text-3xl font-bold text-neutral-100 mt-1">
              {totalMatches}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400">Victories</span>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">
              {stats.wins}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400">Defeats</span>
            <div className="text-2xl sm:text-3xl font-bold text-red-400 mt-1">
              {stats.losses}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400">Win Rate</span>
            <div className="text-2xl sm:text-3xl font-bold text-amber-400 mt-1">
              {winRate}%
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-800">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200 font-mono">
              Badges & Achievements
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                  ach.unlocked
                    ? 'bg-amber-500/10 border-amber-500/40 text-neutral-200'
                    : 'bg-neutral-950/40 border-neutral-800/60 text-neutral-500 opacity-60'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    ach.unlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-neutral-800 text-neutral-600'
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">{ach.name}</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{ach.desc}</p>
                  <span className="text-[10px] font-mono mt-1.5 block font-semibold">
                    {ach.unlocked ? '✓ UNLOCKED' : 'LOCKED'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action Play Now */}
        <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-neutral-900 to-neutral-900 border border-amber-500/30">
          <div>
            <h4 className="text-base font-bold text-neutral-100">Ready to boost your ranking?</h4>
            <p className="text-xs text-neutral-400 mt-0.5">Jump into a match against DeepAI or challenge online opponents.</p>
          </div>
          <Button3D
            variant="primary"
            size="lg"
            onClick={() => onNavigate('play')}
            icon={<ChevronRight className="w-4 h-4" />}
          >
            <span>BATTLE NOW</span>
          </Button3D>
        </div>
      </StaggerContainer>
    </div>
  );
};
