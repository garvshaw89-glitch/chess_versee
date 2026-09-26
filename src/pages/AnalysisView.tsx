import React, { useState } from 'react';
import { NavPage } from '../components/ui/Navbar';
import { ChessCanvas } from '../3d/ChessCanvas';
import { useGameStore } from '../store/gameStore';
import { soundService } from '../services/sound';
import { 
  BarChart2, 
  Cpu, 
  RotateCw, 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  Sliders, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import { Button3D } from '../components/ui/Button3D';

interface AnalysisViewProps {
  onNavigate: (page: NavPage) => void;
  onOpenSettings: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ onNavigate }) => {
  const { chess, history, turn } = useGameStore();
  const [evalScore, setEvalScore] = useState<number>(0.35); // +0.35 (slight white advantage)
  const [engineDepth, setEngineDepth] = useState<number>(24);
  const [isEngineCalculating, setIsEngineCalculating] = useState<boolean>(false);
  const [selectedAnalysisTab, setSelectedAnalysisTab] = useState<'moves' | 'candidates' | 'graph'>('moves');

  const runDeepEngineCalc = () => {
    soundService.playClick();
    setIsEngineCalculating(true);
    setTimeout(() => {
      setIsEngineCalculating(false);
      // Small evaluation shift
      setEvalScore((prev) => +(prev + (Math.random() * 0.4 - 0.2)).toFixed(2));
      setEngineDepth((prev) => Math.min(36, prev + 2));
    }, 600);
  };

  // Convert eval score (-10 to +10) into percentage for evaluation bar
  // 50% is 0.00 equal
  const evalPercent = Math.max(5, Math.min(95, 50 + evalScore * 6));

  const candidateLines = [
    { move: '1. e4', eval: '+0.35', desc: 'King\'s Pawn Opening. Classical center dominance.' },
    { move: '1. d4', eval: '+0.31', desc: 'Queen\'s Pawn Opening. Strong positional stability.' },
    { move: '1. Nf3', eval: '+0.28', desc: 'Zukertort Opening. Flexible hypermodern setup.' },
    { move: '1. c4', eval: '+0.25', desc: 'English Opening. Asymmetric queenside pressure.' },
  ];

  return (
    <div className="relative w-full h-[calc(100dvh-56px)] md:h-[calc(100dvh-60px)] flex flex-col overflow-hidden bg-[#05070A] text-[#F5F7FA]">
      <div className="w-full max-w-7xl mx-auto h-full flex flex-col lg:flex-row overflow-hidden flex-1">
        
        {/* Left / Center: 3D Board and Evaluation Bar */}
        <div className="relative flex-1 h-full flex items-center justify-center p-2 sm:p-4 overflow-hidden min-h-0">
          
          {/* Vertical Dynamic Evaluation Bar */}
          <div className="hidden sm:flex flex-col items-center mr-3 h-[75%] w-6 bg-[#0B1017] rounded-full border border-white/10 p-0.5 relative overflow-hidden shadow-2xl">
            {/* White territory (from bottom up) */}
            <div 
              className="w-full bg-[#F2EFE7] rounded-full transition-all duration-500 ease-out"
              style={{ height: `${evalPercent}%` }}
            />
            {/* Center Zero Marker */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#C9A227] z-10" />
            {/* Number Label */}
            <div className="absolute bottom-2 font-mono text-[9px] font-bold text-[#05070A] z-20">
              {evalScore > 0 ? `+${evalScore}` : evalScore}
            </div>
          </div>

          {/* 3D Canvas Stage */}
          <div className="w-full h-full max-w-2xl relative rounded-2xl overflow-hidden border border-white/5 bg-[#0A0E13]/60 shadow-2xl">
            <ChessCanvas interactive={true} isHeroPreview={false} />

            {/* Floating Engine Telemetry Pill */}
            <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B1017]/85 border border-white/10 backdrop-blur-md text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${isEngineCalculating ? 'bg-[#5ED6E6] animate-ping' : 'bg-[#35C98B]'}`} />
              <span className="text-[#8D98A8]">Stockfish 17</span>
              <span className="text-[#C9A227] font-bold">Depth {engineDepth}</span>
              <span className="text-white/20">|</span>
              <span className="text-[#F5F7FA] font-bold">{evalScore > 0 ? `+${evalScore}` : evalScore}</span>
            </div>

            {/* Recalculate Trigger */}
            <button
              onClick={runDeepEngineCalc}
              className="absolute top-3 right-3 p-2 rounded-xl bg-[#0B1017]/85 border border-white/10 hover:border-[#C9A227]/50 text-[#8D98A8] hover:text-[#F5F7FA] backdrop-blur-md cursor-pointer transition-colors"
              title="Run Deep Engine Evaluation"
            >
              <RotateCw className={`w-4 h-4 ${isEngineCalculating ? 'animate-spin text-[#5ED6E6]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right Sidebar: Engine Analysis & Candidate Moves */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-white/5 bg-[#0A0E13] p-4 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#C9A227]" />
                <h1 className="text-sm font-bold text-[#F5F7FA]">Deep Analysis Engine</h1>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#5ED6E6]">
                Centipawn
              </span>
            </div>

            {/* Tabs */}
            <div className="flex rounded-xl bg-[#10151C] p-1 border border-white/5 gap-1">
              {[
                { id: 'moves', label: 'Move Tree' },
                { id: 'candidates', label: 'Top Engine Lines' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedAnalysisTab(tab.id as any)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedAnalysisTab === tab.id
                      ? 'bg-[#151C25] text-[#E8C75A] shadow'
                      : 'text-[#8D98A8] hover:text-[#F5F7FA]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Top Candidate Moves */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#8D98A8]">
                Recommended Variations
              </div>
              {candidateLines.map((line, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#10151C] border border-white/5 hover:border-[#C9A227]/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-[#F5F7FA] group-hover:text-[#E8C75A]">
                      {line.move}
                    </span>
                    <span className="font-mono text-xs text-[#35C98B] font-bold">
                      {line.eval}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8D98A8] mt-1 leading-relaxed">
                    {line.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* FEN Position String */}
            <div className="p-3 rounded-xl bg-[#05070A] border border-white/5 space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#667080]">
                FEN Signature
              </div>
              <div className="text-[10px] font-mono text-[#8D98A8] break-all select-all">
                {chess.fen()}
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-white/5 flex gap-2">
            <button
              onClick={() => onNavigate('play')}
              className="flex-1 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#E8C75A] text-[#05070A] text-xs font-bold font-mono transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Practice From Position</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
