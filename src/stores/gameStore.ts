/**
 * Game Store - Zustand State Management
 * 
 * This file contains the global game state and all game a      submitGuess: async () => {
        const { currentGuess, targetWord, guesses, currentRow, stats, wordLength } = get()

        console.log('[submitGuess] Starting validation for:', currentGuess)

        // Validation: Check word length
        if (currentGuess.length !== wordLength) {
          console.log('[submitGuess] Word length invalid')
          return
        }* Uses Zustand for simple, performant state management.
 * Statistics are persisted to localStorage.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getTodaysWord, getRandomWord, isValidWord } from "@/utils/words"
import {
  evaluateGuess,
  getKeyboardStatus,
  isWinningGuess,
} from "@/utils/gameLogic"
import { DEFAULT_WORD_LENGTH, MAX_ATTEMPTS } from "@/utils/constants"
import { GameStatus } from "@/types/game.types"
import type { GameStore, GameStats, KeyboardStatus } from "@/types/game.types"

/**
 * Initial statistics state
 */
const initialStats: GameStats = {
  played: 0,
  won: 0,
  currentStreak: 0,
  maxStreak: 0,
  distribution: [0, 0, 0, 0, 0, 0],
}

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
      wordLength: DEFAULT_WORD_LENGTH,

      // ============= ACTIONS =============

      /**
       * Add a letter to the current guess
       *
       * Only adds if:
       * - Game is still in PLAYING state
       * - Current guess is less than wordLength
       *
       * @param {string} letter - Letter to add (automatically uppercased)
       */
      addLetter: (letter: string) => {
        const { currentGuess, gameStatus, wordLength } = get()
        if (gameStatus !== GameStatus.PLAYING) return
        if (currentGuess.length < wordLength) {
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
        const { currentGuess, targetWord, guesses, currentRow, stats, wordLength } = get()

        console.log("[submitGuess] Starting validation for:", currentGuess)

        // Validation: Check word length
        if (currentGuess.length !== wordLength) {
          console.log("[submitGuess] Word length invalid")
          return
        }

        // Set validating state
        console.log("[submitGuess] Setting isValidating to true")
        set({ isValidating: true })

        try {
          // Validation: Check if word is in dictionary (async API call)
          console.log("[submitGuess] Calling isValidWord API...")
          const isValid = await isValidWord(currentGuess)
          console.log("[submitGuess] API returned:", isValid)

          if (!isValid) {
            console.log("[submitGuess] Word is invalid, setting states")
            set({ invalidWord: true, isValidating: false })
            // Auto-clear invalid word flag after animation
            setTimeout(() => {
              console.log("[submitGuess] Clearing invalidWord flag")
              set({ invalidWord: false })
            }, 400)
            return
          }
        } catch (error) {
          console.error("[submitGuess] Error validating word:", error)
          set({ invalidWord: true, isValidating: false })
          setTimeout(() => set({ invalidWord: false }), 400)
          return
        }

        // Evaluate the guess
        console.log('[submitGuess] About to evaluate. Target word:', targetWord)
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
        console.log("[submitGuess] Word is valid, updating game state")
        set({
          guesses: newGuesses,
          currentGuess: "",
          currentRow: currentRow + 1,
          gameStatus: newGameStatus,
          stats: newStats,
          showStats: hasWon || hasLost,
          isValidating: false,
        })
        console.log("[submitGuess] State updated, isValidating set to false")
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
       * Gets a new random word for "play again" functionality.
       * Statistics are preserved.
       */
      resetGame: () => {
        const { wordLength } = get()
        const newWord = getRandomWord(wordLength)
        console.log("[resetGame] New target word selected:", newWord)
        set({
          targetWord: newWord,
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
       * Set word length and start new game
       * 
       * @param {number} length - Word length (5, 6, or 7)
       */
      setWordLength: (length: number) => {
        const newWord = getRandomWord(length)
        console.log(`[setWordLength] Changing to ${length}-letter words. New word:`, newWord)
        set({
          wordLength: length,
          targetWord: newWord,
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
