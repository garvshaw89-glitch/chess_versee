import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useLearnStore } from '../store/learnStore';
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
  ChevronRight,
  GraduationCap,
  Puzzle,
  Edit2,
  Check,
  Bot,
  Users,
  TrendingUp,
  Target,
  Sparkles,
  Shield
} from 'lucide-react';
import { StorageService, storage } from '../services/storage';
import { EloService } from '../../src/services/eloService';
import { Button3D } from '../components/ui/Button3D';
import { StaggerContainer } from '../components/transitions/StaggerContainer';
import { EloPerformanceChart } from '../components/profile/EloPerformanceChart';
import { EloCalculatorWidget } from '../components/profile/EloCalculatorWidget';
import { EloHistoryTable } from '../components/profile/EloHistoryTable';

interface ProfileViewProps {
  onNavigate: (page: NavPage) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  const { stats, showToast } = useGameStore();
  const { 
    completedLessonIds, 
    learningStreakDays, 
    getTotalProgress 
  } = useLearnStore();

  const [playerStats, setPlayerStats] = useState(() => StorageService.getStats());
  const [eloHistory, setEloHistory] = useState(() => StorageService.getEloHistory());
  const [username, setUsername] = useState(() => StorageService.getStats().username || 'Grandmaster');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(username);

  const refreshStats = () => {
    const updated = StorageService.getStats();
    setPlayerStats(updated);
    setEloHistory(StorageService.getEloHistory());
    setUsername(updated.username || 'Grandmaster');
  };

  useEffect(() => {
    refreshStats();
  }, []);

  const totalMatches = playerStats.gamesPlayed || (playerStats.wins + playerStats.losses + playerStats.draws);
  const winRate = totalMatches > 0 ? Math.round((playerStats.wins / totalMatches) * 100) : 0;
  const lessonsCompletedCount = completedLessonIds.length;
  const puzzlesSolvedCount = playerStats.puzzlesSolved || 0;
  const courseProgressPercent = getTotalProgress();

  const currentRating = playerStats.rating || 1250;
  const tierProgress = EloService.getTierProgress(currentRating);
  const currentTier = tierProgress.currentTier;
  const nextTier = tierProgress.nextTier;

  const handleSaveName = () => {
    if (tempName.trim()) {
      const updated = { ...playerStats, username: tempName.trim() };
      StorageService.saveStats(updated);
      setUsername(tempName.trim());
      setIsEditingName(false);
      showToast('Profile name updated', 'success');
    }
  };

  const achievements = [
    { 
      id: 'first_win', 
      name: 'First Victory', 
      desc: 'Win your first rated chess match', 
      unlocked: playerStats.wins >= 1 
    },
    { 
      id: 'scholar', 
      name: 'Tactical Mind', 
      desc: 'Complete at least 5 curriculum lessons', 
      unlocked: lessonsCompletedCount >= 5 
    },
    { 
      id: 'puzzle_master', 
      name: 'Puzzle Solver', 
      desc: 'Solve tactical chess puzzles', 
      unlocked: puzzlesSolvedCount >= 1 
    },
    { 
      id: 'streak', 
      name: 'Hot Streak', 
      desc: 'Achieve a winning streak of 3 matches', 
      unlocked: playerStats.currentStreak >= 3 
    },
    {
      id: 'tactician_tier',
      name: 'Tactician Rank',
      desc: 'Reach 1200+ Elo rating',
      unlocked: currentRating >= 1200
    },
    {
      id: 'ai_conqueror',
      name: 'AI Challenger',
      desc: 'Defeat an AI bot in rated battle',
      unlocked: (playerStats.aiWins || 0) >= 1
    }
  ];

  return (
    <div className="w-full min-h-[calc(100vh-60px)] p-4 sm:p-8 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 overflow-y-auto">
      <StaggerContainer staggerMs={60} baseDelayMs={40} className="max-w-5xl mx-auto space-y-6">
        
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-xl backdrop-blur-md">
          {/* Avatar */}
          <div className="relative">
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${currentTier.gradient} flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20 text-neutral-950 font-serif font-black`}>
              ♔
            </div>
            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-neutral-950 border border-amber-500 text-[10px] font-mono font-bold text-amber-400">
              {currentTier.badge} {currentTier.name.toUpperCase()}
            </div>
          </div>

          {/* User Info & Rating Highlight */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                {isEditingName ? (
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      maxLength={24}
                      className="px-3 py-1 bg-neutral-950 border border-amber-500/60 rounded-lg text-neutral-100 font-display text-lg focus:outline-none"
                      autoFocus
                    />
                    <Button3D
                      variant="primary"
                      size="sm"
                      onClick={handleSaveName}
                      icon={<Check className="w-3.5 h-3.5" />}
                    >
                      Save
                    </Button3D>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <h2 className="text-2xl font-bold text-neutral-100 font-display">
                      {username}
                    </h2>
                    <button
                      onClick={() => {
                        setTempName(username);
                        setIsEditingName(true);
                      }}
                      className="p-1 rounded-md text-neutral-400 hover:text-amber-400 transition-colors"
                      title="Edit username"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <p className="text-xs text-neutral-400 mt-1">
                  ChessVerse 3D Practitioner • Verified FIDE Elo Rating System
                </p>
              </div>

              {/* Prominent Elo Badge on Right */}
              <div className="flex items-center justify-center sm:justify-end gap-2 bg-neutral-950/80 px-4 py-2 rounded-xl border border-neutral-800">
                <div className="text-right">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                    Rating
                  </div>
                  <div className="text-2xl font-black font-mono text-amber-400 leading-none mt-0.5">
                    {currentRating}
                  </div>
                </div>
                <div className="w-px h-8 bg-neutral-800 mx-1" />
                <div className="text-left font-mono">
                  <span className={`text-xs font-bold block ${currentTier.color}`}>
                    {currentTier.name}
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    Peak: {playerStats.peakRating || currentRating}
                  </span>
                </div>
              </div>
            </div>

            {/* Badges strip */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4 font-mono text-xs">
              <div className="px-3 py-1 rounded-lg bg-neutral-950/80 border border-neutral-800 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-400" />
                <span className="text-neutral-400">Current Streak:</span>
                <span className="font-bold text-neutral-200">{playerStats.currentStreak}</span>
              </div>
              <div className="px-3 py-1 rounded-lg bg-neutral-950/80 border border-neutral-800 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-neutral-400">Best Streak:</span>
                <span className="font-bold text-neutral-200">{playerStats.bestStreak || playerStats.currentStreak}</span>
              </div>
              <div className="px-3 py-1 rounded-lg bg-neutral-950/80 border border-neutral-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-neutral-400">Study Streak:</span>
                <span className="font-bold text-neutral-200">{learningStreakDays}d</span>
              </div>
              <div className="px-3 py-1 rounded-lg bg-neutral-950/80 border border-neutral-800 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-neutral-400">Curriculum:</span>
                <span className="font-bold text-purple-300">{courseProgressPercent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Elo Rating Tier Progression & Breakdown Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Tier Progress Card (Span 2) */}
          <div className="lg:col-span-2 p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200 font-mono">
                    Rating Tier Progression
                  </h3>
                </div>
                <span className="text-xs font-mono text-neutral-400">
                  {nextTier ? `${tierProgress.pointsNeeded} pts to ${nextTier.name}` : 'Highest Tier Achieved'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 rounded-full bg-neutral-950 border border-neutral-800 p-0.5 overflow-hidden my-3">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500 shadow-md shadow-amber-500/20"
                  style={{ width: `${tierProgress.progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  {currentTier.badge} {currentTier.name} ({currentTier.minRating})
                </span>
                <span className="text-neutral-200 font-bold">
                  {currentRating} Elo
                </span>
                {nextTier ? (
                  <span className="text-neutral-400 flex items-center gap-1">
                    {nextTier.badge} {nextTier.name} ({nextTier.minRating})
                  </span>
                ) : (
                  <span className="text-amber-300 font-bold">Grandmaster ⚡</span>
                )}
              </div>
            </div>

            {/* Low & Peak stats pills */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-neutral-800/80 font-mono text-center">
              <div className="p-2 rounded-lg bg-neutral-950/60 border border-neutral-800">
                <span className="text-[10px] text-neutral-500 uppercase block">Current</span>
                <span className="text-base font-bold text-amber-400">{currentRating}</span>
              </div>
              <div className="p-2 rounded-lg bg-neutral-950/60 border border-neutral-800">
                <span className="text-[10px] text-neutral-500 uppercase block">Peak Record</span>
                <span className="text-base font-bold text-emerald-400">{playerStats.peakRating || currentRating}</span>
              </div>
              <div className="p-2 rounded-lg bg-neutral-950/60 border border-neutral-800">
                <span className="text-[10px] text-neutral-500 uppercase block">Floor</span>
                <span className="text-base font-bold text-neutral-300">{playerStats.lowestRating || currentRating}</span>
              </div>
            </div>
          </div>

          {/* Mode Breakdown Card (Span 1) */}
          <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col justify-between space-y-3 font-mono">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-2">
              <Swords className="w-4 h-4 text-sky-400" />
              <span>Match Categorization</span>
            </h3>

            {/* vs AI stats */}
            <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-neutral-200 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-amber-400" />
                  <span>vs AI Engines</span>
                </span>
                <span className="text-amber-400 font-bold">
                  {playerStats.aiWins || 0}W - {playerStats.aiLosses || 0}L - {playerStats.aiDraws || 0}D
                </span>
              </div>
              <div className="text-[11px] text-neutral-400">
                {playerStats.aiGamesPlayed || 0} completed matches
              </div>
            </div>

            {/* vs Local stats */}
            <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-neutral-200 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  <span>vs Local Opponents</span>
                </span>
                <span className="text-sky-400 font-bold">
                  {playerStats.localWins || 0}W - {playerStats.localLosses || 0}L - {playerStats.localDraws || 0}D
                </span>
              </div>
              <div className="text-[11px] text-neutral-400">
                {playerStats.localGamesPlayed || 0} completed matches
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Elo Performance Trajectory Graph */}
        <EloPerformanceChart history={eloHistory} />

        {/* Interactive Elo Simulator & Match Predictor */}
        <EloCalculatorWidget currentRating={currentRating} />

        {/* Complete Elo Adjustment Ledger */}
        <EloHistoryTable history={eloHistory} onStatsUpdated={refreshStats} />

        {/* Career Statistics Matrix */}
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 mb-3 px-1">
            Career Record Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            {/* 1. Games Played */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400">Games Played</span>
              <div className="text-2xl sm:text-3xl font-bold text-neutral-100 mt-1">
                {totalMatches}
              </div>
            </div>

            {/* 2. Wins */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400">Wins</span>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">
                {playerStats.wins}
              </div>
            </div>

            {/* 3. Losses */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400">Losses</span>
              <div className="text-2xl sm:text-3xl font-bold text-red-400 mt-1">
                {playerStats.losses}
              </div>
            </div>

            {/* 4. Draws */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400">Draws</span>
              <div className="text-2xl sm:text-3xl font-bold text-neutral-300 mt-1">
                {playerStats.draws}
              </div>
            </div>

            {/* 5. Lessons Completed */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400">Lessons Completed</span>
              <div className="text-2xl sm:text-3xl font-bold text-purple-400 mt-1">
                {lessonsCompletedCount}
              </div>
            </div>

            {/* 6. Puzzles Solved */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400">Puzzles Solved</span>
              <div className="text-2xl sm:text-3xl font-bold text-cyan-400 mt-1">
                {puzzlesSolvedCount}
              </div>
            </div>

            {/* 7. Win Rate */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400">Win Rate</span>
              <div className="text-2xl sm:text-3xl font-bold text-amber-400 mt-1">
                {winRate}%
              </div>
            </div>

            {/* 8. Course Progress */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400">Curriculum</span>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">
                {courseProgressPercent}%
              </div>
            </div>
          </div>
        </div>

        {/* Badges and Milestones Section */}
        <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-800">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200 font-mono">
              Badges & Milestones
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="flex flex-col justify-between p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <div>
              <h4 className="text-sm font-bold text-neutral-100">Play Rated Match</h4>
              <p className="text-xs text-neutral-400 mt-1">Play rated game against AI bots or challenge local opponents.</p>
            </div>
            <div className="mt-4">
              <Button3D
                variant="primary"
                size="sm"
                onClick={() => onNavigate('play')}
                icon={<ChevronRight className="w-3.5 h-3.5" />}
                className="w-full"
              >
                PLAY NOW
              </Button3D>
            </div>
          </div>

          <div className="flex flex-col justify-between p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <div>
              <h4 className="text-sm font-bold text-neutral-100">Study Curriculum</h4>
              <p className="text-xs text-neutral-400 mt-1">Master openings, endgames, tactics, and famous games.</p>
            </div>
            <div className="mt-4">
              <Button3D
                variant="purple"
                size="sm"
                onClick={() => onNavigate('learn')}
                icon={<GraduationCap className="w-3.5 h-3.5" />}
                className="w-full"
              >
                OPEN ACADEMY
              </Button3D>
            </div>
          </div>

          <div className="flex flex-col justify-between p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <div>
              <h4 className="text-sm font-bold text-neutral-100">Tactical Puzzles</h4>
              <p className="text-xs text-neutral-400 mt-1">Sharp tactical puzzles with hint and solve feedback.</p>
            </div>
            <div className="mt-4">
              <Button3D
                variant="emerald"
                size="sm"
                onClick={() => onNavigate('puzzles')}
                icon={<Puzzle className="w-3.5 h-3.5" />}
                className="w-full"
              >
                SOLVE PUZZLES
              </Button3D>
            </div>
          </div>
        </div>
      </StaggerContainer>
    </div>
  );
};
