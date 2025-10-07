/**
 * Word List and Validation
 * 
 * This file contains word validation using Dictionary API and answer word lists.
 * Uses Free Dictionary API for validating any 5-letter English word.
 */

/**
 * Cache for validated words to minimize API calls
 * Stores words that have been checked (both valid and invalid)
 */
const wordValidationCache = new Map<string, boolean>();

/**
 * Fallback valid guesses - words that can be entered
 * Used as fallback if API is unavailable or for offline mode
 */
export const VALID_GUESSES: readonly string[] = [
  'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT',
  'AFTER', 'AGAIN', 'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT',
  'ALIEN', 'ALIGN', 'ALIKE', 'ALIVE', 'ALLOW', 'ALONE', 'ALONG', 'ALTER',
  'ANGEL', 'ANGER', 'ANGLE', 'ANGRY', 'APART', 'APPLE', 'APPLY', 'ARENA',
  'ARGUE', 'ARISE', 'ARRAY', 'ARROW', 'ASIDE', 'ASSET', 'AUDIO', 'AUDIT',
  'AVOID', 'AWAKE', 'AWARD', 'AWARE', 'BADLY', 'BAKER', 'BASES', 'BASIC',
  'BASIS', 'BEACH', 'BEGAN', 'BEGIN', 'BEING', 'BELOW', 'BENCH', 'BILLY',
  'BIRTH', 'BLACK', 'BLADE', 'BLAME', 'BLANK', 'BLAST', 'BLEND', 'BLESS',
  'BLIND', 'BLOCK', 'BLOOD', 'BLOWN', 'BOARD', 'BOOST', 'BOOTH', 'BOUND',
  'BRAIN', 'BRAND', 'BRAVE', 'BREAD', 'BREAK', 'BREED', 'BRIEF', 'BRING',
  'BROAD', 'BROKE', 'BROWN', 'BUILD', 'BUILT', 'BUYER', 'CABLE', 'CALIF',
  'CARRY', 'CATCH', 'CAUSE', 'CHAIN', 'CHAIR', 'CHAOS', 'CHARM', 'CHART',
  'CHASE', 'CHEAP', 'CHECK', 'CHEEK', 'CHEER', 'CHESS', 'CHEST', 'CHIEF',
  'CHILD', 'CHINA', 'CHOSE', 'CIVIL', 'CLAIM', 'CLASS', 'CLEAN', 'CLEAR',
  'CLICK', 'CLIFF', 'CLIMB', 'CLOCK', 'CLOSE', 'CLOTH', 'CLOUD', 'COACH',
  'COAST', 'COULD', 'COUNT', 'COURT', 'COVER', 'CRACK', 'CRAFT', 'CRASH',
  'CRAZY', 'CREAM', 'CRIME', 'CROSS', 'CROWD', 'CROWN', 'CRUDE', 'CURVE',
  'CYCLE', 'DAILY', 'DANCE', 'DATED', 'DEALT', 'DEATH', 'DEBUT', 'DELAY',
  'DEPTH', 'DOING', 'DOUBT', 'DOZEN', 'DRAFT', 'DRAMA', 'DRANK', 'DRAWN',
  'DREAM', 'DRESS', 'DRILL', 'DRINK', 'DRIVE', 'DROVE', 'DYING', 'EAGER',
  'EARLY', 'EARTH', 'EIGHT', 'ELDER', 'ELECT', 'ELITE', 'EMPTY', 'ENEMY',
  'ENJOY', 'ENTER', 'ENTRY', 'EQUAL', 'ERROR', 'EVENT', 'EVERY', 'EXACT',
  'EXIST', 'EXTRA', 'FAITH', 'FALSE', 'FAULT', 'FIBER', 'FIELD', 'FIFTH',
  'FIFTY', 'FIGHT', 'FINAL', 'FIRST', 'FIXED', 'FLASH', 'FLEET', 'FLOOR',
  'FLUID', 'FOCUS', 'FORCE', 'FORTH', 'FORTY', 'FORUM', 'FOUND', 'FRAME',
  'FRANK', 'FRAUD', 'FRESH', 'FRONT', 'FRUIT', 'FULLY', 'FUNNY', 'GIANT',
  'GIVEN', 'GLASS', 'GLOBE', 'GOING', 'GRACE', 'GRADE', 'GRAIN', 'GRAND',
  'GRANT', 'GRASS', 'GRAVE', 'GREAT', 'GREEN', 'GROSS', 'GROUP', 'GROWN',
  'GUARD', 'GUESS', 'GUEST', 'GUIDE', 'HAPPY', 'HARRY', 'HEART', 'HEAVY',
  'HENCE', 'HENRY', 'HORSE', 'HOTEL', 'HOUSE', 'HUMAN', 'IDEAL', 'IMAGE',
  'INDEX', 'INNER', 'INPUT', 'ISSUE', 'JAPAN', 'JIMMY', 'JOINT', 'JONES',
  'JUDGE', 'KNOWN', 'LABEL', 'LARGE', 'LASER', 'LATER', 'LAUGH', 'LAYER',
  'LEARN', 'LEASE', 'LEAST', 'LEAVE', 'LEGAL', 'LEMON', 'LEVEL', 'LEWIS',
  'LIGHT', 'LIMIT', 'LINKS', 'LIVES', 'LOCAL', 'LOGIC', 'LOOSE', 'LOWER',
  'LUCKY', 'LUNCH', 'LYING', 'MAGIC', 'MAJOR', 'MAKER', 'MARCH', 'MARIA',
  'MATCH', 'MAYBE', 'MAYOR', 'MEANT', 'MEDIA', 'METAL', 'MIGHT', 'MINOR',
  'MINUS', 'MIXED', 'MODEL', 'MONEY', 'MONTH', 'MORAL', 'MOTOR', 'MOUNT',
  'MOUSE', 'MOUTH', 'MOVED', 'MOVIE', 'MUSIC', 'NEEDS', 'NEVER', 'NEWLY',
  'NIGHT', 'NOISE', 'NORTH', 'NOTED', 'NOVEL', 'NURSE', 'OCCUR', 'OCEAN',
  'OFFER', 'OFTEN', 'ORDER', 'OTHER', 'OUGHT', 'PAINT', 'PANEL', 'PANIC',
  'PAPER', 'PARTY', 'PEACE', 'PETER', 'PHASE', 'PHONE', 'PHOTO', 'PIECE',
  'PILOT', 'PITCH', 'PLACE', 'PLAIN', 'PLANE', 'PLANT', 'PLATE', 'POINT',
  'POUND', 'POWER', 'PRESS', 'PRICE', 'PRIDE', 'PRIME', 'PRINT', 'PRIOR',
  'PRIZE', 'PROOF', 'PROUD', 'PROVE', 'QUEEN', 'QUICK', 'QUIET', 'QUITE',
  'RADIO', 'RAISE', 'RANGE', 'RAPID', 'RATIO', 'REACH', 'READY', 'REFER',
  'RIGHT', 'RIVAL', 'RIVER', 'ROBIN', 'ROCKY', 'ROGER', 'ROMAN', 'ROUGH',
  'ROUND', 'ROUTE', 'ROYAL', 'RURAL', 'SCALE', 'SCENE', 'SCOPE', 'SCORE',
  'SENSE', 'SERVE', 'SEVEN', 'SHALL', 'SHAPE', 'SHARE', 'SHARP', 'SHEET',
  'SHELF', 'SHELL', 'SHIFT', 'SHINE', 'SHIRT', 'SHOCK', 'SHOOT', 'SHORT',
  'SHOWN', 'SIGHT', 'SINCE', 'SIXTH', 'SIXTY', 'SIZED', 'SKILL', 'SLEEP',
  'SLIDE', 'SMALL', 'SMART', 'SMILE', 'SMITH', 'SMOKE', 'SOLID', 'SOLVE',
  'SORRY', 'SOUND', 'SOUTH', 'SPACE', 'SPARE', 'SPEAK', 'SPEED', 'SPEND',
  'SPENT', 'SPLIT', 'SPOKE', 'SPORT', 'STAFF', 'STAGE', 'STAKE', 'STAND',
  'START', 'STATE', 'STEAM', 'STEEL', 'STICK', 'STILL', 'STOCK', 'STONE',
  'STOOD', 'STORE', 'STORM', 'STORY', 'STRIP', 'STUCK', 'STUDY', 'STUFF',
  'STYLE', 'SUGAR', 'SUITE', 'SUPER', 'SWEET', 'TABLE', 'TAKEN', 'TASTE',
  'TAXES', 'TEACH', 'TERRY', 'TEXAS', 'THANK', 'THEFT', 'THEIR', 'THEME',
  'THERE', 'THESE', 'THICK', 'THING', 'THINK', 'THIRD', 'THOSE', 'THREE',
  'THREW', 'THROW', 'TIGHT', 'TIMES', 'TIRED', 'TITLE', 'TODAY', 'TOPIC',
  'TOTAL', 'TOUCH', 'TOUGH', 'TOWER', 'TRACK', 'TRADE', 'TRAIN', 'TREAT',
  'TREND', 'TRIAL', 'TRIBE', 'TRICK', 'TRIED', 'TRIES', 'TROOP', 'TRUCK',
  'TRULY', 'TRUNK', 'TRUST', 'TRUTH', 'TWICE', 'UNDER', 'UNDUE', 'UNION',
  'UNITY', 'UNTIL', 'UPPER', 'UPSET', 'URBAN', 'USAGE', 'USUAL', 'VALID',
  'VALUE', 'VIDEO', 'VIRUS', 'VISIT', 'VITAL', 'VOCAL', 'VOICE', 'WASTE',
  'WATCH', 'WATER', 'WHEEL', 'WHERE', 'WHICH', 'WHILE', 'WHITE', 'WHOLE',
  'WHOSE', 'WOMAN', 'WOMEN', 'WORLD', 'WORRY', 'WORSE', 'WORST', 'WORTH',
  'WOULD', 'WOUND', 'WRITE', 'WRONG', 'WROTE', 'YOUNG', 'YOUTH',
] as const;

/**
 * Answer words - possible solutions
 * This is a subset of valid guesses that are used as daily answers
 */
export const ANSWER_WORDS: readonly string[] = [
  'ABOUT', 'ABOVE', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN',
  'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIEN', 'ALIGN',
  'ALIKE', 'ALIVE', 'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'ANGEL', 'ANGER',
  'ANGLE', 'ANGRY', 'APART', 'APPLE', 'APPLY', 'ARENA', 'ARGUE', 'ARISE',
  'ARRAY', 'ARROW', 'ASIDE', 'ASSET', 'AUDIO', 'AUDIT', 'AVOID', 'AWAKE',
  'AWARD', 'AWARE', 'BADLY', 'BAKER', 'BASIC', 'BEACH', 'BEGAN', 'BEGIN',
  'BEING', 'BELOW', 'BENCH', 'BIRTH', 'BLACK', 'BLADE', 'BLAME', 'BLANK',
  'BLEND', 'BLIND', 'BLOCK', 'BLOOD', 'BOARD', 'BOOST', 'BOUND', 'BRAIN',
  'BRAND', 'BRAVE', 'BREAD', 'BREAK', 'BRIEF', 'BRING', 'BROAD', 'BROKE',
  'BROWN', 'BUILD', 'BUILT', 'BUYER', 'CABLE', 'CARRY', 'CATCH', 'CAUSE',
  'CHAIN', 'CHAIR', 'CHAOS', 'CHARM', 'CHART', 'CHASE', 'CHEAP', 'CHECK',
  'CHEST', 'CHIEF', 'CHILD', 'CHINA', 'CIVIL', 'CLAIM', 'CLASS', 'CLEAN',
  'CLEAR', 'CLICK', 'CLIMB', 'CLOCK', 'CLOSE', 'CLOUD', 'COACH', 'COAST',
  'COULD', 'COUNT', 'COURT', 'COVER', 'CRACK', 'CRAFT', 'CRASH', 'CRAZY',
  'CREAM', 'CRIME', 'CROSS', 'CROWD', 'CROWN', 'CURVE', 'CYCLE', 'DAILY',
  'DANCE', 'DEATH', 'DELAY', 'DEPTH', 'DOUBT', 'DRAFT', 'DRAMA', 'DRAWN',
  'DREAM', 'DRESS', 'DRINK', 'DRIVE', 'DROVE', 'EARLY', 'EARTH', 'EIGHT',
  'ELDER', 'ELITE', 'EMPTY', 'ENEMY', 'ENJOY', 'ENTER', 'ENTRY', 'EQUAL',
  'ERROR', 'EVENT', 'EVERY', 'EXACT', 'EXIST', 'EXTRA', 'FAITH', 'FALSE',
  'FAULT', 'FIELD', 'FIFTH', 'FIFTY', 'FIGHT', 'FINAL', 'FIRST', 'FIXED',
  'FLASH', 'FLOOR', 'FOCUS', 'FORCE', 'FORTH', 'FORTY', 'FORUM', 'FOUND',
  'FRAME', 'FRANK', 'FRAUD', 'FRESH', 'FRONT', 'FRUIT', 'FULLY', 'FUNNY',
  'GIANT', 'GIVEN', 'GLASS', 'GLOBE', 'GRACE', 'GRADE', 'GRAIN', 'GRAND',
  'GRANT', 'GRASS', 'GRAVE', 'GREAT', 'GREEN', 'GROSS', 'GROUP', 'GROWN',
  'GUARD', 'GUESS', 'GUEST', 'GUIDE', 'HAPPY', 'HEART', 'HEAVY', 'HENCE',
  'HORSE', 'HOTEL', 'HOUSE', 'HUMAN', 'IDEAL', 'IMAGE', 'INDEX', 'INNER',
  'INPUT', 'ISSUE', 'JOINT', 'JUDGE', 'KNOWN', 'LABEL', 'LARGE', 'LASER',
  'LATER', 'LAUGH', 'LAYER', 'LEARN', 'LEASE', 'LEAST', 'LEAVE', 'LEGAL',
  'LEVEL', 'LIGHT', 'LIMIT', 'LOCAL', 'LOGIC', 'LOOSE', 'LOWER', 'LUCKY',
  'MAGIC', 'MAJOR', 'MAKER', 'MARCH', 'MATCH', 'MAYBE', 'MAYOR', 'MEANT',
  'MEDIA', 'METAL', 'MIGHT', 'MINOR', 'MINUS', 'MIXED', 'MODEL', 'MONEY',
  'MONTH', 'MORAL', 'MOTOR', 'MOUNT', 'MOUSE', 'MOUTH', 'MOVIE', 'MUSIC',
  'NEEDS', 'NEVER', 'NEWLY', 'NIGHT', 'NOISE', 'NORTH', 'NOTED', 'NOVEL',
  'NURSE', 'OCCUR', 'OCEAN', 'OFFER', 'OFTEN', 'ORDER', 'OTHER', 'OUGHT',
  'PAINT', 'PANEL', 'PAPER', 'PARTY', 'PEACE', 'PHASE', 'PHONE', 'PHOTO',
  'PIECE', 'PILOT', 'PITCH', 'PLACE', 'PLAIN', 'PLANE', 'PLANT', 'PLATE',
  'POINT', 'POUND', 'POWER', 'PRESS', 'PRICE', 'PRIDE', 'PRIME', 'PRINT',
  'PRIOR', 'PRIZE', 'PROOF', 'PROUD', 'PROVE', 'QUEEN', 'QUICK', 'QUIET',
  'QUITE', 'RADIO', 'RAISE', 'RANGE', 'RAPID', 'RATIO', 'REACH', 'READY',
  'REFER', 'RIGHT', 'RIVAL', 'RIVER', 'ROMAN', 'ROUGH', 'ROUND', 'ROUTE',
  'ROYAL', 'RURAL', 'SCALE', 'SCENE', 'SCOPE', 'SCORE', 'SENSE', 'SERVE',
  'SEVEN', 'SHALL', 'SHAPE', 'SHARE', 'SHARP', 'SHEET', 'SHELF', 'SHELL',
  'SHIFT', 'SHINE', 'SHIRT', 'SHOCK', 'SHOOT', 'SHORT', 'SHOWN', 'SIGHT',
  'SINCE', 'SIXTH', 'SIXTY', 'SKILL', 'SLEEP', 'SLIDE', 'SMALL', 'SMART',
  'SMILE', 'SMITH', 'SMOKE', 'SOLID', 'SOLVE', 'SORRY', 'SOUND', 'SOUTH',
  'SPACE', 'SPARE', 'SPEAK', 'SPEED', 'SPEND', 'SPENT', 'SPLIT', 'SPOKE',
  'SPORT', 'STAFF', 'STAGE', 'STAKE', 'STAND', 'START', 'STATE', 'STEEL',
  'STICK', 'STILL', 'STOCK', 'STONE', 'STOOD', 'STORE', 'STORM', 'STORY',
  'STRIP', 'STUCK', 'STUDY', 'STUFF', 'STYLE', 'SUGAR', 'SUITE', 'SUPER',
  'SWEET', 'TABLE', 'TAKEN', 'TASTE', 'TEACH', 'THANK', 'THEIR', 'THEME',
  'THERE', 'THESE', 'THICK', 'THING', 'THINK', 'THIRD', 'THOSE', 'THREE',
  'THREW', 'THROW', 'TIGHT', 'TIMES', 'TIRED', 'TITLE', 'TODAY', 'TOPIC',
  'TOTAL', 'TOUCH', 'TOUGH', 'TOWER', 'TRACK', 'TRADE', 'TRAIN', 'TREAT',
  'TREND', 'TRIAL', 'TRIBE', 'TRICK', 'TRUST', 'TRUTH', 'TWICE', 'UNDER',
  'UNION', 'UNITY', 'UNTIL', 'UPPER', 'UPSET', 'URBAN', 'USAGE', 'USUAL',
  'VALID', 'VALUE', 'VIDEO', 'VIRUS', 'VISIT', 'VITAL', 'VOCAL', 'VOICE',
  'WASTE', 'WATCH', 'WATER', 'WHEEL', 'WHERE', 'WHICH', 'WHILE', 'WHITE',
  'WHOLE', 'WHOSE', 'WOMAN', 'WOMEN', 'WORLD', 'WORRY', 'WORSE', 'WORST',
  'WORTH', 'WOULD', 'WRITE', 'WRONG', 'YOUNG', 'YOUTH',
] as const;

/**
 * Get today's word
 * Uses a deterministic algorithm based on the current date
 * This ensures all players get the same word on the same day
 * 
 * @returns {string} Today's word in uppercase
 */
export const getTodaysWord = (): string => {
  const today = new Date();
  const start = new Date(2024, 0, 1); // Jan 1, 2024
  const diff = today.getTime() - start.getTime();
  const daysSinceStart = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = daysSinceStart % ANSWER_WORDS.length;
  return ANSWER_WORDS[index].toUpperCase();
};

/**
 * Get a random word for practice mode
 * Returns a different random word each time it's called
 * 
 * @returns {string} Random word in uppercase
 */
export const getRandomWord = (): string => {
  const index = Math.floor(Math.random() * ANSWER_WORDS.length);
  return ANSWER_WORDS[index].toUpperCase();
};

/**
 * Check if a word is valid using Dictionary API
 * 
 * Uses the Free Dictionary API to validate any 5-letter English word.
 * Falls back to local word list if API is unavailable.
 * Results are cached to minimize API calls.
 * 
 * @param {string} word - The word to validate
 * @returns {Promise<boolean>} True if word is valid, false otherwise
 */
export const isValidWord = async (word: string): Promise<boolean> => {
  const upperWord = word.toUpperCase();
  
  // Check cache first
  if (wordValidationCache.has(upperWord)) {
    return wordValidationCache.get(upperWord)!;
  }
  
  try {
    // Try Dictionary API first
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`,
      { 
        signal: AbortSignal.timeout(3000) // 3 second timeout
      }
    );
    
    const isValid = response.ok;
    
    // Cache the result
    wordValidationCache.set(upperWord, isValid);
    
    return isValid;
  } catch (error) {
    // If API fails, fall back to local word list
    console.warn('Dictionary API unavailable, using fallback list', error);
    const isValid = VALID_GUESSES.includes(upperWord as typeof VALID_GUESSES[number]);
    wordValidationCache.set(upperWord, isValid);
    return isValid;
  }
};

/**
 * Check if a word is valid (synchronous version for fallback)
 * Uses only the local word list
 * 
 * @param {string} word - The word to validate
 * @returns {boolean} True if word is valid, false otherwise
 * @deprecated Use isValidWord() instead for API validation
 */
export const isValidWordSync = (word: string): boolean => {
  return VALID_GUESSES.includes(word.toUpperCase() as typeof VALID_GUESSES[number]);
};
