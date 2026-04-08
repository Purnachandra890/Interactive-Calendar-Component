import React from 'react';
import { useNotes } from '../hooks/useNotes';
import { HeroSection } from './HeroSection';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { NotesPanel } from './NotesPanel';

/**
 * Main wrapper component for the Calendar UI.
 * Integrates the Hero image, Calendar Grid, and Notes Panel into a single cohesive layout.
 * @param {Object} props - Component props
 * @param {Object} props.calendarState - The calendar state hoisted from the parent App component
 */
export function CalendarCard({ calendarState }) {
  // Destructure all calendar functionalities and state from the provided prop
  const [activeTab, setActiveTab] = React.useState('diary');
  
  const {
    currentMonth,
    nextMonth,
    prevMonth,
    jumpToToday,
    getDaysInMonth,
    startDate,
    endDate,
    hoverDate,
    onDateClick,
    onDateHover,
    isSelectedStart,
    isSelectedEnd,
    isInRange,
    clearSelection,
  } = calendarState;

  // Manage notes independently as they do not affect the outer layout visual theme natively
  const { notes, saveNote, deleteNote } = useNotes();
  const daysInMonth = getDaysInMonth();

  return (
    <div className="w-full max-w-6xl mx-auto bg-card text-card-foreground rounded-2xl md:rounded-[2rem] shadow-2xl overflow-hidden border border-border/50 backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px] md:h-[85vh] max-h-[800px]">
        {/* Left Side: Hero Image (takes up 4 cols on md, 3 cols on lg) */}
        <HeroSection currentMonth={currentMonth} />

        {/* Middle + Right Side: Calendar & Notes */}
        <div className="col-span-1 md:col-span-8 lg:col-span-9 flex flex-col md:flex-row md:h-full overflow-hidden">
          
          {/* Main Calendar Area */}
          <div className="flex-1 flex flex-col min-w-[320px]">
            <CalendarHeader
              currentMonth={currentMonth}
              onNextMonth={nextMonth}
              onPrevMonth={prevMonth}
              onJumpToToday={jumpToToday}
            />
            
            <div className="flex-1 flex items-stretch py-4">
              <CalendarGrid
                currentMonth={currentMonth}
                daysInMonth={daysInMonth}
                startDate={startDate}
                endDate={endDate}
                hoverDate={hoverDate}
                isSelectedStart={isSelectedStart}
                isSelectedEnd={isSelectedEnd}
                isInRange={isInRange}
                onDateClick={onDateClick}
                onDateHover={onDateHover}
                notes={notes}
                activeTab={activeTab}
              />
            </div>
          </div>

          {/* Side/Bottom Panel for Notes */}
          <div className="w-full md:w-72 lg:w-80 shrink-0 md:h-full overflow-hidden">
            <NotesPanel
              currentMonth={currentMonth}
              startDate={startDate}
              endDate={endDate}
              notes={notes}
              saveNote={saveNote}
              deleteNote={deleteNote}
              clearSelection={clearSelection}
              onDateClick={onDateClick}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
