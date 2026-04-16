import React from 'react';
import { SearchX } from 'lucide-react';

export interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ columns, rows = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr key={rowIdx} className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-sidebar">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <td key={colIdx} className="px-4 py-3">
              <span
                className="inline-block h-3 bg-gray-200 dark:bg-gray-700/50 rounded-full animate-pulse"
                style={{
                  width: `${Math.floor(Math.random() * 40) + 40}%`
                }}
              ></span>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export interface EmptyStateProps {
  message?: string;
  colSpan?: number;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message = 'No records found', colSpan = 100 }) => {
  return (
    <tr>
      <td className="p-8 text-center bg-white dark:bg-sidebar" colSpan={colSpan}>
        <div className="flex flex-col items-center justify-center py-10">
          <div className="rounded-full bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center shadow-sm mb-4 w-20 h-20">
            <SearchX size={40} className="text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{message}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mx-auto mt-1 max-w-sm">
              We couldn't find any data matching your current criteria. Try adjusting your filters
              or reloading the page.
            </p>
          </div>
        </div>
      </td>
    </tr>
  );
};
