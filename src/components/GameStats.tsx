/**
 * Game Stats Modal Component
 * 
 * Displays player statistics and game distribution.
 * Shows win/loss message and offers to play again when game ends.
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/stores/gameStore';
import { GameStatus } from '@/types/game.types';

/**
 * GameStats Component
 * 
 * Features:
 * - Summary statistics (played, win %, streaks)
 * - Guess distribution bar chart
 * - Game over message with target word reveal
 * - Play again button
 */
const GameStats: React.FC = () => {
  const { showStats, toggleStats, stats, gameStatus, resetGame, targetWord } = useGameStore();
  
  // Calculate win percentage
  const winPercentage = stats.played > 0 
    ? Math.round((stats.won / stats.played) * 100) 
    : 0;
  
  // Get max value for distribution chart scaling
  const maxDistribution = Math.max(...stats.distribution, 1);

  return (
    <Dialog open={showStats} onOpenChange={toggleStats}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Statistics</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Stats Summary */}
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold">{stats.played}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Played</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{winPercentage}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Win %</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{stats.currentStreak}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Current Streak</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{stats.maxStreak}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Max Streak</div>
            </div>
          </div>

          {/* Guess Distribution */}
          <div>
            <h3 className="text-sm font-bold mb-2">Guess Distribution</h3>
            <div className="space-y-1">
              {stats.distribution.map((count, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-4 text-sm">{index + 1}</div>
                  <div className="flex-1">
                    <div
                      className="bg-correct text-white text-right px-2 py-1 text-sm font-bold rounded"
                      style={{
                        width: `${count > 0 ? (count / maxDistribution) * 100 : 7}%`,
                        minWidth: '20px',
                      }}
                    >
                      {count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Over Message */}
          {gameStatus !== GameStatus.PLAYING && (
            <div className="text-center space-y-3">
              {gameStatus === GameStatus.WON ? (
                <p className="text-lg font-bold text-correct">Congratulations! 🎉</p>
              ) : (
                <div>
                  <p className="text-lg font-bold text-red-600">Better luck next time!</p>
                  <p className="text-sm">The word was: <strong>{targetWord}</strong></p>
                </div>
              )}
              
              <Button onClick={resetGame} className="w-full">
                Play Again
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameStats;
