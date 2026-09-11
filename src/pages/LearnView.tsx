import React, { useState } from 'react';
import { ChessCanvas } from '../3d/ChessCanvas';
import { useGameStore } from '../store/gameStore';
import { NavPage } from '../components/ui/Navbar';
import { 
  BookOpen, 
  Play, 
  Lightbulb, 
  ShieldCheck, 
  Compass, 
  Target, 
  Award,
  ChevronRight,
  Swords
} from 'lucide-react';
import { Button3D } from '../components/ui/Button3D';

interface OpeningLesson {
  id: string;
  name: string;
  eco: string;
  movesSan: string;
  fen: string;
  description: string;
  keyIdeas: string[];
}

const OPENINGS: OpeningLesson[] = [
  {
    id: 'sicilian',
    name: 'Sicilian Defense',
    eco: 'B20',
    movesSan: '1. e4 c5',
    fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
    description: 'The most popular and combative counter to 1. e4. Black fights for central influence and creates asymmetrical play immediately.',
    keyIdeas: ['Imbalanced pawn structures', 'Counter-play on the semi-open c-file', 'Dynamic counter-attacking chances']
  },
  {
    id: 'ruy-lopez',
    name: 'Ruy Lopez (Spanish Opening)',
    eco: 'C60',
    movesSan: '1. e4 e5 2. Nf3 Nc6 3. Bb5',
    fen: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
    description: 'One of the oldest and most thoroughly analyzed chess openings. White applies pressure to the defender of the e5 pawn.',
    keyIdeas: ['Pressure on the c6 knight', 'Delayed central push with d2-d4', 'Harmonious long-term piece positioning']
  },
  {
    id: 'queens-gambit',
    name: "Queen's Gambit",
    eco: 'D06',
    movesSan: '1. d4 d5 2. c4',
    fen: 'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2',
    description: 'White temporarily offers a wing c-pawn to gain dominant central control of d4 and e4.',
    keyIdeas: ['Total central pawn dominance', 'Rapid development of minor pieces', 'Fierce pressure against Black’s queenside']
  },
  {
    id: 'kings-indian',
    name: "King's Indian Defense",
    eco: 'E60',
    movesSan: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7',
    fen: 'rnbqk2r/ppppppbp/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4',
    description: 'A hypermodern favorite of Garry Kasparov and Bobby Fischer. Black allows White central space then launches a fierce kingside assault.',
    keyIdeas: ['Fianchetto kingside bishop defense', 'Central pawn break with e7-e5 or c7-c5', 'Devastating kingside mating attacks']
  },
  {
    id: 'italian-game',
    name: 'Italian Game (Giuoco Piano)',
    eco: 'C50',
    movesSan: '1. e4 e5 2. Nf3 Nc6 3. Bc4',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
    description: 'Direct development targeting Black’s vulnerable f7 pawn, leading to sharp tactical skirmishes or solid strategic maneuvering.',
    keyIdeas: ['Direct tactical aim at the f7 weak square', 'Quick kingside castling and king safety', 'Flexible pawn structures (c3, d3, or d4)']
  }
];

const PRINCIPLES = [
  {
    title: 'Control the Center',
    icon: Compass,
    text: 'The squares e4, d4, e5, and d5 control the maximum diagonals and files. Pieces stationed near the center radiate greater tactical reach across the board.'
  },
  {
    title: 'Rapid Development',
    icon: Target,
    text: 'Develop your knights and bishops swiftly before moving pieces twice in the opening. An army developed first can unleash overpowering initiatives.'
  },
  {
    title: 'Castling & King Safety',
    icon: ShieldCheck,
    text: 'Never leave your King exposed in the center. Castle early (often within the first 6–10 moves) to tuck the king into safety and activate a heavy rook.'
  },
  {
    title: 'Pawn Structure Integrity',
    icon: Lightbulb,
    text: 'Avoid isolated, doubled, or backward pawns unless compensated by immense piece activity. In the endgame, healthy pawn chains become crowning queens.'
  }
];

interface LearnViewProps {
  onNavigate: (page: NavPage) => void;
  onOpenSettings: () => void;
}

export const LearnView: React.FC<LearnViewProps> = ({ onNavigate, onOpenSettings }) => {
  const { loadCustomFen, setGameMode, showToast } = useGameStore();
  const [activeOpening, setActiveOpening] = useState<OpeningLesson>(OPENINGS[0]);

  React.useEffect(() => {
    loadCustomFen(activeOpening.fen);
    setGameMode('learn');
  }, [activeOpening.id]);

  const handleSelectOpening = (op: OpeningLesson) => {
    setActiveOpening(op);
    showToast(`Loaded ${op.name} (${op.eco})`, 'info');
  };

  return (
    <div className="relative w-full h-[calc(100vh-60px)] flex flex-col lg:flex-row overflow-hidden bg-neutral-950">
      {/* 3D Board Viewport */}
      <div className="relative flex-1 h-[55vh] lg:h-full flex flex-col items-center justify-between p-2 sm:p-4 overflow-hidden">
        {/* Header */}
        <div className="w-full max-w-xl flex items-center justify-between z-10 px-2 py-1">
          <div className="flex items-center gap-2 bg-neutral-900/80 px-3 py-1.5 rounded-xl border border-neutral-800 backdrop-blur-md">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-neutral-200">{activeOpening.name}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              {activeOpening.eco}
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-neutral-300 bg-neutral-900/80 px-2.5 py-1 rounded-lg border border-neutral-800">
            {activeOpening.movesSan}
          </span>
        </div>

        {/* 3D Canvas Board */}
        <div className="relative w-full h-full flex-1 flex items-center justify-center">
          <ChessCanvas />
        </div>

        {/* Tactical Key Takeaway Banner */}
        <div className="w-full max-w-xl z-10 p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-neutral-300 leading-relaxed flex-1">
            {activeOpening.description}
          </p>
          <Button3D
            variant="primary"
            size="sm"
            onClick={() => {
              loadCustomFen(activeOpening.fen);
              setGameMode('vs_ai');
              onNavigate('ai');
              showToast(`Starting practice match: ${activeOpening.name}`, 'success');
            }}
            icon={<Swords className="w-3.5 h-3.5" />}
          >
            PRACTICE VS AI
          </Button3D>
        </div>
      </div>

      {/* Right Sidebar: Openings & Strategic Principles */}
      <div className="w-full lg:w-84 xl:w-96 h-[45vh] lg:h-full bg-neutral-950/95 border-t lg:border-t-0 lg:border-l border-neutral-800/80 p-4 flex flex-col gap-4 z-10 overflow-y-auto">
        {/* Grandmaster Openings Library */}
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800 mb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 font-mono flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Master Openings Explorer</span>
            </h3>
          </div>

          <div className="space-y-1.5">
            {OPENINGS.map((op) => {
              const isSelected = activeOpening.id === op.id;
              return (
                <button
                  key={op.id}
                  onClick={() => handleSelectOpening(op)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                      : 'bg-neutral-900/40 border-neutral-800/60 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <div>
                    <span className="block font-semibold">{op.name}</span>
                    <span className="text-[10px] font-mono text-neutral-500">{op.movesSan}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                    {op.eco}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Key Ideas for Active Opening */}
        <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <h4 className="text-xs font-bold text-neutral-200 uppercase mb-2">Key Strategic Goals</h4>
          <ul className="space-y-1 text-xs text-neutral-400 list-disc list-inside">
            {activeOpening.keyIdeas.map((idea, i) => (
              <li key={i}>{idea}</li>
            ))}
          </ul>
        </div>

        {/* Grandmaster Principles */}
        <div>
          <h4 className="text-xs font-bold text-neutral-300 uppercase font-mono mb-2">
            Foundational Principles
          </h4>
          <div className="space-y-2">
            {PRINCIPLES.map((pr, i) => {
              const Icon = pr.icon;
              return (
                <div key={i} className="p-2.5 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-200 mb-1">
                    <Icon className="w-3.5 h-3.5 text-amber-400" />
                    <span>{pr.title}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    {pr.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
