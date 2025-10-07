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
 * Answer words - 6 letters
 * Common 6-letter words for the game
 */
export const ANSWER_WORDS_6: readonly string[] = [
  'ABROAD', 'ACCEPT', 'ACCESS', 'ACROSS', 'ACTION', 'ACTIVE', 'ACTUAL', 'ADVICE',
  'AFFORD', 'AFRAID', 'AGENCY', 'AGENDA', 'ALMOST', 'ALWAYS', 'AMOUNT', 'ANIMAL',
  'ANNUAL', 'ANSWER', 'ANYONE', 'APPEAL', 'APPEAR', 'AROUND', 'ARRIVE', 'ARTIST',
  'ASSUME', 'ATTACK', 'ATTEND', 'AUGUST', 'AUTHOR', 'AVENUE', 'BARELY', 'BATTLE',
  'BEAUTY', 'BECOME', 'BEFORE', 'BEHALF', 'BEHIND', 'BELIEF', 'BELONG', 'BERLIN',
  'BETTER', 'BEYOND', 'BISHOP', 'BORDER', 'BOTTLE', 'BOTTOM', 'BRANCH', 'BREATH',
  'BRIDGE', 'BRIGHT', 'BROKEN', 'BUDGET', 'BURDEN', 'BUREAU', 'BUTTON', 'CAMERA',
  'CANCER', 'CANNOT', 'CARBON', 'CAREER', 'CASTLE', 'CASUAL', 'CENTER', 'CENTRE',
  'CENTURY', 'CHANCE', 'CHANGE', 'CHARGE', 'CHOICE', 'CHOOSE', 'CHOSEN', 'CHURCH',
  'CIRCLE', 'CLIENT', 'CLOSED', 'CLOSER', 'COFFEE', 'COLUMN', 'COMBAT', 'COMING',
  'COMMON', 'COPPER', 'CORNER', 'COUNTY', 'COUPLE', 'COURSE', 'COUSIN', 'CREDIT',
  'CRISIS', 'CUSTOM', 'DAMAGE', 'DANGER', 'DEALER', 'DEBATE', 'DECADE', 'DEFEAT',
  'DEFEND', 'DEFINE', 'DEGREE', 'DEMAND', 'DEPEND', 'DEPUTY', 'DESERT', 'DESIGN',
  'DESIRE', 'DETAIL', 'DETECT', 'DEVICE', 'DIFFER', 'DINNER', 'DIRECT', 'DOCTOR',
  'DOLLAR', 'DOMAIN', 'DOUBLE', 'DRIVEN', 'DRIVER', 'DURING', 'EASILY', 'EATING',
  'EDITOR', 'EFFECT', 'EFFORT', 'EIGHTH', 'EITHER', 'ENABLE', 'ENDING', 'ENERGY',
  'ENGINE', 'ENOUGH', 'ENSURE', 'ENTIRE', 'ENTITY', 'EQUITY', 'ESCAPE', 'ESTATE',
  'ETHNIC', 'EUROPE', 'EVENTS', 'EXCEPT', 'EXCESS', 'EXPAND', 'EXPECT', 'EXPERT',
  'EXPORT', 'EXTEND', 'EXTENT', 'FABRIC', 'FACIAL', 'FACTOR', 'FAILED', 'FAIRLY',
  'FALLEN', 'FAMILY', 'FAMOUS', 'FARMER', 'FATHER', 'FELLOW', 'FEMALE', 'FIGURE',
  'FILING', 'FINGER', 'FINISH', 'FISCAL', 'FLIGHT', 'FLYING', 'FOLLOW', 'FORCED',
  'FOREST', 'FORGET', 'FORMAL', 'FORMAT', 'FORMER', 'FOSTER', 'FRIEND', 'FUTURE',
  'GARDEN', 'GENDER', 'GERMAN', 'GLOBAL', 'GOLDEN', 'GROUND', 'GROWTH', 'GUIDED',
  'GUILTY', 'HAPPEN', 'HARDLY', 'HEADED', 'HEALTH', 'HEAVEN', 'HEIGHT', 'HIDDEN',
  'HIGHLY', 'HOLDER', 'HONEST', 'IMPACT', 'IMPORT', 'INCOME', 'INDEED', 'INJURY',
  'INSIDE', 'INTENT', 'INVEST', 'ISLAND', 'ITSELF', 'JERSEY', 'JOSEPH', 'JUNIOR',
  'KILLED', 'LABOUR', 'LATEST', 'LATTER', 'LAUNCH', 'LAWYER', 'LEADER', 'LEAGUE',
  'LENGTH', 'LESSON', 'LETTER', 'LIGHTS', 'LIKELY', 'LINKED', 'LISTEN', 'LITTLE',
  'LIVING', 'LOSING', 'LOVELY', 'LOVING', 'LUXURY', 'MAINLY', 'MAKING', 'MANAGE',
  'MANNER', 'MANUAL', 'MARGIN', 'MARINE', 'MARKED', 'MARKET', 'MASTER', 'MATTER',
  'MEDIUM', 'MEMBER', 'MEMORY', 'MENTAL', 'MERELY', 'MERGER', 'MIDDLE', 'MOBILE',
  'MODERN', 'MODEST', 'MODULE', 'MOMENT', 'MOTHER', 'MOTION', 'MOVING', 'MURDER',
  'MUSEUM', 'MUTUAL', 'MYSELF', 'NARROW', 'NATION', 'NATIVE', 'NATURE', 'NEARBY',
  'NEARLY', 'NIGHTS', 'NOBODY', 'NORMAL', 'NOTICE', 'NOTION', 'NUMBER', 'OBJECT',
  'OBTAIN', 'OFFICE', 'OFFSET', 'ONLINE', 'OPTION', 'ORANGE', 'ORIGIN', 'OUTPUT',
  'OXFORD', 'PACKED', 'PALACE', 'PARENT', 'PARTLY', 'PATENT', 'PEOPLE', 'PERIOD',
  'PERMIT', 'PERSON', 'PHRASE', 'PICKED', 'PLANET', 'PLAYER', 'PLEASE', 'PLENTY',
  'POCKET', 'POLICE', 'POLICY', 'PREFER', 'PRETTY', 'PRINCE', 'PRISON', 'PROFIT',
  'PROPER', 'PROVEN', 'PUBLIC', 'PURSUE', 'RAISED', 'RANDOM', 'RARELY', 'RATHER',
  'RATING', 'READER', 'REALLY', 'REASON', 'RECALL', 'RECENT', 'RECORD', 'REDUCE',
  'REFORM', 'REGARD', 'REGIME', 'REGION', 'RELATE', 'RELIEF', 'REMAIN', 'REMOTE',
  'REMOVE', 'REPAIR', 'REPEAT', 'REPLAY', 'REPORT', 'RESORT', 'RESULT', 'RETAIL',
  'RETAIN', 'RETURN', 'REVEAL', 'REVIEW', 'REWARD', 'RIDING', 'RISING', 'ROBUST',
  'RULING', 'RUSSIAN', 'SAFETY', 'SALARY', 'SAMPLE', 'SAVING', 'SAYING', 'SCHEME',
  'SCHOOL', 'SCREEN', 'SEARCH', 'SEASON', 'SECOND', 'SECRET', 'SECTOR', 'SECURE',
  'SEEING', 'SELECT', 'SELLER', 'SENIOR', 'SERIES', 'SERVED', 'SERVER', 'SETTLE',
  'SEVERE', 'SEXUAL', 'SHOULD', 'SIGNAL', 'SIGNED', 'SILENT', 'SILVER', 'SIMPLE',
  'SIMPLY', 'SINGLE', 'SISTER', 'SLIGHT', 'SMOOTH', 'SOCIAL', 'SOLELY', 'SOUGHT',
  'SOURCE', 'SOVIET', 'SPEECH', 'SPIRIT', 'SPOKE', 'SPREAD', 'SPRING', 'SQUARE',
  'STABLE', 'STATUS', 'STEADY', 'STOLEN', 'STRAIN', 'STREAM', 'STREET', 'STRESS',
  'STRICT', 'STRIKE', 'STRING', 'STRONG', 'STRUCK', 'STUDIO', 'SUBMIT', 'SUDDEN',
  'SUFFER', 'SUMMER', 'SUMMIT', 'SUPPLY', 'SURELY', 'SURVEY', 'SWITCH', 'SYMBOL',
  'SYSTEM', 'TAKING', 'TALENT', 'TARGET', 'TAUGHT', 'TEMPLE', 'TENANT', 'TENDER',
  'TENNIS', 'THANKS', 'THEORY', 'THIRTY', 'THOUGH', 'THREAT', 'THROWN', 'TICKET',
  'TIMELY', 'TIMING', 'TISSUE', 'TOWARD', 'TRAVEL', 'TREATY', 'TRYING', 'TURKEY',
  'TURNED', 'TWENTY', 'UNABLE', 'UNIQUE', 'UNITED', 'UNLESS', 'UNLIKE', 'UPDATE',
  'USEFUL', 'VALLEY', 'VARIED', 'VENDOR', 'VICTIM', 'VISION', 'VISUAL', 'VOLUME',
  'WALKER', 'WEALTH', 'WEEKLY', 'WEIGHT', 'WHOLLY', 'WINDOW', 'WINNER', 'WINTER',
  'WITHIN', 'WONDER', 'WORKER', 'WRIGHT', 'WRITER', 'YELLOW',
] as const;

/**
 * Answer words - 7 letters
 * Common 7-letter words for the game
 */
export const ANSWER_WORDS_7: readonly string[] = [
  'ABILITY', 'ABSENCE', 'ACADEMY', 'ACCOUNT', 'ACCUSED', 'ACHIEVE', 'ACQUIRE', 'ADDRESS',
  'ADVANCE', 'ADVERSE', 'ADVISED', 'ADVISER', 'ADVOCATE', 'AFFECTED', 'AGAINST', 'AIRLINE',
  'AIRPORT', 'ALCOHOL', 'ALLEGED', 'ALREADY', 'ANOTHER', 'ANXIETY', 'ANYBODY', 'APPLIED',
  'APPROVE', 'ARRANGE', 'ARRIVAL', 'ARTICLE', 'ARTIST', 'ASSAULT', 'ASSEMBLY', 'ASSUME',
  'ASSURED', 'ATTEMPT', 'ATTRACT', 'AUCTION', 'AVERAGE', 'BACKING', 'BALANCE', 'BANKING',
  'BARRIER', 'BATTERY', 'BEARING', 'BEATING', 'BECAUSE', 'BEDROOM', 'BELIEVE', 'BENEATH',
  'BENEFIT', 'BESIDES', 'BETTING', 'BETWEEN', 'BIOLOGY', 'BOOKING', 'BROTHER', 'BROUGHT',
  'BURNING', 'CABINET', 'CALIBER', 'CALLING', 'CAPABLE', 'CAPITAL', 'CAPTAIN', 'CAPTURE',
  'CAREFUL', 'CARRIER', 'CEILING', 'CENTRAL', 'CENTURY', 'CERTAIN', 'CHAMBER', 'CHANNEL',
  'CHAPTER', 'CHARGED', 'CHARITY', 'CHARLIE', 'CHARTER', 'CHICKEN', 'CHRONIC', 'CIRCUIT',
  'CITIZEN', 'CLASSIC', 'CLIMATE', 'CLOSING', 'CLOSEST', 'CLOTHES', 'COLLECT', 'COLLEGE',
  'COMBINE', 'COMFORT', 'COMMAND', 'COMMENT', 'COMPACT', 'COMPANY', 'COMPARE', 'COMPETE',
  'COMPLEX', 'CONCEPT', 'CONCERN', 'CONCERT', 'CONDUCT', 'CONFIRM', 'CONNECT', 'CONSENT',
  'CONSIST', 'CONTACT', 'CONTAIN', 'CONTENT', 'CONTEST', 'CONTEXT', 'CONTROL', 'CONVERT',
  'CORRECT', 'COUNCIL', 'COUNSEL', 'COUNTER', 'COUNTRY', 'COURAGE', 'COURSES', 'COVERED',
  'CREATED', 'CREATOR', 'CRICKET', 'CRYSTAL', 'CULTURE', 'CURIOUS', 'CURRENT', 'CUTTING',
  'DEALING', 'DECLINE', 'DEFAULT', 'DEFENCE', 'DEFICIT', 'DELIVER', 'DENSITY', 'DESKTOP',
  'DESPITE', 'DESTROY', 'DEVELOP', 'DEVICES', 'DIAMOND', 'DIGITAL', 'DINING', 'DIPLOMA',
  'DISABLE', 'DISCUSS', 'DISEASE', 'DISPLAY', 'DISPUTE', 'DISTANT', 'DIVERSE', 'DIVIDED',
  'DRAWING', 'DRIVING', 'DURATION', 'EARLIER', 'EASTERN', 'ECONOMY', 'EDITION', 'ELDERLY',
  'ELECTED', 'ELEGANT', 'ELEMENT', 'EMBASSY', 'EMBRACE', 'EMERGED', 'EMOTION', 'EMPEROR',
  'EMPIRE', 'ENFORCE', 'ENGAGED', 'ENGLAND', 'ENHANCE', 'EQUALLY', 'EVENING', 'EXACTLY',
  'EXAMINE', 'EXAMPLE', 'EXCITED', 'EXCLUDE', 'EXECUTE', 'EXHIBIT', 'EXPLORE', 'EXPRESS',
  'EXTREME', 'FACTORY', 'FACULTY', 'FAILING', 'FAILURE', 'FANTASY', 'FASHION', 'FEATURE',
  'FEDERAL', 'FEELING', 'FICTION', 'FIFTEEN', 'FIGHTER', 'FINDING', 'FISHING', 'FITNESS',
  'FOREIGN', 'FOREVER', 'FORTUNE', 'FORWARD', 'FOUNDER', 'FREEDOM', 'FURTHER', 'GALLERY',
  'GENERAL', 'GENETIC', 'GENUINE', 'GESTURE', 'GETTING', 'GIVENCHY', 'GLASSES', 'GLIMPSE',
  'GRAVITY', 'GREATER', 'GREATEST', 'GROWING', 'HANDFUL', 'HANGING', 'HARMONY', 'HEALTHY',
  'HEARING', 'HEAVILY', 'HELPING', 'HERSELF', 'HIGHWAY', 'HIMSELF', 'HISTORY', 'HOLDING',
  'HOLIDAY', 'HOUSING', 'HOWEVER', 'HUNDRED', 'HUSBAND', 'ILLEGAL', 'ILLNESS', 'IMAGING',
  'IMAGINE', 'IMPROVE', 'INCLUDE', 'INITIAL', 'INQUIRY', 'INSIGHT', 'INSPIRE', 'INSTALL',
  'INSTANT', 'INSTEAD', 'INTENSE', 'INTERIM', 'INVOLVE', 'ISLAMIC', 'ISLANDS', 'ISOLATED',
  'JOURNEY', 'JUSTICE', 'KEEPING', 'KITCHEN', 'KNOWING', 'LARGELY', 'LASTING', 'LEADING',
  'LEARNED', 'LEATHER', 'LEAVING', 'LECTURE', 'LENDING', 'LIBERAL', 'LIBRARY', 'LICENSE',
  'LIMITED', 'LINKING', 'LISTING', 'LITERAL', 'LOGICAL', 'LOOKING', 'LOYALTY', 'MACHINE',
  'MANAGER', 'MASSIVE', 'MATCHED', 'MAXIMUM', 'MEANING', 'MEASURE', 'MEDICAL', 'MEETING',
  'MEMBERS', 'MESSAGE', 'MICHAEL', 'MIDDLE', 'MILLION', 'MINERAL', 'MINIMAL', 'MINIMUM',
  'MINISTER', 'MISSION', 'MISTAKE', 'MIXTURE', 'MONITOR', 'MONTHLY', 'MORNING', 'MOUNTED',
  'NATURAL', 'NEAREST', 'NEITHER', 'NERVOUS', 'NETWORK', 'NEUTRAL', 'NOTHING', 'NOWHERE',
  'NUCLEAR', 'NUMBERS', 'NURSING', 'OBVIOUS', 'OFFENSE', 'OFFICER', 'ONGOING', 'OPENING',
  'OPERATE', 'OPINION', 'OPPOSED', 'OPTICAL', 'OPTIMAL', 'OPTIONS', 'ORDERED', 'ORGANIC',
  'OUTCOME', 'OUTDOOR', 'OUTLINE', 'OUTSIDE', 'OVERALL', 'OVERLAP', 'Pacific', 'PACKAGE',
  'PAINTED', 'PARKING', 'PARTIAL', 'PARTNER', 'PASSAGE', 'PASSING', 'PASSION', 'PASSIVE',
  'PATTERN', 'PAYMENT', 'PENALTY', 'PENSION', 'PERCENT', 'PERFECT', 'PERFORM', 'PERHAPS',
  'PHOENIX', 'PICTURE', 'PIONEER', 'PLASTIC', 'POINTED', 'POPULAR', 'PORTION', 'POVERTY',
  'PRECISE', 'PREDICT', 'PREMIER', 'PREMIUM', 'PREPARE', 'PRESENT', 'PREVENT', 'PRIMARY',
  'PRINTER', 'PRIVACY', 'PRIVATE', 'PROBLEM', 'PROCEED', 'PROCESS', 'PRODUCE', 'PRODUCT',
  'PROFILE', 'PROGRAM', 'PROJECT', 'PROMISE', 'PROMOTE', 'PROTECT', 'PROTEIN', 'PROTEST',
  'PROVIDE', 'PUBLISH', 'PURPOSE', 'PUSHING', 'PUTTING', 'QUALITY', 'QUARTER', 'RADICAL',
  'RAILWAY', 'READILY', 'READING', 'REALITY', 'REALIZE', 'REBUILD', 'RECEIPT', 'RECEIVE',
  'RECOVER', 'REDUCED', 'REFLECT', 'REFUGEE', 'REFUSED', 'REGULAR', 'RELATED', 'RELEASE',
  'RELIEVE', 'REMAINS', 'REMARKABLE', 'RENEWED', 'REPLACE', 'REPLIED', 'REQUEST', 'REQUIRE',
  'RESERVE', 'RESOLVE', 'RESPECT', 'RESPOND', 'RESTORE', 'RETIRED', 'RETREAT', 'REVENUE',
  'REVERSE', 'ROUTINE', 'RUNNING', 'SATISFY', 'SAVINGS', 'SCIENCE', 'SECTION', 'SEEKING',
  'SELLING', 'SENDING', 'SERIOUS', 'SERVICE', 'SESSION', 'SETTING', 'SETTLED', 'SEVERAL',
  'SHARPLY', 'SHELTER', 'SHERIFF', 'SHOWING', 'SILENCE', 'SILICON', 'SIMILAR', 'SITTING',
  'SKILLED', 'SMOKING', 'SOCIETY', 'SOMEHOW', 'SOMEONE', 'SONBODY', 'SPEAKER', 'SPECIAL',
  'SPECIES', 'SPONSOR', 'STATION', 'STORAGE', 'STRANGE', 'STRETCH', 'STUDENT', 'STUDIED',
  'SUBJECT', 'SUCCESS', 'SUGGEST', 'SUMMARY', 'SUPPORT', 'SUPPOSE', 'SURFACE', 'SURGERY',
  'SURPLUS', 'SURVIVE', 'SUSPECT', 'SUSTAIN', 'TEACHER', 'TEENAGE', 'TENSION', 'TESTING',
  'THEATRE', 'THERAPY', 'THEREBY', 'THOUGHT', 'THROUGH', 'TONIGHT', 'TOUCHED', 'TOWARDS',
  'TRADING', 'TRAFFIC', 'TRAINED', 'TRANSIT', 'TREATED', 'TREATY', 'TRIGGER', 'TROUBLE',
  'TURNING', 'TYPICAL', 'UNIFORM', 'UNKNOWN', 'UNUSUAL', 'UTILITY', 'VARIETY', 'VARIOUS',
  'VEHICLE', 'VENTURE', 'VERSION', 'VETERAN', 'VICTORY', 'VILLAGE', 'VINTAGE', 'VISIBLE',
  'VISITOR', 'WAITING', 'WALKING', 'WANTING', 'WARNING', 'WARRANT', 'WEARING', 'WEATHER',
  'WEDDING', 'WEEKEND', 'WELFARE', 'WESTERN', 'WHETHER', 'WILLING', 'WINNING', 'WITHOUT',
  'WORKING', 'WRITING', 'WRITTEN',
] as const;

/**
 * Get today's word
 * Uses a deterministic algorithm based on the current date
 * This ensures all players get the same word on the same day
 * 
 * @param {number} length - Word length (5, 6, or 7)
 * @returns {string} Today's word in uppercase
 */
export const getTodaysWord = (length: number = 5): string => {
  const wordList = length === 6 ? ANSWER_WORDS_6 : length === 7 ? ANSWER_WORDS_7 : ANSWER_WORDS;
  const today = new Date();
  const start = new Date(2024, 0, 1); // Jan 1, 2024
  const diff = today.getTime() - start.getTime();
  const daysSinceStart = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = daysSinceStart % wordList.length;
  return wordList[index].toUpperCase();
};

/**
 * Get a random word for practice mode
 * Returns a different random word each time it's called
 * 
 * @param {number} length - Word length (5, 6, or 7)
 * @returns {string} Random word in uppercase
 */
export const getRandomWord = (length: number = 5): string => {
  const wordList = length === 6 ? ANSWER_WORDS_6 : length === 7 ? ANSWER_WORDS_7 : ANSWER_WORDS;
  const index = Math.floor(Math.random() * wordList.length);
  return wordList[index].toUpperCase();
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
