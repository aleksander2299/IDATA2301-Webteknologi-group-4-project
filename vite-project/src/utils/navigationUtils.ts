import { NavigateFunction } from 'react-router-dom';

export function formatDateForURL(date: Date | null): string | null {
    if (!date) return null;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Interface for search criteria can be expanded however make sure or null is used if you do since this is supposed to be used for multiple function
export interface CommonSearchCriteria {
    searchTerm?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    roomType?: string | null;
}

/**
 * Navigates to the /search page
 */
export function navigateToSearch(navigate: NavigateFunction, criteria: CommonSearchCriteria): void {
    const formattedFrom = formatDateForURL(criteria.startDate);
    const formattedTo = formatDateForURL(criteria.endDate);

    let url = `/search`;
    const queryParams: string[] = [];

    if (criteria.searchTerm) {
        queryParams.push(`searchTerm=${encodeURIComponent(criteria.searchTerm)}`);
    }
    if (criteria.roomType && criteria.roomType.toLowerCase() !== 'any') {
        queryParams.push(`roomType=${encodeURIComponent(criteria.roomType)}`);
    }
    if (formattedFrom) {
        queryParams.push(`from=${encodeURIComponent(formattedFrom)}`);
    }
    if (formattedTo) {
        queryParams.push(`to=${encodeURIComponent(formattedTo)}`);
    }
    // Add other criteria to queryParams here

    if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
    }
    console.log("Navigating to search with URL:", url);
    navigate(url);
}

/**
 * Navigates to a specific room details page
 */
export function navigateToRoomDetails(
    navigate: NavigateFunction,
    roomId: string,
    startDate?: Date | null,
    endDate?: Date | null
): void {
    const formattedFrom = formatDateForURL(startDate);
    const formattedTo = formatDateForURL(endDate);

    let url = `/room/${roomId}`;
    const queryParams: string[] = [];

    if (formattedFrom) {
        queryParams.push(`from=${encodeURIComponent(formattedFrom)}`);
    }
    if (formattedTo) {
        queryParams.push(`to=${encodeURIComponent(formattedTo)}`);
    }
    if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
    }
    console.log("Navigating to room details with URL:", url);
    navigate(url);
}