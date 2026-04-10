import { format } from 'date-fns';
import { DayCell } from './DayCell';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalendarContext } from '../context/CalendarContext';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * CalendarGrid Component
 * 
 * The primary visualization engine for the calendar interface.
 * Calculates the matrix of day cells, actively evaluates intersection logic to identify
 * which days have existing data/notes saved, and maps them to the `<DayCell />` component.
 * Applies framer-motion logic to yield a smooth CSS transform whenever the month shifts.
 * 
 * @param {Object} props
 */
export function CalendarGrid() {
  const {
    currentMonth,
    getDaysInMonth,
    startDate,
    endDate,
    hoverDate,
    isSelectedStart,
    isSelectedEnd,
    isInRange,
    onDateClick,
    onDateHover,
    notes,
    activeTab,
  } = useCalendarContext();

  const daysInMonth = getDaysInMonth();

  return (
    <div 
      className="tour-calendar-grid w-full flex-1 flex flex-col p-4 md:p-6 max-w-2xl mx-auto"
      onMouseLeave={() => onDateHover(null)}
    >
      
      {/* Weekday headers mapping static abbreviations */}
      <div className="grid grid-cols-7 mb-4">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-xs font-semibold tracking-wider text-muted-foreground uppercase py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid paired with AnimatePresence to create native sliding transitions on month changes */}
      <div className="flex-1 w-full relative">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={currentMonth.toString()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-7 gap-y-1 w-full"
          >
            {daysInMonth.map((day) => {
              const dayStr = format(day, 'yyyy-MM-dd');
              let dayNoteStr = '';
              
              // Expensive mapping check: Identify if the target day contains relevant notes based strictly on the current tab context.
              const hasNote = Object.keys(notes).some(key => {
                if (activeTab === 'diary' && key === dayStr && notes[key].trim() !== '') {
                  dayNoteStr = notes[key];
                  return true;
                }
                if (activeTab === 'schedules' && key.includes('_')) {
                  const [start, end] = key.split('_');
                  if (dayStr >= start && dayStr <= end && notes[key].trim() !== '') {
                    return true;
                  }
                }
                return false;
              });

              return (
                <DayCell
                  key={day.toString()}
                  day={day}
                  currentMonth={currentMonth}
                  isSelectedStart={isSelectedStart(day)}
                  isSelectedEnd={isSelectedEnd(day)}
                  isInRange={isInRange(day)}
                  isHoverEnd={
                    hoverDate && 
                    !endDate && 
                    startDate && 
                    format(day, 'yyyy-MM-dd') === format(hoverDate, 'yyyy-MM-dd') && 
                    day > startDate
                  }
                  rangeActive={!!startDate && (!!endDate || (!!hoverDate && hoverDate > startDate))}
                  hasNote={hasNote}
                  dayNote={dayNoteStr}
                  onDateClick={onDateClick}
                  onDateHover={onDateHover}
                  activeTab={activeTab}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
