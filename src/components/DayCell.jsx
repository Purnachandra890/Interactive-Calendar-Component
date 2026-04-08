import { format, isToday, isSameMonth } from 'date-fns';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { HOLIDAYS } from '../config/holidays';

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
  const holiday = _isSameMonth ? HOLIDAYS[format(day, 'MM-dd')] : null;

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
        "relative w-full h-14 sm:h-16 flex flex-col items-center justify-start pt-2 sm:pt-3 text-sm transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 hover:z-50",
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

      {/* Holiday Marker */}
      {holiday && (
        <div className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 z-30 group/holiday leading-none">
          <span className="text-[10px] sm:text-[13px] drop-shadow-sm transition-transform duration-300 inline-block group-hover/holiday:scale-125 group-hover/holiday:-rotate-12 cursor-pointer">
            {holiday.icon}
          </span>
          {/* Custom Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 sm:mb-1.5 opacity-0 group-hover/holiday:opacity-100 transition-all duration-200 pointer-events-none scale-95 group-hover/holiday:scale-100 ease-out origin-bottom flex flex-col items-center">
            <div className="bg-foreground text-background text-[9px] sm:text-[10px] whitespace-nowrap px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md shadow-md font-medium tracking-wide">
              {holiday.name}
            </div>
            {/* Little Triangle Pointer */}
            <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-foreground -mt-px relative z-10" />
          </div>
        </div>
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
