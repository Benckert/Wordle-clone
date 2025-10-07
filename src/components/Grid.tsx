/**
 * Grid Component
 * 
 * The main game grid displaying all 6 rows of tiles.
 * Manages the display of completed rows, the current row, and empty rows.
 */

import Row from './Row';
import { useGameStore } from '@/stores/gameStore';
import { MAX_ATTEMPTS } from '@/utils/constants';

/**
 * Grid Component
 * 
 * Renders the complete 6-row Wordle grid.
 * Each row can be in one of three states:
 * 1. Completed - contains a submitted guess with evaluation
 * 2. Current - contains the current guess being typed
 * 3. Empty - not yet reached
 */
const Grid: React.FC = () => {
  const { guesses, currentGuess, currentRow, invalidWord, wordLength } =
    useGameStore()

  // Create array for all 6 rows
  const rows = Array(MAX_ATTEMPTS).fill(null)

  return (
    <div className="flex flex-col items-center py-4">
      {rows.map((_, index) => {
        // Completed row - already submitted and evaluated
        if (index < guesses.length) {
          return (
            <Row
              key={index}
              word={guesses[index].word}
              evaluation={guesses[index].evaluation}
              isCurrentRow={false}
              isInvalid={false}
              wordLength={wordLength}
            />
          )
        }
        // Current row - being typed
        else if (index === currentRow) {
          return (
            <Row
              key={index}
              word={currentGuess}
              evaluation={[]}
              isCurrentRow={true}
              isInvalid={invalidWord}
              wordLength={wordLength}
            />
          )
        }
        // Empty row - not yet reached
        else {
          return (
            <Row
              key={index}
              word=""
              evaluation={[]}
              isCurrentRow={false}
              isInvalid={false}
              wordLength={wordLength}
            />
          )
        }
      })}
    </div>
  )
};

export default Grid;
