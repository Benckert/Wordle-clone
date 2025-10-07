/**
 * Main App Component
 * 
 * Root component that orchestrates the entire Wordle game.
 * Manages keyboard event listeners, toast notifications, and component layout.
 */

import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Grid from '@/components/Grid';
import Keyboard from '@/components/Keyboard';
import HelpModal from '@/components/HelpModal';
import GameStats from '@/components/GameStats';
import WinOverlay from "@/components/WinOverlay"
import { useGameStore } from '@/stores/gameStore';
import { GameStatus } from '@/types/game.types';
import './App.css';

/**
 * App Component
 * 
 * Features:
 * - Physical keyboard input handling
 * - Toast notifications for errors and game end
 * - First-time help modal
 * - Responsive layout
 */
function App() {
  const {
    addLetter,
    deleteLetter,
    submitGuess,
    gameStatus,
    invalidWord,
    toggleHelp,
  } = useGameStore()

  /**
   * Physical Keyboard Event Listener
   *
   * Handles all keyboard input for the game:
   * - Enter: Submit guess (async validation)
   * - Backspace: Delete last letter
   * - A-Z: Add letter to guess
   *
   * Only active when game is in PLAYING state
   */
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent): Promise<void> => {
      if (gameStatus !== GameStatus.PLAYING) return

      if (e.key === "Enter") {
        await submitGuess()
      } else if (e.key === "Backspace") {
        deleteLetter()
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        addLetter(e.key.toUpperCase())
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameStatus, addLetter, deleteLetter, submitGuess])

  /**
   * Invalid Word Toast Notification
   *
   * Shows error message when player enters invalid word
   */
  useEffect(() => {
    if (invalidWord) {
      toast.error("Not in word list", {
        duration: 2000, // Auto-dismiss after 2 seconds
      })
    }
  }, [invalidWord])

  /**
   * Game Over Toast Notifications
   *
   * Shows failure message when game ends
   * Delayed to allow tile flip animation to complete
   */
  useEffect(() => {
    if (gameStatus === GameStatus.LOST) {
      setTimeout(
        () =>
          toast.error("Better luck next time!", {
            duration: 3000, // Auto-dismiss after 3 seconds
          }),
        1500
      )
    }
  }, [gameStatus])

  /**
   * First Visit Help Modal
   *
   * Automatically shows help modal on first visit
   * Uses localStorage to track if user has visited before
   */
  useEffect(() => {
    const hasVisited = localStorage.getItem("wordle-has-visited")
    if (!hasVisited) {
      toggleHelp()
      localStorage.setItem("wordle-has-visited", "true")
    }
  }, [toggleHelp])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Header with help and stats buttons */}
      <Header />

      {/* Main game area */}
      <main className="flex-1 flex flex-col items-center justify-between max-w-lg mx-auto w-full px-2 py-3">
        <Grid />
        <Keyboard />
      </main>

      {/* Modals */}
      <HelpModal />
      <GameStats />

      {/* Win Overlay */}
      <WinOverlay />

      {/* Toast notifications */}
      <Toaster position="top-center" />
    </div>
  )
}

export default App;
