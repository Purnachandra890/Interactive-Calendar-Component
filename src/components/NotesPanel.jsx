import { useState, useEffect } from 'react';
import { format, isAfter, startOfToday, endOfToday } from 'date-fns';
import { NotebookPen, Save, Info, ChevronLeft, Zap, Settings2, Check, X, Plus, Pencil, Trash2 } from 'lucide-react';
import { HOLIDAYS } from '../config/holidays';

export function NotesPanel({
  currentMonth,
  startDate,
  endDate,
  notes,
  saveNote,
  deleteNote,
  clearSelection,
  onDateClick,
  setSelection,
  activeTab,
  setActiveTab
}) {
  const [text, setText] = useState('');
  const isMonthView = !startDate && !endDate;
  const isSingleDateView = startDate && !endDate;
  const isFutureSingleDate = isSingleDateView && isAfter(startDate, endOfToday());
  const activeHoliday = isSingleDateView ? HOLIDAYS[format(startDate, 'MM-dd')] : null;

  const [quickMemos, setQuickMemos] = useState(() => {
    const saved = localStorage.getItem('quick_memos_v1');
    return saved ? JSON.parse(saved) : ["Took a break today ☕", "Worked extra two paid hours ⏱️"];
  });
  const [isEditingMemos, setIsEditingMemos] = useState(false);
  const [newMemoText, setNewMemoText] = useState('');

  useEffect(() => {
    localStorage.setItem('quick_memos_v1', JSON.stringify(quickMemos));
  }, [quickMemos]);

  
  // Determine the key for the current selection
  const getKey = () => {
    if (startDate && endDate) {
      return `${format(startDate, 'yyyy-MM-dd')}_${format(endDate, 'yyyy-MM-dd')}`;
    }
    if (startDate) {
      return format(startDate, 'yyyy-MM-dd');
    }
    if (currentMonth) {
      return format(currentMonth, 'yyyy-MM');
    }
    return 'general';
  };

  const currentKey = getKey();
  const [savedStatus, setSavedStatus] = useState('saved');

  // Load note text when selection changes
  useEffect(() => {
    setText(notes[currentKey] || '');
    setSavedStatus('saved');
  }, [currentKey]); // Intentionally omitting `notes` so auto-saving doesn't clash with typed text

  // Auto-save logic
  useEffect(() => {
    if (savedStatus === 'saving') {
      const handler = setTimeout(() => {
        saveNote(currentKey, text);
        setSavedStatus('saved');
      }, 600);
      return () => clearTimeout(handler);
    }
  }, [text, currentKey, saveNote, savedStatus]);

  const handleChange = (e) => {
    setText(e.target.value);
    setSavedStatus('saving');
  };

  const handleSave = () => {
    saveNote(currentKey, text);
    setSavedStatus('saved');
  };

  let title = "General Activities";
  if (startDate && endDate) {
    title = `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`;
  } else if (startDate) {
    title = `Journal: ${format(startDate, 'MMMM d')}`;
  } else if (currentMonth) {
    title = `${format(currentMonth, 'MMMM yyyy')} Log`;
  }



  // Auto-switch tab based on content availability
  useEffect(() => {
    if (isMonthView) {
      const monthStr = format(currentMonth, 'yyyy-MM');
      const hasSchedules = Object.keys(notes).some(key => key.includes('_') && key.startsWith(monthStr.substring(0, 4))); // Simple heuristic
      const hasDiary = Object.keys(notes).some(key => !key.includes('_') && key.startsWith(monthStr));
      
      if (!hasDiary && hasSchedules) setActiveTab('schedules');
      else if (hasDiary && !hasSchedules) setActiveTab('diary');
    }
  }, [currentMonth, isMonthView]); // Run when month changes

  if (isMonthView) {
    const monthStr = format(currentMonth, 'yyyy-MM');
    const rawNotes = Object.entries(notes)
      .filter(([key, val]) => {
        if (!val.trim()) return false;
        if (key === monthStr) return true;
        if (key.startsWith(monthStr) && key !== monthStr) return true;
        if (key.includes('_')) {
          const [s, e] = key.split('_');
          return s.substring(0, 7) <= monthStr && e.substring(0, 7) >= monthStr;
        }
        return false;
      })
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

    // Grouping logic for consecutive days with same note
    const groupedNotes = [];
    let currentGroup = null;

    rawNotes.forEach(([key, val]) => {
      if (key.includes('_') || key === monthStr) {
        groupedNotes.push({ key, val, type: key.includes('_') ? 'range' : 'general' });
        return;
      }
      
      const date = new Date(key);
      if (currentGroup && currentGroup.val === val) {
        // Check if consecutive
        const prevDate = new Date(currentGroup.endKey);
        const diff = (date - prevDate) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          currentGroup.endKey = key;
          return;
        }
      }
      
      currentGroup = { key, endKey: key, val, type: 'daily' };
      groupedNotes.push(currentGroup);
    });

    const schedules = groupedNotes.filter(n => n.type === 'range' || (n.type === 'daily' && n.key !== n.endKey));
    const diaryEntries = groupedNotes.filter(n => n.type === 'daily' && n.key === n.endKey);
    const general = groupedNotes.filter(n => n.type === 'general');
    
    // User preference: General notes come under the diary tab
    const diaryTabContent = [...diaryEntries, ...general];

    const renderActivityCard = (item) => {
      let itemTitle = '';
      if (item.type === 'general') itemTitle = 'General';
      else if (item.type === 'range') {
        const [s, e] = item.key.split('_');
        itemTitle = `${format(new Date(s), 'MMM d')} - ${format(new Date(e), 'MMM d')}`;
      } else if (item.key !== item.endKey) {
        itemTitle = `${format(new Date(item.key), 'MMM d')} - ${format(new Date(item.endKey), 'MMM d')}`;
      } else {
        itemTitle = format(new Date(item.key), 'MMM d, yyyy');
      }

      return (
        <div key={item.key} className="group p-4 rounded-xl bg-background/60 border border-border/50 shadow-sm transition-all hover:bg-background/80 hover:shadow-md relative overflow-hidden">
          <div className="flex justify-between items-start mb-1.5 border-b border-border/40 pb-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary/80">
              {itemTitle}
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => {
                  if (item.type === 'range') {
                    const [s, e] = item.key.split('_');
                    setSelection(new Date(s), new Date(e));
                  } else {
                    setSelection(new Date(item.key), null);
                  }
                }}
                className="p-1 hover:bg-primary/10 rounded text-primary transition-colors"
                title="Edit Entry"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => deleteNote(item.key)}
                className="p-1 hover:bg-destructive/10 rounded text-destructive transition-colors"
                title="Delete Entry"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
            {item.val}
          </div>
        </div>
      );
    };

    return (
      <div className="w-full h-full flex flex-col bg-muted/30 border-t md:border-t-0 md:border-l border-border/40 p-6 overflow-hidden">
        <div className="flex items-center gap-2 mb-4 shrink-0">
          <NotebookPen className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground text-lg tracking-tight">Activity Overview</h3>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-background/40 p-1 rounded-xl mb-6 shrink-0 border border-border/40 backdrop-blur-sm self-start">
          <button
            onClick={() => setActiveTab('schedules')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
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
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
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
        
        {/* Tab Descriptions */}
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

        <div className="flex-1 w-full overflow-y-auto space-y-6 pr-2 -mr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent custom-scroll">
          {groupedNotes.length > 0 ? (
            <>
              {activeTab === 'schedules' ? (
                <div className="space-y-3 animate-in fade-in slide-in-from-right-2 duration-300">
                  {schedules.length > 0 ? schedules.map(renderActivityCard) : (
                    <p className="text-xs text-center text-muted-foreground py-8 italic uppercase tracking-wider opacity-60">No schedules for this month</p>
                  )}
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in slide-in-from-left-2 duration-300">
                  {diaryTabContent.length > 0 ? diaryTabContent.map(renderActivityCard) : (
                    <p className="text-xs text-center text-muted-foreground py-8 italic uppercase tracking-wider opacity-60">No journal entries yet</p>
                  )}
                </div>
              )}
            </>
          ) : (
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

  return (
    <div className="w-full h-full flex flex-col bg-muted/30 border-t md:border-t-0 md:border-l border-border/40 p-6">
        <div className="flex items-center gap-2 mb-6 shrink-0">
          <NotebookPen className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground text-lg">{startDate && endDate ? 'Schedule Overview' : 'Daily Journal'}</h3>
        </div>
        
        {/* Section Descriptions */}
        <div className="mb-4 animate-in fade-in slide-in-from-top-1 duration-500">
          <p className="text-[11px] leading-relaxed text-muted-foreground italic font-medium">
            {startDate && endDate 
              ? "Schedule is a feature where users can plan their upcoming tasks, events, or activities for specific dates."
              : "It helps users track what they did or felt on a particular day."}
          </p>
        </div>
        
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-border/50 px-2 py-1 rounded-md">
            {title}
          </span>
          <button 
            onClick={clearSelection}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline transition-all"
          >
            <ChevronLeft className="w-3 h-3" />
            Back to Overview
          </button>
        </div>

        {/* Holiday Banner (Only for Single Date View where holiday exists) */}
        {activeHoliday && (
          <div className="mb-4 bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary p-3 rounded-r-xl flex items-center gap-3 animate-in fade-in slide-in-from-left-2 shadow-sm">
            <span className="text-2xl drop-shadow-sm animate-pulse">{activeHoliday.icon}</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Special Occasion</p>
              <p className="text-sm font-semibold text-foreground tracking-tight">{activeHoliday.name}</p>
            </div>
          </div>
        )}

        {/* Future Date Warning */}
        {isFutureSingleDate && (
          <div className="mb-4 bg-amber-500/10 border-l-4 border-amber-500 p-3 rounded-r-xl flex items-center gap-3 animate-in fade-in slide-in-from-left-2 shadow-sm">
            <Info className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">Future Journal</p>
              <p className="text-xs font-medium text-amber-800 tracking-tight">Journal entries can only be written for today or past dates.</p>
            </div>
          </div>
        )}

        {/* Quick Memos Section */}
        {isSingleDateView && !isFutureSingleDate && (
          <div className="mb-3 space-y-2 pb-3 border-b border-border/20">
             <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
               <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3"/> Common Logs
               </span>
               <button 
                 onClick={() => setIsEditingMemos(!isEditingMemos)} 
                 className="hover:text-foreground transition-colors flex items-center gap-1"
               >
                 {isEditingMemos ? <Check className="w-3 h-3" /> : <Settings2 className="w-3 h-3" />}
               </button>
             </div>
             
             <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
               {quickMemos.map((memo, idx) => (
                  <div key={idx} className="group flex items-center bg-background/50 hover:bg-background border border-border/50 rounded-full text-xs transition-all shadow-sm">
                    <button 
                      onClick={() => {
                          const newText = text ? `${text}\n- ${memo}` : `- ${memo}`;
                          setText(newText);
                          setSavedStatus('saving');
                      }}
                      className="px-3 py-1.5 hover:text-primary transition-colors text-left font-medium"
                    >
                       {memo}
                    </button>
                    {isEditingMemos && (
                      <button 
                         className="pr-3 pl-1 py-1.5 text-muted-foreground hover:text-destructive transition-colors" 
                         onClick={() => setQuickMemos(prev => prev.filter((_, i) => i !== idx))}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
               ))}
               
               {isEditingMemos && (
                 <div className="flex items-center gap-1.5 w-full mt-1.5 animate-in fade-in slide-in-from-top-1">
                   <input 
                     type="text" 
                     value={newMemoText}
                     onChange={e => setNewMemoText(e.target.value)}
                     className="flex-1 text-xs bg-background/80 border border-primary/30 rounded-full px-3 py-1.5 focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                     placeholder="Add common log..."
                     onKeyDown={e => {
                       if (e.key === 'Enter' && newMemoText.trim()) {
                         setQuickMemos(prev => [...prev, newMemoText.trim()]);
                         setNewMemoText('');
                       }
                     }}
                   />
                   <button 
                     onClick={() => {
                       if (newMemoText.trim()) {
                         setQuickMemos(prev => [...prev, newMemoText.trim()]);
                         setNewMemoText('');
                       }
                     }}
                     className="text-xs bg-primary text-primary-foreground p-1.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-sm flex items-center justify-center shrink-0"
                   >
                     <Plus className="w-3 h-3" />
                   </button>
                 </div>
               )}
             </div>
          </div>
        )}

      <textarea
        value={text}
        onChange={handleChange}
        disabled={isFutureSingleDate}
        placeholder={isFutureSingleDate ? "Future journal entries are locked..." : (startDate && endDate ? "Plan your schedule for these dates..." : "How was your day? Write in your journal...")}
        className={`flex-1 w-full resize-none rounded-lg border-none bg-transparent focus:ring-0 p-0 text-foreground placeholder:text-muted-foreground/60 transition-colors focus-visible:outline-none custom-scroll ${isFutureSingleDate ? 'opacity-50 cursor-not-allowed' : ''}`}
      />

      <div className="mt-4 flex justify-between items-center border-t border-border/40 pt-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Info className="w-3.5 h-3.5" />
          <span>{savedStatus === 'saving' ? 'Saving...' : 'Auto-saved'}</span>
        </div>
        <button
          onClick={handleSave}
          disabled={isFutureSingleDate}
          className={`flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 shadow-md hover:shadow-lg active:shadow-sm ${isFutureSingleDate ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
        >
          <Save className="w-4 h-4" />
          {startDate && endDate ? 'Save Schedule' : 'Save Journal'}
        </button>
      </div>
    </div>
  );
}
