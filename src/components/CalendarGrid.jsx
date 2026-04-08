import { format } from 'date-fns';
import { DayCell } from './DayCell';
import { motion, AnimatePresence } from 'framer-motion';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarGrid({
  currentMonth,
  daysInMonth,
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
}) {
  return (
    <div className="w-full flex-1 flex flex-col p-6 max-w-2xl mx-auto">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-4">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-xs font-semibold tracking-wider text-muted-foreground uppercase py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid with animation container for transitions between months */}
      <div className="flex-1 w-full relative">
        {/* We use a simple grid here */}
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
