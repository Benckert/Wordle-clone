/**
 * Keyboard Component
 * 
 * On-screen keyboard that mirrors a QWERTY layout.
 * Keys are color-coded based on their status from previous guesses.
 */

import { useGameStore } from '@/stores/gameStore';
import { KEYBOARD_ROWS } from '@/utils/constants';
import { TileStatus } from '@/types/game.types';
import { Delete, CornerDownLeft, Loader2 } from "lucide-react"

interface KeyProps {
  /** The key value (letter or special key like ENTER/BACKSPACE) */
  value: string
  /** The status of this key based on previous guesses */
  status?: TileStatus
  /** Click handler for key press */
  onClick: () => void
  /** Whether the key is disabled (e.g., during validation) */
  isDisabled?: boolean
  /** Whether to show loading spinner */
  isLoading?: boolean
}

/**
 * Individual Key Component
 *
 * Renders a single keyboard key with appropriate styling.
 * Special keys (ENTER, BACKSPACE) are wider and show icons.
 */
const Key: React.FC<KeyProps> = ({
  value,
  status,
  onClick,
  isDisabled = false,
  isLoading = false,
}) => {
  /**
   * Get background color based on key status
   *
   * Keys inherit the color of their best result:
   * - Green if letter was ever correct
   * - Yellow if letter was ever present but not correct
   * - Gray if letter was absent
   * - Light gray if not yet used
   */
  const getBackgroundColor = (): string => {
    switch (status) {
      case TileStatus.CORRECT:
        return "bg-correct text-white"
      case TileStatus.PRESENT:
        return "bg-present text-white"
      case TileStatus.ABSENT:
        return "bg-absent text-white"
      default:
        return "bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500"
    }
  }

  const isSpecialKey = value === "ENTER" || value === "BACKSPACE"

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        ${isSpecialKey ? "px-4" : "px-3"} py-4
        rounded font-bold text-sm
        ${getBackgroundColor()}
        transition-colors duration-200
        flex items-center justify-center
        min-w-[40px]
        ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
      aria-label={value}
    >
      {value === "BACKSPACE" ? (
        <Delete size={20} />
      ) : value === "ENTER" ? (
        isLoading ? (
          <Loader2
            size={20}
            className="animate-spin"
          />
        ) : (
          <CornerDownLeft size={20} />
        )
      ) : (
        value
      )}
    </button>
  )
}

/**
 * Keyboard Component
 *
 * Full on-screen keyboard with three rows matching QWERTY layout.
 * Provides visual feedback for letter status and handles click events.
 */
const Keyboard: React.FC = () => {
  const {
    addLetter,
    deleteLetter,
    submitGuess,
    getKeyboardStatus,
    isValidating,
  } = useGameStore()
  const keyboardStatus = getKeyboardStatus()

  /**
   * Handle key click
   *
   * Routes to appropriate action based on key type:
   * - ENTER: Submit current guess (disabled while validating)
   * - BACKSPACE: Delete last letter
   * - Letter: Add letter to current guess
   */
  const handleKeyClick = async (key: string): Promise<void> => {
    if (isValidating) return // Prevent input while validating

    if (key === "ENTER") {
      await submitGuess()
    } else if (key === "BACKSPACE") {
      deleteLetter()
    } else {
      addLetter(key)
    }
  }

  return (
    <div className="w-full max-w-lg px-2 pb-4">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex justify-center gap-1 mb-1"
        >
          {row.map((key) => (
            <Key
              key={key}
              value={key}
              status={keyboardStatus[key]}
              onClick={() => handleKeyClick(key)}
              isDisabled={isValidating}
              isLoading={key === "ENTER" && isValidating}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Keyboard;
