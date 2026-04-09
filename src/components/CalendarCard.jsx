import React from 'react';
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
  return (
    <div className="w-full max-w-6xl mx-auto bg-card text-card-foreground rounded-2xl md:rounded-[2rem] shadow-2xl overflow-hidden border border-border/50 backdrop-blur-sm">
      <Onboarding />
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px] h-auto lg:h-[85vh] max-h-none lg:max-h-[800px]">
        {/* Left Side: Hero Image (takes up 4 cols on md, 3 cols on lg) */}
        <HeroSection />

        {/* Middle + Right Side: Calendar & Notes */}
        <div className="col-span-1 md:col-span-12 lg:col-span-9 flex flex-col md:flex-row md:h-full relative min-h-0">
          
          {/* Main Calendar Area */}
          <div className="flex-1 flex flex-col min-w-[320px] min-h-0">
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
  );
}
