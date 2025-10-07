/**
 * Help Modal Component
 * 
 * Displays game instructions and examples of how the color-coding works.
 * Shown automatically on first visit or when help button is clicked.
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGameStore } from '@/stores/gameStore';

/**
 * Help Modal Component
 * 
 * Explains:
 * - Basic game rules
 * - Color-coding system
 * - Visual examples with sample tiles
 */
const HelpModal: React.FC = () => {
  const { showHelp, toggleHelp } = useGameStore();

  return (
    <Dialog open={showHelp} onOpenChange={toggleHelp}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>How to Play</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-sm">
          <p>Guess the Wordle in 6 tries.</p>
          
          <ul className="list-disc list-inside space-y-2">
            <li>Each guess must be a valid 5-letter word.</li>
            <li>The color of the tiles will change to show how close your guess was.</li>
          </ul>
          
          <div className="space-y-3 pt-4">
            <p className="font-bold">Examples:</p>
            
            {/* Example 1: Correct letter */}
            <div className="space-y-2">
              <div className="flex gap-1">
                <div className="w-10 h-10 bg-correct text-white flex items-center justify-center font-bold border-2 rounded">
                  W
                </div>
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold border-2 rounded">
                  O
                </div>
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold border-2 rounded">
                  R
                </div>
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold border-2 rounded">
                  L
                </div>
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold border-2 rounded">
                  D
                </div>
              </div>
              <p className="text-xs">
                <strong>W</strong> is in the word and in the correct spot.
              </p>
            </div>

            {/* Example 2: Present letter */}
            <div className="space-y-2">
              <div className="flex gap-1">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold border-2 rounded">
                  P
                </div>
                <div className="w-10 h-10 bg-present text-white flex items-center justify-center font-bold border-2 rounded">
                  I
                </div>
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold border-2 rounded">
                  L
                </div>
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold border-2 rounded">
                  L
                </div>
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold border-2 rounded">
                  S
                </div>
              </div>
              <p className="text-xs">
                <strong>I</strong> is in the word but in the wrong spot.
              </p>
            </div>

            {/* Example 3: Absent letter */}
            <div className="space-y-2">
              <div className="flex gap-1">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold border-2 rounded">
                  V
                </div>
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold border-2 rounded">
                  A
                </div>
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold border-2 rounded">
                  G
                </div>
                <div className="w-10 h-10 bg-absent text-white flex items-center justify-center font-bold border-2 rounded">
                  U
                </div>
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold border-2 rounded">
                  E
                </div>
              </div>
              <p className="text-xs">
                <strong>U</strong> is not in the word in any spot.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;
