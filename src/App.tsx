/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navbar, NavPage } from './components/ui/Navbar';
import { LandingExperience } from './components/landing/LandingExperience';
import { PlayView } from './pages/PlayView';
import { TwoPlayerView } from './pages/TwoPlayerView';
import { PuzzlesView } from './pages/PuzzlesView';
import { LearnView } from './pages/LearnView';
import { ProfileView } from './pages/ProfileView';
import { SettingsModal } from './components/ui/SettingsModal';
import { BoardThemesModal } from './components/ui/BoardThemesModal';
import { TwoPlayerSetupModal } from './components/ui/TwoPlayerSetupModal';
import { ToastNotification } from './components/ui/ToastNotification';
import { CustomCursor } from './components/ui/CustomCursor';
import { ChessVerseSplash } from './components/splash/ChessVerseSplash';
import { useNavigationStore } from './store/navigationStore';
import { PageTransition } from './components/transitions/PageTransition';
import { TransitionOverlay } from './components/transitions/TransitionOverlay';

export default function App() {
  const { 
    currentPage, 
    navigateWithTransition, 
    settingsOpen, 
    openSettings, 
    closeSettings,
    themesModalOpen,
    openThemesModal,
    closeThemesModal,
    showCinematicSplash,
    closeCinematicSplash
  } = useNavigationStore();

  return (
    <div className="min-h-screen bg-[#05070A] text-neutral-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Agency Custom Cursor (Desktop only, auto-hides on touch) */}
      <CustomCursor />

      {/* Cinematic 3D ChessVerse Opening Splash Sequence */}
      {showCinematicSplash && (
        <ChessVerseSplash onComplete={closeCinematicSplash} />
      )}

      {/* Agency Top Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateWithTransition}
        onOpenSettings={openSettings}
        onOpenThemes={openThemesModal}
      />

      {/* Main Page Routing with Cinematic Page Transition System */}
      <main className="flex-1 relative flex flex-col overflow-hidden">
        <PageTransition>
          {currentPage === 'landing' && <LandingExperience onNavigate={navigateWithTransition} />}
          {currentPage === 'play' && (
            <PlayView onNavigate={navigateWithTransition} onOpenSettings={openSettings} />
          )}
          {currentPage === '2player' && (
            <TwoPlayerView onNavigate={navigateWithTransition} onOpenSettings={openSettings} />
          )}
          {currentPage === 'puzzles' && (
            <PuzzlesView onNavigate={navigateWithTransition} onOpenSettings={openSettings} />
          )}
          {currentPage === 'learn' && (
            <LearnView onNavigate={navigateWithTransition} onOpenSettings={openSettings} />
          )}
          {currentPage === 'profile' && <ProfileView onNavigate={navigateWithTransition} />}
        </PageTransition>
      </main>

      {/* Global Cinematic Transition Overlay */}
      <TransitionOverlay />

      {/* Persistent Floating Controls & Modals */}
      <TwoPlayerSetupModal onStartPlaying={() => navigateWithTransition('play')} />
      <SettingsModal isOpen={settingsOpen} onClose={closeSettings} />
      <BoardThemesModal isOpen={themesModalOpen} onClose={closeThemesModal} />
      <ToastNotification />
    </div>
  );
}
