/**
 * Lose Overlay Component
 * 
 * Overlay that appears when player loses the game.
 * Shows the correct answer and options to play again or view stats.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, BarChart3, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/stores/gameStore';
import { GameStatus } from '@/types/game.types';
import { useState, useEffect } from "react"

/**
 * LoseOverlay Component
 *
 * Features:
 * - Blurred background overlay
 * - X icon with animation
 * - Shows the correct answer
 * - "Play Again" button - resets current game
 * - "View Stats" button - opens statistics modal
 * - Fade-in animation
 * - Delayed appearance to allow tile animation to complete
 */
const LoseOverlay: React.FC = () => {
  const { gameStatus, resetGame, toggleStats, wordLength, gameStates } =
    useGameStore()
  const [showOverlay, setShowOverlay] = useState(false)

  const currentGame = gameStates[wordLength]
  const targetWord = currentGame?.targetWord || ""

  // Delay showing overlay to let tile animation complete
  // Animation takes ~0.5s, add 0.5s breathing room = 1.0s total delay
  useEffect(() => {
    if (gameStatus === GameStatus.LOST) {
      const timer = setTimeout(() => {
        setShowOverlay(true)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setShowOverlay(false)
    }
  }, [gameStatus])

  const handleViewStats = () => {
    toggleStats()
  }

  const handlePlayAgain = () => {
    resetGame()
  }

  return (
    <AnimatePresence>
      {showOverlay && gameStatus === GameStatus.LOST && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backdropFilter: "blur(8px)" }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Content */}
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ delay: 0.5, duration: 0.4, type: "spring" }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center"
          >
            {/* X Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.7,
                duration: 0.5,
                type: "spring",
                bounce: 0.5,
              }}
              className="flex justify-center mb-6"
            >
              <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-full p-6">
                <XCircle
                  size={48}
                  className="text-white"
                />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
            >
              Game Over
            </motion.h2>

            {/* Subtitle with correct answer */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="mb-8"
            >
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Better luck next time!
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
                The word was:
              </p>
              <div className="inline-block bg-gray-100 dark:bg-gray-700 rounded-lg px-6 py-3">
                <span className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  {targetWord}
                </span>
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="flex flex-col gap-3"
            >
              {/* Play Again Button */}
              <Button
                onClick={handlePlayAgain}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 text-lg font-semibold"
              >
                <RotateCcw
                  size={20}
                  className="mr-2"
                />
                Play Again
              </Button>

              {/* View Stats Button */}
              <Button
                onClick={handleViewStats}
                variant="outline"
                className="w-full py-6 text-lg font-semibold"
              >
                <BarChart3
                  size={20}
                  className="mr-2"
                />
                View Stats
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoseOverlay;
