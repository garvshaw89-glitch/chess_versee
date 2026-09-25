import { create } from 'zustand';
import { Chess, Square } from 'chess.js';
import { 
  GameMode, 
  CameraPreset, 
  MoveRecord, 
  PieceColor, 
  PieceType,
  TimeControlPreset,
  EloAdjustmentRecord
} from '../types/chess';
import { soundService } from '../services/sound';
import { StorageService } from '../services/storage';
import { AIOpponent, AI_OPPONENTS, ChessAIService } from '../services/chessAI';
import { EloService } from '../services/eloService';

export const TIME_CONTROL_PRESETS: TimeControlPreset[] = [
  { id: '1+0', name: '1 min (Bullet)', initialMinutes: 1, incrementSeconds: 0 },
  { id: '2+1', name: '2 | 1 (Bullet)', initialMinutes: 2, incrementSeconds: 1 },
  { id: '3+0', name: '3 min (Blitz)', initialMinutes: 3, incrementSeconds: 0 },
  { id: '3+2', name: '3 | 2 (Blitz)', initialMinutes: 3, incrementSeconds: 2 },
  { id: '5+0', name: '5 min (Blitz)', initialMinutes: 5, incrementSeconds: 0 },
  { id: '5+3', name: '5 | 3 (Rapid)', initialMinutes: 5, incrementSeconds: 3 },
  { id: '10+0', name: '10 min (Rapid)', initialMinutes: 10, incrementSeconds: 0 },
  { id: '15+10', name: '15 | 10 (Rapid)', initialMinutes: 15, incrementSeconds: 10 },
  { id: '30+0', name: '30 min (Classical)', initialMinutes: 30, incrementSeconds: 0 }
];

interface GameState {
  chess: Chess;
  fen: string;
  history: MoveRecord[];
  turn: PieceColor;
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  drawReason: string;
  isGameOver: boolean;
  winner: PieceColor | 'draw' | null;
  winReason: string;

  // AI & Opponent Configuration
  aiOpponent: AIOpponent;
  isAiThinking: boolean;
  localOpponentRating: number;
  lastEloAdjustment: EloAdjustmentRecord | null;

  // Configuration
  gameMode: GameMode;
  players: {
    white: string;
    black: string;
  };
  isTwoPlayerSetupOpen: boolean;
  autoFlipBoard: boolean;
  playerColor: PieceColor;
  boardOrientation: PieceColor;
  timeControl: TimeControlPreset;
  stats: {
    wins: number;
    losses: number;
    draws: number;
    winStreak: number;
  };

  // Interaction
  selectedSquare: string | null;
  legalMoves: string[];
  lastMove: { from: string; to: string } | null;
  capturedWhite: PieceType[]; // captured by black
  capturedBlack: PieceType[]; // captured by white
  whiteTime: number; // seconds
  blackTime: number; // seconds
  clockActive: boolean;

  cameraPreset: CameraPreset;
  promotionPending: { from: string; to: string } | null;
  viewingMoveIndex: number; // -1 for current live board
  toast: { message: string; type: 'info' | 'success' | 'warning' | 'danger'; id: number } | null;

  // Actions
  selectSquare: (sq: string | null) => void;
  makeMove: (from: string, to: string, promotion?: string) => boolean;
  completePromotion: (promo: 'q' | 'r' | 'b' | 'n') => void;
  cancelPromotion: () => void;
  undoMove: () => void;
  resetGame: (customTimeControl?: TimeControlPreset) => void;
  setGameMode: (mode: GameMode) => void;
  setAiOpponent: (bot: AIOpponent) => void;
  setLocalOpponentRating: (rating: number) => void;
  setTwoPlayerSetupOpen: (open: boolean) => void;
  setAutoFlipBoard: (autoFlip: boolean) => void;
  setPlayers: (names: { white: string; black: string }) => void;
  startTwoPlayerGame: (config: {
    whiteName: string;
    blackName: string;
    whiteRating?: number;
    blackRating?: number;
    timeControl?: TimeControlPreset;
    autoFlipBoard?: boolean;
  }) => void;
  setBoardOrientation: (color: PieceColor) => void;
  toggleOrientation: () => void;
  setCameraPreset: (preset: CameraPreset) => void;
  setTimeControl: (tc: TimeControlPreset) => void;
  setPlayerColor: (color: PieceColor) => void;
  resign: (color?: PieceColor) => void;
  offerDraw: () => void;
  jumpToMove: (index: number) => void;
  loadCustomFen: (fen: string) => void;
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'danger') => void;
  tickClock: () => void;
  triggerAiMoveIfNeeded: () => void;
}

const initialChess = new Chess();

export const useGameStore = create<GameState>((set, get) => {
  let clockTimer: any = null;

  const startClockLoop = () => {
    if (clockTimer) clearInterval(clockTimer);
    clockTimer = setInterval(() => {
      get().tickClock();
    }, 1000);
  };

  const handleGameOverRecord = (
    winner: PieceColor | 'draw',
    reason: string,
    historyCount: number
  ): EloAdjustmentRecord => {
    const state = get();
    const isPlayMode = state.gameMode === 'play';
    const playerResult: 'win' | 'loss' | 'draw' =
      winner === 'draw'
        ? 'draw'
        : winner === state.playerColor
        ? 'win'
        : 'loss';

    let opponentName: string;
    let opponentRating: number;
    let opponentType: 'ai' | 'local';

    if (isPlayMode) {
      opponentName = `${state.aiOpponent.name} (${state.aiOpponent.title})`;
      opponentRating = state.aiOpponent.rating;
      opponentType = 'ai';
    } else {
      const isPlayerWhite = state.playerColor === 'w';
      opponentName = isPlayerWhite ? state.players.black : state.players.white;
      opponentRating = state.localOpponentRating || 1200;
      opponentType = 'local';
    }

    const eloAdj = StorageService.recordEloMatch({
      opponent: opponentName,
      opponentRating,
      opponentType,
      result: playerResult,
      reason,
      movesCount: historyCount,
      playerColor: state.playerColor
    });

    // Also persist game into match history
    StorageService.saveGame({
      id: `g_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      opponent: opponentName,
      mode: state.gameMode,
      result: playerResult,
      reason,
      playerColor: state.playerColor,
      movesCount: historyCount,
      timeControl: state.timeControl.name,
      pgn: state.chess.pgn(),
      fenHistory: []
    });

    // Update store stats snapshot
    const updatedStats = StorageService.getStats();
    set({
      lastEloAdjustment: eloAdj,
      stats: {
        wins: updatedStats.wins,
        losses: updatedStats.losses,
        draws: updatedStats.draws,
        winStreak: updatedStats.currentStreak
      }
    });

    // Formulate descriptive toast
    const changeSign = eloAdj.change >= 0 ? `+${eloAdj.change}` : `${eloAdj.change}`;
    const resultLabel =
      playerResult === 'win' ? 'Victory' : playerResult === 'draw' ? 'Draw' : 'Defeat';
    const toastType =
      playerResult === 'win' ? 'success' : playerResult === 'draw' ? 'info' : 'warning';

    get().showToast(
      `${resultLabel}! Elo: ${eloAdj.ratingBefore} → ${eloAdj.ratingAfter} (${changeSign} pts)`,
      toastType
    );

    return eloAdj;
  };

  const initialStats = StorageService.getStats();

  return {
    chess: initialChess,
    fen: initialChess.fen(),
    history: [],
    turn: 'w',
    isCheck: false,
    isCheckmate: false,
    isDraw: false,
    drawReason: '',
    isGameOver: false,
    winner: null,
    winReason: '',

    // AI & Elo defaults
    aiOpponent: AI_OPPONENTS[2], // Bishop Nova 1400
    isAiThinking: false,
    localOpponentRating: 1200,
    lastEloAdjustment: null,

    gameMode: 'play',
    players: {
      white: 'You',
      black: AI_OPPONENTS[2].name
    },
    isTwoPlayerSetupOpen: false,
    autoFlipBoard: false,
    playerColor: 'w',
    boardOrientation: 'w',
    timeControl: TIME_CONTROL_PRESETS[5], // 5+3 Rapid
    stats: {
      wins: initialStats.wins,
      losses: initialStats.losses,
      draws: initialStats.draws,
      winStreak: initialStats.currentStreak
    },

    selectedSquare: null,
    legalMoves: [],
    lastMove: null,
    capturedWhite: [],
    capturedBlack: [],
    whiteTime: 300,
    blackTime: 300,
    clockActive: false,

    cameraPreset: 'player_w',
    promotionPending: null,
    viewingMoveIndex: -1,
    toast: null,

    showToast: (message, type = 'info') => {
      set({ toast: { message, type, id: Date.now() } });
      setTimeout(() => {
        if (get().toast?.message === message) {
          set({ toast: null });
        }
      }, 4000);
    },

    selectSquare: (sq) => {
      const state = get();
      if (state.isGameOver || state.viewingMoveIndex !== -1 || state.isAiThinking) return;

      // In play against AI, do not allow moving during AI's turn
      if (state.gameMode === 'play' && state.turn !== state.playerColor) return;

      if (!sq) {
        set({ selectedSquare: null, legalMoves: [] });
        return;
      }

      const piece = state.chess.get(sq as Square);

      // If a square is already selected
      if (state.selectedSquare) {
        if (state.selectedSquare === sq) {
          // Deselect
          set({ selectedSquare: null, legalMoves: [] });
          return;
        }

        // If target is in legal moves, attempt move
        if (state.legalMoves.includes(sq)) {
          const success = state.makeMove(state.selectedSquare, sq);
          if (success) return;
        }

        // Otherwise if clicked another own piece, switch selection
        if (piece && piece.color === state.chess.turn()) {
          const moves = state.chess.moves({ square: sq as Square, verbose: true });
          set({
            selectedSquare: sq,
            legalMoves: moves.map((m) => m.to)
          });
          soundService.playClick();
          return;
        }

        set({ selectedSquare: null, legalMoves: [] });
        return;
      }

      // No square selected yet
      if (piece && piece.color === state.chess.turn()) {
        const moves = state.chess.moves({ square: sq as Square, verbose: true });
        set({
          selectedSquare: sq,
          legalMoves: moves.map((m) => m.to)
        });
        soundService.playClick();
      }
    },

    makeMove: (from, to, promotionPiece) => {
      const state = get();
      if (state.isGameOver || state.viewingMoveIndex !== -1) return false;
      if (!from || !to) return false;

      const fromLower = from.toLowerCase() as Square;
      const toLower = to.toLowerCase() as Square;

      const piece = state.chess.get(fromLower);
      if (!piece || piece.color !== state.chess.turn()) {
        return false;
      }

      // Validate that this move is in legal moves
      const legalMoves = state.chess.moves({ square: fromLower, verbose: true });
      const matchedMove = legalMoves.find((m) => m.to === toLower);
      if (!matchedMove) {
        return false;
      }

      // Check for pawn promotion requirement
      const isPawnPromotion = Boolean(
        piece.type === 'p' &&
        ((piece.color === 'w' && to[1] === '8') || (piece.color === 'b' && to[1] === '1'))
      );

      if (isPawnPromotion && !promotionPiece) {
        // If it's the user promoting, open promotion modal
        if (state.gameMode === 'local_2p' || piece.color === state.playerColor) {
          set({ promotionPending: { from, to } });
          return true;
        } else {
          promotionPiece = 'q';
        }
      }

      try {
        const moveConfig: { from: string; to: string; promotion?: string } = {
          from: fromLower,
          to: toLower
        };
        if (isPawnPromotion) {
          moveConfig.promotion = promotionPiece || 'q';
        }

        const move = state.chess.move(moveConfig);

        if (!move) {
          get().showToast('Illegal move', 'warning');
          return false;
        }

        // Sound effect
        if (state.chess.isCheckmate()) {
          soundService.playCheckmate();
        } else if (state.chess.inCheck()) {
          soundService.playCheck();
        } else if (move.captured) {
          soundService.playCapture();
        } else {
          soundService.playMove();
        }

        // Captures update
        const capturedWhite = [...state.capturedWhite];
        const capturedBlack = [...state.capturedBlack];
        if (move.captured) {
          if (move.color === 'w') {
            capturedBlack.push(move.captured as PieceType);
          } else {
            capturedWhite.push(move.captured as PieceType);
          }
        }

        // Update clock with increment
        let newWhiteTime = state.whiteTime;
        let newBlackTime = state.blackTime;
        if (state.clockActive) {
          if (move.color === 'w') {
            newWhiteTime += state.timeControl.incrementSeconds;
          } else {
            newBlackTime += state.timeControl.incrementSeconds;
          }
        } else {
          startClockLoop();
        }

        const moveRecord: MoveRecord = {
          from: move.from,
          to: move.to,
          piece: move.piece as PieceType,
          color: move.color as PieceColor,
          captured: move.captured as PieceType | undefined,
          promotion: move.promotion,
          san: move.san,
          fen: state.chess.fen(),
          timestamp: Date.now()
        };

        const newHistory = [...state.history, moveRecord];
        const isCheck = state.chess.inCheck();
        const isCheckmate = state.chess.isCheckmate();
        const isDraw = state.chess.isDraw();

        let winner: PieceColor | 'draw' | null = null;
        let winReason = '';
        let drawReason = '';

        if (isCheckmate) {
          winner = move.color;
          winReason = 'by Checkmate';
          handleGameOverRecord(winner, winReason, newHistory.length);
        } else if (isDraw) {
          winner = 'draw';
          if (state.chess.isStalemate()) drawReason = 'Stalemate';
          else if (state.chess.isThreefoldRepetition()) drawReason = 'Threefold Repetition';
          else if (state.chess.isInsufficientMaterial()) drawReason = 'Insufficient Material';
          else drawReason = '50-Move Rule';
          winReason = drawReason;
          handleGameOverRecord('draw', winReason, newHistory.length);
        } else if (isCheck) {
          get().showToast('Check!', 'danger');
        }

        set({
          fen: state.chess.fen(),
          history: newHistory,
          turn: state.chess.turn() as PieceColor,
          isCheck,
          isCheckmate,
          isDraw,
          drawReason,
          isGameOver: isCheckmate || isDraw,
          winner,
          winReason,
          selectedSquare: null,
          legalMoves: [],
          lastMove: { from, to },
          capturedWhite,
          capturedBlack,
          whiteTime: newWhiteTime,
          blackTime: newBlackTime,
          clockActive: !(isCheckmate || isDraw),
          promotionPending: null
        });

        // In 2-player pass & play, rotate board if auto-flip is enabled
        if (state.gameMode === 'local_2p' && state.autoFlipBoard && !isCheckmate && !isDraw) {
          const nextTurn = state.chess.turn() as PieceColor;
          get().setBoardOrientation(nextTurn);
        }

        // In AI mode, if move was by user and game continues, trigger AI turn
        if (
          state.gameMode === 'play' &&
          !isCheckmate &&
          !isDraw &&
          state.chess.turn() !== state.playerColor
        ) {
          setTimeout(() => {
            get().triggerAiMoveIfNeeded();
          }, 150);
        }

        return true;
      } catch (err) {
        return false;
      }
    },

    triggerAiMoveIfNeeded: () => {
      const state = get();
      if (
        state.gameMode !== 'play' ||
        state.isGameOver ||
        state.isAiThinking ||
        state.chess.turn() === state.playerColor
      ) {
        return;
      }

      set({ isAiThinking: true });

      setTimeout(async () => {
        const current = get();
        if (
          current.isGameOver ||
          current.gameMode !== 'play' ||
          current.chess.turn() === current.playerColor
        ) {
          set({ isAiThinking: false });
          return;
        }

        try {
          const bestMove = await ChessAIService.findBestMove(
            current.chess,
            current.aiOpponent
          );
          set({ isAiThinking: false });
          if (bestMove) {
            get().makeMove(bestMove.from, bestMove.to, bestMove.promotion);
          }
        } catch {
          set({ isAiThinking: false });
        }
      }, 200);
    },

    completePromotion: (promo) => {
      const pending = get().promotionPending;
      if (!pending) return;
      get().makeMove(pending.from, pending.to, promo);
    },

    cancelPromotion: () => {
      set({ promotionPending: null, selectedSquare: null, legalMoves: [] });
    },

    undoMove: () => {
      const state = get();
      if (state.history.length === 0 || state.isAiThinking) return;

      // In play vs AI mode, undo both the AI move and the player's last move so it's the player's turn again
      if (state.gameMode === 'play' && state.history.length >= 2) {
        state.chess.undo();
        state.chess.undo();
        const updatedHistory = state.history.slice(0, state.history.length - 2);
        const last = updatedHistory[updatedHistory.length - 1];
        set({
          fen: state.chess.fen(),
          history: updatedHistory,
          turn: state.chess.turn() as PieceColor,
          isCheck: state.chess.inCheck(),
          isCheckmate: false,
          isDraw: false,
          isGameOver: false,
          winner: null,
          winReason: '',
          selectedSquare: null,
          legalMoves: [],
          lastMove: last ? { from: last.from, to: last.to } : null,
          viewingMoveIndex: -1,
          isAiThinking: false
        });
      } else {
        state.chess.undo();
        const updatedHistory = state.history.slice(0, state.history.length - 1);
        const last = updatedHistory[updatedHistory.length - 1];
        set({
          fen: state.chess.fen(),
          history: updatedHistory,
          turn: state.chess.turn() as PieceColor,
          isCheck: state.chess.inCheck(),
          isCheckmate: false,
          isDraw: false,
          isGameOver: false,
          winner: null,
          winReason: '',
          selectedSquare: null,
          legalMoves: [],
          lastMove: last ? { from: last.from, to: last.to } : null,
          viewingMoveIndex: -1,
          isAiThinking: false
        });
      }

      soundService.playClick();
      get().showToast('Move undone', 'info');
    },

    resetGame: (customTimeControl) => {
      if (clockTimer) clearInterval(clockTimer);
      const newChess = new Chess();
      const tc = customTimeControl || get().timeControl;
      const initialSeconds = tc.initialMinutes * 60;

      set({
        chess: newChess,
        fen: newChess.fen(),
        history: [],
        turn: 'w',
        isCheck: false,
        isCheckmate: false,
        isDraw: false,
        drawReason: '',
        isGameOver: false,
        winner: null,
        winReason: '',
        selectedSquare: null,
        legalMoves: [],
        lastMove: null,
        capturedWhite: [],
        capturedBlack: [],
        whiteTime: initialSeconds,
        blackTime: initialSeconds,
        clockActive: false,
        promotionPending: null,
        viewingMoveIndex: -1,
        isAiThinking: false,
        lastEloAdjustment: null
      });

      soundService.playGameStart();
      get().showToast('New game started', 'info');

      // If user plays black vs AI, trigger AI first move
      if (get().gameMode === 'play' && get().playerColor === 'b') {
        setTimeout(() => {
          get().triggerAiMoveIfNeeded();
        }, 500);
      }
    },

    setAiOpponent: (bot) => {
      const isPlayerWhite = get().playerColor === 'w';
      set({
        aiOpponent: bot,
        players: {
          white: isPlayerWhite ? 'You' : bot.name,
          black: isPlayerWhite ? bot.name : 'You'
        }
      });
      get().resetGame();
      get().showToast(`Opponent set to ${bot.name} (${bot.rating} Elo)`, 'info');
    },

    setLocalOpponentRating: (rating) => {
      set({ localOpponentRating: rating });
    },

    setTwoPlayerSetupOpen: (isTwoPlayerSetupOpen) => {
      set({ isTwoPlayerSetupOpen });
    },

    setAutoFlipBoard: (autoFlipBoard) => {
      set({ autoFlipBoard });
    },

    setPlayers: (players) => {
      set({ players });
    },

    startTwoPlayerGame: ({ whiteName, blackName, whiteRating, blackRating, timeControl, autoFlipBoard = false }) => {
      const tc = timeControl || get().timeControl;
      const cleanWhite = whiteName?.trim() || 'Player 1';
      const cleanBlack = blackName?.trim() || 'Player 2';
      const oppRating = blackRating || 1200;

      set({
        gameMode: 'local_2p',
        players: {
          white: cleanWhite,
          black: cleanBlack
        },
        playerColor: 'w',
        boardOrientation: 'w',
        cameraPreset: 'player_w',
        autoFlipBoard,
        localOpponentRating: oppRating,
        timeControl: tc,
        isTwoPlayerSetupOpen: false
      });

      get().resetGame(tc);
      get().showToast(`Match started: ${cleanWhite} vs ${cleanBlack}`, 'success');
    },

    setGameMode: (gameMode) => {
      if (gameMode === 'local_2p') {
        const currentPlayers = get().players;
        set({
          gameMode,
          players: {
            white: currentPlayers.white === 'You' ? 'Player 1' : currentPlayers.white,
            black: currentPlayers.black.includes('Bot') || currentPlayers.black.includes('AI') ? 'Player 2' : currentPlayers.black
          }
        });
      } else if (gameMode === 'play') {
        const bot = get().aiOpponent;
        const isPlayerWhite = get().playerColor === 'w';
        set({
          gameMode,
          players: {
            white: isPlayerWhite ? 'You' : bot.name,
            black: isPlayerWhite ? bot.name : 'You'
          }
        });
      } else {
        set({ gameMode });
      }
      get().resetGame();
    },

    setBoardOrientation: (boardOrientation) => {
      set({
        boardOrientation,
        cameraPreset: boardOrientation === 'w' ? 'player_w' : 'player_b'
      });
    },

    toggleOrientation: () => {
      const current = get().boardOrientation;
      const next = current === 'w' ? 'b' : 'w';
      get().setBoardOrientation(next);
      soundService.playClick();
    },

    setCameraPreset: (cameraPreset) => {
      set({ cameraPreset });
      soundService.playClick();
    },

    setTimeControl: (tc) => {
      set({ timeControl: tc });
      get().resetGame(tc);
    },

    setPlayerColor: (playerColor) => {
      const bot = get().aiOpponent;
      set({
        playerColor,
        boardOrientation: playerColor,
        players: {
          white: playerColor === 'w' ? 'You' : bot.name,
          black: playerColor === 'b' ? 'You' : bot.name
        }
      });
      get().resetGame();
    },

    resign: (color) => {
      const state = get();
      if (state.isGameOver) return;

      const resigningColor = color || (state.gameMode === 'local_2p' ? state.turn : state.playerColor);
      const winnerColor: PieceColor = resigningColor === 'w' ? 'b' : 'w';
      const resigningName = resigningColor === 'w' ? state.players.white : state.players.black;
      const winnerName = winnerColor === 'w' ? state.players.white : state.players.black;
      const winReason = `${resigningName} (${resigningColor === 'w' ? 'White' : 'Black'}) resigned. ${winnerName} wins!`;

      handleGameOverRecord(winnerColor, winReason, state.history.length);

      set({
        isGameOver: true,
        winner: winnerColor,
        winReason,
        clockActive: false,
        isAiThinking: false
      });

      soundService.playCheckmate();
    },

    offerDraw: () => {
      const state = get();
      if (state.isGameOver) return;

      const drawReason = 'Draw by mutual agreement';
      const winReason = `Draw agreed between ${state.players.white} and ${state.players.black}`;

      handleGameOverRecord('draw', drawReason, state.history.length);

      set({
        isGameOver: true,
        isDraw: true,
        winner: 'draw',
        drawReason,
        winReason,
        clockActive: false,
        isAiThinking: false
      });

      soundService.playMove();
    },

    jumpToMove: (index) => {
      const state = get();
      if (index === -1 || index >= state.history.length) {
        set({ viewingMoveIndex: -1 });
        return;
      }
      set({ viewingMoveIndex: index });
      soundService.playClick();
    },

    loadCustomFen: (fen) => {
      try {
        const customChess = new Chess(fen);
        set({
          chess: customChess,
          fen: customChess.fen(),
          history: [],
          turn: customChess.turn() as PieceColor,
          isCheck: customChess.inCheck(),
          isCheckmate: customChess.isCheckmate(),
          isDraw: customChess.isDraw(),
          isGameOver: customChess.isGameOver(),
          winner: customChess.isCheckmate() ? (customChess.turn() === 'w' ? 'b' : 'w') : null,
          lastMove: null,
          selectedSquare: null,
          legalMoves: [],
          viewingMoveIndex: -1,
          isAiThinking: false
        });
      } catch (e) {
        console.error('Invalid FEN loaded:', e);
      }
    },

    tickClock: () => {
      const state = get();
      if (!state.clockActive || state.isGameOver) return;

      if (state.turn === 'w') {
        const remaining = state.whiteTime - 1;
        if (remaining <= 0) {
          const reason = `${state.players.white} (White) ran out of time`;
          handleGameOverRecord('b', reason, state.history.length);
          set({
            whiteTime: 0,
            isGameOver: true,
            winner: 'b',
            winReason: reason,
            clockActive: false,
            isAiThinking: false
          });
          soundService.playCheckmate();
        } else {
          set({ whiteTime: remaining });
          if (remaining === 10) soundService.playClockWarning();
        }
      } else {
        const remaining = state.blackTime - 1;
        if (remaining <= 0) {
          const reason = `${state.players.black} (Black) ran out of time`;
          handleGameOverRecord('w', reason, state.history.length);
          set({
            blackTime: 0,
            isGameOver: true,
            winner: 'w',
            winReason: reason,
            clockActive: false,
            isAiThinking: false
          });
          soundService.playCheckmate();
        } else {
          set({ blackTime: remaining });
          if (remaining === 10) soundService.playClockWarning();
        }
      }
    }
  };
});
