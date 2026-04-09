import { useEffect } from 'react';
import { format } from 'date-fns';
import { ActivityOverview } from './ActivityOverview';
import { DailyJournalEditor } from './DailyJournalEditor';
import { useCalendarContext } from '../context/CalendarContext';

/**
 * NotesPanel Component (Container Pattern)
 * 
 * This component acts strictly as the Smart Orchestrator. To adhere to the Single Responsibility Principle,
 * NO ui layout logic is done here. Instead, it computes the calendar's active date metadata, evaluates
 * whether the generic Monthly View or specific Editor View is needed, and conditionally renders the correct child.
 */
export function NotesPanel() {
  const {
    currentMonth,
    startDate,
    endDate,
    notes,
    saveNote,
    deleteNote,
    clearSelection,
    onDateClick,
    setSelection,
    activeTab,
    setActiveTab
  } = useCalendarContext();
  // A simple boolean flags the application UI mode
  const isMonthView = !startDate && !endDate;

  /**
   * Determine the unique string key identifier for the current dataset being evaluated
   * These keys correlate directly with how objects are mapped into local storage.
   */
  const getKey = () => {
    if (startDate && endDate) {
      return `${format(startDate, 'yyyy-MM-dd')}_${format(endDate, 'yyyy-MM-dd')}`;
    }
    if (startDate) {
      return format(startDate, 'yyyy-MM-dd'); // Standalone Date Journal
    }
    if (currentMonth) {
      return format(currentMonth, 'yyyy-MM'); // High-Level Month Map
    }
    return 'general';
  };

  const currentKey = getKey();
  // Lazily retrieve data based on dynamically deduced key 
  const initialText = notes[currentKey] || '';

  /**
   * Automatic Tab Switcher logic heuristic:
   * Provides immediate feedback during Monthly view by routing the user aggressively 
   * to whichever Tab (Schedules or Diary) actually contains written data right now.
   */
  useEffect(() => {
    if (isMonthView) {
      const monthStr = format(currentMonth, 'yyyy-MM');
      const hasSchedules = Object.keys(notes).some(key => key.includes('_') && key.startsWith(monthStr.substring(0, 4))); 
      const hasDiary = Object.keys(notes).some(key => !key.includes('_') && key.startsWith(monthStr));
      
      if (!hasDiary && hasSchedules) setActiveTab('schedules');
      else if (hasDiary && !hasSchedules) setActiveTab('diary');
    }
  }, [currentMonth, isMonthView, notes, setActiveTab]);

  // Phase 1: No Dates Selected -> Render The Aggregated Overviews
  if (isMonthView) {
    return (
      <ActivityOverview />
    );
  }

  // Phase 2: Active User Target Selection -> Render The Active Text Editor
  return (
    <DailyJournalEditor
      initialText={initialText}
      currentKey={currentKey}
    />
  );
}
