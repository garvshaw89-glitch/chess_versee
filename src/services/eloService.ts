export interface EloTier {
  id: string;
  name: string;
  minRating: number;
  maxRating: number;
  badge: string;
  color: string;
  bgBadge: string;
  gradient: string;
  description: string;
}

export const ELO_TIERS: EloTier[] = [
  {
    id: 'bronze',
    name: 'Apprentice',
    minRating: 0,
    maxRating: 999,
    badge: '🥉',
    color: 'text-amber-600',
    bgBadge: 'bg-amber-600/20 text-amber-500 border-amber-600/40',
    gradient: 'from-amber-700 to-amber-900',
    description: 'Learning fundamentals, piece dynamics, and board awareness.'
  },
  {
    id: 'silver',
    name: 'Challenger',
    minRating: 1000,
    maxRating: 1199,
    badge: '🥈',
    color: 'text-slate-300',
    bgBadge: 'bg-slate-400/20 text-slate-200 border-slate-400/40',
    gradient: 'from-slate-400 to-slate-600',
    description: 'Developing tactical vision, forks, pins, and pawn structures.'
  },
  {
    id: 'gold',
    name: 'Tactician',
    minRating: 1200,
    maxRating: 1399,
    badge: '🥇',
    color: 'text-amber-400',
    bgBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    gradient: 'from-amber-400 to-amber-600',
    description: 'Solid tactical execution, disciplined openings, and endgame basics.'
  },
  {
    id: 'emerald',
    name: 'Strategist',
    minRating: 1400,
    maxRating: 1599,
    badge: '💎',
    color: 'text-emerald-400',
    bgBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    gradient: 'from-emerald-400 to-teal-600',
    description: 'Advanced positional play, piece harmony, and dynamic combinations.'
  },
  {
    id: 'sapphire',
    name: 'Expert',
    minRating: 1600,
    maxRating: 1799,
    badge: '💠',
    color: 'text-sky-400',
    bgBadge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    gradient: 'from-sky-400 to-blue-600',
    description: 'Deep game planning, counter-play, and precision time handling.'
  },
  {
    id: 'master',
    name: 'Master',
    minRating: 1800,
    maxRating: 1999,
    badge: '👑',
    color: 'text-purple-400',
    bgBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    gradient: 'from-purple-400 to-indigo-600',
    description: 'Tournament mastery, opening repertoire depth, and endgame finesse.'
  },
  {
    id: 'grandmaster',
    name: 'Grandmaster',
    minRating: 2000,
    maxRating: 9999,
    badge: '⚡',
    color: 'text-amber-300',
    bgBadge: 'bg-amber-400/20 text-amber-200 border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.3)]',
    gradient: 'from-amber-300 via-yellow-400 to-amber-600',
    description: 'Peak calculation, intuitive positional insight, and relentless endgame accuracy.'
  }
];

export interface EloHistoryEntry {
  id: string;
  date: string;
  timestamp: number;
  opponent: string;
  opponentRating: number;
  opponentType: 'ai' | 'local';
  result: 'win' | 'loss' | 'draw';
  reason: string;
  ratingBefore: number;
  ratingAfter: number;
  change: number; // e.g. +18, -12
  expectedScore: number; // e.g. 0.58
  movesCount: number;
  playerColor: 'w' | 'b';
}

export interface EloAdjustmentRecord {
  ratingBefore: number;
  ratingAfter: number;
  change: number;
  result: 'win' | 'loss' | 'draw';
  opponentName: string;
  opponentRating: number;
  opponentType: 'ai' | 'local';
  expectedScore: number;
  tierBefore: EloTier;
  tierAfter: EloTier;
  tierChanged: boolean;
}

export class EloService {
  public static readonly DEFAULT_K_FACTOR = 32;

  /**
   * Calculates the expected win probability according to the standard Elo formula:
   * E = 1 / (1 + 10 ^ ((opponentRating - playerRating) / 400))
   */
  public static getExpectedScore(playerRating: number, opponentRating: number): number {
    return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  }

  /**
   * Calculates rating adjustment based on the standard Elo formula:
   * delta = round(K * (actualScore - expectedScore))
   */
  public static calculateAdjustment(
    playerRating: number,
    opponentRating: number,
    result: 'win' | 'loss' | 'draw',
    kFactor: number = this.DEFAULT_K_FACTOR
  ): { change: number; newRating: number; expectedScore: number } {
    const expectedScore = this.getExpectedScore(playerRating, opponentRating);
    const actualScore = result === 'win' ? 1.0 : result === 'draw' ? 0.5 : 0.0;

    let change = Math.round(kFactor * (actualScore - expectedScore));

    // Ensure non-zero change for definitive results
    if (result === 'win' && change <= 0) change = 1;
    if (result === 'loss' && change >= 0) change = -1;

    const minRating = 100;
    const newRating = Math.max(minRating, playerRating + change);

    return {
      change,
      newRating,
      expectedScore: Number(expectedScore.toFixed(3))
    };
  }

  /**
   * Calculates potential rating changes for Win, Draw, and Loss against a given opponent
   */
  public static getPotentialChanges(
    playerRating: number,
    opponentRating: number,
    kFactor: number = this.DEFAULT_K_FACTOR
  ): { win: number; draw: number; loss: number; winProb: number } {
    const winAdj = this.calculateAdjustment(playerRating, opponentRating, 'win', kFactor);
    const drawAdj = this.calculateAdjustment(playerRating, opponentRating, 'draw', kFactor);
    const lossAdj = this.calculateAdjustment(playerRating, opponentRating, 'loss', kFactor);

    return {
      win: winAdj.change,
      draw: drawAdj.change,
      loss: lossAdj.change,
      winProb: Math.round(winAdj.expectedScore * 100)
    };
  }

  /**
   * Resolves the Elo Tier for a given rating
   */
  public static getTier(rating: number): EloTier {
    for (let i = ELO_TIERS.length - 1; i >= 0; i--) {
      if (rating >= ELO_TIERS[i].minRating) {
        return ELO_TIERS[i];
      }
    }
    return ELO_TIERS[0];
  }

  /**
   * Computes progress percentage towards the next tier
   */
  public static getTierProgress(rating: number): {
    currentTier: EloTier;
    nextTier: EloTier | null;
    progressPercent: number;
    pointsNeeded: number;
  } {
    const currentTier = this.getTier(rating);
    const currentIndex = ELO_TIERS.findIndex(t => t.id === currentTier.id);
    const nextTier = currentIndex < ELO_TIERS.length - 1 ? ELO_TIERS[currentIndex + 1] : null;

    if (!nextTier) {
      return {
        currentTier,
        nextTier: null,
        progressPercent: 100,
        pointsNeeded: 0
      };
    }

    const range = nextTier.minRating - currentTier.minRating;
    const progress = rating - currentTier.minRating;
    const progressPercent = Math.min(100, Math.max(0, Math.round((progress / range) * 100)));
    const pointsNeeded = Math.max(0, nextTier.minRating - rating);

    return {
      currentTier,
      nextTier,
      progressPercent,
      pointsNeeded
    };
  }

  /**
   * Helper to format rating change string: e.g. "+18" or "-14"
   */
  public static formatChange(change: number): string {
    if (change > 0) return `+${change}`;
    return `${change}`;
  }
}
