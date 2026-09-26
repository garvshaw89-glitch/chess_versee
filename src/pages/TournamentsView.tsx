import React, { useState } from 'react';
import { NavPage } from '../components/ui/Navbar';
import { 
  Trophy, 
  Users, 
  Clock, 
  Calendar, 
  Award, 
  Flame, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles,
  Play
} from 'lucide-react';
import { soundService } from '../services/sound';

interface TournamentsViewProps {
  onNavigate: (page: NavPage) => void;
}

interface TournamentCardData {
  id: string;
  name: string;
  timeControl: string;
  playersCount: number;
  maxPlayers: number;
  prizePool: string;
  startTime: string;
  status: 'LIVE' | 'UPCOMING' | 'FINISHED';
  tierRequired: string;
}

export const TournamentsView: React.FC<TournamentsViewProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<'ALL' | 'LIVE' | 'UPCOMING'>('ALL');
  const [joinedId, setJoinedId] = useState<string | null>(null);

  const tournaments: TournamentCardData[] = [
    {
      id: 'tourn-1',
      name: 'Sunday Grandmaster Blitz Arena',
      timeControl: '3+0 Blitz',
      playersCount: 48,
      maxPlayers: 64,
      prizePool: '1,500 Arena Elo',
      startTime: 'Live Now · Round 3 of 7',
      status: 'LIVE',
      tierRequired: 'Apprentice+'
    },
    {
      id: 'tourn-2',
      name: 'Tactical Bullet Royale',
      timeControl: '1+0 Bullet',
      playersCount: 112,
      maxPlayers: 128,
      prizePool: '2,500 Arena Elo + Custom Badge',
      startTime: 'In 35 minutes',
      status: 'UPCOMING',
      tierRequired: 'Challenger+'
    },
    {
      id: 'tourn-3',
      name: 'Classical Swiss Championship',
      timeControl: '10+5 Rapid',
      playersCount: 28,
      maxPlayers: 32,
      prizePool: 'FIDE Verified Calibration',
      startTime: 'Starts Tomorrow, 18:00 UTC',
      status: 'UPCOMING',
      tierRequired: 'Open to All'
    },
    {
      id: 'tourn-4',
      name: 'Midnight Speed Marathon',
      timeControl: '2+1 Fast Blitz',
      playersCount: 64,
      maxPlayers: 64,
      prizePool: 'Crown Trophy Artifact',
      startTime: 'Completed',
      status: 'FINISHED',
      tierRequired: 'Tactician+'
    },
  ];

  const filtered = tournaments.filter((t) => filter === 'ALL' || t.status === filter);

  const handleJoin = (id: string) => {
    soundService.playSuccess();
    setJoinedId(id);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-60px)] bg-[#05070A] text-[#F5F7FA] p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#C9A227] uppercase tracking-widest">
              <Trophy className="w-4 h-4" />
              <span>Competitive Circuit</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#F5F7FA] mt-1">
              Tournaments &amp; Swiss Arenas
            </h1>
            <p className="text-sm text-[#8D98A8] mt-1 max-w-xl">
              Compete in FIDE-regulated brackets, earn seasonal trophies, and climb the seasonal championship standings.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex rounded-xl bg-[#0A0E13] p-1 border border-white/10 self-start sm:self-center gap-1">
            {(['ALL', 'LIVE', 'UPCOMING'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  soundService.playClick();
                  setFilter(tab);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  filter === tab
                    ? 'bg-[#151C25] text-[#E8C75A] border border-[#C9A227]/40 shadow'
                    : 'text-[#8D98A8] hover:text-[#F5F7FA]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tournament Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((tourn) => {
            const isLive = tourn.status === 'LIVE';
            const isJoined = joinedId === tourn.id;

            return (
              <div
                key={tourn.id}
                className="p-5 rounded-2xl bg-[#0A0E13] border border-white/10 hover:border-[#C9A227]/40 transition-all flex flex-col justify-between shadow-xl relative overflow-hidden group"
              >
                {/* Status Glow */}
                {isLive && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#E45D6A]/10 blur-2xl pointer-events-none" />
                )}

                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-[#E45D6A] animate-ping' : 'bg-[#C9A227]'}`} />
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isLive ? 'text-[#E45D6A]' : 'text-[#8D98A8]'}`}>
                        {tourn.status}
                      </span>
                      <span className="text-white/20">·</span>
                      <span className="text-[11px] font-mono text-[#E8C75A] font-bold">
                        {tourn.timeControl}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#8D98A8]">
                      {tourn.tierRequired}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-[#F5F7FA] mt-3 group-hover:text-[#E8C75A] transition-colors">
                    {tourn.name}
                  </h2>

                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono text-[#8D98A8]">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#5ED6E6]" />
                      <span>{tourn.playersCount} / {tourn.maxPlayers} Registered</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#E8C75A]" />
                      <span className="truncate">{tourn.startTime}</span>
                    </div>
                  </div>

                  <div className="mt-3 p-2 rounded-xl bg-[#05070A] border border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-[#8D98A8]">Prize Caliber:</span>
                    <span className="text-[#35C98B] font-bold">{tourn.prizePool}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center gap-2">
                  {isLive ? (
                    <button
                      onClick={() => onNavigate('play')}
                      className="w-full py-2.5 rounded-xl bg-[#E45D6A] hover:bg-[#ff6e7c] text-white text-xs font-bold font-mono transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Spectate / Enter Match</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoin(tourn.id)}
                      disabled={isJoined || tourn.status === 'FINISHED'}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold font-mono transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                        isJoined
                          ? 'bg-[#35C98B]/20 text-[#35C98B] border border-[#35C98B]/40 cursor-default'
                          : tourn.status === 'FINISHED'
                          ? 'bg-white/5 text-[#667080] cursor-not-allowed'
                          : 'bg-[#C9A227] hover:bg-[#E8C75A] text-[#05070A]'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{isJoined ? 'Registered ✓' : 'Register for Bracket'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
