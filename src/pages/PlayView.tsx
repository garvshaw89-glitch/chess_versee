import React, { useState } from 'react';
import { ChessCanvas } from '../3d/ChessCanvas';
import { GameClock } from '../components/ui/GameClock';
import { CapturedPieces } from '../components/ui/CapturedPieces';
import { MoveHistoryPanel } from '../components/ui/MoveHistoryPanel';
import { MoveHistoryBottomSheet } from '../components/ui/MoveHistoryBottomSheet';
import { GameControlsBar } from '../components/ui/GameControlsBar';
import { PromotionModal } from '../components/ui/PromotionModal';
import { CheckmateModal } from '../components/ui/CheckmateModal';
import { AIOpponentModal } from '../components/ui/AIOpponentModal';
import { useGameStore } from '../store/gameStore';
import { NavPage } from '../components/ui/Navbar';
import { 
  Shield, 
  Sparkles, 
  AlertCircle, 
  Users, 
  History, 
  RotateCw, 
  Bot, 
  Zap, 
  Cpu 
} from 'lucide-react';
import { Button3D } from '../components/ui/Button3D';
import { useDevice } from '../services/deviceTier';
import { StorageService } from '../services/storage';
import { EloService } from '../services/eloService';

interface PlayViewProps {
  onNavigate: (page: NavPage) => void;
  onOpenSettings: () => void;
}

export const PlayView: React.FC<PlayViewProps> = ({ onNavigate, onOpenSettings }) => {
  const [historySheetOpen, setHistorySheetOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const device = useDevice();
  const {
    gameMode,
    turn,
    isCheck,
    isGameOver,
    playerColor,
    players,
    history,
    toggleOrientation,
    setTwoPlayerSetupOpen,
    setGameMode,
    aiOpponent,
    isAiThinking
  } = useGameStore();

  const userStats = StorageService.getStats();
  const userRating = userStats.rating;
  const stakes = EloService.getPotentialChanges(userRating, aiOpponent.rating);

  const currentTurnPlayer = turn === 'w' ? players.white : players.black;
  const isLandscapeMobile = device.isLandscape && (device.isMobile || device.height < 520);

  return (
    <div className="relative w-full h-[calc(100dvh-56px)] md:h-[calc(100dvh-60px)] flex flex-col overflow-hidden bg-neutral-950">
      {/* Centered Max-Width Container for Desktop and Ultrawide monitors */}
      <div className="w-full max-w-7xl mx-auto h-full flex flex-col lg:flex-row overflow-hidden flex-1">
        
        {/* 3D Chess Board Stage */}
        <div className="relative flex-1 h-full flex flex-col items-center justify-between p-1.5 sm:p-3 overflow-hidden min-h-0">
          
          {/* Top Status Strip */}
          <div className="w-full max-w-xl flex items-center justify-between z-10 px-2 py-1 gap-1.5 flex-wrap">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              
              {/* Opponents & Elo Tags */}
              <div className="flex items-center gap-1 font-mono text-[11px] sm:text-xs">
                <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-100 font-bold">
                  {players.white}
                </span>
                <span className="text-amber-500 font-bold text-xs">vs</span>
                <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-bold">
                  {players.black}
                </span>
              </div>

              {/* Bot Selector Button */}
              <Button3D
                variant="secondary"
                size="sm"
                onClick={() => setAiModalOpen(true)}
                icon={<Bot className="w-3 h-3 text-amber-400" />}
                title="Change AI bot or difficulty"
                className="!py-1 !px-2 text-[10px] sm:text-[11px]"
              >
                <span>{aiOpponent.name} ({aiOpponent.rating})</span>
              </Button3D>

              {/* Quick Players / Clock Setup Button */}
              <Button3D
                variant="secondary"
                size="sm"
                onClick={() => setTwoPlayerSetupOpen(true)}
                icon={<Users className="w-3 h-3 text-sky-400" />}
                title="Edit player names or time control"
                className="!py-1 !px-2 text-[10px] sm:text-[11px]"
              >
                <span>Format</span>
              </Button3D>
            </div>

            {/* Turn / AI Thinking Banner */}
            <div className="flex items-center gap-1.5">
              {isAiThinking ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-[11px] sm:text-xs font-mono font-bold text-amber-300 animate-pulse backdrop-blur-md">
                  <Cpu className="w-3.5 h-3.5 animate-spin" />
                  <span>AI Thinking...</span>
                </div>
              ) : isCheck ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/80 border border-red-500/60 text-[11px] sm:text-xs font-semibold text-red-300 backdrop-blur-md animate-bounce">
                  <AlertCircle className="w-3.5 h-3.5" /> CHECK! ({currentTurnPlayer})
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900/80 border border-neutral-800 text-[11px] sm:text-xs font-semibold backdrop-blur-md">
                  <span className="text-neutral-200">
                    <span className="font-bold text-amber-400">{currentTurnPlayer}</span>
                    <span className="text-neutral-400 ml-1">({turn === 'w' ? 'White' : 'Black'})</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Elo Stakes Sub-strip */}
          <div className="w-full max-w-xl px-2 flex items-center justify-between text-[10px] font-mono text-neutral-400 z-10">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Your Elo: <strong className="text-neutral-200">{userRating}</strong></span>
            </span>
            <span className="flex items-center gap-2">
              <span>Potential:</span>
              <span className="text-emerald-400 font-semibold">+{stakes.win}W</span>
              <span className="text-neutral-300 font-semibold">{stakes.draw >= 0 ? `+${stakes.draw}` : stakes.draw}D</span>
              <span className="text-rose-400 font-semibold">{stakes.loss}L</span>
            </span>
          </div>

          {/* 3D Canvas Container */}
          <div className="relative w-full flex-1 min-h-0 flex items-center justify-center touch-none">
            <ChessCanvas />
          </div>

          {/* Clocks & Mobile Controls Row */}
          <div className="w-full max-w-xl z-10 flex flex-col gap-1.5 pb-1 lg:pb-0">
            <GameClock />

            {/* Mobile Bottom Quick Actions (Moves Drawer, Flip, Controls) */}
            <div className="flex items-center justify-between gap-1.5 lg:hidden px-1">
              <Button3D
                variant="secondary"
                size="sm"
                onClick={() => setHistorySheetOpen(true)}
                icon={<History className="w-3.5 h-3.5 text-amber-400" />}
                className="flex-1 !py-1.5 text-xs font-semibold"
                title="Open move history and captured pieces"
              >
                <span>Moves ({Math.ceil(history.length / 2)})</span>
              </Button3D>

              <Button3D
                variant="secondary"
                size="sm"
                onClick={toggleOrientation}
                icon={<RotateCw className="w-3.5 h-3.5 text-neutral-300" />}
                className="!py-1.5 !px-3 text-xs"
                title="Flip board view"
              >
                <span>Flip</span>
              </Button3D>
            </div>
          </div>
        </div>

        {/* Right Sidebar: History, Captured, Controls (Permanently docked on Desktop & Landscape) */}
        <div className="hidden lg:flex w-80 xl:w-96 h-full bg-neutral-950/95 border-l border-neutral-800/80 p-3 xl:p-4 flex-col gap-3 z-10 overflow-y-auto">
          {/* Captured Material Widget */}
          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300 mb-2">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Material Advancements</span>
            </div>
            <CapturedPieces />
          </div>

          {/* Move History Panel */}
          <div className="flex-1 min-h-[160px] overflow-hidden">
            <MoveHistoryPanel />
          </div>

          {/* Game Action Controls */}
          <GameControlsBar onOpenSettings={onOpenSettings} />
        </div>
      </div>

      {/* Mobile Move History Bottom Sheet */}
      <MoveHistoryBottomSheet
        isOpen={historySheetOpen}
        onClose={() => setHistorySheetOpen(false)}
      />

      {/* Overlays */}
      <AIOpponentModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />
      <PromotionModal />
      <CheckmateModal onNavigateHome={() => onNavigate('landing')} />
    </div>
  );
};
