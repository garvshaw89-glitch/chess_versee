import React, { useState } from 'react';
import { EloHistoryEntry } from '../../types/chess';
import { 
  Bot, 
  Users, 
  History, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  RotateCcw, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button3D } from '../ui/Button3D';
import { StorageService } from '../../services/storage';

interface EloHistoryTableProps {
  history: EloHistoryEntry[];
  onStatsUpdated: () => void;
}

export const EloHistoryTable: React.FC<EloHistoryTableProps> = ({ history, onStatsUpdated }) => {
  const [filter, setFilter] = useState<'all' | 'ai' | 'local'>('all');
  const [showAll, setShowAll] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const filtered = history.filter((item) => {
    if (filter === 'ai') return item.opponentType === 'ai';
    if (filter === 'local') return item.opponentType === 'local';
    return true;
  });

  const displayList = showAll ? filtered : filtered.slice(0, 7);

  const handleResetElo = (calibratedRating: number) => {
    StorageService.resetEloStats(calibratedRating);
    setIsResetConfirmOpen(false);
    onStatsUpdated();
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200 font-mono flex items-center gap-1.5">
            <History className="w-4 h-4 text-amber-400" />
            <span>Elo Rating Adjustment Ledger</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Auditable log of calculated rating deltas after completed games
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-neutral-950/80 p-1 rounded-xl border border-neutral-800 font-mono text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('ai')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filter === 'ai'
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              AI
            </button>
            <button
              onClick={() => setFilter('local')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filter === 'local'
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Local
            </button>
          </div>

          {/* Reset / Calibration trigger */}
          <Button3D
            variant="ghost"
            size="sm"
            onClick={() => setIsResetConfirmOpen(true)}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            title="Recalibrate Rating"
            className="!py-1 !px-2 text-xs"
          >
            <span>Reset</span>
          </Button3D>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div className="mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-xs font-mono">
          <p className="font-bold text-amber-300">
            Recalibrate your Elo rating baseline?
          </p>
          <p className="text-neutral-300 mt-1">
            Choose your starting level calibration or cancel:
          </p>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <Button3D
              variant="secondary"
              size="sm"
              onClick={() => handleResetElo(1000)}
            >
              Novice (1000)
            </Button3D>
            <Button3D
              variant="primary"
              size="sm"
              onClick={() => handleResetElo(1200)}
            >
              Club (1200)
            </Button3D>
            <Button3D
              variant="secondary"
              size="sm"
              onClick={() => handleResetElo(1400)}
            >
              Advanced (1400)
            </Button3D>
            <button
              onClick={() => setIsResetConfirmOpen(false)}
              className="px-3 py-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Adjustments Table */}
      {filtered.length === 0 ? (
        <div className="py-8 text-center text-xs font-mono text-neutral-500">
          No matches recorded for this filter.
        </div>
      ) : (
        <div className="space-y-2 font-mono">
          {displayList.map((entry) => {
            const isWin = entry.result === 'win';
            const isLoss = entry.result === 'loss';
            const changeSign = entry.change >= 0 ? `+${entry.change}` : `${entry.change}`;

            return (
              <div
                key={entry.id}
                className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:border-neutral-700 transition-colors"
              >
                {/* Left: Opponent & Date */}
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                    entry.opponentType === 'ai'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                  }`}>
                    {entry.opponentType === 'ai' ? <Bot className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-neutral-100 font-sans">
                        {entry.opponent}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                        {entry.opponentRating} Elo
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        ({entry.movesCount} moves • {entry.reason})
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      {entry.date} • Color: {entry.playerColor === 'w' ? 'White' : 'Black'}
                    </div>
                  </div>
                </div>

                {/* Right: Result & Rating Delta */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    isWin
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : isLoss
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  }`}>
                    {entry.result}
                  </span>

                  <div className="text-right">
                    <div className={`text-sm font-bold flex items-center justify-end gap-0.5 ${
                      entry.change > 0
                        ? 'text-emerald-400'
                        : entry.change < 0
                        ? 'text-rose-400'
                        : 'text-neutral-400'
                    }`}>
                      {entry.change > 0 ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : entry.change < 0 ? (
                        <TrendingDown className="w-3.5 h-3.5" />
                      ) : (
                        <Minus className="w-3.5 h-3.5" />
                      )}
                      <span>{changeSign} pts</span>
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      {entry.ratingBefore} → <strong className="text-neutral-300">{entry.ratingAfter}</strong>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length > 7 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full py-2 rounded-xl bg-neutral-950/80 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono text-amber-400 font-bold flex items-center justify-center gap-1 transition-colors mt-2"
            >
              <span>{showAll ? 'Show Fewer Records' : `View All ${filtered.length} Match Adjustments`}</span>
              {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
