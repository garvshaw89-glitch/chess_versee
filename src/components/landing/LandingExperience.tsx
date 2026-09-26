import React, { useState } from 'react';
import { ChessCanvas } from '../../3d/ChessCanvas';
import { NavPage } from '../ui/Navbar';
import { useGameStore } from '../../store/gameStore';
import { useNavigationStore } from '../../store/navigationStore';
import { StorageService } from '../../services/storage';
import { EloService } from '../../services/eloService';
import { AI_OPPONENTS } from '../../services/chessAI';
import { soundService } from '../../services/sound';
import { PremiumButton } from '../ui/PremiumButton';
import { InteractiveBoardPreview } from './InteractiveBoardPreview';
import {
  ArrowRight,
  Play,
  Users,
  GraduationCap,
  Puzzle,
  Palette,
  Volume2,
  Shield,
  Zap,
  Sparkles,
  Layers,
  Cpu,
  Trophy,
  Award,
  CheckCircle2,
  Radio,
  Compass,
  Flame,
} from 'lucide-react';

interface LandingExperienceProps {
  onNavigate: (page: NavPage) => void;
}

export const LandingExperience: React.FC<LandingExperienceProps> = ({ onNavigate }) => {
  const { setGameMode, resetGame, setTwoPlayerSetupOpen, setAiOpponent } = useGameStore();
  const { openThemesModal, openSettings } = useNavigationStore();
  const [selectedBotId, setSelectedBotId] = useState(AI_OPPONENTS[2].id);
  const [synthSoundPlaying, setSynthSoundPlaying] = useState<string | null>(null);

  const stats = StorageService.getStats();
  const currentTier = EloService.getTier(stats.rating);

  const handleLaunchPlay = () => {
    setGameMode('play');
    resetGame();
    onNavigate('play');
  };

  const handleLaunch2Player = () => {
    setTwoPlayerSetupOpen(true);
  };

  const handlePlayBot = (botId: string) => {
    const targetBot = AI_OPPONENTS.find((b) => b.id === botId);
    if (targetBot) {
      setAiOpponent(targetBot);
      setGameMode('play');
      resetGame();
      onNavigate('play');
    }
  };

  const handleAuditionSound = (type: 'move' | 'capture' | 'check' | 'victory') => {
    setSynthSoundPlaying(type);
    if (type === 'move') soundService.playMove();
    if (type === 'capture') soundService.playCapture();
    if (type === 'check') soundService.playCheck();
    if (type === 'victory') soundService.playCheckmate();
    setTimeout(() => setSynthSoundPlaying(null), 400);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#08080a] text-neutral-100 flex flex-col overflow-x-hidden">
      {/* ============================================================== */}
      {/* 01. CINEMATIC HERO SECTION                                    */}
      {/* ============================================================== */}
      <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden border-b border-white/5">
        {/* Background 3D Three.js WebGL Canvas */}
        <div className="absolute inset-0 z-0 opacity-75 pointer-events-auto">
          <ChessCanvas isHeroPreview={true} interactive={false} />
        </div>

        {/* Ambient Depth Scrims */}
        <div className="absolute inset-0 z-1 pointer-events-none bg-gradient-to-b from-neutral-950/40 via-neutral-950/20 to-[#08080a]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />

        {/* Primary Hero Content Container */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12 flex flex-col items-center text-center my-auto">
          {/* Unboxed Editorial Eyebrow */}
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-amber-300/90 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>WebGL 60 FPS Engine · FIDE Regulated</span>
          </div>

          {/* Master Display Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-neutral-100 font-display leading-[1.05] drop-shadow-2xl max-w-4xl">
            Master the board.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-amber-200 to-amber-400">
              Command the dimension.
            </span>
          </h1>

          {/* Value Proposition Description */}
          <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl mt-6 font-normal leading-relaxed">
            Classical chess elevated by Three.js physical kinematics, zero-latency FIDE legality, procedural Web Audio acoustics, and persistent FIDE Elo progression.
          </p>

          {/* Primary & Secondary Action Gates */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-9 w-full max-w-md">
            <PremiumButton
              variant="primary"
              size="lg"
              onClick={handleLaunchPlay}
              icon={<Play className="w-4 h-4 fill-current" />}
              className="w-full sm:w-auto flex-1 font-bold text-neutral-950"
            >
              LAUNCH ARENA
            </PremiumButton>

            <PremiumButton
              variant="secondary"
              size="lg"
              onClick={() => onNavigate('learn')}
              icon={<GraduationCap className="w-4 h-4 text-purple-400" />}
              className="w-full sm:w-auto flex-1"
            >
              CHESS ACADEMY
            </PremiumButton>
          </div>

          {/* Quick Nav Anchors */}
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-neutral-400 font-mono">
            <button
              onClick={handleLaunch2Player}
              className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span>Pass &amp; Play 2P</span>
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('puzzles')}
              className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Puzzle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tactical Puzzles</span>
            </button>
            <span>·</span>
            <button
              onClick={openThemesModal}
              className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Material Studio</span>
            </button>
          </div>
        </div>

        {/* Quiet Bottom Telemetry Bar */}
        <div className="relative z-10 w-full border-t border-white/5 bg-neutral-950/60 backdrop-blur-md py-3.5 px-6">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between text-xs text-neutral-400 font-mono gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-neutral-200">Chess Engine Online</span>
              <span className="hidden sm:inline">· Stockfish Centipawn Evaluation</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span>60 FPS WebGL</span>
              <span>·</span>
              <span>Procedural Audio</span>
              <span>·</span>
              <span>FIDE Elo (K=32)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 02. CONTEXT & THE CRAFT OF MODERN CHESS (STORYTELLING)         */}
      {/* ============================================================== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto w-full border-b border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-mono tracking-widest uppercase text-amber-400">
              The Evolution of Board Experience
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-100 font-display leading-tight">
              Moving beyond static 2D tiles into tactile kinematics.
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              For three decades, online chess was confined to flat sprite bitmaps and mechanical click-to-teleport movements. ChessVerse rebuilds the tactile soul of the board.
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Every move follows realistic parabolic flight curves with gravitational acceleration and directional tilt. Pieces land with acoustic weight synthesized on the fly via the Web Audio API—with zero network latency and no audio files to download.
            </p>

            <div className="pt-2 flex items-center gap-6 text-xs font-mono text-neutral-300">
              <div>
                <div className="text-2xl font-bold font-display text-amber-400">0 ms</div>
                <div className="text-neutral-400 text-[11px] mt-0.5">Asset Download Delay</div>
              </div>
              <div className="w-px h-8 bg-neutral-800" />
              <div>
                <div className="text-2xl font-bold font-display text-emerald-400">60 FPS</div>
                <div className="text-neutral-400 text-[11px] mt-0.5">PBR Shadowed Render</div>
              </div>
              <div className="w-px h-8 bg-neutral-800" />
              <div>
                <div className="text-2xl font-bold font-display text-sky-400">100%</div>
                <div className="text-neutral-400 text-[11px] mt-0.5">Self-Contained Client</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-neutral-900/50 rounded-2xl border border-white/10 p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
              <span className="text-xs font-mono uppercase text-neutral-400">Kinematic Flight Arc Math</span>
              <span className="text-xs font-mono text-amber-400">y(t) = 4h · t(1 - t)</span>
            </div>

            {/* Parabolic Trajectory Diagram representation */}
            <div className="relative h-48 w-full bg-neutral-950/80 rounded-xl border border-white/5 p-4 flex flex-col justify-between overflow-hidden">
              <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                <span>Square (x₀, z₀)</span>
                <span className="text-amber-300">Peak Apex (Altitude h=0.85)</span>
                <span>Square (x₁, z₁)</span>
              </div>

              {/* Trajectory SVG */}
              <svg className="w-full h-24 overflow-visible" viewBox="0 0 500 100" fill="none">
                <path
                  d="M 30 80 Q 250 -10 470 80"
                  stroke="url(#arcGrad)"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  className="animate-pulse"
                />
                <circle cx="30" cy="80" r="5" fill="#f59e0b" />
                <circle cx="250" cy="35" r="7" fill="#fbbf24" filter="drop-shadow(0 0 8px #f59e0b)" />
                <circle cx="470" cy="80" r="5" fill="#10b981" />
                <defs>
                  <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 border-t border-white/5 pt-2">
                <span>Start: Lift Off &amp; Pitch Forward</span>
                <span>Midpoint: Rotational Symmetry</span>
                <span>Arrival: Damped Cushion Impact</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-3.5 rounded-xl bg-neutral-950/50 border border-white/5">
                <div className="text-xs font-semibold text-neutral-200">Dynamic Tilt Physics</div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  Pieces pitch smoothly along their trajectory vector, mimicking human finger movement.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950/50 border border-white/5">
                <div className="text-xs font-semibold text-neutral-200">Ground Shadow Scaling</div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  Shadow blur and opacity scale inversely with altitude for true 3D spatial depth.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 03. INTERACTIVE PRODUCT EXPERIENCE (LIVE BOARD INSPECTOR)       */}
      {/* ============================================================== */}
      <section className="relative py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full border-b border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="text-xs font-mono tracking-widest uppercase text-amber-400">
            Real-Time Hardware Inspection
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-100 font-display">
            Test the materials. Orbit the stage.
          </h2>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Interact with the actual procedural geometries and PBR shaders running in your browser right now.
          </p>
        </div>

        {/* Live Interactive Board Component */}
        <InteractiveBoardPreview onLaunchArena={handleLaunchPlay} />
      </section>

      {/* ============================================================== */}
      {/* 04. ASYMMETRIC CORE CAPABILITIES (ANTI-AI BENTO GRID)           */}
      {/* ============================================================== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto w-full border-b border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-mono tracking-widest uppercase text-amber-400">
              Core Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-100 font-display mt-2">
              Engineered for both casual sparring and grandmaster study.
            </h2>
          </div>
          <p className="text-xs font-mono text-neutral-400 max-w-xs text-left md:text-right">
            Four specialized subsystems running concurrently in a single unified architecture.
          </p>
        </div>

        {/* Asymmetric Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Card 1: Verifiable FIDE Elo Engine (Spans 7 cols) */}
          <div className="md:col-span-7 bg-neutral-900/60 rounded-2xl border border-white/10 p-7 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden group hover:border-amber-500/30 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-neutral-100 font-display">
                Verifiable FIDE Elo Rating System
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Standard FIDE expected-score algorithm ($K = 32$) persistent across sessions. Evaluates game outcomes against both AI bots and local opponents with post-game rating adjustment breakdown.
              </p>
            </div>

            {/* Live Interactive Elo Meter Preview */}
            <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between gap-4">
              <div>
                <div className="text-[10px] font-mono text-neutral-400 uppercase">Your Active Rating</div>
                <div className="text-2xl font-black font-mono text-amber-400 mt-0.5">
                  {stats.rating}{' '}
                  <span className={`text-xs font-bold ${currentTier.color}`}>
                    ({currentTier.name})
                  </span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('profile')}
                className="px-3.5 py-1.5 rounded-lg bg-neutral-800 text-xs font-mono text-neutral-200 hover:text-white border border-white/5 hover:border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Career Ledger</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 2: Dual Clocks Pass & Play (Spans 5 cols) */}
          <div className="md:col-span-5 bg-neutral-900/60 rounded-2xl border border-white/10 p-7 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden group hover:border-sky-500/30 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-neutral-100 font-display">
                Pass &amp; Play 2-Player Arena
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Side-by-side local battle station with customizable dual Fischer clocks (Bullet, Blitz, Rapid, Classical) and turn-based 180° board auto-flipping.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-white/5">
              <button
                onClick={handleLaunch2Player}
                className="w-full py-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300 font-bold text-xs hover:bg-sky-500/25 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Configure Local Match</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Chess Academy (Spans 5 cols) */}
          <div className="md:col-span-5 bg-neutral-900/60 rounded-2xl border border-white/10 p-7 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden group hover:border-purple-500/30 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-neutral-100 font-display">
                Interactive Chess Academy
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                4 comprehensive master chapters covering piece kinetics, fork/pin tactics, opening principles, and grandmaster endgame techniques with interactive move guidance.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs font-mono text-purple-300">4 Curriculum Levels</span>
              <button
                onClick={() => onNavigate('learn')}
                className="text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <span>Start Training</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 4: Procedural Web Audio Synth with Audition Buttons (Spans 7 cols) */}
          <div className="md:col-span-7 bg-neutral-900/60 rounded-2xl border border-white/10 p-7 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-neutral-100 font-display">
                Procedural Web Audio Synthesizer
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Zero MP3 audio files. All piece slides, heavy captures, alert checks, and victory fanfare chimes are synthesized dynamically via pure Web Audio oscillator nodes.
              </p>
            </div>

            {/* Interactive Sound Audition Row */}
            <div className="mt-6 pt-5 border-t border-white/5">
              <div className="text-[10px] font-mono uppercase text-neutral-400 mb-2.5">
                Audition Synthesizer Nodes:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'move' as const, label: 'Slide Thud' },
                  { id: 'capture' as const, label: 'Heavy Capture' },
                  { id: 'check' as const, label: 'Tension Alert' },
                  { id: 'victory' as const, label: 'Victory Chord' },
                ].map((snd) => (
                  <button
                    key={snd.id}
                    onClick={() => handleAuditionSound(snd.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      synthSoundPlaying === snd.id
                        ? 'bg-emerald-500 text-neutral-950 font-bold border-emerald-400 shadow-sm'
                        : 'bg-neutral-950 border-white/10 text-neutral-300 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>{snd.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 05. AI OPPONENT ROSTER & SPARRING SUITE                       */}
      {/* ============================================================== */}
      <section className="relative py-24 px-4 sm:px-6 max-w-6xl mx-auto w-full border-b border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="text-xs font-mono tracking-widest uppercase text-amber-400">
            Sparring Roster
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-100 font-display">
            Challenge graduated computing levels.
          </h2>
          <p className="text-sm text-neutral-300 leading-relaxed">
            From relaxed fundamentals to decisive alpha-beta minimax calculation.
          </p>
        </div>

        {/* AI Opponent Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {AI_OPPONENTS.map((bot) => {
            const isSelected = selectedBotId === bot.id;
            const changes = EloService.getPotentialChanges(stats.rating, bot.rating);
            return (
              <div
                key={bot.id}
                onClick={() => setSelectedBotId(bot.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                  isSelected
                    ? 'bg-neutral-900 border-amber-500/80 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/30'
                    : 'bg-neutral-900/50 border-white/5 hover:border-white/20 hover:bg-neutral-900/80'
                }`}
              >
                <div>
                  <div className="text-3xl mb-3">{bot.avatar}</div>
                  <div className="text-sm font-bold text-neutral-100 font-display">{bot.name}</div>
                  <div className="text-[11px] font-mono text-neutral-400">{bot.title}</div>
                  <div className="text-base font-black font-mono text-amber-400 mt-2">
                    {bot.rating} <span className="text-[10px] text-neutral-400 font-normal">Elo</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed line-clamp-2">
                    {bot.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5">
                  <div className="flex justify-between items-center text-[10px] font-mono mb-2 text-neutral-400">
                    <span>Win: <strong className="text-emerald-400">+{changes.win}</strong></span>
                    <span>Loss: <strong className="text-rose-400">{changes.loss}</strong></span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayBot(bot.id);
                    }}
                    className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-neutral-950 hover:bg-amber-300'
                        : 'bg-neutral-800 text-neutral-300 hover:text-white'
                    }`}
                  >
                    Spar Match
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 06. ARCHITECTURE & 4-LAYER WEBGL DEEP-DIVE                     */}
      {/* ============================================================== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto w-full border-b border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-mono tracking-widest uppercase text-amber-400">
              System Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-100 font-display">
              Decoupled, deterministic, reactive.
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed">
              ChessVerse completely separates the graphical rendering pipeline from the core chess state machine. State is synchronized through unidirectional Zustand reactive channels.
            </p>

            <ul className="space-y-3.5 text-xs text-neutral-300 font-mono">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Layer 1: FIDE Chess.js legality validator &amp; move generator</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Layer 2: Zustand reactive state store with local persistence</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Layer 3: Three.js WebGL scene graph with PCF shadow mapping</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Layer 4: Zero-latency Web Audio acoustic synthesizer</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7 bg-neutral-900/60 rounded-2xl border border-white/10 p-6 sm:p-8 backdrop-blur-sm space-y-3">
            {[
              { num: '01', title: 'React 19 & Tailwind CSS Interface Layer', desc: 'HUD overlays, dual Fischer clocks, move history notation, modal portals', tag: 'UI Shell' },
              { num: '02', title: 'Zustand Unidirectional State Machine', desc: 'Game modes, player turns, move logs, FEN strings, sound dispatch', tag: 'State Core' },
              { num: '03', title: 'Three.js & React Three Fiber Scene Graph', desc: 'Procedural meshes, PBR lighting, parabolic trajectory physics, raycasting', tag: 'WebGL 60 FPS' },
              { num: '04', title: 'Web Audio API Acoustic Synthesizer', desc: 'Real-time procedural piece thuds, captures, clock ticks, and fanfare', tag: 'Acoustics' },
            ].map((layer) => (
              <div
                key={layer.num}
                className="p-4 rounded-xl bg-neutral-950/70 border border-white/5 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">{layer.num}.</span>
                    <span className="text-xs sm:text-sm font-bold text-neutral-100">{layer.title}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">{layer.desc}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-neutral-900 border border-white/5 text-neutral-400 whitespace-nowrap shrink-0">
                  {layer.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 07. FINAL CALL TO ACTION                                       */}
      {/* ============================================================== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 max-w-4xl mx-auto w-full text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-neutral-900 via-neutral-900/90 to-neutral-950 border border-amber-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <span className="font-brand text-3xl text-amber-400 font-serif">♔</span>

            <h2 className="text-3xl sm:text-5xl font-black text-neutral-100 font-display max-w-2xl mx-auto leading-tight">
              Ready to take your seat at the board?
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 max-w-lg mx-auto leading-relaxed">
              No account required. Instant matchmaking against bots or local friends with persistent FIDE Elo progression.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4 max-w-md mx-auto">
              <PremiumButton
                variant="primary"
                size="lg"
                onClick={handleLaunchPlay}
                icon={<Play className="w-4 h-4 fill-current" />}
                className="w-full sm:w-auto flex-1 font-bold text-neutral-950"
              >
                ENTER ARENA NOW
              </PremiumButton>

              <PremiumButton
                variant="secondary"
                size="lg"
                onClick={handleLaunch2Player}
                icon={<Users className="w-4 h-4 text-sky-400" />}
                className="w-full sm:w-auto flex-1"
              >
                2-PLAYER PASS &amp; PLAY
              </PremiumButton>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 08. QUIET AGENCY-GRADE FOOTER                                  */}
      {/* ============================================================== */}
      <footer className="w-full border-t border-white/5 bg-neutral-950 py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg text-amber-400">♔</span>
              <span className="font-brand text-lg font-bold tracking-wider text-neutral-100">
                CHESSVERSE
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs">
              Autonomous WebGL spatial chess platform. Procedural physics, FIDE Elo rating ledger, and acoustic synthesis.
            </p>
          </div>

          {/* Quick Route Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400 font-mono">
            <button
              onClick={() => onNavigate('play')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Play Arena
            </button>
            <button
              onClick={handleLaunch2Player}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Pass &amp; Play 2P
            </button>
            <button
              onClick={() => onNavigate('learn')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Chess Academy
            </button>
            <button
              onClick={() => onNavigate('puzzles')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Puzzles
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Profile &amp; Elo
            </button>
            <button
              onClick={openThemesModal}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Themes
            </button>
            <button
              onClick={openSettings}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Settings
            </button>
          </div>

          {/* Copyright */}
          <div className="text-[11px] font-mono text-neutral-400">
            © {new Date().getFullYear()} ChessVerse. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
