/**
 * Game Type Definitions
 * 
 * This file contains all TypeScript interfaces and enums for the Wordle game.
 */

/**
 * Tile status enumeration
 * Represents the current state of a tile in the game grid
 */
export enum TileStatus {
  EMPTY = 'empty',
  FILLED = 'filled',
  CORRECT = 'correct',
  PRESENT = 'present',
  ABSENT = 'absent',
}

/**
 * Game status enumeration
 * Represents the current state of the game
 */
export enum GameStatus {
  PLAYING = 'playing',
  WON = 'won',
  LOST = 'lost',
}

/**
 * Guess interface
 * Represents a single guess with its evaluation
 */
export interface Guess {
  word: string;
  evaluation: TileStatus[];
}

/**
 * Game statistics interface
 * Tracks player performance over time
 */
export interface GameStats {
  played: number;
  won: number;
  currentStreak: number;
  maxStreak: number;
  distribution: number[]; // Index = attempt number (0-5)
}

/**
 * Game state interface
 * Contains all game state properties
 */
export interface GameState {
  targetWord: string
  currentGuess: string
  guesses: Guess[]
  currentRow: number
  gameStatus: GameStatus
  stats: GameStats
  showStats: boolean
  showHelp: boolean
  invalidWord: boolean
  isValidating: boolean
  wordLength: number
}

/**
 * Game actions interface
 * Contains all game action functions
 */
export interface GameActions {
  addLetter: (letter: string) => void
  deleteLetter: () => void
  submitGuess: () => Promise<void>
  getKeyboardStatus: () => KeyboardStatus
  resetGame: () => void
  toggleStats: () => void
  toggleHelp: () => void
  setWordLength: (length: number) => void
}

/**
 * Complete game store type
 * Combines state and actions
 */
export type GameStore = GameState & GameActions;

/**
 * Keyboard status type
 * Maps keyboard letters to their tile status
 */
export interface KeyboardStatus {
  [key: string]: TileStatus | undefined;
}
