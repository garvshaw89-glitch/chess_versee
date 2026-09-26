import React, { useState } from 'react';
import { ThemePreview3D } from '../../3d/ThemePreview3D';
import { BoardThemeId, PieceThemeId, PieceType } from '../../types/chess';
import { RotateCw, Sparkles, Layers, Crown, ArrowRight } from 'lucide-react';
import { soundService } from '../../services/sound';
import { useSettingsStore } from '../../store/settingsStore';

interface InteractiveBoardPreviewProps {
  onLaunchArena: () => void;
}

const BOARD_OPTIONS: { id: BoardThemeId; label: string; color: string }[] = [
  { id: 'midnight', label: 'Midnight Onyx', color: '#18181b' },
  { id: 'royal', label: 'Royal Walnut', color: '#78350f' },
  { id: 'cyber', label: 'Cyber Grid', color: '#0284c7' },
  { id: 'marble', label: 'Imperial Marble', color: '#52525b' },
  { id: 'classic', label: 'Classic Tournament', color: '#b45309' },
];

const PIECE_OPTIONS: { id: PieceThemeId; label: string }[] = [
  { id: 'classic', label: 'Alabaster & Ebony' },
  { id: 'wood', label: 'Natural Walnut' },
  { id: 'metal', label: 'Brushed Titanium' },
  { id: 'futuristic', label: 'Cyber Obsidian' },
];

export const InteractiveBoardPreview: React.FC<InteractiveBoardPreviewProps> = ({
  onLaunchArena,
}) => {
  const { gameplay, updateGameplay } = useSettingsStore();
  const [boardTheme, setBoardTheme] = useState<BoardThemeId>(gameplay.boardTheme || 'midnight');
  const [pieceTheme, setPieceTheme] = useState<PieceThemeId>(gameplay.pieceTheme || 'classic');
  const [focusedPiece, setFocusedPiece] = useState<PieceType | 'all'>('all');
  const [autoRotate, setAutoRotate] = useState(true);

  const handleSelectBoard = (id: BoardThemeId) => {
    soundService.playClick();
    setBoardTheme(id);
    updateGameplay({ boardTheme: id });
  };

  const handleSelectPiece = (id: PieceThemeId) => {
    soundService.playClick();
    setPieceTheme(id);
    updateGameplay({ pieceTheme: id });
  };

  return (
    <div className="relative w-full rounded-2xl bg-neutral-900/60 border border-white/10 overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-white/5 gap-3 bg-neutral-950/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
              Interactive 3D Viewport
            </span>
          </div>
          <h3 className="text-lg font-bold text-neutral-100 font-display mt-0.5">
            Physical PBR Material & Geometry Stage
          </h3>
        </div>

        {/* Viewport Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundService.playClick();
              setAutoRotate(!autoRotate);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors border ${
              autoRotate
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-neutral-800/60 text-neutral-400 border-white/5 hover:text-white'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
            <span>{autoRotate ? 'Turntable Active' : 'Turntable Paused'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Body: 3D Stage on Left / Real-Time Controls on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        {/* 3D WebGL Canvas */}
        <div className="lg:col-span-7 relative h-[340px] sm:h-[420px] lg:h-auto min-h-[380px] bg-gradient-to-b from-neutral-950/90 to-neutral-900/90 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <ThemePreview3D
              boardTheme={boardTheme}
              pieceTheme={pieceTheme}
              focusedPiece={focusedPiece}
              autoRotate={autoRotate}
            />
          </div>

          {/* Floating Orbit Guidance Pill */}
          <div className="absolute bottom-3 left-3 pointer-events-none px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] font-mono text-neutral-400 backdrop-blur-md">
            Click &amp; drag to orbit camera · Scroll to zoom
          </div>

          {/* Telemetry Indicator */}
          <div className="absolute top-3 right-3 pointer-events-none px-3 py-1 rounded-md bg-neutral-950/80 border border-white/5 text-[10px] font-mono text-neutral-400 backdrop-blur-md flex items-center gap-3">
            <span>60 FPS</span>
            <span>·</span>
            <span>PBR Shaders</span>
            <span>·</span>
            <span>Soft PCF</span>
          </div>
        </div>

        {/* Customization Dashboard */}
        <div className="lg:col-span-5 p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/5 bg-neutral-950/60 space-y-6">
          <div className="space-y-5">
            {/* Piece Focus Selector */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 mb-2.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Piece Focus Inspection</span>
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {[
                  { id: 'all' as const, label: 'All' },
                  { id: 'k' as PieceType, label: '♔ King' },
                  { id: 'q' as PieceType, label: '♕ Queen' },
                  { id: 'r' as PieceType, label: '♖ Rook' },
                  { id: 'b' as PieceType, label: '♗ Bishop' },
                  { id: 'n' as PieceType, label: '♘ Knight' },
                  { id: 'p' as PieceType, label: '♙ Pawn' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      soundService.playClick();
                      setFocusedPiece(item.id);
                    }}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      focusedPiece === item.id
                        ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                        : 'bg-neutral-900 border border-white/5 text-neutral-400 hover:text-white hover:border-white/15'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Board Material Themes */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 mb-2.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Board Finish &amp; Lighting</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {BOARD_OPTIONS.map((board) => (
                  <button
                    key={board.id}
                    onClick={() => handleSelectBoard(board.id)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left text-xs font-medium transition-all ${
                      boardTheme === board.id
                        ? 'bg-amber-500/10 border-amber-500/80 text-amber-300'
                        : 'bg-neutral-900/80 border-white/5 text-neutral-300 hover:border-white/15 hover:bg-neutral-850'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: board.color }}
                    />
                    <span className="truncate">{board.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Piece Shader Sets */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Sculpted Piece Material</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PIECE_OPTIONS.map((piece) => (
                  <button
                    key={piece.id}
                    onClick={() => handleSelectPiece(piece.id)}
                    className={`px-3 py-2 rounded-xl border text-left text-xs font-medium transition-all ${
                      pieceTheme === piece.id
                        ? 'bg-amber-500/10 border-amber-500/80 text-amber-300 font-semibold'
                        : 'bg-neutral-900/80 border-white/5 text-neutral-400 hover:text-neutral-200 hover:border-white/15'
                    }`}
                  >
                    {piece.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="text-[11px] text-neutral-400 font-mono">
              Ready to battle with equipped theme
            </div>
            <button
              onClick={onLaunchArena}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 font-bold text-xs hover:brightness-105 transition-transform active:scale-[0.98] shadow-md shadow-amber-500/15"
            >
              <span>Play With This Set</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
