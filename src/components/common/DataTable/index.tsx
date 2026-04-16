import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { ChevronUp, ChevronDown, ArrowDownUp } from 'lucide-react';
import Pagination, { type PaginationProps } from './Pagination';
import { TableSkeleton, EmptyState } from './TableStates';

export interface ColumnDef<T> {
  key: string;
  label: string;
  minWidth?: number;
  resizable?: boolean;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (val: any, row: T, rowIndex: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  headers: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T, index: number) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  serialNumber?: boolean;
  zebra?: boolean;
  enablePagination?: boolean;
  pagination?: Partial<PaginationProps>;
  // Infinite Scroll Props
  enableInfiniteScroll?: boolean;
  apiFunction?: (page: number, limit: number) => Promise<any>;
  pageSize?: number;
  scrollHeight?: string;
  onLoadMore?: (page: number) => void;
}

type SortConfig = { key: string; direction: 'asc' | 'desc' } | null;

export default function DataTable<T extends Record<string, any>>({
  headers,
  data,
  isLoading = false,
  emptyMessage = 'No data found',
  onRowClick,
  selectable = false,
  onSelectionChange,
  serialNumber = true,
  zebra = true,
  enablePagination = true,
  pagination,
  enableInfiniteScroll = false,
  apiFunction,
  pageSize = 50,
  scrollHeight = undefined,
  onLoadMore
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  // Internal Pagination
  const [internalPage, setInternalPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(10);

  // Infinite Scroll States
  const [infiniteScrollData, setInfiniteScrollData] = useState<T[]>([]);
  const [currentApiPage, setCurrentApiPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalRecordsCount, setTotalRecordsCount] = useState<number | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef(null);
  const lastFetchRef = useRef<number>(0);

  useEffect(() => {
    setInternalPage(1);
    if (enableInfiniteScroll) {
      setInfiniteScrollData([]);
      setCurrentApiPage(1);
      setHasMoreData(true);
      setIsLoadingMore(true);

      if (apiFunction) {
        setTimeout(() => {
          fetchNextPage();
        }, 0);
      }
    }
  }, [enableInfiniteScroll, apiFunction]);

  const [widths, setWidths] = useState<Record<string, number>>(() => {
    const w: Record<string, number> = {};
    headers.forEach((h) => {
      if (h.minWidth) w[h.key] = h.minWidth;
      else if (h.resizable) w[h.key] = 150;
    });
    return w;
  });

  const fetchNextPage = useCallback(async () => {
    if (isLoadingMore || !hasMoreData || !apiFunction) return;

    const now = Date.now();
    if (now - lastFetchRef.current < 300) return;
    lastFetchRef.current = now;

    setIsLoadingMore(true);
    try {
      const nextPage = currentApiPage;
      const response = await apiFunction(nextPage, pageSize);

      const newData = response?.data || response || [];
      const total = response?.totalRecords || null;

      setInfiniteScrollData((prev) => [...prev, ...newData]);
      setTotalRecordsCount(total);

      if (newData.length < pageSize) {
        setHasMoreData(false);
      }

      setCurrentApiPage((prev) => prev + 1);
      if (onLoadMore) onLoadMore(nextPage);
    } catch (err) {
      console.error('Error fetching next page:', err);
      setHasMoreData(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMoreData, apiFunction, currentApiPage, pageSize, onLoadMore]);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 200;

    if (isNearBottom && hasMoreData && !isLoadingMore) {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        fetchNextPage();
      }, 200);
    }
  }, [fetchNextPage, hasMoreData, isLoadingMore]);

  useEffect(() => {
    if (!enableInfiniteScroll) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [enableInfiniteScroll, handleScroll]);

  const handleResizeStart = (e: React.MouseEvent, key: string, minW?: number) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = widths[key] || minW || 80;

    const doDrag = (ev: MouseEvent) => {
      window.requestAnimationFrame(() => {
        const newWidth = Math.max(startWidth + (ev.clientX - startX), minW || 60);
        setWidths((prev) => ({ ...prev, [key]: newWidth }));
      });
    };
    const stopDrag = () => {
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;
    setSortConfig((prev) => {
      if (prev?.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        if (prev.direction === 'desc') return null;
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedData = useMemo(() => {
    const sourceData = enableInfiniteScroll ? infiniteScrollData : data;
    const items = [...sourceData];
    if (!sortConfig) return items;
    items.sort((a, b) => {
      let aVal = a[sortConfig.key] ?? '';
      let bVal = b[sortConfig.key] ?? '';
      if (typeof aVal === 'number' && typeof bVal === 'number')
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      const aStr = String(aVal);
      const bStr = String(bVal);
      const cmp = aStr.localeCompare(bStr, undefined, { numeric: true });
      return sortConfig.direction === 'asc' ? cmp : -cmp;
    });
    return items;
  }, [data, sortConfig, enableInfiniteScroll, infiniteScrollData]);

  const finalRenderedData = useMemo(() => {
    if (enableInfiniteScroll) return sortedData;
    if (pagination) return sortedData;
    if (enablePagination) {
      const start = (internalPage - 1) * internalPageSize;
      return sortedData.slice(start, start + internalPageSize);
    }
    return sortedData;
  }, [sortedData, pagination, enablePagination, internalPage, internalPageSize, enableInfiniteScroll]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIndices(new Set(finalRenderedData.map((_, i) => i)));
    } else {
      setSelectedIndices(new Set());
    }
  };

  const handleSelectRow = (index: number) => {
    const next = new Set(selectedIndices);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setSelectedIndices(next);
  };

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(finalRenderedData.filter((_, i) => selectedIndices.has(i)));
    }
  }, [selectedIndices, finalRenderedData, onSelectionChange]);

  const getAlign = (align?: 'left' | 'center' | 'right') => {
    if (align === 'center') return 'text-center';
    if (align === 'right') return 'text-right';
    return 'text-left';
  };

  const isAllSelected = finalRenderedData.length > 0 && selectedIndices.size === finalRenderedData.length;
  const isIndeterminate = selectedIndices.size > 0 && selectedIndices.size < finalRenderedData.length;

  return (
    <div className="w-full flex flex-col rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-sidebar">
      {/* Table wrapper */}
      <div
        ref={enableInfiniteScroll ? scrollContainerRef : null}
        className="w-full relative"
        style={{
          overflowX: 'auto',
          overflowY: enableInfiniteScroll ? 'auto' : 'visible',
          WebkitOverflowScrolling: 'touch',
          ...(enableInfiniteScroll && scrollHeight ? { height: scrollHeight } : {})
        }}
      >
        <table className="w-full border-collapse text-sm text-left table-auto relative min-w-full">
          <colgroup>
            {selectable && <col style={{ width: '50px', minWidth: '50px' }} />}
            {serialNumber && <col style={{ width: '60px', minWidth: '60px' }} />}
            {headers.map((h) => (
              <col
                key={h.key}
                style={{
                  width: widths[h.key] ? `${widths[h.key]}px` : 'auto',
                  minWidth: `${h.minWidth || 80}px`
                }}
              />
            ))}
          </colgroup>

          {/* THEAD */}
          <thead>
            <tr>
              {selectable && (
                <th
                  className={`px-3 py-1.5 text-center ${enableInfiniteScroll ? 'sticky top-0 z-10' : 'relative'} bg-[linear-gradient(135deg,#1e293b_0%,#334155_100%)] dark:bg-slate-800/80 border-r border-white/5`}
                  style={{ width: 50 }}
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 cursor-pointer text-primary border-gray-300 rounded focus:ring-primary"
                    checked={isAllSelected}
                    ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
                    onChange={handleSelectAll}
                  />
                </th>
              )}

              {serialNumber && (
                <th
                  className={`px-3 py-1.5 text-center text-xs  font-semibold uppercase tracking-wider text-white dark:text-gray-400 ${enableInfiniteScroll ? 'sticky top-0 z-10' : 'relative'} bg-[linear-gradient(135deg,#1e293b_0%,#334155_100%)] dark:bg-slate-800/80 border-r border-gray-200/50 dark:border-gray-700/50`}
                  style={{ width: 60 }}
                >
                  S.No
                </th>
              )}

              {headers.map((h) => {
                const isActive = sortConfig?.key === h.key;
                const wStyle = widths[h.key] ? { width: widths[h.key], minWidth: widths[h.key] } : {};
                return (
                  <th
                    key={h.key}
                    onClick={() => handleSort(h.key, h.sortable)}
                    className={`px-3 py-1.5 text-xs font-semibold tracking-wider ${h.sortable ? 'cursor-pointer select-none hover:text-gray-400 dark:hover:text-gray-200 transition-colors' : ''} ${isActive ? 'text-primary' : 'text-white dark:text-gray-400'} ${enableInfiniteScroll ? 'sticky top-0 z-10' : 'relative'} bg-[linear-gradient(135deg,#1e293b_0%,#334155_100%)] dark:bg-slate-800/80 border-r border-gray-200/50 dark:border-gray-700/50`}
                    style={{ ...wStyle }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap">
                        {h.label}
                      </span>
                      {h.sortable && (
                        <span className={`shrink-0 flex items-center ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                          {isActive ? (
                            sortConfig?.direction === 'asc' ? <ChevronUp size={14} className="text-primary" /> : <ChevronDown size={14} className="text-primary" />
                          ) : (
                            <ArrowDownUp size={12} />
                          )}
                        </span>
                      )}
                    </div>

                    {/* Resize handle */}
                    {h.resizable && (
                      <div
                        onMouseDown={(e) => handleResizeStart(e, h.key, h.minWidth || 60)}
                        className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize z-20 flex items-center justify-center group"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="w-[2px] h-[50%] bg-gray-300 dark:bg-gray-600 rounded-sm group-hover:bg-primary transition-colors" />
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
            {/* thin accent line under header */}
            <tr>
              <td
                colSpan={headers.length + (selectable ? 1 : 0) + (serialNumber ? 1 : 0)}
                className="h-[2px] bg-primary rounded-t-sm p-0 m-0"
              />
            </tr>
          </thead>

          {/* TBODY */}
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
            {isLoading || (enableInfiniteScroll && isLoadingMore && infiniteScrollData.length === 0) ? (
              <TableSkeleton columns={headers.length + (selectable ? 1 : 0) + (serialNumber ? 1 : 0)} />
            ) : finalRenderedData.length === 0 ? (
              <EmptyState message={emptyMessage} colSpan={headers.length + (selectable ? 1 : 0) + (serialNumber ? 1 : 0)} />
            ) : (
              finalRenderedData.map((row, rowIndex) => {
                const isSelected = selectedIndices.has(rowIndex);
                const isEven = rowIndex % 2 === 0;

                return (
                  <tr
                    key={rowIndex}
                    onClick={() => onRowClick && onRowClick(row, rowIndex)}
                    className={`${onRowClick ? 'cursor-pointer' : ''} ${isSelected ? 'bg-primary/5 dark:bg-primary/10' : (zebra && !isEven) ? 'bg-gray-50/50 dark:bg-gray-800/30' : 'bg-white dark:bg-sidebar'} hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150 ease-in-out`}
                  >
                    {selectable && (
                      <td className="px-3 py-1.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer text-primary border-gray-300 rounded focus:ring-primary"
                          checked={isSelected}
                          onChange={() => handleSelectRow(rowIndex)}
                        />
                      </td>
                    )}

                    {serialNumber && (
                      <td className="px-3 py-1.5 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                        {((pagination?.currentPage || internalPage) - 1) *
                          (pagination?.pageSize || internalPageSize) +
                          rowIndex + 1}
                      </td>
                    )}

                    {headers.map((h) => {
                      const val = row[h.key];
                      return (
                        <td
                          key={h.key}
                          className={`px-3 py-1.5 text-xs md:text-sm text-gray-700 dark:text-gray-200 overflow-hidden text-ellipsis whitespace-nowrap ${getAlign(h.align)}`}
                        >
                          {h.render ? h.render(val, row, rowIndex) : val}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}

            {/* Loading indicator for infinite scroll */}
            {enableInfiniteScroll && isLoadingMore && (
              <tr>
                <td colSpan={headers.length + (selectable ? 1 : 0) + (serialNumber ? 1 : 0)} className="p-6 text-center bg-gray-50/50 dark:bg-sidebar">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-gray-200 dark:border-gray-700 border-t-primary rounded-full animate-spin" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Loading more records...</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* No more records message for infinite scroll */}
      {enableInfiniteScroll && !isLoadingMore && !hasMoreData && infiniteScrollData.length > 0 && (
        <div className="p-4 text-center bg-green-50/50 dark:bg-green-900/10 border-t border-green-100 dark:border-green-800/30 text-green-700 dark:text-green-500 text-sm font-medium">
          ✓ No more records to load
        </div>
      )}

      {/* PAGINATION */}
      {!enableInfiniteScroll && enablePagination && sortedData.length > 0 && !isLoading && (
        <Pagination
          currentPage={pagination?.currentPage || internalPage}
          pageSize={pagination?.pageSize || internalPageSize}
          totalRecords={pagination?.totalRecords || sortedData.length}
          onPageChange={pagination?.onPageChange || ((page) => setInternalPage(page))}
          onPageSizeChange={
            pagination?.onPageSizeChange ||
            ((size) => {
              setInternalPageSize(size);
              setInternalPage(1);
            })
          }
        />
      )}
    </div>
  );
}
