import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '../../store/gameStore';
import { 
  Trophy, 
  RotateCw, 
  BarChart2, 
  Home, 
  Flag, 
  Award, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Sparkles,
  Zap,
  Shield
} from 'lucide-react';
import { Modal3D } from '../transitions/Modal3D';
import { Button3D } from './Button3D';
import { EloService } from '../../services/eloService';

interface CheckmateModalProps {
  onNavigateHome: () => void;
  onNavigateAnalyze?: () => void;
}

export const CheckmateModal: React.FC<CheckmateModalProps> = ({
  onNavigateHome,
  onNavigateAnalyze
}) => {
  const {
    isGameOver,
    winner,
    winReason,
    history,
    resetGame,
    playerColor,
    gameMode,
    players,
    setTwoPlayerSetupOpen,
    lastEloAdjustment
  } = useGameStore();

  const isPlayerWinner = winner === playerColor;

  useEffect(() => {
    if (isGameOver && winner && winner !== 'draw' && isPlayerWinner) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  }, [isGameOver, winner, isPlayerWinner]);

  if (!isGameOver) return null;

  const winnerDisplayName =
    winner === 'draw'
      ? 'Draw'
      : winner === 'w'
      ? players?.white || 'White'
      : players?.black || 'Black';

  const tier = lastEloAdjustment ? EloService.getTier(lastEloAdjustment.ratingAfter) : null;

  return (
    <Modal3D isOpen={isGameOver} onClose={() => {}} maxWidth="max-w-md">
      <div className="relative w-full p-5 sm:p-7 text-center">
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-amber-500 rounded-full blur-[2px]" />

        {/* Victory Icon / Badge */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3 shadow-inner">
          {winner === 'draw' ? (
            <Award className="w-8 h-8" />
          ) : isPlayerWinner ? (
            <Trophy className="w-8 h-8 animate-bounce text-amber-400" />
          ) : (
            <Shield className="w-8 h-8 text-neutral-400" />
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-100 font-display">
          {winner === 'draw'
            ? 'GAME DRAWN'
            : gameMode === 'play'
            ? isPlayerWinner
              ? 'VICTORY!'
              : 'DEFEAT'
            : `${winnerDisplayName.toUpperCase()} WINS!`}
        </h2>

        {/* Subtitle / Reason */}
        <p className="text-xs sm:text-sm font-medium text-amber-400/90 mt-1 tracking-wider font-mono">
          {winReason || 'Match completed'}
        </p>

        {/* Elo Rating Adjustment Card */}
        {lastEloAdjustment && (
          <div className="my-4 p-3.5 rounded-xl bg-gradient-to-b from-neutral-900/90 to-neutral-950 border border-neutral-800 shadow-xl relative overflow-hidden">
            {/* Background accent glow */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 ${
              lastEloAdjustment.change > 0 
                ? 'bg-emerald-500' 
                : lastEloAdjustment.change < 0 
                ? 'bg-rose-500' 
                : 'bg-neutral-500'
            }`} />

            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  Elo Rating Update
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl sm:text-2xl font-bold font-mono text-neutral-100">
                    {lastEloAdjustment.ratingAfter}
                  </span>
                  <span className="text-xs font-mono text-neutral-400">
                    from {lastEloAdjustment.ratingBefore}
                  </span>
                </div>
              </div>

              {/* Delta Badge */}
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-mono font-bold text-sm ${
                lastEloAdjustment.change > 0
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : lastEloAdjustment.change < 0
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
              }`}>
                {lastEloAdjustment.change > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : lastEloAdjustment.change < 0 ? (
                  <TrendingDown className="w-4 h-4" />
                ) : (
                  <Minus className="w-4 h-4" />
                )}
                <span>
                  {lastEloAdjustment.change > 0 ? `+${lastEloAdjustment.change}` : lastEloAdjustment.change}
                </span>
              </div>
            </div>

            {/* Rank / Tier notification */}
            <div className="mt-2.5 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-neutral-400 truncate max-w-[190px]">
                vs {lastEloAdjustment.opponentName} ({lastEloAdjustment.opponentRating})
              </span>
              {tier && (
                <span className={`px-2 py-0.5 rounded font-bold ${tier.bgBadge}`}>
                  {tier.badge} {tier.name}
                </span>
              )}
            </div>

            {lastEloAdjustment.tierChanged && (
              <div className="mt-2 py-1 px-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-[11px] font-mono text-amber-300 font-bold flex items-center justify-center gap-1.5 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Tier Updated: Now {lastEloAdjustment.tierAfter}!</span>
              </div>
            )}
          </div>
        )}

        {/* Match Statistics Card */}
        <div className="grid grid-cols-3 gap-2 my-4 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 text-center font-mono">
          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-400 uppercase">Winner</span>
            <span className="text-xs sm:text-sm font-bold text-neutral-200 mt-0.5 truncate px-1">
              {winnerDisplayName}
            </span>
          </div>

          <div className="flex flex-col border-x border-neutral-800">
            <span className="text-[10px] text-neutral-400 uppercase">Total Moves</span>
            <span className="text-xs sm:text-sm font-bold text-amber-400 mt-0.5">
              {history.length}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-400 uppercase">Score</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5">
              {winner === 'draw' ? '½ - ½' : winner === 'w' ? '1 - 0' : '0 - 1'}
            </span>
          </div>
        </div>

        {/* Action Buttons with 3D Interaction */}
        <div className="flex flex-col gap-2.5">
          <Button3D
            variant="primary"
            size="lg"
            onClick={() => resetGame()}
            icon={<RotateCw className="w-4 h-4" />}
            className="w-full"
          >
            PLAY AGAIN
          </Button3D>

          {gameMode === 'local_2p' && (
            <Button3D
              variant="secondary"
              size="md"
              onClick={() => {
                setTwoPlayerSetupOpen(true);
              }}
              icon={<Users className="w-4 h-4 text-amber-400" />}
              className="w-full"
            >
              SETUP NEW 2-PLAYER MATCH
            </Button3D>
          )}

          {onNavigateAnalyze && (
            <Button3D
              variant="secondary"
              size="md"
              onClick={onNavigateAnalyze}
              icon={<BarChart2 className="w-4 h-4 text-cyan-400" />}
              className="w-full"
            >
              ANALYZE GAME
            </Button3D>
          )}

          <Button3D
            variant="ghost"
            size="md"
            onClick={onNavigateHome}
            icon={<Home className="w-4 h-4" />}
            className="w-full"
          >
            MAIN MENU
          </Button3D>
        </div>
      </div>
    </Modal3D>
  );
};
