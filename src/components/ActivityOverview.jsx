import { format } from 'date-fns';
import { NotebookPen } from 'lucide-react';
import { ActivityCard } from './ActivityCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalendarContext } from '../context/CalendarContext';

/**
 * ActivityOverview Component
 * 
 * Operates as the default UI State when the user is simply looking at the calendar
 * (i.e., NO dates are actively selected). It fetches all saved records for the currently
 * viewed month, groups them logically, and renders them across respective Tabs to prevent visual clutter.
 * 
 * @param {Object} props
 * @param {Date} props.currentMonth - The Date object resolving to the month currently visible on the grid.
 * @param {Object} props.notes - The global dictionary containing all written files/responses.
 * @param {string} props.activeTab - Currently active pane ('schedules' or 'diary').
 * @param {Function} props.setActiveTab - State updating mechanism for the tab navigator.
 * @param {Function} props.setSelection - Escalates a click inside a card back to the parent to trigger the Editor.
 * @param {Function} props.deleteNote - Escalates a deletion handler up the tree.
 */
export function ActivityOverview() {
  const {
    currentMonth,
    notes,
    activeTab,
    setActiveTab,
    setSelection,
    deleteNote
  } = useCalendarContext();
  const monthStr = format(currentMonth, 'yyyy-MM');
  
  // Phase 1: Filter and strictly locate items belonging uniquely to the visualized month
  const rawNotes = Object.entries(notes)
    .filter(([key, val]) => {
      if (!val.trim()) return false; 
      if (key === monthStr) return true; // General month notes
      if (key.startsWith(monthStr) && key !== monthStr) return true; // Diary standalone keys
      if (key.includes('_')) {
        // Range intersection logic validation ensures overlapping schedules safely display
        const [s, e] = key.split('_');
        return s.substring(0, 7) <= monthStr && e.substring(0, 7) >= monthStr;
      }
      return false;
    })
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

  // Phase 2: Heuristic Grouping Logic for Data Normalization
  const groupedNotes = [];
  let currentGroup = null;

  rawNotes.forEach(([key, val]) => {
    if (key.includes('_') || key === monthStr) {
      groupedNotes.push({ key, val, type: key.includes('_') ? 'range' : 'general' });
      return;
    }
    
    // Evaluate if standalone diary logs should be merged sequentially visually
    const date = new Date(key);
    if (currentGroup && currentGroup.val === val) {
      const prevDate = new Date(currentGroup.endKey);
      const diff = (date - prevDate) / (1000 * 60 * 60 * 24);
      if (diff === 1) { // Exact consecutive day found
        currentGroup.endKey = key;
        return;
      }
    }
    
    // Create new root group for completely independent statements
    currentGroup = { key, endKey: key, val, type: 'daily' };
    groupedNotes.push(currentGroup);
  });

  // Phase 3: Segregation constraints specifically separating Daily Journals from Long-Term Schedules
  const schedules = groupedNotes.filter(n => n.type === 'range' || (n.type === 'daily' && n.key !== n.endKey));
  const diaryEntries = groupedNotes.filter(n => n.type === 'daily' && n.key === n.endKey);
  const general = groupedNotes.filter(n => n.type === 'general');
  
  // Design Specification: General Notes seamlessly map inside the Diary view constraint
  const diaryTabContent = [...diaryEntries, ...general];

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col bg-muted/30 md:border-l border-border/40 p-4 md:p-6 overflow-hidden">
      
      {/* Title Bar Context */}
      <div className="flex items-center gap-2 mb-4 shrink-0">
        <NotebookPen className="w-5 h-5 text-muted-foreground" />
        <h3 className="font-semibold text-foreground text-lg tracking-tight">Activity Overview</h3>
      </div>

      {/* Primary Tab Navigation Menu */}
      <div className="flex bg-background/40 p-1 rounded-xl mb-6 shrink-0 border border-border/40 backdrop-blur-sm self-start">
        <button
          onClick={() => setActiveTab('schedules')}
          className={`tour-schedules-tab px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'schedules' 
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'text-muted-foreground hover:bg-border/30 hover:text-foreground'
          }`}
        >
          Schedules
          {schedules.length > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${
              activeTab === 'schedules' ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-border text-muted-foreground'
            }`}>
              {schedules.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('diary')}
          className={`tour-diary-tab px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'diary' 
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'text-muted-foreground hover:bg-border/30 hover:text-foreground'
          }`}
        >
          Daily Journal
          {diaryTabContent.length > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${
              activeTab === 'diary' ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-border text-muted-foreground'
            }`}>
              {diaryTabContent.length}
            </span>
          )}
        </button>
      </div>
      
      {/* Dynamic Tab Helper Descriptions for precise UX feedback */}
      <div className="mb-6 px-1 animate-in fade-in slide-in-from-top-1 duration-500">
        <p className="text-[11px] leading-relaxed text-muted-foreground italic font-medium">
          {activeTab === 'diary' 
            ? "Daily Journal helps you track what you did or felt on a particular day." 
            : "Schedules help you plan your upcoming tasks, events, or activities for specific dates."}
        </p>
      </div>
      
      <div className="mb-4 flex items-center justify-between shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-border/40 px-2.5 py-1 rounded-full">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
      </div>

      {/* Scrollable Main Layout Area for Items Mapping */}
      <div className="flex-1 w-full overflow-y-auto space-y-6 pr-2 -mr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent custom-scroll">
        {groupedNotes.length > 0 ? (
          <AnimatePresence mode="wait">
            {activeTab === 'schedules' ? (
              <motion.div 
                key="schedules-tab"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {schedules.length > 0 ? schedules.map(item => (
                  <ActivityCard key={item.key} item={item} setSelection={setSelection} deleteNote={deleteNote} />
                )) : (
                  <p className="text-xs text-center text-muted-foreground py-8 italic uppercase tracking-wider opacity-60">No schedules for this month</p>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="diary-tab"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {diaryTabContent.length > 0 ? diaryTabContent.map(item => (
                  <ActivityCard key={item.key} item={item} setSelection={setSelection} deleteNote={deleteNote} />
                )) : (
                  <p className="text-xs text-center text-muted-foreground py-8 italic uppercase tracking-wider opacity-60">No journal entries yet</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
           // Empty Application State Configuration
           <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40 py-12">
             <NotebookPen className="w-12 h-12 text-muted-foreground/30 stroke-[1.5]" />
             <div>
                <p className="text-sm font-semibold text-foreground">No activities yet</p>
                <p className="text-[11px] text-muted-foreground max-w-[180px] mt-1">Start by selecting a date range or a single day on the calendar.</p>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}
