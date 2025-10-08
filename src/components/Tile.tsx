/**
 * Tile Component
 * 
 * Represents a single letter tile in the Wordle grid.
 * Handles animations for letter entry, tile flip, and invalid word shake.
 */

import { motion } from 'framer-motion';
import { TileStatus } from '@/types/game.types';

interface TileProps {
  /** The letter to display (empty string if no letter) */
  letter: string
  /** Current status of the tile (empty, filled, correct, present, absent) */
  status: TileStatus
  /** Position in the word (0-4), used for staggered flip animation */
  position: number
  /** Whether this tile is part of an invalid word (triggers shake animation) */
  isInvalid: boolean
  /** Word length to determine tile size */
  wordLength?: number
  /** Whether this tile should animate (only for last submitted row) */
  shouldAnimate?: boolean
}

/**
 * Tile Component
 *
 * Features:
 * - Pop animation when letter is entered
 * - Flip animation when row is submitted
 * - Shake animation for invalid words
 * - Color-coded background based on letter correctness
 * - Responsive sizing based on word length
 */
const Tile: React.FC<TileProps> = ({
  letter,
  status,
  position,
  isInvalid,
  wordLength = 5,
  shouldAnimate = false,
}) => {
  /**
   * Get size classes based on word length
   * On mobile (< 640px): smaller tiles for longer words
   * On larger screens (≥ 640px): keep consistent size
   */
  const getSizeClasses = (): string => {
    switch (wordLength) {
      case 7:
        return "w-10 h-10 text-lg sm:w-14 sm:h-14 sm:text-2xl" // Smaller on mobile, standard on larger screens
      case 6:
        return "w-12 h-12 text-xl sm:w-14 sm:h-14 sm:text-2xl" // Medium on mobile, standard on larger screens
      default:
        return "w-14 h-14 text-2xl" // Standard for 5-letter words on all screens
    }
  }

  /**
   * Get background color class based on tile status
   */
  const getBackgroundColor = (): string => {
    switch (status) {
      case TileStatus.CORRECT:
        return "bg-correct"
      case TileStatus.PRESENT:
        return "bg-present"
      case TileStatus.ABSENT:
        return "bg-absent"
      case TileStatus.FILLED:
        return "bg-gray-200 dark:bg-gray-700 border-gray-400"
      default:
        return "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
    }
  }

  /**
   * Get text color class based on tile status
   */
  const getTextColor = (): string => {
    return status === TileStatus.EMPTY || status === TileStatus.FILLED
      ? "text-gray-900 dark:text-white"
      : "text-white"
  }

  // Calculate stagger delay with consistent time per tile
  // 7-letter words: 0.5s total, animation duration = 0.25s
  // Available time for stagger = 0.5 - 0.25 = 0.25s
  // Time per tile gap = 0.25 / 6 = 0.04167s
  // Shorter words use same time per tile, so they finish faster
  const getStaggerDelay = (): number => {
    const animationDuration = 0.25
    const sevenLetterTotalTime = 0.5
    const sevenLetterStaggerTime = sevenLetterTotalTime - animationDuration
    const timePerTileGap = sevenLetterStaggerTime / 6 // 6 gaps in 7-letter word
    return position * timePerTileGap
  }

  return (
    <motion.div
      className={`
        ${getSizeClasses()} border-2 flex items-center justify-center
        font-bold uppercase rounded
        ${getBackgroundColor()} ${getTextColor()}
      `}
      key={`${letter}-${status}-${position}`}
      initial={{ scale: 1 }}
      animate={{
        // Pop animation when letter is entered on current row
        scale: letter && status === TileStatus.FILLED ? [1, 1.1, 1] : 1,

        // Staggered bounce animation only for the last submitted row
        ...(shouldAnimate &&
          status !== TileStatus.EMPTY &&
          status !== TileStatus.FILLED && {
            scale: [1, 1.2, 1],
          }),

        // Shake animation for invalid word
        x: isInvalid ? [0, -10, 10, -10, 10, 0] : 0,
      }}
      transition={{
        scale: shouldAnimate
          ? {
              duration: 0.25,
              delay: getStaggerDelay(),
              ease: [0.175, 0.885, 0.32, 1.275], // Bouncy easing
            }
          : { duration: 0.1 },
        x: { duration: 0.4 },
      }}
    >
      {letter}
    </motion.div>
  )
}

export default Tile;
