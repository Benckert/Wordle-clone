/**
 * Game Logic Utilities
 * 
 * This file contains the core game logic for evaluating guesses,
 * calculating keyboard status, and determining win conditions.
 */

import { TileStatus } from '@/types/game.types';
import type { Guess, KeyboardStatus } from '@/types/game.types';

/**
 * Evaluate a guess against the target word
 * 
 * This function implements the Wordle evaluation algorithm:
 * 1. First pass: Mark all correctly positioned letters (green)
 * 2. Second pass: Mark all present but wrongly positioned letters (yellow)
 * 3. Remaining letters are marked as absent (gray)
 * 
 * Important: Letters are only counted once. If a letter appears multiple times
 * in the guess but only once in the target, only one instance will be marked
 * as correct/present.
 * 
 * @param {string} guess - The guessed word
 * @param {string} target - The target word
 * @returns {TileStatus[]} Array of tile statuses for each letter
 * 
 * @example
 * evaluateGuess('WORDS', 'WORLD')
 * // Returns: [CORRECT, CORRECT, CORRECT, ABSENT, ABSENT]
 */
export const evaluateGuess = (guess: string, target: string): TileStatus[] => {
  const wordLength = guess.length;
  const result: TileStatus[] = Array(wordLength).fill(TileStatus.ABSENT);
  const targetLetters = target.split('');
  const guessLetters = guess.split('');
  
  // First pass: mark correct letters (exact position match)
  guessLetters.forEach((letter, i) => {
    if (letter === targetLetters[i]) {
      result[i] = TileStatus.CORRECT;
      targetLetters[i] = ''; // Mark as used to prevent double counting
    }
  });
  
  // Second pass: mark present letters (wrong position)
  guessLetters.forEach((letter, i) => {
    if (result[i] === TileStatus.ABSENT) {
      const targetIndex = targetLetters.indexOf(letter);
      if (targetIndex !== -1) {
        result[i] = TileStatus.PRESENT;
        targetLetters[targetIndex] = ''; // Mark as used
      }
    }
  });
  
  return result;
};

/**
 * Get keyboard letter status based on all guesses
 * 
 * Calculates the status of each letter on the keyboard based on all
 * previous guesses. Uses a priority system:
 * - CORRECT (green) takes highest priority
 * - PRESENT (yellow) takes second priority
 * - ABSENT (gray) takes lowest priority
 * 
 * This ensures that if a letter has been marked correct anywhere,
 * it shows as green on the keyboard even if it was yellow or gray elsewhere.
 * 
 * @param {Guess[]} guesses - Array of all previous guesses with evaluations
 * @returns {KeyboardStatus} Object mapping letters to their status
 * 
 * @example
 * getKeyboardStatus([
 *   { word: 'HOUSE', evaluation: [...] },
 *   { word: 'MOUSE', evaluation: [...] }
 * ])
 * // Returns: { H: ABSENT, O: PRESENT, U: CORRECT, ... }
 */
export const getKeyboardStatus = (guesses: Guess[]): KeyboardStatus => {
  const status: KeyboardStatus = {};
  
  guesses.forEach(({ word, evaluation }) => {
    word.split('').forEach((letter, i) => {
      const currentStatus = evaluation[i];
      const existingStatus = status[letter];
      
      // Priority: correct > present > absent
      if (currentStatus === TileStatus.CORRECT) {
        status[letter] = TileStatus.CORRECT;
      } else if (
        currentStatus === TileStatus.PRESENT && 
        existingStatus !== TileStatus.CORRECT
      ) {
        status[letter] = TileStatus.PRESENT;
      } else if (!existingStatus) {
        status[letter] = currentStatus;
      }
    });
  });
  
  return status;
};

/**
 * Check if a guess is a winning guess
 * 
 * A guess is winning if all letters are marked as CORRECT.
 * 
 * @param {TileStatus[]} evaluation - The evaluation result of a guess
 * @returns {boolean} True if all letters are correct, false otherwise
 * 
 * @example
 * isWinningGuess([CORRECT, CORRECT, CORRECT, CORRECT, CORRECT])
 * // Returns: true
 * 
 * isWinningGuess([CORRECT, PRESENT, CORRECT, CORRECT, CORRECT])
 * // Returns: false
 */
export const isWinningGuess = (evaluation: TileStatus[]): boolean => {
  return evaluation.every(status => status === TileStatus.CORRECT);
};
