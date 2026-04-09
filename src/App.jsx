import { useEffect } from 'react';
import { CalendarCard } from './components/CalendarCard';
import { BackgroundAmbiance } from './components/BackgroundAmbiance';
import { useCalendarContext } from './context/CalendarContext';
import { getThemeForDate, monthThemes } from './config/themeMapping';

/**
 * Main application entry point.
 * We hoist the calendar state here so that the background ambiance
 * can dynamically react to the month selected by the user.
 */
function App() {
  // Pull currentMonth from our global context instead of a local hook
  const { currentMonth } = useCalendarContext();
  
  // Extract custom theme colors depending on the selected month
  const theme = getThemeForDate(currentMonth);

  // Preload all month images quietly in the background on initial mount!
  // This guarantees absolutely instant, zero-delay rendering when a user clicks 'Next Month'
  useEffect(() => {
    Object.values(monthThemes).forEach(themeConfig => {
      const img = new Image();
      img.src = themeConfig.image;
    });
  }, []);

  return (
    <div className="min-h-screen relative p-4 md:p-6 flex items-start lg:items-center justify-center overflow-y-auto lg:overflow-hidden">
      {/* 
        Dynamic Image-based Background
        This replaces the old static blobs with an immersive blurred representation
        of the current month's hero image.
      */}
      <BackgroundAmbiance image={theme.image} />
      
      <div className="z-10 w-full relative">
        <main>
          {/* CalendarCard now connects to Context directly! */}
          <CalendarCard />
        </main>
      </div>
    </div>
  );
}

export default App;
