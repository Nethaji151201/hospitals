import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface SearchProps {
  onSearch?: (val: string) => void;
  width?: string;
  height?: string;
  placeholder?: string;
  debounce?: number;
  isLoading?: boolean;
  initialValue?: string;
  onClear?: () => void;
  id?: string;
}

const Search: React.FC<SearchProps> = ({
  onSearch,
  width = '300px',
  height,
  placeholder = 'Search...',
  debounce = 300,
  isLoading = false,
  initialValue = '',
  onClear,
  id = 'search-input'
}) => {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const debounceTimer = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fireSearch = useCallback(
    (val: string) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        if (onSearch) onSearch(val);
      }, debounce);
    },
    [onSearch, debounce]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    fireSearch(val);
  };

  const handleClear = () => {
    setValue('');
    if (onSearch) onSearch('');
    if (onClear) onClear();
    if (inputRef.current) inputRef.current.focus();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && isFocused) {
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isFocused]);

  useEffect(() => () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  }, []);

  return (
    <div style={{ width }} className="inline-flex flex-col relative">
      {/* ── Card shell ── */}
      <div
        className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border-2 transition-all duration-200
        ${isFocused
            ? 'bg-white dark:bg-sidebar border-primary shadow-[0_0_0_3.5px_rgba(var(--color-primary)/0.13),0_2px_8px_rgba(0,0,0,0.06)]'
            : 'bg-gray-50/80 dark:bg-slate-900 border-gray-200 dark:border-gray-800 shadow-sm'
          }`}
        style={height ? { height, minHeight: height } : {}}
      >
        {/* ── Left icon ── */}
        <span className="flex items-center shrink-0">
          {isLoading ? (
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              className="text-primary animate-spin"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-6.22-8.56" />
            </svg>
          ) : (
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              className={`transition-colors duration-200 ${isFocused ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`}
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          )}
        </span>

        {/* ── Input ── */}
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoComplete="off"
          className="flex-1 bg-transparent border-none outline-none text-sm text-text-main font-medium p-0 min-w-0 placeholder-gray-400 dark:placeholder-gray-600 focus:ring-0"
        />

        {/* ── Shortcut badge ── */}
        {!value && !isFocused && (
          <span className="hidden sm:inline-flex items-center gap-0.5 text-[0.68rem] text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700/50 rounded px-1.5 py-0.5 shrink-0 select-none font-mono">
            ⌃K
          </span>
        )}

        {/* ── Clear button ── */}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            tabIndex={-1}
            title="Clear"
            className="flex flex-center shrink-0 w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-700 text-white dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors border-none outline-none cursor-pointer"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Animated accent underline ── */}
      <div className="h-[2px] rounded-b-md overflow-hidden mt-[1px]">
        <div
          className="h-full bg-gradient-to-r from-primary to-green-400 rounded-md transition-all duration-300 ease-out"
          style={{ width: isFocused ? '100%' : '0%' }}
        />
      </div>
    </div>
  );
};

export default Search;
