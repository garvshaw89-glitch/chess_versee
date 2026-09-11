import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ChessCanvas } from '../3d/ChessCanvas';
import { GameClock } from '../components/ui/GameClock';
import { CapturedPieces } from '../components/ui/CapturedPieces';
import { MoveHistoryPanel } from '../components/ui/MoveHistoryPanel';
import { GameControlsBar } from '../components/ui/GameControlsBar';
import { PromotionModal } from '../components/ui/PromotionModal';
import { CheckmateModal } from '../components/ui/CheckmateModal';
import { NavPage } from '../components/ui/Navbar';
import { AIDifficulty, PieceColor } from '../types/chess';
import { 
  Bot, 
  Cpu, 
  Sparkles, 
  Zap, 
  RotateCcw, 
  HelpCircle, 
  Play, 
  Sliders,
  Check
} from 'lucide-react';
import { getBestMove } from '../services/aiEngine';
import { Button3D } from '../components/ui/Button3D';
import { StaggerContainer } from '../components/transitions/StaggerContainer';
import { soundService } from '../services/sound';

interface VsAiViewProps {
  onNavigate: (page: NavPage) => void;
  onOpenSettings: () => void;
}

const AI_LEVELS: { level: AIDifficulty; name: string; elo: number; depth: number; desc: string }[] = [
  { level: 1, name: 'Trainee Bot', elo: 800, depth: 1, desc: 'Prone to tactical oversights. Perfect for beginners.' },
  { level: 2, name: 'Club Player', elo: 1200, depth: 2, desc: 'Understands basic captures, trades, and center control.' },
  { level: 3, name: 'Tactical Veteran', elo: 1600, depth: 3, desc: 'Calculates forks, pins, skewers, and tactical combinations.' },
  { level: 4, name: 'International Master', elo: 2000, depth: 4, desc: 'High positional accuracy with aggressive counter-attacks.' },
  { level: 5, name: 'Grandmaster DeepAI', elo: 2400, depth: 5, desc: 'Minimax engine with deep alpha-beta pruning.' }
];

export const VsAiView: React.FC<VsAiViewProps> = ({ onNavigate, onOpenSettings }) => {
  const {
    chess,
    aiDifficulty,
    setAiDifficulty,
    playerColor,
    setPlayerColor,
    aiThinking,
    isGameOver,
    setGameMode,
    resetGame,
    makeMove,
    showToast,
    history
  } = useGameStore();

  const [inGame, setInGame] = useState<boolean>(() => history.length > 0);
  const [hintMove, setHintMove] = useState<string | null>(null);

  const currentLevelInfo = AI_LEVELS.find((l) => l.level === aiDifficulty) || AI_LEVELS[2];

  const handleStartMatch = (selectedLevel: AIDifficulty, color: PieceColor) => {
    setGameMode('vs_ai');
    setAiDifficulty(selectedLevel);
    setPlayerColor(color);
    resetGame();
    setInGame(true);
    setHintMove(null);
  };

  const handleRequestHint = async () => {
    if (isGameOver || aiThinking) return;
    showToast('Calculating tactical grandmaster suggestion...', 'info');
    const move = await getBestMove(chess, 3);
    if (move) {
      setHintMove(`${move.from.toUpperCase()} ➔ ${move.to.toUpperCase()}`);
      showToast(`Suggested move: ${move.from.toUpperCase()} to ${move.to.toUpperCase()}`, 'success');
    }
  };

  if (!inGame) {
    return (
      <div className="w-full min-h-[calc(100vh-60px)] flex items-center justify-center p-4 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
        <StaggerContainer 
          staggerMs={70} 
          baseDelayMs={50}
          className="w-full max-w-2xl bg-neutral-900/90 border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-md"
        >
          {/* Header */}
          <div className="flex items-center gap-3 pb-6 border-b border-neutral-800">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 font-display">
                AI ARENA BATTLE
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Configure your artificial intelligence opponent and battle conditions
              </p>
            </div>
          </div>

          {/* AI Difficulty Tiers */}
          <div className="my-6">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-3">
              Choose Engine Difficulty
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AI_LEVELS.map((item) => {
                const isSelected = aiDifficulty === item.level;
                return (
                  <button
                    key={item.level}
                    onClick={() => {
                      soundService.playButton3DPress('tactile');
                      setAiDifficulty(item.level);
                    }}
                    className={`flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-neutral-100 shadow-md shadow-amber-500/10'
                        : 'bg-neutral-950/50 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-neutral-100">{item.name}</span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-neutral-800 text-amber-400 font-semibold">
                        ELO {item.elo}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-3">
              Play As
            </label>
            <div className="grid grid-cols-3 gap-3">
              <Button3D
                variant={playerColor === 'w' ? 'primary' : 'secondary'}
                size="md"
                onClick={() => setPlayerColor('w')}
              >
                <span>⚪ WHITE</span>
              </Button3D>

              <Button3D
                variant={playerColor === 'b' ? 'primary' : 'secondary'}
                size="md"
                onClick={() => setPlayerColor('b')}
              >
                <span>⚫ BLACK</span>
              </Button3D>

              <Button3D
                variant="secondary"
                size="md"
                onClick={() => setPlayerColor(Math.random() > 0.5 ? 'w' : 'b')}
                icon={<Zap className="w-3.5 h-3.5 text-amber-400" />}
              >
                <span>RANDOM</span>
              </Button3D>
            </div>
          </div>

          {/* Start Battle Button with 3D button interaction */}
          <Button3D
            variant="primary"
            size="lg"
            onClick={() => handleStartMatch(aiDifficulty, playerColor)}
            icon={<Play className="w-4 h-4 fill-current" />}
            className="w-full !py-4 text-sm tracking-wider font-extrabold"
          >
            COMMENCE BATTLE
          </Button3D>
        </StaggerContainer>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-60px)] flex flex-col lg:flex-row overflow-hidden bg-neutral-950">
      {/* 3D Chess Canvas */}
      <div className="relative flex-1 h-[55vh] lg:h-full flex flex-col items-center justify-between p-2 sm:p-4 overflow-hidden">
        {/* Top AI Status Banner */}
        <div className="w-full max-w-xl flex items-center justify-between z-10 px-2 py-1">
          <div className="flex items-center gap-2.5 bg-neutral-900/80 px-3 py-1.5 rounded-xl border border-neutral-800 backdrop-blur-md">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-neutral-200">{currentLevelInfo.name}</span>
                <span className="text-[10px] font-mono px-1 rounded bg-neutral-800 text-amber-400 font-bold">
                  {currentLevelInfo.elo}
                </span>
              </div>
              <span className="text-[10px] text-neutral-400">Depth {currentLevelInfo.depth} • Alpha-Beta</span>
            </div>
          </div>

          {/* Engine calculation state */}
          <div className="flex items-center gap-2">
            {aiThinking && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono animate-pulse">
                <Cpu className="w-3.5 h-3.5" />
                <span>EVALUATING POSITIONS...</span>
              </div>
            )}
            {hintMove && !aiThinking && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>HINT: {hintMove}</span>
              </div>
            )}
          </div>
        </div>

        {/* 3D Board Viewport */}
        <div className="relative w-full h-full flex-1 flex items-center justify-center">
          <ChessCanvas />
        </div>

        {/* Clocks */}
        <div className="w-full max-w-xl z-10">
          <GameClock />
        </div>
      </div>

      {/* Right Sidebar: Stats, History & Assistant Controls */}
      <div className="w-full lg:w-84 xl:w-96 h-[45vh] lg:h-full bg-neutral-950/95 border-t lg:border-t-0 lg:border-l border-neutral-800/80 p-3 sm:p-4 flex flex-col gap-3 z-10 overflow-y-auto">
        {/* Match Header & Change Opponent */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
            AI Battlefield
          </span>
          <div className="flex items-center gap-2">
            <Button3D
              variant="secondary"
              size="sm"
              onClick={handleRequestHint}
              disabled={aiThinking || isGameOver}
              icon={<HelpCircle className="w-3.5 h-3.5 text-amber-400" />}
              className="text-xs"
            >
              <span>Hint</span>
            </Button3D>
            <Button3D
              variant="secondary"
              size="sm"
              onClick={() => setInGame(false)}
              icon={<Sliders className="w-3.5 h-3.5 text-neutral-400" />}
              className="text-xs"
            >
              <span>Change AI</span>
            </Button3D>
          </div>
        </div>

        {/* Captured Pieces */}
        <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-2.5">
          <CapturedPieces />
        </div>

        {/* Move Log */}
        <div className="flex-1 min-h-[160px]">
          <MoveHistoryPanel />
        </div>

        {/* Controls */}
        <GameControlsBar onOpenSettings={onOpenSettings} />
      </div>

      {/* Overlays */}
      <PromotionModal />
      <CheckmateModal onNavigateHome={() => onNavigate('landing')} />
    </div>
  );
};
