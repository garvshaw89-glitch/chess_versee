import React, { useState } from 'react';
import { 
  Sword, 
  Users, 
  Puzzle, 
  GraduationCap, 
  User, 
  Volume2, 
  VolumeX, 
  Settings, 
  ArrowLeft, 
  Palette,
  Menu,
  X,
  Play,
  Sparkles
} from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useNavigationStore } from '../../store/navigationStore';
import { useGameStore } from '../../store/gameStore';
import { soundService } from '../../services/sound';
import { PremiumButton } from './PremiumButton';
import { ChessVerseSymbol } from '../splash/ChessVerseSymbol';

export type NavPage = 'landing' | 'play' | '2player' | 'learn' | 'puzzles' | 'profile';

interface NavbarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  onOpenSettings: () => void;
  onOpenThemes?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenSettings,
  onOpenThemes
}) => {
  const { sound, updateSound } = useSettingsStore();
  const { navigateBack, openThemesModal, triggerCinematicSplash } = useNavigationStore();
  const { setGameMode, resetGame, setTwoPlayerSetupOpen } = useGameStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenThemes = onOpenThemes || openThemesModal;

  const handleItemClick = (pageId: NavPage) => {
    soundService.playClick();
    setMobileMenuOpen(false);
    onNavigate(pageId);
  };

  const handleQuickPlay = () => {
    soundService.playClick();
    setGameMode('play');
    resetGame();
    onNavigate('play');
  };

  const navItems: { id: NavPage; label: string }[] = [
    { id: 'play', label: 'Arena' },
    { id: '2player', label: '2-Player' },
    { id: 'learn', label: 'Academy' },
    { id: 'puzzles', label: 'Puzzles' },
    { id: 'profile', label: 'Career' },
  ];

  return (
    <>
      {/* Top Bar: Strict One-Row Three-Zone Contract */}
      <header className="sticky top-0 z-40 w-full bg-[#08080a]/90 border-b border-white/5 backdrop-blur-xl px-4 sm:px-8 py-3 flex items-center justify-between transition-colors">
        {/* Zone 1: Single Text Element Brand Wordmark with Sovereign Symbol */}
        <div className="flex items-center gap-3">
          {currentPage !== 'landing' && (
            <button
              onClick={() => {
                soundService.playClick();
                navigateBack();
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono text-neutral-400 hover:text-amber-400 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 cursor-pointer"
              title="Return to previous screen"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          <button
            onClick={() => handleItemClick('landing')}
            className="flex items-center gap-2.5 group text-left cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
          >
            <ChessVerseSymbol size={28} glow={false} animated={true} />
            <span className="font-brand text-base sm:text-lg font-bold tracking-[0.14em] text-neutral-100 group-hover:text-amber-300 transition-colors">
              CHESSVERSE
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 Clean Text Nav Links with Underline Transitions */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold tracking-wide text-neutral-400">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`relative py-1 transition-colors cursor-pointer outline-none focus-visible:text-white ${
                  isActive ? 'text-amber-400 font-bold' : 'hover:text-neutral-100'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 Primary Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Replay Cinematic Splash Button */}
          <button
            onClick={triggerCinematicSplash}
            title="Replay Cinematic Opening Experience"
            className="hidden sm:inline-flex p-2 rounded-xl text-neutral-400 hover:text-amber-300 hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400/80 hover:text-amber-300" />
          </button>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={() => {
              soundService.playClick();
              updateSound({ enabled: !sound.enabled });
            }}
            title={sound.enabled ? 'Mute Procedural Synthesizer' : 'Enable Audio'}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-100 hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors cursor-pointer"
          >
            {sound.enabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-500" />
            )}
          </button>

          {/* Theme Studio Trigger */}
          <button
            onClick={() => {
              soundService.playClick();
              handleOpenThemes();
            }}
            title="Material & Themes Studio"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900/60 hover:bg-neutral-800 border border-white/5 hover:border-white/15 transition-all cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span>Themes</span>
          </button>

          {/* Settings Trigger */}
          <button
            onClick={() => {
              soundService.playClick();
              onOpenSettings();
            }}
            title="Engine Settings"
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-100 hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Primary Quick CTA (Only on desktop if not in play mode) */}
          {currentPage !== 'play' && (
            <PremiumButton
              variant="primary"
              size="sm"
              onClick={handleQuickPlay}
              icon={<Play className="w-3.5 h-3.5 fill-current" />}
              className="hidden sm:inline-flex"
            >
              Enter Arena
            </PremiumButton>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => {
              soundService.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Full-Screen Navigation Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[57px] z-50 bg-[#08080a]/98 backdrop-blur-2xl flex flex-col justify-between p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="space-y-4 pt-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 pb-2 border-b border-white/5">
              Destinations
            </div>

            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`text-left px-4 py-3 rounded-xl text-xl font-display font-bold transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-xs font-mono text-neutral-400">→</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/5 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenThemes();
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-neutral-300 hover:bg-white/5 flex items-center gap-2 cursor-pointer"
              >
                <Palette className="w-4 h-4 text-amber-400" />
                <span>Board &amp; Piece Themes Studio</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSettings();
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-neutral-300 hover:bg-white/5 flex items-center gap-2 cursor-pointer"
              >
                <Settings className="w-4 h-4 text-neutral-400" />
                <span>Engine &amp; Graphics Settings</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <PremiumButton
              variant="primary"
              size="lg"
              onClick={() => {
                setMobileMenuOpen(false);
                handleQuickPlay();
              }}
              icon={<Play className="w-4 h-4 fill-current" />}
              className="w-full font-bold text-neutral-950"
            >
              LAUNCH BATTLE ARENA
            </PremiumButton>
          </div>
        </div>
      )}

      {/* Mobile Bottom Quick-Action Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#08080a]/95 border-t border-white/5 backdrop-blur-xl px-2 py-1 flex items-center justify-around">
        {[
          { id: 'play' as NavPage, label: 'Arena', icon: Sword },
          { id: '2player' as NavPage, label: '2P', icon: Users },
          { id: 'learn' as NavPage, label: 'Academy', icon: GraduationCap },
          { id: 'puzzles' as NavPage, label: 'Puzzles', icon: Puzzle },
          { id: 'profile' as NavPage, label: 'Career', icon: User },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-[10px] font-mono transition-transform active:scale-95 cursor-pointer ${
                isActive ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
