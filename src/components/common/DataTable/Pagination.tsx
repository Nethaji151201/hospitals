import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal, ChevronDown } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: (number | 'All')[];
}

export default function Pagination({
  currentPage,
  pageSize,
  totalRecords,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100, 'All']
}: PaginationProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handleOptionSelect = (opt: number | 'All') => {
    if (opt === 'All') {
      onPageSizeChange(totalRecords > 0 ? totalRecords : 999999);
    } else {
      onPageSizeChange(opt);
    }
    setIsDropdownOpen(false);
  };

  const displayPageSize =
    pageSize >= 999999 || (totalRecords > 0 && pageSize >= totalRecords) ? 'All' : pageSize;

  const getPageNumbers = () => {
    let pages: number[] = [];
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, currentPage + 1);

    if (currentPage === 1) end = Math.min(3, totalPages);
    if (currentPage === totalPages) start = Math.max(1, totalPages - 2);

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white dark:bg-sidebar border-t border-gray-100 dark:border-gray-800 gap-4 rounded-b-xl">
      {/* Settings & Info */}
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 z-10 w-full sm:w-auto justify-between sm:justify-start">
        <span className="mr-3 font-medium hidden sm:inline">Rows per page:</span>

        {/* Custom Fancy Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between min-w-[72px] px-3 py-1.5 rounded bg-white dark:bg-gray-800 border-[1.5px] border-primary/50 dark:border-primary text-primary font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all h-[36px]"
          >
            <span className="font-medium mr-2">{displayPageSize}</span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute bottom-full left-0 mb-1 w-full min-w-[72px] bg-white dark:bg-gray-800 rounded-md shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden py-1">
              {pageSizeOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleOptionSelect(opt)}
                  className={`w-full text-left text-sm py-2 px-3 transition-colors ${
                    displayPageSize === opt 
                      ? 'bg-primary text-white font-semibold' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="hidden sm:inline ml-4">
          Showing{' '}
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {totalRecords > 0 ? (currentPage - 1) * pageSize + 1 : 0}
          </span>{' '}
          to{' '}
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {Math.min(currentPage * pageSize, totalRecords)}
          </span>{' '}
          of <span className="font-bold text-gray-900 dark:text-gray-100">{totalRecords}</span> entries
        </span>
      </div>

      {/* Pages Controls */}
      <div className="flex items-center gap-1.5 relative z-0">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-9 h-9 rounded-md text-gray-500 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none"
        >
          <ChevronLeft size={18} />
        </button>

        {pages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="flex items-center justify-center w-9 h-9 rounded-md text-sm font-semibold text-gray-600 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              1
            </button>
            {pages[0] > 2 && <MoreHorizontal size={16} className="text-gray-400 mx-1" />}
          </>
        )}

        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`flex items-center justify-center w-9 h-9 rounded-md text-sm font-semibold transition-all shadow-sm ${
                isActive 
                  ? 'bg-primary text-white pointer-events-none' 
                  : 'text-gray-600 dark:text-gray-300 bg-white dark:bg-sidebar border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {p}
            </button>
          );
        })}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <MoreHorizontal size={16} className="text-gray-400 mx-1" />
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="flex items-center justify-center w-9 h-9 rounded-md text-sm font-semibold text-gray-600 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalRecords === 0}
          className="flex items-center justify-center w-9 h-9 rounded-md text-gray-500 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
