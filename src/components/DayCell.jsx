import { format, isToday, isSameMonth } from 'date-fns';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { HOLIDAYS } from '../config/holidays';

export function DayCell({
  day,
  currentMonth,
  isSelectedStart,
  isSelectedEnd,
  isInRange,
  isHoverEnd,
  rangeActive,
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
        "relative w-full h-14 sm:h-16 flex flex-col items-center justify-start pt-1.5 sm:pt-2 text-sm transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 hover:z-50 group",
        !_isSameMonth && "text-muted-foreground/40 opacity-50",
        _isSameMonth && "text-foreground font-medium",
      )}
    >
      {/* Main Date Area: Precision Stack */}
      <div className="relative w-full h-8 sm:h-9 pointer-events-none mb-1">
        
        {/* Layer 1: Background range bar (Full-width behind everything) */}
        <div className="absolute inset-0 flex z-0">
          <div className={cn(
            "h-full w-1/2 transition-colors duration-300",
            (isInRange || isSelectedEnd || isHoverEnd) ? "bg-primary/15" : "bg-transparent"
          )} />
          <div className={cn(
            "h-full w-1/2 transition-colors duration-300",
            (isInRange || (isSelectedStart && (rangeActive || isHoverEnd))) ? "bg-primary/15" : "bg-transparent"
          )} />
        </div>

        {/* Master Anchor: Everything in this box is concentric */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="relative w-8 h-8 sm:w-9 sm:h-9">
            
            {/* Selected Circles */}
            <AnimatePresence>
              {isSelectedStart && (
                <motion.div 
                  layoutId="selectedStartCircle"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-primary shadow-xl"
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isSelectedEnd && (
                <motion.div 
                  layoutId="selectedEndCircle"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-primary shadow-xl"
                />
              )}
            </AnimatePresence>

            {/* Hover Preview */}
            {isHoverEnd && (
              <div className="absolute inset-0 rounded-full bg-primary/30 border border-primary/40 shadow-sm scale-90 opacity-70 backdrop-blur-[2px] transition-all" />
            )}

            {/* Day Number Label (Pinned to exact same inset-0) */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <span className={cn(
                "transition-all duration-300 flex items-center justify-center",
                _isSameMonth ? "opacity-100" : "opacity-0",
                (isSelectedStart || isSelectedEnd || isHoverEnd) ? "text-primary-foreground font-bold" : (
                  _isToday && !isInRange ? "text-primary font-bold bg-primary/10 rounded-full w-full h-full" : "group-hover:bg-primary/10 rounded-full w-full h-full font-medium"
                )
              )}>
                {format(day, 'd')}
              </span>
            </div>
          </div>
        </div>

      </div>

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

      {/* Note: Holiday Marker and Background effects are separated neatly now. */}

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
