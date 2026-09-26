import React, { useState } from 'react';
import { NavPage } from '../components/ui/Navbar';
import { 
  Trophy, 
  Crown, 
  Award, 
  TrendingUp, 
  Users, 
  Globe, 
  Search, 
  ChevronRight,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { soundService } from '../services/sound';

interface LeaderboardViewProps {
  onNavigate: (page: NavPage) => void;
}

interface LeaderboardPlayer {
  rank: number;
  username: string;
  rating: number;
  tier: string;
  winRate: number;
  games: number;
  badge: string;
  country: string;
  streak: number;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ onNavigate }) => {
  const [tab, setTab] = useState<'GLOBAL' | 'BLITZ' | 'PUZZLES'>('GLOBAL');
  const [searchQuery, setSearchQuery] = useState('');

  const players: LeaderboardPlayer[] = [
    { rank: 1, username: 'Magnus Carlson (AI)', rating: 2882, tier: 'Grandmaster', winRate: 88, games: 642, badge: '👑', country: 'NOR', streak: 14 },
    { rank: 2, username: 'Hikaru Pulse', rating: 2820, tier: 'Grandmaster', winRate: 84, games: 512, badge: '💎', country: 'USA', streak: 9 },
    { rank: 3, username: 'DeepMatrix GM', rating: 2750, tier: 'Grandmaster', winRate: 82, games: 420, badge: '🧠', country: 'SUI', streak: 7 },
    { rank: 4, username: 'Valkyrie Gambit', rating: 2640, tier: 'International Master', winRate: 78, games: 388, badge: '⚔️', country: 'FRA', streak: 5 },
    { rank: 5, username: 'Alireza Rapid', rating: 2610, tier: 'International Master', winRate: 76, games: 340, badge: '⚡', country: 'IRN', streak: 4 },
    { rank: 6, username: 'Knight Sovereign', rating: 2540, tier: 'FIDE Master', winRate: 74, games: 310, badge: '🛡️', country: 'GER', streak: 6 },
    { rank: 7, username: 'Grandmaster (You)', rating: 1250, tier: 'Tactician', winRate: 64, games: 14, badge: '🎯', country: 'LOCAL', streak: 3 },
    { rank: 8, username: 'Bishop Nova', rating: 1400, tier: 'Club Master', winRate: 62, games: 88, badge: '🔮', country: 'ENG', streak: 2 },
    { rank: 9, username: 'Knight Pulse', rating: 1150, tier: 'Challenger', winRate: 58, games: 64, badge: '⚡', country: 'CAN', streak: 1 },
    { rank: 10, username: 'Spark Bot', rating: 850, tier: 'Apprentice', winRate: 48, games: 52, badge: '🤖', country: 'BOT', streak: 0 },
  ];

  const filtered = players.filter(
    (p) => p.username.toLowerCase().includes(searchQuery.toLowerCase()) || p.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full min-h-[calc(100vh-60px)] bg-[#05070A] text-[#F5F7FA] p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#C9A227] uppercase tracking-widest">
              <Globe className="w-4 h-4" />
              <span>FIDE Calibration Standings</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#F5F7FA] mt-1">
              Global Championship Standings
            </h1>
            <p className="text-sm text-[#8D98A8] mt-1 max-w-xl">
              Real-time competitive Elo rankings across Blitz, Rapid, and Tactical Academy categories.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex rounded-xl bg-[#0A0E13] p-1 border border-white/10 self-start sm:self-center gap-1">
            {(['GLOBAL', 'BLITZ', 'PUZZLES'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  soundService.playClick();
                  setTab(t);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  tab === t
                    ? 'bg-[#151C25] text-[#E8C75A] border border-[#C9A227]/40 shadow'
                    : 'text-[#8D98A8] hover:text-[#F5F7FA]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#0A0E13] border border-white/10 max-w-md">
          <Search className="w-4 h-4 text-[#8D98A8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search grandmasters or national federations..."
            className="flex-1 bg-transparent text-xs text-[#F5F7FA] placeholder-[#667080] outline-none"
          />
        </div>

        {/* Leaderboard Table Card */}
        <div className="rounded-2xl bg-[#0A0E13] border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-[#10151C]/60 text-[10px] font-mono uppercase tracking-widest text-[#8D98A8]">
                  <th className="py-3 px-4 text-center w-16">Rank</th>
                  <th className="py-3 px-4">Player</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Tier</th>
                  <th className="py-3 px-4 hidden md:table-cell text-center">Win Rate</th>
                  <th className="py-3 px-4 hidden lg:table-cell text-center">Streak</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-mono">
                {filtered.map((player) => {
                  const isUser = player.username.includes('(You)');
                  const isTop3 = player.rank <= 3;

                  return (
                    <tr
                      key={player.rank}
                      className={`hover:bg-[#151C25]/80 transition-colors ${
                        isUser ? 'bg-[#C9A227]/10 border-l-2 border-[#C9A227]' : ''
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3 px-4 text-center font-bold">
                        {player.rank === 1 && <span className="text-[#E8C75A] font-extrabold text-sm">#1</span>}
                        {player.rank === 2 && <span className="text-[#A7B0BE] font-extrabold text-sm">#2</span>}
                        {player.rank === 3 && <span className="text-[#C9A227] font-extrabold text-sm">#3</span>}
                        {player.rank > 3 && <span className="text-[#667080]">#{player.rank}</span>}
                      </td>

                      {/* Player info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{player.badge}</span>
                          <div>
                            <span className={`font-bold ${isUser ? 'text-[#E8C75A]' : 'text-[#F5F7FA]'}`}>
                              {player.username}
                            </span>
                            <span className="text-[10px] text-[#667080] ml-2">
                              [{player.country}]
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="py-3 px-4 font-bold text-sm text-[#F0D477]">
                        {player.rating}
                      </td>

                      {/* Tier */}
                      <td className="py-3 px-4 hidden sm:table-cell text-[#8D98A8]">
                        {player.tier}
                      </td>

                      {/* Win Rate */}
                      <td className="py-3 px-4 hidden md:table-cell text-center">
                        <span className="px-2 py-0.5 rounded bg-white/5 text-[#35C98B] font-bold">
                          {player.winRate}%
                        </span>
                      </td>

                      {/* Streak */}
                      <td className="py-3 px-4 hidden lg:table-cell text-center">
                        {player.streak > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[#E8C75A] font-bold">
                            <Flame className="w-3.5 h-3.5" />
                            {player.streak}W
                          </span>
                        ) : (
                          <span className="text-[#667080]">-</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        {isUser ? (
                          <button
                            onClick={() => onNavigate('profile')}
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[11px] text-[#F5F7FA] font-bold transition-colors cursor-pointer"
                          >
                            My Stats
                          </button>
                        ) : (
                          <button
                            onClick={() => onNavigate('play')}
                            className="px-2.5 py-1 rounded-lg bg-[#C9A227]/20 hover:bg-[#C9A227] text-[11px] text-[#E8C75A] hover:text-[#05070A] font-bold transition-all cursor-pointer"
                          >
                            Challenge
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
