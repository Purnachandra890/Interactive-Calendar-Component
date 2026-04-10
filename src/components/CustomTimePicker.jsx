import { useState, useRef, useEffect } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CustomTimePicker
 * 
 * A premium, highly aesthetic custom dropdown substitution for the native HTML time input.
 * Implements smooth entry/exit animations, 12-hour AM/PM formatting for the user, 
 * but maintains standard 24-hour time values for the underlying data layer.
 */
export function CustomTimePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Intelligent blur detection automatically collapsing the menu when clicking away
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Algorithmic generation of 15-minute time intervals across a 24 hour span
  const generateTimeIntervals = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const hh = h.toString().padStart(2, '0');
        const mm = m.toString().padStart(2, '0');
        
        // Aesthetic parsing for presentation
        const displayH = h % 12 || 12;
        const ampm = h < 12 ? 'AM' : 'PM';
        
        times.push({
          value: `${hh}:${mm}`,
          label: `${displayH}:${mm} ${ampm}`
        });
      }
    }
    return times;
  };

  const timeOptions = generateTimeIntervals();
  
  // Cross-reference current selected 24-hr value against the formatting dictionary
  const selectedLabel = timeOptions.find(t => t.value === value)?.label || '';

  // Calculate the index of the selected item to optionally scroll to it (advanced UX, keeping it simple here though)
  
  return (
    <div className="relative w-full" ref={dropdownRef}>
      
      {/* Primary Interaction Button masquerading as an Input */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-background/50 border rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-all flex items-center justify-between shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
          isOpen 
            ? 'border-primary/50 text-foreground ring-2 ring-primary/20 bg-background' 
            : 'border-border/40 text-muted-foreground hover:border-border/80 hover:bg-background/80'
        } ${value ? 'text-foreground' : ''}`}
      >
        <div className="flex items-center gap-2.5">
          <Clock className={`w-4 h-4 transition-colors duration-300 ${value ? 'text-primary' : 'opacity-50'}`} />
          <span className="tracking-tight">{value ? selectedLabel : 'Select time'}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'opacity-50'}`} />
      </button>

      {/* Floating Action Menu mapped via Framer Motion for premium fluidity */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98, filter: 'blur(2px)' }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2 bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="max-h-[240px] overflow-y-auto custom-scroll p-1.5 flex flex-col gap-0.5">
              {timeOptions.map((option) => {
                const isSelected = value === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'hover:bg-primary/10 hover:text-primary text-foreground'
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
