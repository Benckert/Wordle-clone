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
  letter: string;
  /** Current status of the tile (empty, filled, correct, present, absent) */
  status: TileStatus;
  /** Position in the word (0-4), used for staggered flip animation */
  position: number;
  /** Whether this tile is part of an invalid word (triggers shake animation) */
  isInvalid: boolean;
}

/**
 * Tile Component
 * 
 * Features:
 * - Pop animation when letter is entered
 * - Flip animation when row is submitted
 * - Shake animation for invalid words
 * - Color-coded background based on letter correctness
 */
const Tile: React.FC<TileProps> = ({ letter, status, position, isInvalid }) => {
  /**
   * Get background color class based on tile status
   */
  const getBackgroundColor = (): string => {
    switch (status) {
      case TileStatus.CORRECT:
        return 'bg-correct';
      case TileStatus.PRESENT:
        return 'bg-present';
      case TileStatus.ABSENT:
        return 'bg-absent';
      case TileStatus.FILLED:
        return 'bg-gray-200 dark:bg-gray-700 border-gray-400';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600';
    }
  };

  /**
   * Get text color class based on tile status
   */
  const getTextColor = (): string => {
    return status === TileStatus.EMPTY || status === TileStatus.FILLED
      ? 'text-gray-900 dark:text-white'
      : 'text-white';
  };

  return (
    <motion.div
      className={`
        w-14 h-14 border-2 flex items-center justify-center
        text-2xl font-bold uppercase rounded
        ${getBackgroundColor()} ${getTextColor()}
      `}
      initial={{ scale: 1 }}
      animate={{
        // Pop animation when letter is entered
        scale: letter && status === TileStatus.FILLED ? [1, 1.1, 1] : 1,
        
        // Flip animation when tile is evaluated
        rotateX: 
          status !== TileStatus.EMPTY && status !== TileStatus.FILLED 
            ? [0, 90, 0] 
            : 0,
        
        // Shake animation for invalid word
        x: isInvalid ? [0, -10, 10, -10, 10, 0] : 0,
      }}
      transition={{
        scale: { duration: 0.1 },
        rotateX: { 
          duration: 0.6, 
          delay: position * 0.1 // Stagger the flip animation
        },
        x: { duration: 0.4 },
      }}
    >
      {letter}
    </motion.div>
  );
};

export default Tile;
