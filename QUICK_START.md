# 🚀 Quick Start Guide - Wordle Clone

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** version 18.0.0 or higher
- **npm** (comes with Node.js) or **yarn** or **pnpm**

Check your versions:
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be 8.0.0 or higher
```

## Installation Steps

### 1. Navigate to Project Directory
```bash
cd "c:\Users\Chas Academy\FJS24\Projekt\Personal-projects\Wordle"
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages:
- React 18
- TypeScript 5
- Vite 5
- Zustand
- Framer Motion
- Lucide React
- Tailwind CSS 3.4.15
- shadcn/ui components
- And more...

### 3. Start Development Server
```bash
npm run dev
```

The application will start on `http://localhost:5173`

### 4. Open in Browser
Navigate to `http://localhost:5173` in your web browser

## Available Scripts

### Development
```bash
npm run dev
```
Starts the Vite development server with hot module replacement (HMR)

### Build
```bash
npm run build
```
Creates an optimized production build in the `dist/` folder

### Preview
```bash
npm run preview
```
Locally preview the production build

### Type Check
```bash
npx tsc --noEmit
```
Run TypeScript type checking without emitting files

### Lint
```bash
npm run lint
```
Run ESLint to check code quality

## Troubleshooting

### Port Already in Use
If port 5173 is already in use:
```bash
npm run dev -- --port 3000
```

### Dependency Issues
If you encounter dependency issues:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tailwind Not Working
If Tailwind styles aren't loading:
1. Stop the dev server (Ctrl+C)
2. Clear Vite cache:
   ```bash
   rm -rf node_modules/.vite
   ```
3. Restart dev server:
   ```bash
   npm run dev
   ```

### TypeScript Errors
If you see TypeScript errors:
1. Restart TypeScript server in VS Code:
   - Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
   - Type "TypeScript: Restart TS Server"
   - Press Enter

## Project Structure Overview

```
wordle/
├── src/                    # Source code
│   ├── components/        # React components
│   ├── stores/           # State management
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   └── App.tsx           # Main application
├── public/               # Static assets
├── node_modules/         # Dependencies (auto-generated)
├── dist/                 # Production build (auto-generated)
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind configuration
└── vite.config.ts        # Vite configuration
```

## First-Time Setup Checklist

- [ ] Node.js 18+ installed
- [ ] Project dependencies installed (`npm install`)
- [ ] Dev server runs without errors (`npm run dev`)
- [ ] Application opens in browser at `localhost:5173`
- [ ] Can type letters and see them appear
- [ ] Can submit guesses with Enter
- [ ] Help modal appears on first visit

## Next Steps

1. **Play the game** to ensure everything works
2. **Read the README.md** for detailed documentation
3. **Check PROJECT_SUMMARY.md** for technical overview
4. **Start customizing** (see Customization section in README)

## Getting Help

If you encounter issues:
1. Check the console for error messages (F12 in browser)
2. Check the terminal for build errors
3. Review the README.md for common solutions
4. Ensure all dependencies are correctly installed

## Deploy to Production

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages
1. Update `vite.config.ts` with base path
2. Run:
   ```bash
   npm run build
   npx gh-pages -d dist
   ```

---

**🎉 You're all set! Start playing Wordle!**
