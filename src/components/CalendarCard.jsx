import React from 'react';
import { useCalendarContext } from '../context/CalendarContext';
import { getThemeForDate } from '../config/themeMapping';
import { HeroSection } from './HeroSection';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { NotesPanel } from './NotesPanel';
import { Onboarding } from './Onboarding';

/**
 * Main wrapper component for the Calendar UI.
 * Integrates the Hero image, Calendar Grid, and Notes Panel into a single cohesive layout.
 * @param {Object} props - Component props
 */
export function CalendarCard() {
  const { currentMonth } = useCalendarContext();
  const theme = getThemeForDate(currentMonth);
  
  // Use the first color blob to dynamically tint the push pin
  const pinColorClass = theme.blobs[0] || 'bg-zinc-700';

  return (
    <div className="w-full max-w-6xl mx-auto relative mt-2 md:mt-4 transition-colors duration-1000">
      {/* Dynamic Push Pin overlapping the calendar edge */}
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-50 pointer-events-none drop-shadow-[0_3px_4px_rgba(0,0,0,0.5)]">
        {/* Simple metallic pin head dynamically colored by theme */}
        <div className={`w-3.5 h-3.5 rounded-full ${pinColorClass} border border-black/40 shadow-[inset_0_1px_3px_rgba(255,255,255,0.6),inset_0_-2px_4px_rgba(0,0,0,0.4)] relative transition-colors duration-1000`}>
            {/* Tiny highlight for spherical realism */}
            <div className="absolute top-[2px] left-[2px] w-1 h-1 rounded-full bg-white/40 blur-[0.5px]" />
        </div>
      </div>

      <div className="w-full bg-card text-card-foreground rounded-2xl md:rounded-[2rem] shadow-[0_12px_24px_-8px_rgba(0,0,0,0.4),_0_4px_8px_-4px_rgba(0,0,0,0.2)] overflow-hidden ring-1 ring-black/5 backdrop-blur-sm">
        <Onboarding />
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px] h-auto lg:h-[85vh] max-h-none lg:max-h-[800px]">
          {/* Left Side: Hero Image (takes up 4 cols on md, 3 cols on lg) */}
          <HeroSection />

          {/* Middle + Right Side: Calendar & Notes */}
          <div className="col-span-1 md:col-span-12 lg:col-span-9 flex flex-col md:flex-row md:h-full relative min-h-0">
            
            {/* Main Calendar Area */}
            <div className="flex-1 flex flex-col min-w-0 md:min-w-[320px] min-h-0">
              <CalendarHeader />
              
              <div className="flex-1 flex items-stretch py-4">
                <CalendarGrid />
              </div>
            </div>

            {/* Side/Bottom Panel for Notes */}
            <div className="w-full md:w-72 lg:w-80 shrink-0 md:h-full relative flex flex-col min-h-0 border-t md:border-t-0 border-border/40">
              <NotesPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
