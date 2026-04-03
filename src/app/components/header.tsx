import React from 'react';
import { Search, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery, isDark, toggleTheme }) => {
  return (
    <header className={`flex items-center justify-between px-6 py-4 transition-colors ${isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-gray-200'
      } border-b`}>
      <div className="flex items-center">
        <h1 className="text-3xl font-bold text-[#ff4d00] tracking-tight">WonderPay</h1>
      </div>

      <div className="flex-1 max-w-2xl mx-12">
        <div className="relative">
          <input
            type="text"
            placeholder="Search payments or workers..."
            className={`w-full pl-4 pr-10 py-1.5 border rounded-sm text-sm focus:outline-none transition-colors ${isDark
                ? 'bg-[#242424] border-[#333] text-gray-400 focus:border-[#444]'
                : 'bg-gray-50 border-gray-200 text-gray-700 focus:border-[#ff4d00]'
              }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-3 py-1.5 border rounded-md transition-all text-sm font-medium ${isDark
            ? 'bg-[#242424] border-[#333] hover:bg-[#333] text-gray-300'
            : 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-700'
          }`}
      >
        {isDark ? (
          <>
            <Moon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>Dark Mode</span>
          </>
        ) : (
          <>
            <Sun className="w-4 h-4 text-[#ff4d00] fill-[#ff4d00]" />
            <span>Light Mode</span>
          </>
        )}
      </button>
    </header>
  );
};
