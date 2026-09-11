import React from 'react';
import { ChessCanvas } from '../3d/ChessCanvas';
import { GameClock } from '../components/ui/GameClock';
import { CapturedPieces } from '../components/ui/CapturedPieces';
import { MoveHistoryPanel } from '../components/ui/MoveHistoryPanel';
import { GameControlsBar } from '../components/ui/GameControlsBar';
import { PromotionModal } from '../components/ui/PromotionModal';
import { CheckmateModal } from '../components/ui/CheckmateModal';
import { useGameStore } from '../store/gameStore';
import { NavPage } from '../components/ui/Navbar';
import { Shield, Sparkles, AlertCircle, Users, Bot } from 'lucide-react';
import { Button3D } from '../components/ui/Button3D';

interface PlayViewProps {
  onNavigate: (page: NavPage) => void;
  onOpenSettings: () => void;
}

export const PlayView: React.FC<PlayViewProps> = ({ onNavigate, onOpenSettings }) => {
  const {
    gameMode,
    turn,
    isCheck,
    isGameOver,
    playerColor,
    aiThinking,
    players,
    setTwoPlayerSetupOpen,
    setGameMode
  } = useGameStore();

  const isPlayerTurn = gameMode === 'local_2p' || turn === playerColor;
  const currentTurnPlayer = turn === 'w' ? players.white : players.black;

  return (
    <div className="relative w-full h-[calc(100vh-60px)] flex flex-col lg:flex-row overflow-hidden bg-neutral-950">
      {/* 3D Chess Board Main Stage */}
      <div className="relative flex-1 h-[55vh] lg:h-full flex flex-col items-center justify-between p-2 sm:p-4 overflow-hidden">
        {/* Top Status Strip */}
        <div className="w-full max-w-xl flex items-center justify-between z-10 px-2 py-1 gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-200 font-mono">
              {gameMode === 'local_2p' ? (
                <span className="flex items-center gap-1.5">
                  <span className="text-neutral-100">{players.white}</span>
                  <span className="text-amber-500 font-bold">vs</span>
                  <span className="text-neutral-300">{players.black}</span>
                </span>
              ) : gameMode === 'vs_ai' ? (
                'Match vs DeepAI'
              ) : (
                'Tactical Arena'
              )}
            </span>

            {/* Quick Switch / Setup Button with 3D button interactions */}
            {gameMode === 'local_2p' ? (
              <Button3D
                variant="secondary"
                size="sm"
                onClick={() => setTwoPlayerSetupOpen(true)}
                icon={<Users className="w-3 h-3 text-amber-400" />}
                title="Edit player names or colors"
              >
                <span>Edit Players</span>
              </Button3D>
            ) : (
              <Button3D
                variant="secondary"
                size="sm"
                onClick={() => setTwoPlayerSetupOpen(true)}
                icon={<Users className="w-3 h-3 text-amber-400" />}
                title="Switch to Local 2-Player Pass & Play"
              >
                <span>2-Player Mode</span>
              </Button3D>
            )}
          </div>

          {/* Turn Indicator Banner */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/80 border border-neutral-800 text-xs font-semibold backdrop-blur-md">
            {aiThinking ? (
              <span className="text-amber-400 flex items-center gap-1.5 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" /> AI Thinking...
              </span>
            ) : isCheck ? (
              <span className="text-red-400 flex items-center gap-1.5 animate-bounce">
                <AlertCircle className="w-3.5 h-3.5" /> CHECK! ({currentTurnPlayer})
              </span>
            ) : (
              <span className="text-neutral-200">
                {gameMode === 'local_2p' ? (
                  <>
                    <span className="font-bold text-amber-400">{currentTurnPlayer}</span>
                    <span className="text-neutral-400 ml-1">({turn === 'w' ? 'White' : 'Black'}) to move</span>
                  </>
                ) : (
                  <span>{turn === 'w' ? '⚪ White' : '⚫ Black'} to move</span>
                )}
              </span>
            )}
          </div>
        </div>

        {/* 3D Canvas Board Container */}
        <div className="relative w-full h-full flex-1 flex items-center justify-center">
          <ChessCanvas />
        </div>

        {/* Clocks & Quick Stats Bar under board on mobile */}
        <div className="w-full max-w-xl z-10 flex flex-col gap-2">
          <GameClock />
        </div>
      </div>

      {/* Right Sidebar: History, Captured, Controls */}
      <div className="w-full lg:w-84 xl:w-96 h-[45vh] lg:h-full bg-neutral-950/95 border-t lg:border-t-0 lg:border-l border-neutral-800/80 p-3 sm:p-4 flex flex-col gap-3 z-10 overflow-y-auto">
        {/* Captured Material Widget */}
        <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300 mb-2">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Material Advancements</span>
          </div>
          <CapturedPieces />
        </div>

        {/* Move History Panel */}
        <div className="flex-1 min-h-[160px]">
          <MoveHistoryPanel />
        </div>

        {/* Game Action Controls */}
        <GameControlsBar onOpenSettings={onOpenSettings} />
      </div>

      {/* Overlays */}
      <PromotionModal />
      <CheckmateModal onNavigateHome={() => onNavigate('landing')} />
    </div>
  );
};
