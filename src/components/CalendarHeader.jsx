import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useCalendarContext } from '../context/CalendarContext';

/**
 * CalendarHeader Component
 * 
 * Provides the top-level navigation controls for the calendar interface.
 * Exposes actions to traverse forward and backward through months, and a 
 * quick-action utility to immediately reset the UI to the current real-world month.
 */
export function CalendarHeader() {
  const {
    currentMonth,
    prevMonth: onPrevMonth,
    nextMonth: onNextMonth,
    jumpToToday: onJumpToToday
  } = useCalendarContext();

  return (
    <div className="flex items-center justify-between p-6 border-b border-border/40">
      
      {/* Month & Year Title Display */}
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-foreground font-serif tracking-tight">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
      </div>
      
      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        
        {/* 'Jump to Today' Utility Button */}
        <button
          onClick={onJumpToToday}
          className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors flex items-center gap-2 text-sm font-medium mr-2 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Jump to today"
        >
          <CalendarIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Today</span>
        </button>
        
        {/* Reversal Arrow */}
        <button
          onClick={onPrevMonth}
          className="p-2 hover:bg-muted/80 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        
        {/* Forward Arrow */}
        <button
          onClick={onNextMonth}
          className="p-2 hover:bg-muted/80 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </div>
  );
}
