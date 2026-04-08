import { useState } from 'react';
import { 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameDay, 
  isBefore, 
  isAfter, 
  eachDayOfInterval,
  startOfDay
} from 'date-fns';

/**
 * Custom hook to manage the state and logic of the interactive calendar.
 * Handles month navigation, date range boundary selection, and hover states.
 * Extracting this logic here keeps the components clean and purely presentational.
 *
 * @param {Date} initialDate - The starting date for the calendar context
 */
export function useCalendar(initialDate = new Date()) {
  // Tracks the currently viewed month in the calendar UI
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(initialDate));
  
  // State storing the beginning of a user's selected date range
  const [startDate, setStartDate] = useState(null);
  
  // State storing the end of a user's selected date range
  const [endDate, setEndDate] = useState(null);
  
  // State tracking the date actively hovered over to preview range selection
  const [hoverDate, setHoverDate] = useState(null);

  // Handlers for month pagination
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  
  // Quick-action to reset the view to the current real-world month
  const jumpToToday = () => {
    setCurrentMonth(startOfMonth(new Date()));
  };

  /**
   * Generates a flat array of dates to render the calendar grid.
   * It includes days from the previous and next months to ensure the grid always starts on Sunday and ends on Saturday.
   */
  const getDaysInMonth = () => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 }); // Start on Sunday
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 }); // End on Saturday
    return eachDayOfInterval({ start, end });
  };

  /**
   * Handle user clicks on a day cell to manage range selection transitions.
   * Follows a 3-step state machine:
   * 1. No start -> Set start
   * 2. Start exists, no end -> Set end (or restart if clicked before start)
   * 3. Both exist -> Restart selection
   */
  const clearSelection = () => {
    setStartDate(null);
    setEndDate(null);
    setHoverDate(null);
  };

  const onDateClick = (day) => {
    if (!startDate) {
      // Step 1: Start a new selection
      setStartDate(day);
      setEndDate(null);
    } else if (startDate && !endDate) {
      // Step 2: Conclude the range, or reset if they clicked backwards
      if (isSameDay(day, startDate)) {
        clearSelection(); // Toggle off if the same start date is clicked again
      } else if (isBefore(day, startDate)) {
        setStartDate(day); // Reset start date if user chooses a preceding day
      } else {
        setEndDate(day); // Complete the valid range
      }
    } else {
      // Step 3: Start over completely
      if (isSameDay(day, startDate) || isSameDay(day, endDate)) {
        clearSelection(); // Toggle off if they click an existing selection boundary
      } else {
        setStartDate(day);
        setEndDate(null);
      }
    }
  };

  /**
   * Handle hover effects strictly during an active range selection.
   * This is used to preview the range before the user confirms the end date.
   */
  const onDateHover = (day) => {
    if (startDate && !endDate) {
      setHoverDate(day);
    } else {
      setHoverDate(null); // Prevent trailing hover states when selection is done
    }
  };

  // Helper checks to determine CSS classes for individual cells
  const isSelectedStart = (day) => startDate && isSameDay(day, startDate);
  const isSelectedEnd = (day) => endDate && isSameDay(day, endDate);
  
  /**
   * Determines if a day falls between the start and end/hover dates.
   * Necessary for rendering the visual highlight connecting the terminal dates.
   */
  const isInRange = (day) => {
    const dayStart = startOfDay(day);
    if (startDate && endDate) {
      return isAfter(dayStart, startOfDay(startDate)) && isBefore(dayStart, startOfDay(endDate));
    }
    // Handle the visual preview before the second click
    if (startDate && hoverDate && !endDate) {
      return isAfter(dayStart, startOfDay(startDate)) && isBefore(dayStart, startOfDay(hoverDate));
    }
    return false;
  };

  return {
    currentMonth,
    nextMonth,
    prevMonth,
    jumpToToday,
    getDaysInMonth,
    startDate,
    endDate,
    hoverDate,
    onDateClick,
    onDateHover,
    isSelectedStart,
    isSelectedEnd,
    isInRange,
    clearSelection,
    setSelection: (start, end) => {
      setStartDate(start);
      setEndDate(end);
    },
  };
}
