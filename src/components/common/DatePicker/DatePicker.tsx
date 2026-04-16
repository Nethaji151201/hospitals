import React, { forwardRef, useState, useEffect, useRef, useMemo } from 'react';
import DatePickerBase from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export interface DatePickerValueRange {
  startDate: Date | null;
  endDate: Date | null;
}

export type DatePickerValue = Date | DatePickerValueRange | null;

export interface DatePickerProps {
  mode?: 'single' | 'range';
  value?: DatePickerValue;
  onChange?: (date: DatePickerValue) => void;
  label?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  color?: string; // hex color for the theme, though ideally we use tailwind primary
  dateFormat?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
}

const CustomInput = forwardRef<HTMLButtonElement, any>(
  ({ value, onClick, placeholder, label, color, width, height }, ref) => (
    <div style={{ width }}>
      {label && (
        <label className="block mb-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <button
        type="button"
        ref={ref}
        onClick={onClick}
        className="w-full flex justify-between items-center rounded-xl bg-white dark:bg-sidebar text-left px-3 py-2.5 shadow-sm border focus:outline-none transition-shadow duration-200 ease-in-out"
        style={{
          maxHeight: height,
          borderColor: color,
          color: value ? '#1f2937' : '#8b95a1', /* Can be managed by tailwind dark mode if preferred */
        }}
      >
        <span className="text-sm font-medium dark:text-gray-200">{value || placeholder}</span>
        <span className="opacity-70 text-base">📅</span>
      </button>
    </div>
  )
);

CustomInput.displayName = 'CustomInput';

const DatePicker: React.FC<DatePickerProps> = ({
  mode = 'single',
  value = null,
  onChange = () => {},
  label,
  placeholder = 'Select date',
  minDate,
  maxDate,
  color = '#36c95f',
  dateFormat = 'dd/MM/yyyy',
  className = '',
  width = '100%',
  height = 42
}) => {
  const isRange = mode === 'range';
  const rangeValue = value as DatePickerValueRange;
  const singleValue = value as Date;

  const selectedDate = isRange ? rangeValue?.startDate || null : singleValue || null;
  const startDate = isRange ? rangeValue?.startDate || null : null;
  const endDate = isRange ? rangeValue?.endDate || null : null;

  const handleChange = (next: [Date, Date] | Date | null) => {
    if (isRange) {
      const [nextStart, nextEnd] = (next as [Date, Date]) || [null, null];
      onChange({ startDate: nextStart, endDate: nextEnd });
      return;
    }
    onChange(next as Date | null);
  };

  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowYearDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderCustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
    changeYear
  }: any) => {
    const currentYear = date.getFullYear();
    const currentMonth = date.toLocaleString('default', { month: 'long' });

    return (
      <div
        className="flex justify-between items-center px-4 py-3 rounded-t-2xl relative"
        style={{
          background: `${color}15`,
          borderBottom: `1px solid ${color}22`,
        }}
      >
        <div className="flex gap-1.5 items-center">
          <button
            type="button"
            onClick={() => changeYear(currentYear - 1)}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/80 dark:bg-gray-800/80 shadow-sm font-bold text-lg cursor-pointer border-none"
            style={{ color }}
          >
            ‹‹
          </button>
          <button
            type="button"
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/80 dark:bg-gray-800/80 shadow-sm font-bold text-lg cursor-pointer border-none disabled:opacity-50"
            style={{ color }}
          >
            ‹
          </button>
        </div>

        <div className="text-center flex-1 z-10">
          <div
            className="text-[0.95rem] font-bold tracking-wide"
            style={{ color }}
          >
            {currentMonth}
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowYearDropdown(!showYearDropdown)}
              className="mt-1.5 w-full h-9 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-semibold rounded-lg shadow-sm flex justify-between items-center border cursor-pointer border-transparent"
              style={{ borderColor: `${color}25` }}
            >
              <span>{currentYear}</span>
              <span className="text-xs opacity-60">
                {showYearDropdown ? '▲' : '▼'}
              </span>
            </button>
            {showYearDropdown && (
              <div
                className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-[1000] max-h-48 overflow-y-auto mt-1"
                style={{ border: `1px solid ${color}25` }}
              >
                <div className="flex flex-wrap gap-1 p-2 max-h-[150px] overflow-y-auto">
                  {Array.from({ length: 100 }, (_, index) => 2000 + index).map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => {
                        changeYear(year);
                        setShowYearDropdown(false);
                      }}
                      className={`text-sm py-1.5 px-2 rounded-md transition-colors cursor-pointer border-none min-w-[50px] text-center ${
                        year === currentYear 
                          ? 'font-bold' 
                          : 'font-medium text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      style={year === currentYear ? { background: `${color}20`, color } : {}}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-1.5 items-center">
          <button
            type="button"
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/80 dark:bg-gray-800/80 shadow-sm font-bold text-lg cursor-pointer border-none disabled:opacity-50"
            style={{ color }}
          >
            ›
          </button>
          <button
            type="button"
            onClick={() => changeYear(currentYear + 1)}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/80 dark:bg-gray-800/80 shadow-sm font-bold text-lg cursor-pointer border-none"
            style={{ color }}
          >
            ››
          </button>
        </div>
      </div>
    );
  };

  const calendarCss = useMemo(
    () => `
      .common-date-picker-calendar {
        font-family: inherit;
      }
      .common-date-picker-calendar .react-datepicker__header {
        padding: 0;
        border: none;
        border-radius: 18px 18px 0 0;
        background: transparent;
        position: relative;
      }
      .common-date-picker-calendar .react-datepicker__month-container {
        border-radius: 0 0 18px 18px;
        overflow: hidden;
        box-shadow: rgba(15, 23, 42, 0.14) 0px 24px 60px;
        background-color: var(--color-sidebar, #ffffff);
      }
      .common-date-picker-calendar .react-datepicker__month {
        padding: 18px 22px 22px;
        position: relative;
      }
      .common-date-picker-calendar .react-datepicker__day-names {
        margin-top: 12px;
        color: #6b7280;
      }
      .common-date-picker-calendar .react-datepicker__day-name,
      .common-date-picker-calendar .react-datepicker__day {
        font-weight: 600;
        color: #374151;
      }
      .dark .common-date-picker-calendar .react-datepicker__day-name,
      .dark .common-date-picker-calendar .react-datepicker__day {
        color: #e5e7eb;
      }
      .common-date-picker-calendar .react-datepicker__day--selected,
      .common-date-picker-calendar .react-datepicker__day--keyboard-selected,
      .common-date-picker-calendar .react-datepicker__day--in-range,
      .common-date-picker-calendar .react-datepicker__day--in-selecting-range {
        background-color: ${color} !important;
        color: #fff !important;
        box-shadow: 0 8px 20px rgba(97, 93, 250, 0.18);
      }
      .common-date-picker-calendar .react-datepicker__day--range-start,
      .common-date-picker-calendar .react-datepicker__day--range-end {
        border-radius: 10px !important;
      }
      .common-date-picker-calendar .react-datepicker__day:hover {
        border-radius: 10px !important;
      }
      .common-date-picker-calendar .react-datepicker__triangle {
        display: none;
      }
      .react-datepicker-popper,
      .react-datepicker { 
        z-index: 1100 !important;
      }
      .react-datepicker-wrapper{
        width: 100%;
      }
      .common-date-picker-calendar .react-datepicker__day--selected:hover,
      .common-date-picker-calendar .react-datepicker__day--keyboard-selected:hover {
        background-color: ${color}cc !important;
      }
    `,
    [color]
  );

  return (
    <div className={className} style={{ width }}>
      <style>{calendarCss}</style>
      <DatePickerBase
        selected={selectedDate}
        startDate={startDate}
        endDate={endDate}
        onChange={handleChange as any}
        selectsRange={isRange as any}
        shouldCloseOnSelect={!isRange}
        minDate={minDate}
        maxDate={maxDate}
        dateFormat={dateFormat}
        placeholderText={placeholder}
        renderCustomHeader={renderCustomHeader}
        customInput={
          <CustomInput
            label={label}
            placeholder={placeholder}
            color={color}
            width={width}
            height={height}
          />
        }
        calendarClassName="common-date-picker-calendar"
      />
    </div>
  );
};

export default DatePicker;
