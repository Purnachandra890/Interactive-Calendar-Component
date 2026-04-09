import { format, isToday, isSameMonth } from 'date-fns';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { HOLIDAYS } from '../config/holidays';

const getHolidayStyles = (type) => {
  switch(type) {
    case 'national': 
      return { bg: 'bg-orange-500/15 dark:bg-orange-500/20', border: 'border border-orange-500/30', dot: 'bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.6)]' };
    case 'festival': 
      return { bg: 'bg-amber-500/15 dark:bg-amber-500/20', border: 'border border-amber-500/30', dot: 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]' };
    case 'cultural': 
    default: 
      return { bg: 'bg-blue-500/15 dark:bg-blue-500/20', border: 'border border-blue-500/30', dot: 'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.6)]' };
  }
};

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
  const holiday = _isSameMonth ? HOLIDAYS[format(day, 'yyyy-MM-dd')] : null;
  const hStyle = holiday ? getHolidayStyles(holiday.type) : null;

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

            {/* Holiday Background */}
            {holiday && !_isToday && !(isSelectedStart || isSelectedEnd) && (
              <div className={cn("absolute inset-0 rounded-full transition-colors", hStyle.bg, hStyle.border)} />
            )}
            
            {/* Today + Holiday Combined Highlights */}
            {holiday && _isToday && !(isSelectedStart || isSelectedEnd) && (
               <div className={cn("absolute inset-0 rounded-full border border-dashed transition-colors", hStyle.border)} />
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

      {/* Holiday Tooltip (Triggers on cell hover) */}
      {holiday && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 -translate-y-1 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none flex flex-col items-center">
          <div className="bg-foreground/95 backdrop-blur-sm text-background text-[10px] sm:text-xs whitespace-nowrap px-2.5 py-1.5 rounded-lg shadow-xl font-medium tracking-wide flex items-center gap-1.5">
            <span>{holiday.name}</span>
            <span className="text-sm">{holiday.icon}</span>
          </div>
          {/* Pointer Triangle */}
          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-foreground/95 -mt-px" />
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
