import React, { useState, useEffect, ReactNode } from 'react';
import CustomDatePicker from '../CustomDatePicker/CustomDatePicker';
// @ts-ignore
import styles from './SearchBar.module.css';

export interface SearchCriteria {
    searchTerm: string;
    startDate: Date | null;
    endDate: Date | null;
    roomType: string;
}

interface SearchBarProps {
    onSearch: (criteria: SearchCriteria) => void;
    initialSearchTerm?: string;
    initialStartDate?: Date | null;
    initialEndDate?: Date | null;
    initialRoomType?: string;
    children?: ReactNode; // To add Filters on specific pages
    className?: string; // For Styling
}

const BASIC_ROOM_TYPES: string[] = [
    'Single',
    'Superior',
    'Standard',
    'Plus',
    'Premium',
    'Deluxe',
    'Executive Suite',
    'Classic',
    'Junior Suite',
    'Suite',
    'Business Class',
    'Moderate',
    'Artist',
    'Club Room'
].sort((a, b) => a.localeCompare(b));

const SearchBar: React.FC<SearchBarProps> = ({
                                                                     onSearch,
                                                                     initialSearchTerm = '',
                                                                     initialStartDate = null,
                                                                     initialEndDate = null,
                                                                     initialRoomType = 'any',
                                                                     children,
                                                                     className,
                                                                 }) => {
    const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
    const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
    const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
    const [roomType, setRoomType] = useState<string>(initialRoomType);

    useEffect(() => {
        setSearchTerm(initialSearchTerm);
    }, [initialSearchTerm]);

    useEffect(() => {
        setStartDate(initialStartDate);
    }, [initialStartDate]);

    useEffect(() => {
        setEndDate(initialEndDate);
    }, [initialEndDate]);

    useEffect(() => {
        setRoomType(initialRoomType);
    }, [initialRoomType]);




    const handleDatesUpdate = (selected: { startDate: Date | null; endDate: Date | null }) => {
        setStartDate(selected.startDate);
        setEndDate(selected.endDate);
    };

    const handleSearchClick = () => {
        onSearch({
            searchTerm: searchTerm.trim(), // Trim whitespace
            startDate,
            endDate,
            roomType,
        });
    };

    return (
        <div className={`${styles.searchBarWrapper} ${className || ''}`}>
            <div className={styles.mainSearchInputs}>
                <div className={styles.inputGroup}>
                    <label htmlFor="searchTermInput" className={styles.inputLabel}>Hotel/Location</label>
                    <input
                        id="searchTermInput"
                        type="text"
                        className={styles.textInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="e.g., Grand Hotel or Oslo"
                    />
                </div>
                <div className={styles.inputGroup} tabIndex={0} >
                    <CustomDatePicker
                        onDatesSelected={handleDatesUpdate}
                        initialStartDate={startDate}
                        initialEndDate={endDate}
                        className={styles.datePickerInput} // Pass class for styling the picker's trigger
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="roomTypeSelect" className={styles.inputLabel}>Room Type</label>
                    <select
                        id="roomTypeSelect"
                        className={styles.selectInput}
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                    >
                        <option value="any">Any Type</option>
                        {BASIC_ROOM_TYPES.map((type) => (
                            <option key={type} value={type.toLowerCase()}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                <button onClick={handleSearchClick} className={styles.searchButton}>
                    Search
                </button>
            </div>

            {/* Addition children depending on page */}
            {children && <div className={styles.additionalFilters}>{children}</div>}
        </div>
    );
};

export default SearchBar;