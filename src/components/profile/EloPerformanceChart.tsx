import React, { useState, useMemo } from 'react';
import { EloHistoryEntry } from '../../types/chess';
import { EloService } from '../../services/eloService';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Bot, 
  Users, 
  Calendar, 
  Crosshair,
  Filter
} from 'lucide-react';

interface EloPerformanceChartProps {
  history: EloHistoryEntry[];
}

export const EloPerformanceChart: React.FC<EloPerformanceChartProps> = ({ history }) => {
  const [filter, setFilter] = useState<'all' | 'ai' | 'local'>('all');
  const [hoveredEntry, setHoveredEntry] = useState<EloHistoryEntry | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  const filteredHistory = useMemo(() => {
    let list = [...history];
    if (filter === 'ai') list = list.filter((e) => e.opponentType === 'ai');
    if (filter === 'local') list = list.filter((e) => e.opponentType === 'local');
    // Sort chronologically ascending for the chart timeline (oldest to newest)
    return list.sort((a, b) => a.timestamp - b.timestamp);
  }, [history, filter]);

  // Chart Dimensions
  const width = 800;
  const height = 240;
  const paddingX = 45;
  const paddingY = 35;

  const { points, minRating, maxRating, pathString, areaString } = useMemo(() => {
    if (filteredHistory.length === 0) {
      return { points: [], minRating: 1200, maxRating: 1300, pathString: '', areaString: '' };
    }

    const ratings = filteredHistory.map((e) => e.ratingAfter);
    // Include starting rating of first match
    if (filteredHistory[0]) {
      ratings.unshift(filteredHistory[0].ratingBefore);
    }

    let min = Math.min(...ratings);
    let max = Math.max(...ratings);

    // Give some breathing room
    min = Math.floor((min - 30) / 25) * 25;
    max = Math.ceil((max + 30) / 25) * 25;
    if (max - min < 50) {
      max += 25;
      min -= 25;
    }

    const ratingRange = max - min || 1;
    const chartW = width - paddingX * 2;
    const chartH = height - paddingY * 2;

    const computedPoints = filteredHistory.map((entry, index) => {
      const step = filteredHistory.length > 1 ? chartW / (filteredHistory.length - 1) : chartW / 2;
      const x = paddingX + (filteredHistory.length > 1 ? index * step : chartW / 2);
      const normalizedY = (entry.ratingAfter - min) / ratingRange;
      const y = height - paddingY - normalizedY * chartH;
      return { x, y, entry };
    });

    if (computedPoints.length === 0) {
      return { points: [], minRating: min, maxRating: max, pathString: '', areaString: '' };
    }

    // Build SVG Path
    let d = `M ${computedPoints[0].x} ${computedPoints[0].y}`;
    for (let i = 1; i < computedPoints.length; i++) {
      const prev = computedPoints[i - 1];
      const curr = computedPoints[i];
      // Catmull-Rom or cubic Bezier smoothing
      const midX = (prev.x + curr.x) / 2;
      d += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    const firstPt = computedPoints[0];
    const lastPt = computedPoints[computedPoints.length - 1];
    const area = `${d} L ${lastPt.x} ${height - paddingY} L ${firstPt.x} ${height - paddingY} Z`;

    return {
      points: computedPoints,
      minRating: min,
      maxRating: max,
      pathString: d,
      areaString: area
    };
  }, [filteredHistory]);

  const netChange = useMemo(() => {
    if (filteredHistory.length < 1) return 0;
    const first = filteredHistory[0].ratingBefore;
    const last = filteredHistory[filteredHistory.length - 1].ratingAfter;
    return last - first;
  }, [filteredHistory]);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-xl backdrop-blur-md">
      {/* Header and Filter Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200 font-mono flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Elo Rating Trajectory</span>
            </h3>
            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
              netChange >= 0
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            }`}>
              {netChange >= 0 ? `+${netChange}` : netChange} Net
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Historical rating evolution across completed games
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-neutral-950/80 p-1 rounded-xl border border-neutral-800 self-start sm:self-auto font-mono text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            All Matches ({history.length})
          </button>
          <button
            onClick={() => setFilter('ai')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
              filter === 'ai'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Bot className="w-3 h-3" />
            <span>AI Only</span>
          </button>
          <button
            onClick={() => setFilter('local')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
              filter === 'local'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Users className="w-3 h-3" />
            <span>Local</span>
          </button>
        </div>
      </div>

      {/* SVG Chart Stage */}
      <div className="relative w-full overflow-x-auto select-none">
        {filteredHistory.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center text-neutral-500 font-mono text-xs">
            <Crosshair className="w-8 h-8 text-neutral-600 mb-2" />
            <span>No rated matches recorded for this filter yet.</span>
            <span className="text-[11px] text-neutral-600 mt-0.5">Play a game against AI or Local opponent to start tracking!</span>
          </div>
        ) : (
          <div className="min-w-[600px] relative">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-48 sm:h-56 overflow-visible"
            >
              <defs>
                <linearGradient id="eloGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                  <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>

                <linearGradient id="eloLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#eab308" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>

                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Horizontal Grid lines */}
              {[minRating, Math.round((minRating + maxRating) / 2), maxRating].map((rVal) => {
                const normalizedY = (rVal - minRating) / (maxRating - minRating);
                const y = height - paddingY - normalizedY * (height - paddingY * 2);
                return (
                  <g key={rVal}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={width - paddingX}
                      y2={y}
                      stroke="#262626"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 3}
                      fill="#737373"
                      fontSize="10"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {rVal}
                    </text>
                  </g>
                );
              })}

              {/* Gradient Area under curve */}
              {areaString && (
                <path d={areaString} fill="url(#eloGlow)" />
              )}

              {/* Glowing Line */}
              {pathString && (
                <path
                  d={pathString}
                  fill="none"
                  stroke="url(#eloLine)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glowEffect)"
                />
              )}

              {/* Interactive Points */}
              {points.map((pt, idx) => {
                const isHovered = hoveredEntry?.id === pt.entry.id;
                const isWin = pt.entry.result === 'win';
                const isLoss = pt.entry.result === 'loss';

                return (
                  <g key={pt.entry.id} className="cursor-pointer">
                    {/* Pulsing ring on active */}
                    {isHovered && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="12"
                        fill="rgba(245, 158, 11, 0.2)"
                        className="animate-ping"
                      />
                    )}

                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 6 : 4}
                      fill={isWin ? '#10b981' : isLoss ? '#f43f5e' : '#38bdf8'}
                      stroke="#0a0a0a"
                      strokeWidth="2"
                      className="transition-all duration-150"
                      onMouseEnter={(e) => {
                        setHoveredEntry(pt.entry);
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoverPos({ x: pt.x, y: pt.y });
                      }}
                      onMouseLeave={() => {
                        setHoveredEntry(null);
                        setHoverPos(null);
                      }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Card */}
            {hoveredEntry && hoverPos && (
              <div
                style={{
                  left: `${(hoverPos.x / width) * 100}%`,
                  top: `${Math.max(10, hoverPos.y - 85)}px`,
                  transform: 'translateX(-50%)'
                }}
                className="absolute z-20 pointer-events-none p-2.5 rounded-xl bg-neutral-950/95 border border-amber-500/50 shadow-2xl backdrop-blur-md text-xs font-mono w-48 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="flex items-center justify-between gap-1 pb-1 mb-1 border-b border-neutral-800">
                  <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                    {hoveredEntry.opponentType === 'ai' ? (
                      <Bot className="w-3 h-3 text-amber-400" />
                    ) : (
                      <Users className="w-3 h-3 text-sky-400" />
                    )}
                    {hoveredEntry.date}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 rounded ${
                    hoveredEntry.result === 'win'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : hoveredEntry.result === 'loss'
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-neutral-800 text-neutral-300'
                  }`}>
                    {hoveredEntry.result.toUpperCase()}
                  </span>
                </div>

                <div className="font-bold text-neutral-100 truncate text-[11px]">
                  {hoveredEntry.opponent}
                </div>

                <div className="flex items-center justify-between mt-1 text-[11px]">
                  <span className="text-neutral-400">Elo Result:</span>
                  <span className="font-bold text-neutral-100">
                    {hoveredEntry.ratingAfter}{' '}
                    <span className={hoveredEntry.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      ({hoveredEntry.change >= 0 ? `+${hoveredEntry.change}` : hoveredEntry.change})
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
