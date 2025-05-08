/**
 AI was used to help on the logic transfer between the component and other pages
 Other parts of the component were taken from examples on the API site https://reactdatepicker.com/
 */

import React, { useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';

// Styles for react-datepicker's calendar
import 'react-datepicker/dist/react-datepicker.css';
import './IconRangePickerButton.css';

const CalendarIcon = () => (
  <svg
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

interface CustomIconButtonProps {
  value?: string; // DatePicker passes the current value, we don't need to display it for an icon
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void; // DatePicker passes this to open/close
}

const CustomIconButton = forwardRef<HTMLButtonElement, CustomIconButtonProps>(
  ({ onClick, className }, ref) => (
    <button
      type="button"
      className="icon-trigger-button"
      onClick={onClick}
      ref={ref}
      aria-label="Open date range picker"
    >
      <CalendarIcon />
    </button>
  )
);

  return (
    <DatePicker
      selectsRange={true}
      startDate={startDate}
      endDate={endDate}
      onChange={handleDateChange}

      // Prevent dates before current date
      minDate={new Date()}

      // Using Only an Icon as the Trigger
      customInput={<CustomIconButton className={buttonClassName} />}

      popperPlacement="bottom-start"
      monthsShown={2}
      isClearable={true}
      shouldCloseOnSelect={false}
      showDisabledMonthNavigation  // Allows navigating through months even if some are disabled.
      placeholderText="Select a date range" // Useful for accessibility if the input was visible

    />
  );
};

export default CustomDatePicker;