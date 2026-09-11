import React, { useState, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Square } from 'chess.js';
import { useGameStore } from '../store/gameStore';
import { useSettingsStore } from '../store/settingsStore';
import { Board3D } from './Board3D';
import { AnimatedPiece } from './AnimatedPiece';
import { Lighting } from './Lighting';
import { CameraController } from './CameraController';
import { AmbientParticles } from './Particles';
import { WebGLFallback } from '../components/ui/WebGLFallback';
import { PieceType, PieceColor } from '../types/chess';

interface ChessCanvasProps {
  interactive?: boolean;
  isHeroPreview?: boolean;
}

function checkWebGL(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const ChessCanvas: React.FC<ChessCanvasProps> = ({
  interactive = true,
  isHeroPreview = false
}) => {
  const [webglAvailable] = useState<boolean>(() => checkWebGL());
  const [hoveredSquare, setHoveredSquare] = useState<string | null>(null);

  const {
    chess,
    selectedSquare,
    legalMoves,
    lastMove,
    isCheck,
    turn,
    cameraPreset,
    selectSquare,
    makeMove,
    viewingMoveIndex,
    history
  } = useGameStore();

  const { gameplay, graphics } = useSettingsStore();

  // If user requested 2D mode in settings or WebGL unavailable, render 2D fallback
  if (!webglAvailable || graphics.viewMode === '2d') {
    return <WebGLFallback />;
  }

  // Determine which position to display (live vs history rewind)
  const displayFen = useMemo(() => {
    if (viewingMoveIndex >= 0 && viewingMoveIndex < history.length) {
      return history[viewingMoveIndex].fen;
    }
    return chess.fen();
  }, [viewingMoveIndex, history, chess]);

  // Persistent identity map to keep <AnimatedPiece> instances mounted between moves
  const pieceIdentitiesRef = React.useRef<Map<string, { id: string; type: PieceType; color: PieceColor }>>(new Map());

  // Extract all pieces on the board with stable identity preservation
  const boardPieces = useMemo(() => {
    const rawPieces: { type: PieceType; color: PieceColor; square: string }[] = [];
    const rows = displayFen.split(' ')[0].split('/');

    rows.forEach((rowStr, rIdx) => {
      const rank = 8 - rIdx;
      let fileIdx = 0;
      for (const char of rowStr) {
        if (/\d/.test(char)) {
          fileIdx += parseInt(char, 10);
        } else {
          const file = String.fromCharCode(97 + fileIdx);
          const square = `${file}${rank}`;
          const isWhite = char === char.toUpperCase();
          const type = char.toLowerCase() as PieceType;
          const color: PieceColor = isWhite ? 'w' : 'b';

          rawPieces.push({
            type,
            color,
            square
          });
          fileIdx++;
        }
      }
    });

    const prevMap = pieceIdentitiesRef.current;
    const nextMap = new Map<string, { id: string; type: PieceType; color: PieceColor }>();
    const assignedIds = new Set<string>();

    // 1. Handle lastMove (source piece moves to target square)
    if (lastMove) {
      const prevPiece = prevMap.get(lastMove.from);
      const newPiece = rawPieces.find((p) => p.square === lastMove.to);
      if (prevPiece && newPiece && prevPiece.color === newPiece.color) {
        nextMap.set(lastMove.to, { id: prevPiece.id, type: newPiece.type, color: newPiece.color });
        assignedIds.add(prevPiece.id);

        // Check for castling companion rook move
        if (prevPiece.type === 'k') {
          if (lastMove.from === 'e1' && lastMove.to === 'g1') {
            const rook = prevMap.get('h1');
            if (rook) {
              nextMap.set('f1', { id: rook.id, type: 'r', color: 'w' });
              assignedIds.add(rook.id);
            }
          } else if (lastMove.from === 'e1' && lastMove.to === 'c1') {
            const rook = prevMap.get('a1');
            if (rook) {
              nextMap.set('d1', { id: rook.id, type: 'r', color: 'w' });
              assignedIds.add(rook.id);
            }
          } else if (lastMove.from === 'e8' && lastMove.to === 'g8') {
            const rook = prevMap.get('h8');
            if (rook) {
              nextMap.set('f8', { id: rook.id, type: 'r', color: 'b' });
              assignedIds.add(rook.id);
            }
          } else if (lastMove.from === 'e8' && lastMove.to === 'c8') {
            const rook = prevMap.get('a8');
            if (rook) {
              nextMap.set('d8', { id: rook.id, type: 'r', color: 'b' });
              assignedIds.add(rook.id);
            }
          }
        }
      }
    }

    // 2. Preserve IDs for all stationary pieces
    rawPieces.forEach((p) => {
      if (nextMap.has(p.square)) return;
      const prev = prevMap.get(p.square);
      if (prev && prev.color === p.color && prev.type === p.type && !assignedIds.has(prev.id)) {
        nextMap.set(p.square, { id: prev.id, type: p.type, color: p.color });
        assignedIds.add(prev.id);
      }
    });

    // 3. Assign IDs to any remaining pieces (newly introduced, promoted, or initial load)
    const result = rawPieces.map((p) => {
      let entry = nextMap.get(p.square);
      if (!entry) {
        const id = `${p.color}_${p.type}_${p.square}_${Math.random().toString(36).substring(2, 8)}`;
        entry = { id, type: p.type, color: p.color };
        nextMap.set(p.square, entry);
      }
      return {
        id: entry.id,
        type: p.type,
        color: p.color,
        square: p.square
      };
    });

    pieceIdentitiesRef.current = nextMap;
    return result;
  }, [displayFen, lastMove]);

  // Find King square if in check
  const checkSquare = useMemo(() => {
    if (!isCheck) return null;
    const kingPiece = boardPieces.find((p) => p.type === 'k' && p.color === turn);
    return kingPiece ? kingPiece.square : null;
  }, [isCheck, boardPieces, turn]);

  // Square interaction handler
  const handleSquareClick = (sq: string) => {
    if (!interactive) return;

    if (selectedSquare) {
      if (legalMoves.includes(sq)) {
        makeMove(selectedSquare, sq);
      } else {
        selectSquare(sq);
      }
    } else {
      selectSquare(sq);
    }
  };

  // Piece click handler
  const handlePieceClick = (pieceSquare: string, pieceColor: PieceColor) => {
    if (!interactive) return;

    // If we have a selected piece and clicked an opponent piece that is a legal capture
    if (selectedSquare && legalMoves.includes(pieceSquare)) {
      makeMove(selectedSquare, pieceSquare);
      return;
    }

    // Otherwise select this piece if it belongs to active player
    if (pieceColor === turn) {
      selectSquare(pieceSquare);
    } else {
      selectSquare(null);
    }
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden touch-none">
      <Canvas
        shadows={graphics.shadows}
        dpr={graphics.quality === 'low' ? [1, 1] : [1, 2]}
        gl={{
          antialias: graphics.quality !== 'low',
          powerPreference: 'high-performance',
          alpha: true
        }}
        camera={{
          position: isHeroPreview ? [7.5, 5.5, 8.5] : [0, 8.2, 9.2],
          fov: 44,
          near: 0.1,
          far: 60
        }}
      >
        <Suspense fallback={null}>
          <Lighting theme={gameplay.boardTheme} shadows={graphics.shadows} />

          <CameraController
            preset={isHeroPreview ? 'cinematic' : cameraPreset}
            isCinematicActive={isHeroPreview}
          />

          <Board3D
            theme={gameplay.boardTheme}
            selectedSquare={selectedSquare}
            legalMoves={gameplay.showLegalMoves ? legalMoves : []}
            lastMove={lastMove}
            checkSquare={checkSquare}
            hoveredSquare={hoveredSquare}
            onSquareClick={handleSquareClick}
            onSquareHover={setHoveredSquare}
          />

          {boardPieces.map((p) => (
            <AnimatedPiece
              key={p.id}
              id={p.id}
              type={p.type}
              color={p.color}
              square={p.square}
              theme={gameplay.pieceTheme}
              isSelected={selectedSquare === p.square}
              isUnderCheck={checkSquare === p.square}
              isHovered={hoveredSquare === p.square}
              onClick={() => handlePieceClick(p.square, p.color)}
              onPointerOver={() => setHoveredSquare(p.square)}
              onPointerOut={() => setHoveredSquare(null)}
            />
          ))}

          {graphics.particles && <AmbientParticles count={isHeroPreview ? 90 : 50} />}
        </Suspense>
      </Canvas>
    </div>
  );
};
