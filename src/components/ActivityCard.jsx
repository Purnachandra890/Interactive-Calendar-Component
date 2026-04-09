import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';

/**
 * ActivityCard Component
 * 
 * Represents a single mapped activity item (either a daily journal entry or a scheduled range).
 * It displays the specific date(s), the logged content, and provides interactive action buttons 
 * to either edit or delete the specific entry.
 * 
 * @param {Object} props
 * @param {Object} props.item - The data object containing the note's key, endKey, val (text content), and type.
 * @param {Function} props.deleteNote - Function to permanently delete the note from local storage/context.
 * @param {Function} props.setSelection - Function to update the parent calendar's active date selection to enable editing.
 */
export function ActivityCard({ item, deleteNote, setSelection }) {
  let itemTitle = '';
  
  // Conditionally format the title label based on the explicit type of the recorded note
  if (item.type === 'general') {
    itemTitle = 'General';
  } else if (item.type === 'range') {
    const [s, e] = item.key.split('_');
    itemTitle = `${format(new Date(s), 'MMM d')} - ${format(new Date(e), 'MMM d')}`;
  } else if (item.key !== item.endKey) {
    // If consecutive standalone daily logs were grouped into one, visualize the span
    itemTitle = `${format(new Date(item.key), 'MMM d')} - ${format(new Date(item.endKey), 'MMM d')}`;
  } else {
    // Standard single-day diary formatting
    itemTitle = format(new Date(item.key), 'MMM d, yyyy');
  }

  return (
    <div className="group p-4 rounded-xl bg-background/60 border border-border/50 shadow-sm transition-all hover:bg-background/80 hover:shadow-md relative overflow-hidden">
      <div className="flex justify-between items-start mb-1.5 border-b border-border/40 pb-1">
        
        {/* Render dynamically calculated title */}
        <div className="text-[10px] font-bold uppercase tracking-widest text-primary/80">
          {itemTitle}
        </div>
        
        {/* Action Buttons: Concealed by default, revealed on hover for a pristine micro-interaction UX */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          
          {/* Edit Button: Seamlessly syncs the calendar selection bounds to unlock the editor view */}
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
          
          {/* Delete Button: Triggers immediate removal of the node from storage */}
          <button 
            onClick={() => deleteNote(item.key)}
            className="p-1 hover:bg-destructive/10 rounded text-destructive transition-colors"
            title="Delete Entry"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      
      {/* Activity Content Body */}
      <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
        {item.val}
      </div>
    </div>
  );
}
