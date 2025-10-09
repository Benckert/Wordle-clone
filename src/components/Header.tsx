/**
 * Header Component
 * 
 * Top navigation bar with help, word length selector, and statistics buttons.
 * Displays the Wordle logo/title.
 */

import { HelpCircle, BarChart3, RotateCcw, AlertCircle } from "lucide-react"
import { useGameStore } from "@/stores/gameStore"
import { WORD_LENGTHS } from "@/utils/constants"
import { GameStatus } from "@/types/game.types"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backdropFilter: "blur(8px)" }}
            onClick={() => setShowConfirmDialog(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Content */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.2, type: "spring" }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-full p-6">
                  <AlertCircle
                    size={48}
                    className="text-white"
                  />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Restart Game?
              </h2>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                You have a game in progress. Are you sure you want to start a
                new game? Your current progress will be lost.
              </p>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleConfirmRestart}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-6 text-lg font-semibold"
                >
                  <RotateCcw
                    size={20}
                    className="mr-2"
                  />
                  Yes, Restart
                </Button>

                <Button
                  onClick={() => setShowConfirmDialog(false)}
                  variant="outline"
                  className="w-full py-6 text-lg font-semibold"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header;
