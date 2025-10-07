/**
 * Game Constants
 * 
 * This file contains all constant values used throughout the Wordle game.
 */

/**
 * Word length - all words must be 5 letters
 */
export const WORD_LENGTH = 5 as const;

/**
 * Maximum number of guesses allowed
 */
export const MAX_ATTEMPTS = 6 as const;

/**
 * Keyboard layout
 * Organized in three rows as they appear on a QWERTY keyboard
 */
export const KEYBOARD_ROWS: readonly string[][] = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["BACKSPACE", "Z", "X", "C", "V", "B", "N", "M", "ENTER"],
] as const

/**
 * Animation durations in milliseconds
 * Used for consistent timing across the application
 */
export const ANIMATION_DURATION = {
  TILE_POP: 100,
  TILE_FLIP: 600,
  ROW_SHAKE: 400,
  TILE_REVEAL_DELAY: 100,
} as const;
