import { PlayerStats, HistoricalGame, GameSettings, EloHistoryEntry, EloAdjustmentRecord, PieceColor } from '../types/chess';
import { EloService } from './eloService';

const STATS_KEY = 'chessverse_player_stats';
const HISTORY_KEY = 'chessverse_game_history';
const SETTINGS_KEY = 'chessverse_game_settings';
const ELO_HISTORY_KEY = 'chessverse_elo_history';

export const DEFAULT_STATS: PlayerStats = {
  username: 'Grandmaster',
  rating: 1250,
  peakRating: 1292,
  lowestRating: 1184,
  gamesPlayed: 14,
  wins: 9,
  losses: 4,
  draws: 1,
  currentStreak: 3,
  bestStreak: 6,
  puzzleRating: 1420,
  puzzlesSolved: 28,
  aiGamesPlayed: 8,
  aiWins: 5,
  aiLosses: 2,
  aiDraws: 1,
  localGamesPlayed: 6,
  localWins: 4,
  localLosses: 2,
  localDraws: 0
};

export const DEFAULT_ELO_HISTORY: EloHistoryEntry[] = [
  {
    id: 'elo_init_7',
    date: '2026-03-08',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
    opponent: 'Bishop Nova (AI)',
    opponentRating: 1400,
    opponentType: 'ai',
    result: 'win',
    reason: 'checkmate',
    ratingBefore: 1228,
    ratingAfter: 1250,
    change: 22,
    expectedScore: 0.27,
    movesCount: 34,
    playerColor: 'w'
  },
  {
    id: 'elo_init_6',
    date: '2026-03-05',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5,
    opponent: 'Alex (Local)',
    opponentRating: 1210,
    opponentType: 'local',
    result: 'win',
    reason: 'resignation',
    ratingBefore: 1214,
    ratingAfter: 1228,
    change: 14,
    expectedScore: 0.52,
    movesCount: 27,
    playerColor: 'b'
  },
  {
    id: 'elo_init_5',
    date: '2026-03-02',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 8,
    opponent: 'Knight Pulse (AI)',
    opponentRating: 1150,
    opponentType: 'ai',
    result: 'win',
    reason: 'checkmate',
    ratingBefore: 1204,
    ratingAfter: 1214,
    change: 10,
    expectedScore: 0.58,
    movesCount: 31,
    playerColor: 'w'
  },
  {
    id: 'elo_init_4',
    date: '2026-02-28',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 11,
    opponent: 'Sarah (Local)',
    opponentRating: 1280,
    opponentType: 'local',
    result: 'loss',
    reason: 'timeout',
    ratingBefore: 1218,
    ratingAfter: 1204,
    change: -14,
    expectedScore: 0.41,
    movesCount: 42,
    playerColor: 'w'
  },
  {
    id: 'elo_init_3',
    date: '2026-02-24',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 15,
    opponent: 'DeepMatrix GM (AI)',
    opponentRating: 1750,
    opponentType: 'ai',
    result: 'loss',
    reason: 'checkmate',
    ratingBefore: 1222,
    ratingAfter: 1218,
    change: -4,
    expectedScore: 0.05,
    movesCount: 38,
    playerColor: 'b'
  },
  {
    id: 'elo_init_2',
    date: '2026-02-20',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 19,
    opponent: 'Spark Bot (AI)',
    opponentRating: 850,
    opponentType: 'ai',
    result: 'win',
    reason: 'resignation',
    ratingBefore: 1217,
    ratingAfter: 1222,
    change: 5,
    expectedScore: 0.89,
    movesCount: 22,
    playerColor: 'w'
  },
  {
    id: 'elo_init_1',
    date: '2026-02-15',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 24,
    opponent: 'Placement Calibration',
    opponentRating: 1200,
    opponentType: 'local',
    result: 'win',
    reason: 'checkmate',
    ratingBefore: 1200,
    ratingAfter: 1217,
    change: 17,
    expectedScore: 0.5,
    movesCount: 29,
    playerColor: 'w'
  }
];

export const DEFAULT_SETTINGS: GameSettings = {
  graphics: {
    quality: 'high',
    shadows: true,
    particles: true,
    reflections: true,
    cameraEffects: true,
    viewMode: '3d',
    cinematicIntroOnStartup: true
  },
  sound: {
    enabled: true,
    masterVolume: 0.75,
    moveSound: true,
    captureSound: true,
    checkSound: true,
    voiceFeedback: false
  },
  gameplay: {
    autoQueen: false,
    confirmMoves: false,
    showLegalMoves: true,
    showCoordinates: true,
    pieceAnimations: true,
    boardTheme: 'classic',
    pieceTheme: 'classic'
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    colorFriendlyHighlights: true
  }
};

export const INITIAL_GAMES: HistoricalGame[] = [
  {
    id: 'g_init_1',
    date: '2026-03-08',
    opponent: 'Bishop Nova (AI 1400)',
    mode: 'play',
    result: 'win',
    reason: 'checkmate',
    playerColor: 'w',
    movesCount: 34,
    timeControl: '5 + 3',
    opening: 'Italian Game: Giuoco Piano',
    pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Bd2 Bxd2+ 8. Nbxd2 d5',
    fenHistory: []
  },
  {
    id: 'g_init_2',
    date: '2026-03-05',
    opponent: 'Alex (Local 1210)',
    mode: 'local_2p',
    result: 'win',
    reason: 'resignation',
    playerColor: 'b',
    movesCount: 27,
    timeControl: '3 + 2',
    opening: 'Sicilian Defense: Najdorf',
    pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 7. Nb3 Be6',
    fenHistory: []
  },
  {
    id: 'g_init_3',
    date: '2026-02-28',
    opponent: 'Tactician Sarah (Local 1280)',
    mode: 'local_2p',
    result: 'loss',
    reason: 'timeout',
    playerColor: 'w',
    movesCount: 42,
    timeControl: '1 + 0',
    opening: "Queen's Gambit Declined",
    pgn: '1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3 Nbd7',
    fenHistory: []
  }
];

export class StorageService {
  public static getStats(): PlayerStats {
    try {
      const data = localStorage.getItem(STATS_KEY);
      if (!data) return DEFAULT_STATS;
      const parsed = JSON.parse(data);
      // Ensure all fields exist with fallback
      return {
        ...DEFAULT_STATS,
        ...parsed,
        rating: typeof parsed.rating === 'number' ? parsed.rating : DEFAULT_STATS.rating,
        peakRating: typeof parsed.peakRating === 'number' ? parsed.peakRating : Math.max(parsed.rating || 1250, DEFAULT_STATS.peakRating),
        lowestRating: typeof parsed.lowestRating === 'number' ? parsed.lowestRating : Math.min(parsed.rating || 1250, DEFAULT_STATS.lowestRating),
        aiGamesPlayed: typeof parsed.aiGamesPlayed === 'number' ? parsed.aiGamesPlayed : DEFAULT_STATS.aiGamesPlayed,
        aiWins: typeof parsed.aiWins === 'number' ? parsed.aiWins : DEFAULT_STATS.aiWins,
        aiLosses: typeof parsed.aiLosses === 'number' ? parsed.aiLosses : DEFAULT_STATS.aiLosses,
        aiDraws: typeof parsed.aiDraws === 'number' ? parsed.aiDraws : DEFAULT_STATS.aiDraws,
        localGamesPlayed: typeof parsed.localGamesPlayed === 'number' ? parsed.localGamesPlayed : DEFAULT_STATS.localGamesPlayed,
        localWins: typeof parsed.localWins === 'number' ? parsed.localWins : DEFAULT_STATS.localWins,
        localLosses: typeof parsed.localLosses === 'number' ? parsed.localLosses : DEFAULT_STATS.localLosses,
        localDraws: typeof parsed.localDraws === 'number' ? parsed.localDraws : DEFAULT_STATS.localDraws
      };
    } catch {
      return DEFAULT_STATS;
    }
  }

  public static saveStats(stats: PlayerStats) {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {}
  }

  public static getEloHistory(): EloHistoryEntry[] {
    try {
      const data = localStorage.getItem(ELO_HISTORY_KEY);
      return data ? JSON.parse(data) : DEFAULT_ELO_HISTORY;
    } catch {
      return DEFAULT_ELO_HISTORY;
    }
  }

  public static saveEloHistory(history: EloHistoryEntry[]) {
    try {
      localStorage.setItem(ELO_HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
    } catch {}
  }

  /**
   * Calculates rating adjustment and persists the updated rating, stats, and Elo history
   */
  public static recordEloMatch(params: {
    opponent: string;
    opponentRating: number;
    opponentType: 'ai' | 'local';
    result: 'win' | 'loss' | 'draw';
    reason: string;
    movesCount: number;
    playerColor: PieceColor;
  }): EloAdjustmentRecord {
    const stats = this.getStats();
    const ratingBefore = stats.rating;
    const tierBefore = EloService.getTier(ratingBefore);

    const { change, newRating, expectedScore } = EloService.calculateAdjustment(
      ratingBefore,
      params.opponentRating,
      params.result
    );

    const tierAfter = EloService.getTier(newRating);

    // Update career stats
    stats.rating = newRating;
    stats.gamesPlayed++;
    if (newRating > (stats.peakRating || ratingBefore)) {
      stats.peakRating = newRating;
    }
    if (newRating < (stats.lowestRating || ratingBefore)) {
      stats.lowestRating = newRating;
    }

    if (params.result === 'win') {
      stats.wins++;
      stats.currentStreak++;
      if (stats.currentStreak > stats.bestStreak) {
        stats.bestStreak = stats.currentStreak;
      }
    } else if (params.result === 'loss') {
      stats.losses++;
      stats.currentStreak = 0;
    } else {
      stats.draws++;
    }

    // Update mode-specific stats
    if (params.opponentType === 'ai') {
      stats.aiGamesPlayed = (stats.aiGamesPlayed || 0) + 1;
      if (params.result === 'win') stats.aiWins = (stats.aiWins || 0) + 1;
      else if (params.result === 'loss') stats.aiLosses = (stats.aiLosses || 0) + 1;
      else stats.aiDraws = (stats.aiDraws || 0) + 1;
    } else {
      stats.localGamesPlayed = (stats.localGamesPlayed || 0) + 1;
      if (params.result === 'win') stats.localWins = (stats.localWins || 0) + 1;
      else if (params.result === 'loss') stats.localLosses = (stats.localLosses || 0) + 1;
      else stats.localDraws = (stats.localDraws || 0) + 1;
    }

    this.saveStats(stats);

    // Add entry to Elo history
    const historyEntry: EloHistoryEntry = {
      id: `elo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      opponent: params.opponent,
      opponentRating: params.opponentRating,
      opponentType: params.opponentType,
      result: params.result,
      reason: params.reason,
      ratingBefore,
      ratingAfter: newRating,
      change,
      expectedScore,
      movesCount: params.movesCount,
      playerColor: params.playerColor
    };

    const history = this.getEloHistory();
    history.unshift(historyEntry);
    this.saveEloHistory(history);

    return {
      ratingBefore,
      ratingAfter: newRating,
      change,
      result: params.result,
      opponentName: params.opponent,
      opponentRating: params.opponentRating,
      opponentType: params.opponentType,
      expectedScore,
      tierBefore: tierBefore.name,
      tierAfter: tierAfter.name,
      tierChanged: tierBefore.id !== tierAfter.id
    };
  }

  /**
   * Backward-compatible simple update method
   */
  public static updateStatsAfterGame(result: 'win' | 'loss' | 'draw', ratingDelta: number = 0) {
    const stats = this.getStats();
    stats.gamesPlayed++;
    if (result === 'win') {
      stats.wins++;
      stats.currentStreak++;
      if (stats.currentStreak > stats.bestStreak) stats.bestStreak = stats.currentStreak;
      stats.rating += ratingDelta || 16;
    } else if (result === 'loss') {
      stats.losses++;
      stats.currentStreak = 0;
      stats.rating = Math.max(100, stats.rating - (ratingDelta || 14));
    } else {
      stats.draws++;
      stats.rating += 2;
    }
    if (stats.rating > stats.peakRating) stats.peakRating = stats.rating;
    if (stats.rating < stats.lowestRating) stats.lowestRating = stats.rating;
    this.saveStats(stats);
    return stats;
  }

  public static getHistory(): HistoricalGame[] {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : INITIAL_GAMES;
    } catch {
      return INITIAL_GAMES;
    }
  }

  public static saveGame(game: HistoricalGame) {
    try {
      const history = this.getHistory();
      history.unshift(game);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
    } catch {}
  }

  public static resetEloStats(calibratedRating: number = 1200) {
    const stats = this.getStats();
    stats.rating = calibratedRating;
    stats.peakRating = calibratedRating;
    stats.lowestRating = calibratedRating;
    stats.gamesPlayed = 0;
    stats.wins = 0;
    stats.losses = 0;
    stats.draws = 0;
    stats.currentStreak = 0;
    stats.aiGamesPlayed = 0;
    stats.aiWins = 0;
    stats.aiLosses = 0;
    stats.aiDraws = 0;
    stats.localGamesPlayed = 0;
    stats.localWins = 0;
    stats.localLosses = 0;
    stats.localDraws = 0;
    this.saveStats(stats);
    this.saveEloHistory([
      {
        id: `elo_reset_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
        opponent: 'Rating Calibration',
        opponentRating: calibratedRating,
        opponentType: 'local',
        result: 'draw',
        reason: 'calibration',
        ratingBefore: calibratedRating,
        ratingAfter: calibratedRating,
        change: 0,
        expectedScore: 0.5,
        movesCount: 0,
        playerColor: 'w'
      }
    ]);
  }

  public static getSettings(): GameSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  public static saveSettings(settings: GameSettings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
  }
}

export const storage = StorageService;
