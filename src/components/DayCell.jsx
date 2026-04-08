import { format, isToday, isSameMonth } from 'date-fns';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export function DayCell({
  day,
  currentMonth,
  isSelectedStart,
  isSelectedEnd,
  isInRange,
  hasNote,
  dayNote,
  onDateClick,
  onDateHover,
  activeTab
}) {
  const _isToday = isToday(day);
  const _isSameMonth = isSameMonth(day, currentMonth);

  let initialMemos = dayNote ? dayNote.split('\n').map(l => l.trim()).filter(l => l.length > 0) : [];
  let quickMemos = initialMemos.filter(line => line.startsWith('- ')).map(line => line.substring(2));
  
  if (quickMemos.length === 0 && initialMemos.length > 0) {
    quickMemos = initialMemos;
  }

  return (
    <button
      onClick={() => onDateClick(day)}
      onMouseEnter={() => onDateHover(day)}
      className={cn(
        "relative w-full h-14 sm:h-16 flex flex-col items-center justify-start pt-2 sm:pt-3 text-sm transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 overflow-hidden",
        !_isSameMonth && "text-muted-foreground/50 opacity-50",
        _isSameMonth && "text-foreground font-medium",
        isInRange && "bg-primary/10",
        (isSelectedStart || isSelectedEnd) && "text-primary-foreground font-bold",
        _isToday && !isSelectedStart && !isSelectedEnd && !isInRange && "text-destructive font-bold"
      )}
    >
      <span className={cn(
        "relative z-10 flex items-center justify-center rounded-full leading-none transition-all w-7 h-7 sm:w-8 sm:h-8",
        _isSameMonth ? "flex" : "hidden",
        _isToday && !isSelectedStart && !isSelectedEnd && !isInRange ? "border border-destructive/30 bg-destructive/10 text-destructive font-bold" : ""
      )}>
        {format(day, 'd')}
      </span>

      {_isSameMonth && quickMemos.length > 0 && activeTab === 'diary' && (
        <div className="absolute inset-x-0.5 sm:inset-x-1 bottom-1.5 sm:bottom-2 flex flex-col gap-[1px] z-10 pointer-events-none items-center justify-end overflow-hidden pb-0.5">
          {quickMemos.slice(0, 1).map((memo, idx) => (
             <div key={idx} className="w-full truncate text-[8px] sm:text-[9px] leading-[1.1] text-center px-0.5 sm:px-1 bg-primary/20 text-foreground dark:text-primary-foreground rounded-sm font-medium">
               {memo}
             </div>
          ))}
          {quickMemos.length > 1 && (
             <div className="text-[7px] sm:text-[8px] leading-none text-muted-foreground font-bold mt-px">+{quickMemos.length - 1}</div>
          )}
        </div>
      )}

      {/* Background for selected states to allow proper rounded edges on range edges */}
      {isSelectedStart && (
        <motion.div 
          layoutId="selectedStart"
          className="absolute right-0 w-1/2 h-full bg-primary/10 -z-10"
        />
      )}
      {isSelectedEnd && (
        <motion.div 
          layoutId="selectedEnd"
          className="absolute left-0 w-1/2 h-full bg-primary/10 -z-10"
        />
      )}
      
      {(isSelectedStart || isSelectedEnd) && (
        <div className="absolute inset-1 rounded-lg bg-primary shadow-md -z-0" />
      )}

      {/* Note Indicator (Visible when Schedules tab is active) */}
      {hasNote && activeTab === 'schedules' && (
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "1.25rem", opacity: 1 }}
          className="mt-1 h-1 rounded-full bg-primary/20 shadow-sm" 
        />
      )}
      
    </button>
  );
}
