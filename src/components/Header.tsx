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

/**
 * Header Component
 *
 * Features:
 * - Help button (left) - opens instructions modal
 * - Wordle title (center)
 * - Word length selector (center-right)
 * - Restart button (when game is over)
 * - Statistics button (right) - opens stats modal
 */
const Header: React.FC = () => {
  const {
    toggleHelp,
    toggleStats,
    wordLength,
    setWordLength,
    gameStatus,
    resetGame,
  } = useGameStore()

  const isGameOver =
    gameStatus === GameStatus.WON || gameStatus === GameStatus.LOST

  return (
    <header className="border-b border-gray-300 dark:border-gray-700 px-3 py-2">
      <div className="max-w-lg mx-auto flex items-center justify-between gap-2">
        {/* Help Button */}
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

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex-shrink-0">
          Wordle
        </h1>

        {/* Word Length Selector */}
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

        {/* Restart Button (shown when game is over) */}
        {isGameOver && (
          <button
            onClick={resetGame}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors flex-shrink-0"
            aria-label="Restart game"
            title="Start a new game"
          >
            <RotateCcw
              size={22}
              className="text-gray-700 dark:text-gray-300"
            />
          </button>
        )}

        {/* Statistics Button */}
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
    </header>
  )
}

export default Header;
