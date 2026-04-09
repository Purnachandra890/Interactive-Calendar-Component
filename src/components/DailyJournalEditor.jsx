import { useState, useEffect } from 'react';
import { format, isAfter, endOfToday } from 'date-fns';
import { NotebookPen, Save, Info, ChevronLeft, Check, X } from 'lucide-react';
import { HOLIDAYS } from '../config/holidays';
import { DailyJournalQuickMemos } from './DailyJournalQuickMemos';
import { useCalendarContext } from '../context/CalendarContext';

/**
 * DailyJournalEditor Component
 * 
 * The main architectural layout serving as the input form/editor whenever the user 
 * selects either a specific day (creating a Daily Journal) or a range of days (creating a Schedule).
 * Internally runs isolated auto-save polling mechanism to ensure data is never lost.
 */
export function DailyJournalEditor({
  initialText,
  currentKey
}) {
  const { startDate, endDate, currentMonth, saveNote, clearSelection } = useCalendarContext();
  const [text, setText] = useState('');
  const [savedStatus, setSavedStatus] = useState('saved'); // 'saved' | 'saving'
  const [showSuccess, setShowSuccess] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Derive behavioral traits dynamically off dates rather than state variables for bulletproof calculations
  const isSingleDateView = startDate && !endDate;
  const isFutureSingleDate = isSingleDateView && isAfter(startDate, endOfToday());
  const activeHoliday = isSingleDateView ? HOLIDAYS[format(startDate, 'yyyy-MM-dd')] : null;

  // React strictly to external prop updates signifying a new node was selected by passing in initial metadata
  useEffect(() => {
    setText(initialText || '');
    setSavedStatus('saved');
    setShowWarning(false);
  }, [currentKey, initialText]);

  /**
   * Continuous Auto-Save Engine
   * Utilizes debouncing (delay mechanisms) to push modifications upward to the main parent state cleanly without firing API commands per-keystroke.
   */
  useEffect(() => {
    if (savedStatus === 'saving') {
      const handler = setTimeout(() => {
        saveNote(currentKey, text);
        setSavedStatus('saved');
      }, 600);
      return () => clearTimeout(handler); // Clears trailing event so rapid typing doesn't cascade
    }
  }, [text, currentKey, saveNote, savedStatus]);

  // Standard textarea change tracking router
  const handleChange = (e) => {
    setText(e.target.value);
    setSavedStatus('saving');
    // Rapidly revoke validation warnings as soon as valid keyboard input registers natively
    if (showWarning && e.target.value.trim()) setShowWarning(false);
  };

  /**
   * Direct manual submission interface validation checkpoint
   */
  const handleSave = () => {
    if (!text.trim()) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 2000); // Pulse warning state out gracefully
      return;
    }
    
    saveNote(currentKey, text);
    setSavedStatus('saved');
    setShowSuccess(true);
    
    // Automatically evict user cleanly from editor interface post-successful explicit submission
    setTimeout(() => {
      setShowSuccess(false);
      clearSelection();
    }, 1500);
  };

  // Handles inserting specific 'Quick Memos' directly into the unified textarea natively
  const handleAddMemo = (memo) => {
    const newText = text ? `${text}\n- ${memo}` : `- ${memo}`;
    setText(newText);
    setSavedStatus('saving');
  };

  // Context-aware Header Titling
  let title = "General Activities";
  if (startDate && endDate) {
    title = `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`;
  } else if (startDate) {
    title = `Journal: ${format(startDate, 'MMMM d')}`;
  } else if (currentMonth) {
    title = `${format(currentMonth, 'MMMM yyyy')} Log`;
  }

  return (
    <div className="w-full h-full flex flex-col bg-muted/30 border-t md:border-t-0 md:border-l border-border/40 p-6">
        
        {/* Editor Title Declaration */}
        <div className="flex items-center gap-2 mb-6 shrink-0">
          <NotebookPen className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground text-lg">{startDate && endDate ? 'Schedule Overview' : 'Daily Journal'}</h3>
        </div>
        
        {/* Helper Context Subtext */}
        <div className="mb-4 animate-in fade-in slide-in-from-top-1 duration-500">
          <p className="text-[11px] leading-relaxed text-muted-foreground italic font-medium">
            {startDate && endDate 
              ? "Schedule is a feature where users can plan their upcoming tasks, events, or activities for specific dates."
              : "It helps users track what they did or felt on a particular day."}
          </p>
        </div>
        
        {/* Breadcrumb Control & View Label Component */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-border/50 px-2 py-1 rounded-md">
            {title}
          </span>
          <button 
            onClick={clearSelection}
            className="tour-back-button flex items-center gap-1 text-xs font-medium text-primary hover:underline transition-all"
            title="Return to visual calendar board"
          >
            <ChevronLeft className="w-3 h-3" />
            Back to Overview
          </button>
        </div>

        {/* Dynamic Holiday Awareness Banner Plugin */}
        {activeHoliday && (
          <div className="mb-4 bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary p-3 rounded-r-xl flex items-center gap-3 animate-in fade-in slide-in-from-left-2 shadow-sm">
            <span className="text-2xl drop-shadow-sm animate-pulse">{activeHoliday.icon}</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Special Occasion</p>
              <p className="text-sm font-semibold text-foreground tracking-tight">{activeHoliday.name}</p>
            </div>
          </div>
        )}

        {/* Form Validation Security Banner disabling logic against incorrect behavior metrics */}
        {isFutureSingleDate && (
          <div className="mb-4 bg-amber-500/10 border-l-4 border-amber-500 p-3 rounded-r-xl flex items-center gap-3 animate-in fade-in slide-in-from-left-2 shadow-sm">
            <Info className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">Future Journal</p>
              <p className="text-xs font-medium text-amber-800 tracking-tight">Journal entries can only be written for today or past dates.</p>
            </div>
          </div>
        )}

        {/* Quick Memos Section specifically bound directly inside the single Day Journal interface */}
        {isSingleDateView && !isFutureSingleDate && (
          <DailyJournalQuickMemos onAddMemo={handleAddMemo} />
        )}

      {/* Main Core Document Interface Logic Mechanism */}
      <textarea
        value={text}
        onChange={handleChange}
        disabled={isFutureSingleDate}
        placeholder={isFutureSingleDate ? "Future journal entries are locked..." : (startDate && endDate ? "Plan your schedule for these dates..." : "How was your day? Write in your journal...")}
        className={`tour-note-input flex-1 w-full resize-none rounded-lg border-none bg-transparent focus:ring-0 p-0 text-foreground placeholder:text-muted-foreground/60 transition-colors focus-visible:outline-none custom-scroll ${isFutureSingleDate ? 'opacity-50 cursor-not-allowed' : ''}`}
      />

      {/* Footer Interface Bar (Reporting metadata + Action Controllers) */}
      <div className="mt-4 flex justify-between items-center border-t border-border/40 pt-4">
        
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Info className="w-3.5 h-3.5" />
          <span>{savedStatus === 'saving' ? 'Saving...' : 'Auto-saved'}</span>
        </div>
        
        {/* Dynamic Context Multi-State Save Action Handler Element */}
        <button
          onClick={handleSave}
          disabled={isFutureSingleDate || showSuccess || showWarning}
          className={`tour-save-button flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg active:shadow-sm ${
            showSuccess 
              ? 'bg-green-500 text-white hover:bg-green-600 scale-95' 
              : showWarning
              ? 'bg-amber-500 text-white hover:bg-amber-600 animate-shake'
              : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
          } ${isFutureSingleDate ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
        >
          {showSuccess ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : showWarning ? (
            <>
              <X className="w-4 h-4" />
              Entry is empty!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {startDate && endDate ? 'Save Schedule' : 'Save Journal'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
