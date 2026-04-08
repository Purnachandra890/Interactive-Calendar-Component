import { format } from 'date-fns';
import { getThemeForDate } from '../config/themeMapping';

/**
 * HeroSection Component
 * Displays a premium header image that dynamically updates based on the selected month.
 * Provides a strong visual identity for the wall-calendar aesthetic.
 * 
 * @param {Object} props
 * @param {Date} props.currentMonth - The currently viewed month in the calendar
 */
export function HeroSection({ currentMonth }) {
  // Retrieve the theme mapping for the currently active month to get the mapped image URL
  const theme = getThemeForDate(currentMonth);
  
  return (
    <div className="relative w-full h-48 lg:h-full col-span-12 lg:col-span-3 overflow-hidden bg-slate-200">
      {/* 
        The hero image with transition classes.
        Using opacity and transform gives a subtle, premium fade/zoom effect on image change.
      */}
      <img
        key={theme.image} // Adding key forces React to treat new image URLs as new elements, triggering entry animations if set, but simple src change is smoother
        src={theme.image}
        alt={`${theme.name} Theme`}
        className="object-cover w-full h-full absolute inset-0 transition-opacity duration-1000 ease-in-out hover:scale-105 duration-[20s]"
      />

      {/* 
        Soft gradient overlay targeting the bottom edge.
        Ensures the white text remains readable regardless of how bright the underlying image is.
      */}
      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8 transition-opacity duration-700">
        <h1 className="text-white text-5xl font-serif tracking-tight drop-shadow-md">
          {format(currentMonth, 'MMMM')}
        </h1>
        <p className="text-white/90 mt-2 text-lg font-medium drop-shadow-sm flex items-center">
          {format(currentMonth, 'yyyy')}
        </p>
      </div>
    </div>
  );
}
