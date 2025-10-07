# Wordle Clone

A fully-featured Wordle clone built with modern web technologies. Test your vocabulary with this daily word puzzle game!

![Wordle Clone Screenshot](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan)

## 🎮 How to Play

1. **Guess the 5-letter word** in 6 tries or less
2. **Type your guess** using your keyboard or the on-screen keyboard
3. **Press Enter** to submit your guess
4. **Watch the tiles change color:**
   - 🟩 **Green** - Letter is correct and in the right position
   - 🟨 **Yellow** - Letter is in the word but in the wrong position
   - ⬜ **Gray** - Letter is not in the word

5. **Keep guessing** until you find the word or run out of attempts!

## ✨ Features

### Core Gameplay
- ✅ 5-letter word guessing with 6 attempts
- ✅ Real-time tile color feedback (correct, present, absent)
- ✅ Valid word checking from curated word list (500+ words)
- ✅ Smooth tile flip animations
- ✅ Invalid word shake animation

### User Interface
- ✅ Clean, responsive design works on all devices
- ✅ On-screen QWERTY keyboard with color-coded keys
- ✅ Physical keyboard support
- ✅ Help modal with examples
- ✅ Statistics modal with game history

### Statistics Tracking
- ✅ Games played and win percentage
- ✅ Current win streak and max streak
- ✅ Guess distribution chart
- ✅ Persistent stats using localStorage

### Animations & Polish
- ✅ Smooth tile flip animations using Framer Motion
- ✅ Tile pop animation when typing
- ✅ Row shake animation for invalid words
- ✅ Staggered tile reveals for visual appeal
- ✅ Toast notifications for feedback

## 🛠️ Tech Stack

### Core
- **[React 18](https://react.dev/)** - UI framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server

### State & Logic
- **[Zustand](https://github.com/pmndrs/zustand)** - Lightweight state management
- **localStorage** - Statistics persistence

### Styling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality component library

### UI Components
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

## 📦 Installation

### Prerequisites
- **Node.js** 18+ and npm (or yarn/pnpm)

### Steps

1. **Clone or download the repository**
   ```bash
   cd wordle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Start playing!

## 🚀 Build for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

The build output will be in the `dist/` folder, ready to deploy to any static hosting service.

## 📁 Project Structure

```
wordle/
├── src/
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── Grid.tsx     # Game grid (6 rows)
│   │   ├── Row.tsx      # Single row (5 tiles)
│   │   ├── Tile.tsx     # Individual letter tile
│   │   ├── Keyboard.tsx # On-screen keyboard
│   │   ├── Header.tsx   # Top navigation
│   │   ├── HelpModal.tsx    # Instructions modal
│   │   └── GameStats.tsx    # Statistics modal
│   ├── stores/
│   │   └── gameStore.ts     # Zustand game state
│   ├── types/
│   │   └── game.types.ts    # TypeScript types
│   ├── utils/
│   │   ├── constants.ts     # Game constants
│   │   ├── gameLogic.ts     # Game logic functions
│   │   └── words.ts         # Word lists and validation
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## 🎯 Game Logic

### Word Evaluation Algorithm

The game uses a two-pass algorithm to evaluate guesses:

1. **First Pass (Green)**: Mark all letters that are in the correct position
2. **Second Pass (Yellow)**: Mark remaining letters that exist in the word but are in wrong positions
3. **Final Pass (Gray)**: Mark all other letters as absent

This ensures proper handling of duplicate letters.

### Example

Target word: **SPEED**

| Guess | Evaluation |
|-------|-----------|
| STONE | 🟩⬜⬜⬜🟨 (S correct, E present) |
| SLEEP | 🟩⬜🟩🟩🟩 (All but L correct) |
| SPEED | 🟩🟩🟩🟩🟩 (Winner!) |

## 🎨 Customization

### Change Target Word Algorithm

Edit `src/utils/words.ts`:

```typescript
export const getTodaysWord = (): string => {
  // Customize this function to change how daily words are selected
  const today = new Date();
  const start = new Date(2024, 0, 1);
  const diff = today.getTime() - start.getTime();
  const daysSinceStart = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = daysSinceStart % ANSWER_WORDS.length;
  return ANSWER_WORDS[index].toUpperCase();
};
```

### Add More Words

Add words to `VALID_GUESSES` or `ANSWER_WORDS` arrays in `src/utils/words.ts`

### Change Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  correct: '#6aaa64',  // Green for correct letters
  present: '#c9b458',  // Yellow for present letters
  absent: '#787c7e',   // Gray for absent letters
},
```

## 🧪 Development

### Type Checking

```bash
npx tsc --noEmit
```

### Linting

```bash
npm run lint
```

## 📝 Code Quality

- ✅ **Fully typed** with TypeScript
- ✅ **Component documentation** with JSDoc comments
- ✅ **Clean, readable code** following React best practices
- ✅ **Modular architecture** with separation of concerns
- ✅ **Performance optimized** with React hooks best practices

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by the original [Wordle](https://www.nytimes.com/games/wordle/index.html) by Josh Wardle
- Built with modern React and TypeScript best practices
- UI components powered by [shadcn/ui](https://ui.shadcn.com/)

---

**Happy Word Guessing! 🎉**
