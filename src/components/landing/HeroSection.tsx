import React from 'react';
import { ChessCanvas } from '../../3d/ChessCanvas';
import { NavPage } from '../ui/Navbar';
import { useGameStore } from '../../store/gameStore';
import { Button3D } from '../ui/Button3D';
import { StaggerContainer } from '../transitions/StaggerContainer';
import { 
  Play, 
  Bot, 
  Users, 
  Puzzle, 
  BookOpen, 
  ShieldCheck, 
  Cpu, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (page: NavPage) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { setGameMode, resetGame, setTwoPlayerSetupOpen } = useGameStore();

  const handlePlayNow = () => {
    setGameMode('vs_ai');
    resetGame();
    onNavigate('play');
  };

  const handlePlayAI = () => {
    setGameMode('vs_ai');
    resetGame();
    onNavigate('ai');
  };

  const handleLocal2P = () => {
    setTwoPlayerSetupOpen(true);
  };

  return (
    <div className="relative min-h-[calc(100vh-60px)] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      {/* Background 3D Canvas with cinematic camera orbit */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-auto">
        <ChessCanvas isHeroPreview={true} interactive={false} />
      </div>

      {/* Atmospheric Ambient Glows & Subtle Vignette */}
      <div className="absolute inset-0 z-1 pointer-events-none bg-radial-gradient from-transparent via-neutral-950/40 to-neutral-950/90" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Content Overlay with Staggered Entrance */}
      <StaggerContainer 
        staggerMs={70} 
        baseDelayMs={50}
        className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8 flex flex-col items-center text-center"
      >
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/80 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium backdrop-blur-md shadow-lg shadow-amber-500/5 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>NEXT-GENERATION 3D CHESS BATTLEFIELD</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-neutral-100 font-display max-w-3xl leading-[1.08] drop-shadow-2xl">
          MASTER THE BOARD.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-neutral-300 max-w-xl mt-3 font-normal leading-relaxed drop-shadow">
          Experience chess in a new dimension. Precision physics, intelligent AI engine, interactive puzzles, and cinematic 3D realism.
        </p>

        {/* Primary Call to Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8 w-full max-w-md">
          <Button3D
            variant="primary"
            size="lg"
            onClick={handlePlayNow}
            icon={<Play className="w-4 h-4 fill-current" />}
            className="flex-1 min-w-[160px]"
          >
            PLAY NOW
          </Button3D>

          <Button3D
            variant="secondary"
            size="lg"
            onClick={handlePlayAI}
            icon={<Bot className="w-4 h-4 text-amber-400" />}
            className="flex-1 min-w-[160px]"
          >
            PLAY VS AI
          </Button3D>
        </div>

        {/* Secondary Mode Direct Links with 3D button interactions */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5 text-xs font-medium text-neutral-400">
          <Button3D
            variant="secondary"
            size="sm"
            onClick={handleLocal2P}
            icon={<Users className="w-3.5 h-3.5 text-cyan-400" />}
          >
            2 PLAYER
          </Button3D>

          <Button3D
            variant="secondary"
            size="sm"
            onClick={() => onNavigate('puzzles')}
            icon={<Puzzle className="w-3.5 h-3.5 text-emerald-400" />}
          >
            PUZZLES
          </Button3D>

          <Button3D
            variant="secondary"
            size="sm"
            onClick={() => onNavigate('learn')}
            icon={<BookOpen className="w-3.5 h-3.5 text-purple-400" />}
          >
            LEARN CHESS
          </Button3D>
        </div>
      </StaggerContainer>

      {/* Feature Strip at Bottom */}
      <div className="relative z-10 w-full border-t border-neutral-800/60 bg-neutral-950/70 backdrop-blur-md py-4 px-4 sm:px-8 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-amber-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-200 uppercase">Async AI Engine</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">5 calibrated skill levels with positional search</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-amber-400">
              <Puzzle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-200 uppercase">Tactical Puzzles</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Curated tactical challenges & master studies</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-200 uppercase">FIDE Rule Engine</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">En passant, castling, promotion & draw checks</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-200 uppercase">Procedural 3D Audio</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Tactile synthesized impact thuds & fanfares</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
