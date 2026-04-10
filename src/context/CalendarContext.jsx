import React, { createContext, useContext, useState } from 'react';
import { useCalendar } from '../hooks/useCalendar';
import { useNotes } from '../hooks/useNotes';
import { useTasks } from '../hooks/useTasks';

// 1. Create the Context
const CalendarContext = createContext();

// 2. Create the Provider
export function CalendarProvider({ children }) {
  // Initialize our custom hooks inside the Provider
  const calendarState = useCalendar();
  const notesState = useNotes();
  const tasksState = useTasks();
  
  // We can also hoist UI-specific state here that many components need
  const [activeTab, setActiveTab] = useState('schedules');

  // Combine them into a single value object
  const value = {
    ...calendarState,
    ...notesState,
    ...tasksState,
    activeTab,
    setActiveTab,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

// 3. Create a custom hook to consume the Context
export function useCalendarContext() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendarContext must be used within a CalendarProvider');
  }
  return context;
}
