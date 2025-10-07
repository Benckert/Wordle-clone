/**
 * Game Store - Zustand State Management
 * 
 * This file contains the global game state and all game actions.
 * Uses Zustand for simple, performant state management.
 * Statistics are persisted to localStorage.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getTodaysWord, isValidWord } from '@/utils/words';
import { evaluateGuess, getKeyboardStatus, isWinningGuess } from '@/utils/gameLogic';
import { WORD_LENGTH, MAX_ATTEMPTS } from '@/utils/constants';
import { GameStatus } from '@/types/game.types';
import type { GameStore, GameStats, KeyboardStatus } from '@/types/game.types';

/**
 * Initial statistics state
 */
const initialStats: GameStats = {
  played: 0,
  won: 0,
  currentStreak: 0,
  maxStreak: 0,
  distribution: [0, 0, 0, 0, 0, 0],
};

/**
 * Game Store
 * 
 * Central state management for the entire Wordle game.
 * Handles all game logic, state updates, and persistence.
 */
export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // ============= INITIAL STATE =============

      targetWord: getTodaysWord(),
      currentGuess: "",
      guesses: [],
      currentRow: 0,
      gameStatus: GameStatus.PLAYING,
      stats: initialStats,
      showStats: false,
      showHelp: false,
      invalidWord: false,
      isValidating: false,

      // ============= ACTIONS =============

      /**
       * Add a letter to the current guess
       *
       * Only adds if:
       * - Game is still in PLAYING state
       * - Current guess is less than WORD_LENGTH
       *
       * @param {string} letter - Letter to add (automatically uppercased)
       */
      addLetter: (letter: string) => {
        const { currentGuess, gameStatus } = get()
        if (gameStatus !== GameStatus.PLAYING) return
        if (currentGuess.length < WORD_LENGTH) {
          set({
            currentGuess: currentGuess + letter.toUpperCase(),
            invalidWord: false,
          })
        }
      },

      /**
       * Delete the last letter from the current guess
       *
       * Only deletes if:
       * - Game is still in PLAYING state
       * - There are letters to delete
       */
      deleteLetter: () => {
        const { currentGuess, gameStatus } = get()
        if (gameStatus !== GameStatus.PLAYING) return
        set({
          currentGuess: currentGuess.slice(0, -1),
          invalidWord: false,
        })
      },

      /**
       * Submit the current guess
       *
       * Validates the guess, evaluates it, updates game state,
       * and checks for win/loss conditions.
       *
       * Validation checks:
       * 1. Guess must be exactly WORD_LENGTH characters
       * 2. Guess must be in the dictionary (checked via API)
       *
       * If guess is valid:
       * 1. Evaluates guess against target word
       * 2. Adds guess to guesses array
       * 3. Checks for win condition
       * 4. Checks for loss condition (max attempts reached)
       * 5. Updates statistics if game ends
       * 6. Shows stats modal if game ends
       */
      submitGuess: async () => {
        const { currentGuess, targetWord, guesses, currentRow, stats } = get()

        // Validation: Check word length
        if (currentGuess.length !== WORD_LENGTH) return

        // Set validating state
        set({ isValidating: true })

        // Validation: Check if word is in dictionary (async API call)
        const isValid = await isValidWord(currentGuess)

        // Clear validating state
        set({ isValidating: false })

        if (!isValid) {
          set({ invalidWord: true })
          // Auto-clear invalid word flag after animation
          setTimeout(() => set({ invalidWord: false }), 400)
          return
        }

        // Evaluate the guess
        const evaluation = evaluateGuess(currentGuess, targetWord)
        const newGuesses = [...guesses, { word: currentGuess, evaluation }]

        // Check win/loss conditions
        const hasWon = isWinningGuess(evaluation)
        const hasLost = currentRow >= MAX_ATTEMPTS - 1 && !hasWon

        let newGameStatus = GameStatus.PLAYING
        const newStats = { ...stats }

        // Handle win condition
        if (hasWon) {
          newGameStatus = GameStatus.WON
          newStats.played++
          newStats.won++
          newStats.currentStreak++
          newStats.maxStreak = Math.max(
            newStats.maxStreak,
            newStats.currentStreak
          )
          newStats.distribution[currentRow]++
        }
        // Handle loss condition
        else if (hasLost) {
          newGameStatus = GameStatus.LOST
          newStats.played++
          newStats.currentStreak = 0
        }

        // Update state
        set({
          guesses: newGuesses,
          currentGuess: "",
          currentRow: currentRow + 1,
          gameStatus: newGameStatus,
          stats: newStats,
          showStats: hasWon || hasLost,
        })
      },

      /**
       * Get keyboard status for all letters
       *
       * @returns {KeyboardStatus} Map of letters to their status
       */
      getKeyboardStatus: (): KeyboardStatus => {
        const { guesses } = get()
        return getKeyboardStatus(guesses)
      },

      /**
       * Reset the game
       *
       * Resets all game state to initial values.
       * Gets a new target word (useful for testing or "play again").
       * Statistics are preserved.
       */
      resetGame: () => {
        set({
          targetWord: getTodaysWord(),
          currentGuess: "",
          guesses: [],
          currentRow: 0,
          gameStatus: GameStatus.PLAYING,
          invalidWord: false,
          isValidating: false,
          showStats: false,
        })
      },

      /**
       * Toggle statistics modal visibility
       */
      toggleStats: () => set((state) => ({ showStats: !state.showStats })),

      /**
       * Toggle help modal visibility
       */
      toggleHelp: () => set((state) => ({ showHelp: !state.showHelp })),
    }),
    {
      name: "wordle-game-storage",
      // Only persist statistics to localStorage
      // Game state resets on each session
      partialize: (state) => ({
        stats: state.stats,
      }),
    }
  )
)
