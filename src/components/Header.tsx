/**
 * Header Component
 * 
 * Top navigation bar with help, word length selector, and statistics buttons.
 * Displays the Wordle logo/title.
 */

import { HelpCircle, BarChart3, RotateCcw } from "lucide-react"
import { useGameStore } from "@/stores/gameStore"
import { WORD_LENGTHS } from "@/utils/constants"
import { GameStatus } from "@/types/game.types"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

/**
 * Header Component
 *
 * Features:
 * - Help button (far left) - opens instructions modal
 * - Word length selector (left) - switches between 5, 6, 7 letter modes
 * - Wordle title (center)
 * - Restart button (right) - always visible, with confirmation for games in progress
 * - Statistics button (far right) - opens stats modal
 */
const Header: React.FC = () => {
  const {
    toggleHelp,
    toggleStats,
    wordLength,
    setWordLength,
    gameStatus,
    resetGame,
    guesses,
    currentGuess,
  } = useGameStore()

  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  // Check if there's an active game in progress
  // Game is in progress if:
  // 1. Status is PLAYING
  // 2. AND (there are guesses made OR current guess has letters typed)
  const isGameInProgress =
    gameStatus === GameStatus.PLAYING &&
    (guesses.length > 0 || currentGuess.length > 0)

  console.log("[Header] Debug:", {
    gameStatus,
    guessesLength: guesses.length,
    currentGuessLength: currentGuess.length,
    isGameInProgress,
  })

  const handleRestartClick = () => {
    console.log("[Header] Restart clicked, isGameInProgress:", isGameInProgress)
    if (isGameInProgress) {
      setShowConfirmDialog(true)
    } else {
      resetGame()
    }
  }

  const handleConfirmRestart = () => {
    resetGame()
    setShowConfirmDialog(false)
  }

  return (
    <>
      <header className="border-b border-gray-300 dark:border-gray-700 px-3 py-2">
        <div className="max-w-lg mx-auto grid grid-cols-3 items-center gap-2">
          {/* Left Section: Help + Word Length Selector */}
          <div className="flex items-center gap-2 justify-start">
            <button
              onClick={toggleHelp}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors flex-shrink-0"
              aria-label="Help"
            >
              <HelpCircle
                size={22}
                className="text-gray-700 dark:text-gray-300"
              />
            </button>

            <div className="flex gap-1 flex-shrink-0">
              {WORD_LENGTHS.map((length) => (
                <button
                  key={length}
                  onClick={() => setWordLength(length)}
                  className={`
                    px-2 py-1 rounded text-xs font-bold transition-colors
                    ${
                      wordLength === length
                        ? "bg-correct text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }
                  `}
                  aria-label={`${length} letters`}
                >
                  {length}
                </button>
              ))}
            </div>
          </div>

          {/* Center Section: Title */}
          <div className="flex justify-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white select-none">
              Wordle
            </h1>
          </div>

          {/* Right Section: Restart + Statistics */}
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={handleRestartClick}
              disabled={!isGameInProgress}
              className={`
                p-1.5 rounded transition-colors flex-shrink-0
                ${
                  isGameInProgress
                    ? "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    : "opacity-40 cursor-default"
                }
              `}
              aria-label="Restart game"
              title={
                isGameInProgress ? "Start a new game" : "No game to restart"
              }
            >
              <RotateCcw
                size={22}
                className="text-gray-700 dark:text-gray-300"
              />
            </button>

            <button
              onClick={toggleStats}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors flex-shrink-0"
              aria-label="Statistics"
            >
              <BarChart3
                size={22}
                className="text-gray-700 dark:text-gray-300"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restart Game?</DialogTitle>
            <DialogDescription>
              You have a game in progress. Are you sure you want to start a new
              game? Your current progress will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmRestart}>Restart</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Header;
