import React from 'react';
import { Modal3D } from '../transitions/Modal3D';
import { Button3D } from './Button3D';
import { useGameStore } from '../../store/gameStore';
import { AI_OPPONENTS, AIOpponent } from '../../services/chessAI';
import { StorageService } from '../../services/storage';
import { EloService } from '../../services/eloService';
import { PieceColor } from '../../types/chess';
import { 
  Bot, 
  Zap, 
  Crown, 
  Shield, 
  Swords, 
  TrendingUp, 
  Check, 
  X,
  Target
} from 'lucide-react';

interface AIOpponentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIOpponentModal: React.FC<AIOpponentModalProps> = ({ isOpen, onClose }) => {
  const { 
    aiOpponent, 
    setAiOpponent, 
    playerColor, 
    setPlayerColor, 
    gameMode, 
    setGameMode 
  } = useGameStore();

  const userStats = StorageService.getStats();
  const userRating = userStats.rating;
  const userTier = EloService.getTier(userRating);

  if (!isOpen) return null;

  const handleSelectOpponent = (bot: AIOpponent) => {
    if (gameMode !== 'play') {
      setGameMode('play');
    }
    setAiOpponent(bot);
    onClose();
  };

  const handleColorChange = (color: PieceColor) => {
    setPlayerColor(color);
  };

  return (
    <Modal3D isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="relative w-full p-5 sm:p-7 text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-neutral-100">
                Select AI Opponent
              </h3>
              <p className="text-xs text-neutral-400">
                Matches directly affect your persistent Elo rating (Current: <span className="font-mono font-bold text-amber-400">{userRating}</span> • {userTier.name})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Color Preference */}
        <div className="my-4 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-mono text-neutral-300">Play As:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleColorChange('w')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                playerColor === 'w'
                  ? 'bg-neutral-100 text-neutral-900 shadow-md'
                  : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span>♔ White (First Move)</span>
            </button>
            <button
              onClick={() => handleColorChange('b')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                playerColor === 'b'
                  ? 'bg-amber-500 text-neutral-950 font-black shadow-md'
                  : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span>♚ Black (Defender)</span>
            </button>
          </div>
        </div>

        {/* AI Opponents List */}
        <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
          {AI_OPPONENTS.map((bot) => {
            const isSelected = aiOpponent.id === bot.id;
            const stakes = EloService.getPotentialChanges(userRating, bot.rating);
            const botTier = EloService.getTier(bot.rating);

            return (
              <div
                key={bot.id}
                onClick={() => handleSelectOpponent(bot)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/5'
                    : 'bg-neutral-900/40 border-neutral-800/80 hover:bg-neutral-900/80 hover:border-neutral-700'
                }`}
              >
                {/* Left: Avatar & Info */}
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bot.accentColor} flex items-center justify-center text-2xl shadow-md text-white shrink-0`}>
                    {bot.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-neutral-100 font-display">
                        {bot.name}
                      </h4>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-950/80 border border-neutral-800 text-amber-400 font-bold">
                        {bot.rating} Elo
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${botTier.bgBadge}`}>
                        {botTier.badge} {bot.title}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5 max-w-sm">
                      {bot.description}
                    </p>
                  </div>
                </div>

                {/* Right: Stakes & Selection Button */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800/80">
                  {/* Elo Stakes preview */}
                  <div className="text-right font-mono text-[11px]">
                    <div className="text-neutral-400 text-[10px] uppercase">Rating Stakes</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-emerald-400 font-bold">+{stakes.win}W</span>
                      <span className="text-neutral-500">•</span>
                      <span className="text-neutral-300 font-bold">
                        {stakes.draw >= 0 ? `+${stakes.draw}` : stakes.draw}D
                      </span>
                      <span className="text-neutral-500">•</span>
                      <span className="text-rose-400 font-bold">{stakes.loss}L</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">
                      Expected Win: {stakes.winProb}%
                    </div>
                  </div>

                  <Button3D
                    variant={isSelected ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectOpponent(bot);
                    }}
                    icon={isSelected ? <Check className="w-3.5 h-3.5" /> : <Swords className="w-3.5 h-3.5" />}
                    className="shrink-0"
                  >
                    {isSelected ? 'SELECTED' : 'CHALLENGE'}
                  </Button3D>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal3D>
  );
};
