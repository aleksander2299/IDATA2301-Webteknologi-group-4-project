/**
 AI was used to help on the logic transfer between the component and other pages
 Other parts of the component were taken from examples on the API site https://reactdatepicker.com/
 and from a guide https://refine.dev/blog/react-date-picker/
 */

import React, { useState, forwardRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';

// Styles for react-datepicker's calendar
import 'react-datepicker/dist/react-datepicker.css';
import styles from './CustomDatePicker.module.css';


const CalendarIcon = () => (
  <svg
    className={styles.calendarIcon}
    xmlns="http://www.w3.org/2000/svg"
    width="1.5em" // Made slightly larger for easier clicking
    height="1.5em"
    viewBox="0 0 48 48"
  >
    <mask id="ipSApplication0">
      <g fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="4">
        <path strokeLinecap="round" d="M40.04 22v20h-32V22"></path>
        <path
          fill="#fff"
          d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"
        ></path>
      </g>
    </mask>
    <path
      fill="currentColor" // Inherits color from parent CSS
      d="M0 0h48v48H0z"
      mask="url(#ipSApplication0)"
    ></path>
  </svg>
);

function formatDisplayDate(date: Date | null): string {
    if (!date) {
        return '-- / -- / --';
    }
    return date.toLocaleDateString(undefined, {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
    });
}

// Props for the input component
interface CustomButtonProps {
  value?: string; // DatePicker passes the current value, we don't need to display it for an icon
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void; // DatePicker passes this to open/close
  currentDisplayStartDate: Date | null;
  currentDisplayEndDate: Date | null;
  className?: string;
}

// Custom input component
const CustomButton = forwardRef<HTMLDivElement, CustomButtonProps>(
  ({ onClick , currentDisplayStartDate, currentDisplayEndDate , className}, ref) => (
    <div
      role="button"
      className={`${styles.dateRangeDisplayInput} ${className || ''}`}
      onClick={onClick}
      ref={ref}
      aria-label="Select check-in and check-out dates"
    >

      <div className={`${styles.dateSection} ${styles.checkInSection || ''}`}>
          <span className={styles.dateLabel}>Check in</span>
          <span className={styles.dateValue}>{formatDisplayDate(currentDisplayStartDate)}</span>
      </div>
        <div className={styles.separator}></div> {/* Separator class */}
       <div className={styles.dateSection}>
          <span className={styles.dateLabel}>Check out</span>
          <span className={styles.dateValue}>{formatDisplayDate(currentDisplayEndDate)}</span>
       </div>
       <CalendarIcon />
      </div>
  )
);

/**
 --- Props for the main DatePicker component ---
 Made mostly by AI since i couldn't figure out how to reuse the
 Date picker between multiple pages without reusing a lot of code
 */
interface CustomDatePickerProps {
  /** Callback function invoked when a date range is selected */
  onDatesSelected: (selected: { startDate: Date | null; endDate: Date | null }) => void;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
  className?: string;
}


/**
 --- Main Date Picker Component ---
 Made mostly by AI since i couldn't figure out how to reuse the
 Date picker between multiple pages without reusing a lot of code
 */
const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  onDatesSelected,
  initialStartDate,
  initialEndDate,
  className,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);

  useEffect(() => {
    if (initialStartDate !== startDate) {
        setStartDate(initialStartDate || null);
    }
    if (initialEndDate !== endDate) {
        setEndDate(initialEndDate || null);
    }
  }, [initialStartDate, initialEndDate, startDate, endDate]);

  const handleDateChange = (dates: [Date | null, Date | null] | Date | null) => {
    let newStart: Date | null = null;
    let newEnd: Date | null = null;

    if (Array.isArray(dates)) {
      [newStart, newEnd] = dates;
    } else {
      newStart = dates;
    }

    setStartDate(newStart);
    setEndDate(newEnd);
    onDatesSelected({ startDate: newStart, endDate: newEnd });
  };

  return (
    <DatePicker
      selectsRange={true}
      startDate={startDate}
      endDate={endDate}
      onChange={handleDateChange}
      // Prevent dates before current date
      minDate={new Date()}

      // Using Only an Icon as the Trigger
      customInput={<CustomButton
          currentDisplayStartDate = {startDate}
          currentDisplayEndDate = {endDate}
          className = {className}
          />
      }

      popperPlacement="bottom"
      monthsShown={2}
      //isClearable={true}
      shouldCloseOnSelect={false}
      showDisabledMonthNavigation  // Allows navigating through months even if some are disabled.
      placeholderText="Select a date range" // Useful for accessibility if the input was visible
      dateFormat="dd/MM/yyyy"
      weekStartsOn={1}
    />
  );
};

export default CustomDatePicker;