/**
 * Header Component
 * 
 * Top navigation bar with help and statistics buttons.
 * Displays the Wordle logo/title.
 */

import { HelpCircle, BarChart3 } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';

/**
 * Header Component
 * 
 * Features:
 * - Help button (left) - opens instructions modal
 * - Wordle title (center)
 * - Statistics button (right) - opens stats modal
 */
const Header: React.FC = () => {
  const { toggleHelp, toggleStats } = useGameStore();

  return (
    <header className="border-b border-gray-300 dark:border-gray-700 px-4 py-3">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        {/* Help Button */}
        <button
          onClick={toggleHelp}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          aria-label="Help"
        >
          <HelpCircle size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Wordle
        </h1>
        
        {/* Statistics Button */}
        <button
          onClick={toggleStats}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          aria-label="Statistics"
        >
          <BarChart3 size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </header>
  );
};

export default Header;
