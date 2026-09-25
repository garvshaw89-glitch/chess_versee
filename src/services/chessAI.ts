import { Chess, Square } from 'chess.js';

export interface AIOpponent {
  id: string;
  name: string;
  title: string;
  rating: number;
  avatar: string;
  style: 'aggressive' | 'balanced' | 'defensive' | 'tactical';
  description: string;
  depth: number;
  randomness: number; // 0 to 1
  accentColor: string;
}

export const AI_OPPONENTS: AIOpponent[] = [
  {
    id: 'ai_novice',
    name: 'Spark Bot',
    title: 'Apprentice AI',
    rating: 850,
    avatar: '🤖',
    style: 'balanced',
    description: 'Casual and friendly. Focuses on simple forward moves with occasional mistakes.',
    depth: 1,
    randomness: 0.35,
    accentColor: 'from-amber-600 to-yellow-600'
  },
  {
    id: 'ai_casual',
    name: 'Knight Pulse',
    title: 'Challenger AI',
    rating: 1150,
    avatar: '⚡',
    style: 'aggressive',
    description: 'Fast attacking bot. Prioritizes captures and king-side aggression.',
    depth: 2,
    randomness: 0.18,
    accentColor: 'from-slate-400 to-cyan-500'
  },
  {
    id: 'ai_club',
    name: 'Bishop Nova',
    title: 'Tactician AI',
    rating: 1400,
    avatar: '🔮',
    style: 'tactical',
    description: 'Disciplined club player. Strong piece coordination, forks, and center control.',
    depth: 3,
    randomness: 0.08,
    accentColor: 'from-amber-400 to-amber-600'
  },
  {
    id: 'ai_master',
    name: 'DeepMatrix GM',
    title: 'Master Engine',
    rating: 1750,
    avatar: '🧠',
    style: 'balanced',
    description: 'Positional mastermind. Relentless tactical punishment and refined endgames.',
    depth: 3,
    randomness: 0.02,
    accentColor: 'from-emerald-400 to-teal-500'
  },
  {
    id: 'ai_grandmaster',
    name: 'Titan Alpha 3D',
    title: 'Super Grandmaster',
    rating: 2150,
    avatar: '👑',
    style: 'tactical',
    description: 'Formidable computing strength. Near-zero errors and decisive counter-attacks.',
    depth: 4,
    randomness: 0.0,
    accentColor: 'from-purple-500 to-amber-400'
  }
];

// Piece values in centipawns
const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

// Piece Square Tables (White's perspective; 8x8 flattened a8-h8 to a1-h1)
const PAWN_PST = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 20, 20,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_PST = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50
];

const BISHOP_PST = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20
];

const ROOK_PST = [
    0,  0,  0,  0,  0,  0,  0,  0,
    5, 10, 10, 10, 10, 10, 10,  5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
    0,  0,  0,  5,  5,  0,  0,  0
];

const QUEEN_PST = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
   -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20
];

const KING_MID_PST = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
   20, 20,  0,  0,  0,  0, 20, 20,
   20, 30, 10,  0,  0, 10, 30, 20
];

function squareToIndex(sq: string): number {
  const file = sq.charCodeAt(0) - 97; // a -> 0
  const rank = 8 - parseInt(sq[1], 10); // 8 -> 0
  return rank * 8 + file;
}

function flipIndex(index: number): number {
  const rank = Math.floor(index / 8);
  const file = index % 8;
  return (7 - rank) * 8 + file;
}

export function evaluateBoard(chess: Chess): number {
  if (chess.isCheckmate()) {
    return chess.turn() === 'w' ? -30000 : 30000;
  }
  if (chess.isDraw()) {
    return 0;
  }

  let evaluation = 0;
  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f];
      if (!piece) continue;

      const baseVal = PIECE_VALUES[piece.type] || 0;
      const index = r * 8 + f;
      let pstVal = 0;

      switch (piece.type) {
        case 'p':
          pstVal = piece.color === 'w' ? PAWN_PST[index] : PAWN_PST[flipIndex(index)];
          break;
        case 'n':
          pstVal = piece.color === 'w' ? KNIGHT_PST[index] : KNIGHT_PST[flipIndex(index)];
          break;
        case 'b':
          pstVal = piece.color === 'w' ? BISHOP_PST[index] : BISHOP_PST[flipIndex(index)];
          break;
        case 'r':
          pstVal = piece.color === 'w' ? ROOK_PST[index] : ROOK_PST[flipIndex(index)];
          break;
        case 'q':
          pstVal = piece.color === 'w' ? QUEEN_PST[index] : QUEEN_PST[flipIndex(index)];
          break;
        case 'k':
          pstVal = piece.color === 'w' ? KING_MID_PST[index] : KING_MID_PST[flipIndex(index)];
          break;
      }

      const totalVal = baseVal + pstVal;
      if (piece.color === 'w') {
        evaluation += totalVal;
      } else {
        evaluation -= totalVal;
      }
    }
  }

  return evaluation;
}

function orderMoves(moves: any[]): any[] {
  return moves.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    if (a.captured) {
      const victimA = PIECE_VALUES[a.captured] || 0;
      const attackerA = PIECE_VALUES[a.piece] || 1;
      scoreA += victimA * 10 - attackerA;
    }
    if (a.promotion) scoreA += 800;

    if (b.captured) {
      const victimB = PIECE_VALUES[b.captured] || 0;
      const attackerB = PIECE_VALUES[b.piece] || 1;
      scoreB += victimB * 10 - attackerB;
    }
    if (b.promotion) scoreB += 800;

    return scoreB - scoreA;
  });
}

function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0 || chess.isGameOver()) {
    return evaluateBoard(chess);
  }

  const moves = orderMoves(chess.moves({ verbose: true }));

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export interface BestMoveResult {
  from: string;
  to: string;
  promotion?: 'q' | 'r' | 'b' | 'n';
  evalScore: number;
}

export class ChessAIService {
  public static async findBestMove(
    chessInstance: Chess,
    bot: AIOpponent
  ): Promise<BestMoveResult | null> {
    const moves = chessInstance.moves({ verbose: true });
    if (moves.length === 0) return null;

    // Simulate thinking delay between 450ms and 800ms
    const thinkDelay = 450 + Math.random() * 350;
    await new Promise((resolve) => setTimeout(resolve, thinkDelay));

    // For novice/casual bots, apply occasional random blunder or sub-optimal choice
    if (Math.random() < bot.randomness) {
      // Pick randomly among top 3 or all moves
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      return {
        from: randomMove.from,
        to: randomMove.to,
        promotion: (randomMove.promotion as any) || undefined,
        evalScore: 0
      };
    }

    const isWhite = chessInstance.turn() === 'w';
    let bestMoves: { move: any; score: number }[] = [];
    let bestScore = isWhite ? -Infinity : Infinity;

    // Shallow clone chess instance using FEN
    const searchChess = new Chess(chessInstance.fen());
    const ordered = orderMoves(searchChess.moves({ verbose: true }));

    for (const move of ordered) {
      searchChess.move(move);
      const score = minimax(
        searchChess,
        bot.depth - 1,
        -Infinity,
        Infinity,
        !isWhite
      );
      searchChess.undo();

      if (isWhite) {
        if (score > bestScore) {
          bestScore = score;
          bestMoves = [{ move, score }];
        } else if (score === bestScore) {
          bestMoves.push({ move, score });
        }
      } else {
        if (score < bestScore) {
          bestScore = score;
          bestMoves = [{ move, score }];
        } else if (score === bestScore) {
          bestMoves.push({ move, score });
        }
      }
    }

    if (bestMoves.length === 0) {
      const fallback = moves[0];
      return {
        from: fallback.from,
        to: fallback.to,
        promotion: (fallback.promotion as any) || undefined,
        evalScore: 0
      };
    }

    // Pick among equal best moves for variety
    const chosen = bestMoves[Math.floor(Math.random() * bestMoves.length)];
    return {
      from: chosen.move.from,
      to: chosen.move.to,
      promotion: (chosen.move.promotion as any) || undefined,
      evalScore: chosen.score
    };
  }
}
