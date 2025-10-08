/**
 * Row Component
 * 
 * Represents a single row of tiles in the Wordle grid.
 * Contains tiles based on the current word length.
 */

import Tile from './Tile';
import { TileStatus } from '@/types/game.types';

interface RowProps {
  /** The word for this row (empty string if not filled) */
  word?: string
  /** Evaluation results for each letter (empty array if not evaluated) */
  evaluation?: TileStatus[]
  /** Whether this is the currently active row */
  isCurrentRow: boolean
  /** Whether the current guess is invalid (triggers shake animation) */
  isInvalid: boolean
  /** Length of the word */
  wordLength: number
  /** Whether this is the most recently submitted row (triggers flip animation) */
  isLastSubmittedRow: boolean
}

/**
 * Row Component
 *
 * Renders a row of tiles based on wordLength, managing their display state based on
 * whether the row is empty, filled, or evaluated.
 */
const Row: React.FC<RowProps> = ({
  word = "",
  evaluation = [],
  isCurrentRow,
  isInvalid,
  wordLength,
  isLastSubmittedRow,
}) => {
  // Create array of tiles based on word length
  const tiles: string[] = Array(wordLength).fill("")

  // Fill in letters from the word
  for (let i = 0; i < wordLength; i++) {
    tiles[i] = word[i] || ""
  }

  /**
   * Get the status for a tile at the given index
   *
   * Priority:
   * 1. If evaluated, use the evaluation status
   * 2. If filled but not evaluated, use FILLED status
   * 3. Otherwise, use EMPTY status
   */
  const getTileStatus = (index: number): TileStatus => {
    if (evaluation[index]) {
      return evaluation[index]
    }
    if (tiles[index]) {
      return TileStatus.FILLED
    }
    return TileStatus.EMPTY
  }

  return (
    <div className="flex gap-1 justify-center mb-1">
      {tiles.map((letter, index) => (
        <Tile
          key={index}
          letter={letter}
          status={getTileStatus(index)}
          position={index}
          isInvalid={isInvalid && isCurrentRow}
          wordLength={wordLength}
          shouldAnimate={isLastSubmittedRow}
        />
      ))}
    </div>
  )
}

export default Row;
