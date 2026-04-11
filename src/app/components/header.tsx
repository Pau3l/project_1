import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDark: boolean;
  resultCount?: number;
  totalCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  isDark,
  resultCount,
  totalCount,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Ctrl+K / Cmd+K keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        setSearchQuery('');
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setSearchQuery]);

  const isFiltering = searchQuery.length > 0;
  const showCount = isFiltering && resultCount !== undefined && totalCount !== undefined;

  return (
    <header
      className={`flex items-center justify-center px-6 py-3 border-b transition-colors ${
        isDark ? 'bg-[#111111] border-[#222]' : 'bg-white border-gray-200'
      }`}
    >
      <div className="w-full max-w-xl relative">
        {/* Search icon */}
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${
            isFiltering
              ? 'text-[#ff4d00]'
              : isDark ? 'text-gray-500' : 'text-gray-400'
          }`}
        />

        <input
          ref={inputRef}
          type="text"
          placeholder="Search payments, workers, or status…"
          className={`w-full pl-9 pr-24 py-2 border rounded-lg text-sm focus:outline-none transition-all ${
            isDark
              ? 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-300 placeholder:text-gray-600 focus:border-[#ff4d00]/50 focus:bg-[#1e1e1e]'
              : 'bg-gray-50 border-gray-200 text-gray-700 placeholder:text-gray-400 focus:border-[#ff4d00]/50 focus:bg-white'
          }`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Right side: result count OR keyboard shortcut */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {showCount && (
            <span className={`text-xs font-medium ${
              resultCount === 0 ? 'text-red-400' : 'text-[#ff4d00]'
            }`}>
              {resultCount}/{totalCount}
            </span>
          )}

          {isFiltering ? (
            <button
              onClick={() => { setSearchQuery(''); inputRef.current?.focus(); }}
              className={`p-0.5 rounded-full transition-colors cursor-pointer ${
                isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Clear search (Esc)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className={`hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono border ${
              isDark
                ? 'bg-[#252525] border-[#333] text-gray-500'
                : 'bg-gray-100 border-gray-300 text-gray-400'
            }`}>
              Ctrl K
            </kbd>
          )}
        </div>
      </div>
    </header>
  );
};
