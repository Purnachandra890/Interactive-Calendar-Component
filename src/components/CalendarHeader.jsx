import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export function CalendarHeader({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onJumpToToday
}) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-border/40">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-foreground font-serif tracking-tight">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onJumpToToday}
          className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors flex items-center gap-2 text-sm font-medium mr-2"
          aria-label="Jump to today"
        >
          <CalendarIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Today</span>
        </button>
        <button
          onClick={onPrevMonth}
          className="p-2 hover:bg-muted/80 rounded-full transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={onNextMonth}
          className="p-2 hover:bg-muted/80 rounded-full transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </div>
  );
}
