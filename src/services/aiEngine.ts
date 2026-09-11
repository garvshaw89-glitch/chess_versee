import { Chess } from 'chess.js';
import { AIDifficulty } from '../types/chess';

// Piece value mapping (centipawns)
const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

// Piece-Square Tables (from White's perspective; inverted for Black)
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

function getSquareIndex(square: string): number {
  const file = square.charCodeAt(0) - 97; // 0 to 7 (a-h)
  const rank = 8 - parseInt(square[1], 10); // 0 to 7 (8-1)
  return rank * 8 + file;
}

function evaluateBoard(chess: Chess): number {
  if (chess.isCheckmate()) {
    return chess.turn() === 'w' ? -99999 : 99999;
  }
  if (chess.isDraw()) {
    return 0;
  }

  let score = 0;
  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f];
      if (!piece) continue;

      const sqIndex = r * 8 + f;
      const flippedIndex = (7 - r) * 8 + f;
      const val = PIECE_VALUES[piece.type] || 0;

      let pstBonus = 0;
      switch (piece.type) {
        case 'p':
          pstBonus = piece.color === 'w' ? PAWN_PST[sqIndex] : PAWN_PST[flippedIndex];
          break;
        case 'n':
          pstBonus = piece.color === 'w' ? KNIGHT_PST[sqIndex] : KNIGHT_PST[flippedIndex];
          break;
        case 'b':
          pstBonus = piece.color === 'w' ? BISHOP_PST[sqIndex] : BISHOP_PST[flippedIndex];
          break;
        case 'r':
          pstBonus = piece.color === 'w' ? ROOK_PST[sqIndex] : ROOK_PST[flippedIndex];
          break;
        case 'q':
          pstBonus = piece.color === 'w' ? QUEEN_PST[sqIndex] : QUEEN_PST[flippedIndex];
          break;
        case 'k':
          pstBonus = piece.color === 'w' ? KING_MID_PST[sqIndex] : KING_MID_PST[flippedIndex];
          break;
      }

      const pieceEval = val + pstBonus;
      if (piece.color === 'w') {
        score += pieceEval;
      } else {
        score -= pieceEval;
      }
    }
  }

  return score;
}

// Order moves to optimize alpha-beta pruning (checks & captures first)
function orderMoves(moves: any[]): any[] {
  return moves.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    if (a.captured) scoreA += 10 * (PIECE_VALUES[a.captured] || 0) - (PIECE_VALUES[a.piece] || 0);
    if (b.captured) scoreB += 10 * (PIECE_VALUES[b.captured] || 0) - (PIECE_VALUES[b.piece] || 0);
    if (a.promotion) scoreA += 800;
    if (b.promotion) scoreB += 800;
    if (a.san.includes('+')) scoreA += 50;
    if (b.san.includes('+')) scoreB += 50;
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
      const evalScore = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move);
      const evalScore = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export interface AIEngineResult {
  from: string;
  to: string;
  promotion?: string;
  san: string;
  evaluation: number;
}

export class AIEngine {
  public static evaluatePosition(fen: string): number {
    try {
      const chess = new Chess(fen);
      return evaluateBoard(chess);
    } catch {
      return 0;
    }
  }

  public static async calculateBestMove(
    fen: string,
    difficulty: AIDifficulty
  ): Promise<AIEngineResult | null> {
    const chess = new Chess(fen);
    if (chess.isGameOver()) return null;

    const legalMoves = chess.moves({ verbose: true });
    if (legalMoves.length === 0) return null;

    // Determine depth and thinking delay based on difficulty
    let depth = 2;
    let thinkingDelay = 600;
    let blunderChance = 0;

    switch (difficulty) {
      case 1:
      case 'beginner':
        depth = 1;
        thinkingDelay = 450;
        blunderChance = 0.40;
        break;
      case 2:
      case 'easy':
        depth = 2;
        thinkingDelay = 600;
        blunderChance = 0.18;
        break;
      case 3:
      case 'medium':
        depth = 3;
        thinkingDelay = 750;
        blunderChance = 0.05;
        break;
      case 4:
      case 'hard':
        depth = 3;
        thinkingDelay = 1000;
        blunderChance = 0;
        break;
      case 5:
      case 'expert':
        depth = 4;
        thinkingDelay = 1200;
        blunderChance = 0;
        break;
    }

    // Give the UI a chance to render the thinking indicator and sound
    await new Promise((resolve) => setTimeout(resolve, thinkingDelay));

    // Blunder / random choice for lower difficulties
    if (blunderChance > 0 && Math.random() < blunderChance) {
      const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
      return {
        from: randomMove.from,
        to: randomMove.to,
        promotion: randomMove.promotion,
        san: randomMove.san,
        evaluation: 0
      };
    }

    const isWhite = chess.turn() === 'w';
    let bestMove = legalMoves[0];
    let bestScore = isWhite ? -Infinity : Infinity;

    const ordered = orderMoves(legalMoves);

    for (const move of ordered) {
      chess.move(move);
      const score = minimax(chess, depth - 1, -Infinity, Infinity, !isWhite);
      chess.undo();

      if (isWhite) {
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      } else {
        if (score < bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
    }

    return {
      from: bestMove.from,
      to: bestMove.to,
      promotion: bestMove.promotion,
      san: bestMove.san,
      evaluation: bestScore
    };
  }
}

export async function getBestMove(chess: Chess, depthLevel: number | AIDifficulty = 3) {
  let diff: AIDifficulty = 'medium';
  if (typeof depthLevel === 'number') {
    if (depthLevel <= 1) diff = 'beginner';
    else if (depthLevel === 2) diff = 'easy';
    else if (depthLevel === 3) diff = 'medium';
    else if (depthLevel === 4) diff = 'hard';
    else diff = 'expert';
  } else {
    diff = depthLevel;
  }
  return AIEngine.calculateBestMove(chess.fen(), diff);
}
