import { useState, useEffect } from 'react';
import { Zap, Settings2, Check, X, Plus } from 'lucide-react';

/**
 * DailyJournalQuickMemos Component
 * 
 * A granular sub-component specifically bound to the Daily Journal system.
 * It strictly manages the user's recurrent "Common Logs" (tag chips). It handles its own independent
 * internal state and persists directly to localStorage so it doesn't cause unnecessary parent re-renders.
 * 
 * @param {Object} props
 * @param {Function} props.onAddMemo - Callback fired when a user presses a log chip to append it to the main journal body.
 */
export function DailyJournalQuickMemos({ onAddMemo }) {
  // Initialize state eagerly from LocalStorage for seamless data persistence
  const [quickMemos, setQuickMemos] = useState(() => {
    // We use a new key 'common_logs_v2' so the updated defaults show up immediately for existing users
    const saved = localStorage.getItem('common_logs_v2');
    return saved ? JSON.parse(saved) : [
      "I did a graph topic from Striver Sheet today", 
      "Solved a Leetcode Daily Challenge"
    ];
  });
  
  // Toggles the settings menu to enable deleting or appending custom logs
  const [isEditingMemos, setIsEditingMemos] = useState(false);
  const [newMemoText, setNewMemoText] = useState('');

  // Auto-sync custom logs back to local storage the exact moment the array mutates
  useEffect(() => {
    localStorage.setItem('common_logs_v2', JSON.stringify(quickMemos));
  }, [quickMemos]);

  return (
    <div className="mb-3 space-y-2 pb-3 border-b border-border/20">
       
       {/* Feature Header and Settings Toggle */}
       <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
         <span className="flex items-center gap-1">
            <Zap className="w-3 h-3"/> Common Logs
         </span>
         <button 
           onClick={() => setIsEditingMemos(!isEditingMemos)} 
           className="hover:text-foreground transition-colors flex items-center gap-1"
           title="Manage Common Logs"
         >
           {isEditingMemos ? <Check className="w-3 h-3" /> : <Settings2 className="w-3 h-3" />}
         </button>
       </div>
       
       {/* Scrollable Container Mapping the Persisted Array */}
       <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
         {quickMemos.map((memo, idx) => (
            <div key={idx} className="group flex items-center bg-background/50 hover:bg-background border border-border/50 rounded-full text-xs transition-all shadow-sm">
              <button 
                onClick={() => onAddMemo(memo)}
                className="px-3 py-1.5 hover:text-primary transition-colors text-left font-medium"
              >
                 {memo}
              </button>
              
              {/* Conditionally Render the Delete specific to this iteration during 'edit mode' */}
              {isEditingMemos && (
                <button 
                   className="pr-3 pl-1 py-1.5 text-muted-foreground hover:text-destructive transition-colors" 
                   onClick={() => setQuickMemos(prev => prev.filter((_, i) => i !== idx))}
                   title="Remove"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
         ))}
         
         {/* Inline Input Field to dynamically append fresh elements to the state array */}
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
                   setNewMemoText(''); // Flush input upon success
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
  );
}
