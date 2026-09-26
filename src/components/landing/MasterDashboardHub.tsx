import React from 'react';
import { NavPage } from '../ui/Navbar';
import { 
  Play, 
  Puzzle, 
  GraduationCap, 
  BarChart2, 
  Trophy, 
  Flame, 
  TrendingUp, 
  ChevronRight, 
  Bot, 
  Clock, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { EloService } from '../../services/eloService';
import { soundService } from '../../services/sound';

interface MasterDashboardHubProps {
  onNavigate: (page: NavPage) => void;
}

export const MasterDashboardHub: React.FC<MasterDashboardHubProps> = ({ onNavigate }) => {
  const stats = StorageService.getStats();
  const history = StorageService.getHistory();
  const currentTier = EloService.getTier(stats.rating);
  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;

  return (
    <section className="relative py-12 px-4 sm:px-6 max-w-6xl mx-auto w-full border-b border-white/5 space-y-8">
      {/* Welcome Banner & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#E8C75A] uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#35C98B] animate-pulse" />
            <span>Grandmaster Command Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#F5F7FA] mt-1">
            Welcome back, {stats.username}
          </h2>
          <p className="text-xs sm:text-sm text-[#8D98A8] mt-0.5">
            Your standing: <span className="text-[#E8C75A] font-bold">{currentTier.name} Tier</span> ({stats.rating} Elo) · {stats.currentStreak} Game Win Streak
          </p>
        </div>

        {/* Quick Launch Button */}
        <button
          onClick={() => {
            soundService.playClick();
            onNavigate('play');
          }}
          className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#E8C75A] text-[#05070A] font-mono text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Resume Arena Match</span>
        </button>
      </div>

      {/* 4 Primary Launch Portals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            title: 'Live Arena',
            desc: 'Challenge Stockfish or AI bots',
            page: 'play' as NavPage,
            icon: Play,
            color: 'text-[#E8C75A]',
            bg: 'bg-[#C9A227]/10 hover:border-[#C9A227]/40',
            badge: 'Online',
          },
          {
            title: 'Tactical Puzzles',
            desc: 'Daily tactical puzzle calibration',
            page: 'puzzles' as NavPage,
            icon: Puzzle,
            color: 'text-[#35C98B]',
            bg: 'bg-[#35C98B]/10 hover:border-[#35C98B]/40',
            badge: `${stats.puzzleRating} Elo`,
          },
          {
            title: 'Chess Academy',
            desc: 'Interactive guided master lessons',
            page: 'learn' as NavPage,
            icon: GraduationCap,
            color: 'text-[#5B8CFF]',
            bg: 'bg-[#5B8CFF]/10 hover:border-[#5B8CFF]/40',
            badge: 'Curriculum',
          },
          {
            title: 'Deep Analysis',
            desc: 'Centipawn engine evaluation',
            page: 'analysis' as NavPage,
            icon: BarChart2,
            color: 'text-[#5ED6E6]',
            bg: 'bg-[#5ED6E6]/10 hover:border-[#5ED6E6]/40',
            badge: 'Depth 38',
          },
        ].map((act, idx) => {
          const Icon = act.icon;
          return (
            <button
              key={idx}
              onClick={() => {
                soundService.playClick();
                onNavigate(act.page);
              }}
              className={`p-4 rounded-2xl bg-[#0A0E13] border border-white/5 ${act.bg} text-left transition-all flex flex-col justify-between shadow-xl cursor-pointer group`}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center ${act.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#8D98A8]">
                  {act.badge}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-bold text-[#F5F7FA] group-hover:text-[#E8C75A] transition-colors flex items-center justify-between">
                  <span>{act.title}</span>
                  <ChevronRight className="w-4 h-4 text-[#667080] group-hover:translate-x-0.5 transition-transform" />
                </h3>
                <p className="text-[11px] text-[#8D98A8] mt-1 line-clamp-1">{act.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Progress Cards & Daily Challenge Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Player Rating & Progress Telemetry (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0A0E13] border border-white/10 p-5 space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8D98A8]">
              Calibration Telemetry
            </span>
            <button
              onClick={() => onNavigate('profile')}
              className="text-xs font-mono text-[#E8C75A] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Dossier</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Key Stat Blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[#05070A] border border-white/5">
              <div className="text-[10px] font-mono uppercase text-[#667080]">FIDE Elo</div>
              <div className="text-xl font-bold font-display text-[#F0D477] mt-0.5">{stats.rating}</div>
              <div className="text-[10px] font-mono text-[#35C98B] mt-0.5">Peak {stats.peakRating}</div>
            </div>

            <div className="p-3 rounded-xl bg-[#05070A] border border-white/5">
              <div className="text-[10px] font-mono uppercase text-[#667080]">Win Rate</div>
              <div className="text-xl font-bold font-display text-[#F5F7FA] mt-0.5">{winRate}%</div>
              <div className="text-[10px] font-mono text-[#8D98A8] mt-0.5">{stats.wins}W - {stats.losses}L</div>
            </div>

            <div className="p-3 rounded-xl bg-[#05070A] border border-white/5">
              <div className="text-[10px] font-mono uppercase text-[#667080]">Streak</div>
              <div className="text-xl font-bold font-display text-[#E8C75A] mt-0.5 flex items-center gap-1">
                <Flame className="w-4 h-4 fill-current text-amber-500" />
                <span>{stats.currentStreak}</span>
              </div>
              <div className="text-[10px] font-mono text-[#8D98A8] mt-0.5">Best: {stats.bestStreak}</div>
            </div>

            <div className="p-3 rounded-xl bg-[#05070A] border border-white/5">
              <div className="text-[10px] font-mono uppercase text-[#667080]">Tactics Elo</div>
              <div className="text-xl font-bold font-display text-[#5ED6E6] mt-0.5">{stats.puzzleRating}</div>
              <div className="text-[10px] font-mono text-[#8D98A8] mt-0.5">{stats.puzzlesSolved} Solved</div>
            </div>
          </div>

          {/* Recent Arena Encounters */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#667080] mb-2.5">
              Recent Arena Encounters
            </div>
            <div className="space-y-1.5">
              {history.slice(0, 3).map((game) => (
                <div
                  key={game.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#10151C] border border-white/5 text-xs font-mono"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${game.result === 'win' ? 'bg-[#35C98B]' : game.result === 'loss' ? 'bg-[#E45D6A]' : 'bg-[#C9A227]'}`} />
                    <span className="font-bold text-[#F5F7FA]">{game.opponent}</span>
                    <span className="text-[10px] text-[#8D98A8]">[{game.opponentRating || 1500} Elo]</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold ${game.result === 'win' ? 'text-[#35C98B]' : game.result === 'loss' ? 'text-[#E45D6A]' : 'text-[#C9A227]'}`}>
                      {game.result.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-[#667080]">{game.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Daily Puzzle & Championship Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Daily Tactical Puzzle Showcase Card */}
          <div className="rounded-2xl bg-gradient-to-br from-[#10151C] to-[#0A0E13] border border-[#C9A227]/30 p-5 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="text-xs font-mono text-[#E8C75A] font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Daily Tactical Puzzle</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#35C98B] font-bold">
                +12 Elo Reward
              </span>
            </div>

            <div className="py-4 space-y-1.5">
              <h3 className="text-base font-bold text-[#F5F7FA]">
                Back-Rank Mate in One
              </h3>
              <p className="text-xs text-[#8D98A8] leading-relaxed">
                Black is trapped behind its pawn shield. White rook penetrates the 8th rank. Deliver the winning checkmate.
              </p>
            </div>

            <button
              onClick={() => {
                soundService.playClick();
                onNavigate('puzzles');
              }}
              className="w-full py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#E8C75A] text-[#05070A] font-mono text-xs font-bold transition-all shadow cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Puzzle className="w-3.5 h-3.5" />
              <span>Solve Daily Puzzle</span>
            </button>
          </div>

          {/* Quick Tournament Teaser */}
          <div className="rounded-2xl bg-[#0A0E13] border border-white/10 p-5 shadow-xl flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#5B8CFF]" />
                <span className="text-xs font-bold text-[#F5F7FA]">Weekly Swiss Championship</span>
              </div>
              <p className="text-xs text-[#8D98A8] mt-1">Sunday Grandmaster Arena · 64 Competitors</p>
            </div>
            <button
              onClick={() => onNavigate('tournaments')}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#E8C75A] transition-colors cursor-pointer"
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
