import React, { useState } from 'react';
import { EloService } from '../../services/eloService';
import { Calculator, Sparkles, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { AI_OPPONENTS } from '../../services/chessAI';

interface EloCalculatorWidgetProps {
  currentRating: number;
}

export const EloCalculatorWidget: React.FC<EloCalculatorWidgetProps> = ({ currentRating }) => {
  const [opponentRating, setOpponentRating] = useState(1400);

  const stakes = EloService.getPotentialChanges(currentRating, opponentRating);
  const oppTier = EloService.getTier(opponentRating);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Calculator className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200 font-mono">
            Interactive Elo Simulator & Stakes Predictor
          </h3>
          <p className="text-xs text-neutral-400">
            Simulate expected win probability and prospective rating adjustments (FIDE standard K=32)
          </p>
        </div>
      </div>

      {/* Opponent Rating Slider & Presets */}
      <div className="mt-4 p-4 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-neutral-300">Hypothetical Opponent Rating:</span>
            <span className="font-mono text-lg font-bold text-amber-400">
              {opponentRating} Elo
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${oppTier.bgBadge}`}>
              {oppTier.badge} {oppTier.name}
            </span>
          </div>

          <div className="text-xs font-mono text-neutral-400">
            Expected Win: <strong className="text-amber-400 font-bold">{stakes.winProb}%</strong>
          </div>
        </div>

        {/* Range Slider */}
        <div>
          <input
            type="range"
            min={600}
            max={2400}
            step={25}
            value={opponentRating}
            onChange={(e) => setOpponentRating(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-2 bg-neutral-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
            <span>600 (Novice)</span>
            <span>1200 (Club)</span>
            <span>1800 (Master)</span>
            <span>2400 (Grandmaster)</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 font-mono text-xs">
          <span className="text-[11px] text-neutral-500 mr-1">Presets:</span>
          {AI_OPPONENTS.map((bot) => (
            <button
              key={bot.id}
              onClick={() => setOpponentRating(bot.rating)}
              className={`px-2 py-1 rounded-md text-[11px] transition-all ${
                opponentRating === bot.rating
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {bot.name} ({bot.rating})
            </button>
          ))}
          <button
            onClick={() => setOpponentRating(1200)}
            className={`px-2 py-1 rounded-md text-[11px] transition-all ${
              opponentRating === 1200
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Local (1200)
          </button>
        </div>
      </div>

      {/* Outcome Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 font-mono">
        {/* Victory */}
        <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-emerald-500/30 text-center">
          <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>On Victory</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            +{stakes.win} pts
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Rating: {currentRating} → <strong className="text-neutral-200">{currentRating + stakes.win}</strong>
          </div>
        </div>

        {/* Draw */}
        <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-sky-500/30 text-center">
          <div className="flex items-center justify-center gap-1 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Minus className="w-3.5 h-3.5" />
            <span>On Draw</span>
          </div>
          <div className="text-2xl font-bold text-sky-400">
            {stakes.draw >= 0 ? `+${stakes.draw}` : stakes.draw} pts
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Rating: {currentRating} → <strong className="text-neutral-200">{currentRating + stakes.draw}</strong>
          </div>
        </div>

        {/* Defeat */}
        <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-rose-500/30 text-center">
          <div className="flex items-center justify-center gap-1 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>On Defeat</span>
          </div>
          <div className="text-2xl font-bold text-rose-400">
            {stakes.loss} pts
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Rating: {currentRating} → <strong className="text-neutral-200">{Math.max(100, currentRating + stakes.loss)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
