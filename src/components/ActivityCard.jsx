import { useState } from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isDeleting, setIsDeleting] = useState(false);
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
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group p-4 rounded-xl bg-background/60 border border-border/50 shadow-sm transition-all hover:bg-background/80 hover:shadow-md relative overflow-hidden"
    >
      <div className="flex justify-between items-center mb-1.5 border-b border-border/40 pb-1 h-7">
        
        {/* Render dynamically calculated title */}
        <div className="text-[10px] font-bold uppercase tracking-widest text-primary/80">
          {itemTitle}
        </div>
        
        {/* Action Buttons: Concealed by default, revealed on hover for a pristine micro-interaction UX */}
        <div className="flex gap-1 shrink-0 items-center">
          <AnimatePresence mode="wait">
            {!isDeleting ? (
              <motion.div 
                key="actions"
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 5 }}
                className="flex gap-1 opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              >
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
                
                {/* Delete Button: Triggers the confirmation state */}
                <button 
                  onClick={() => setIsDeleting(true)}
                  className="p-1 hover:bg-destructive/10 rounded text-destructive transition-colors"
                  title="Delete Entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="confirm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2 bg-destructive/10 px-2 py-0.5 rounded-lg border border-destructive/20"
              >
                <span className="text-[10px] font-bold text-destructive uppercase tracking-tighter">Delete?</span>
                <div className="flex gap-1">
                  <button 
                    onClick={() => deleteNote(item.key)}
                    className="p-1 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors shadow-sm"
                    title="Confirm Delete"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => setIsDeleting(false)}
                    className="p-1 bg-background border border-border rounded-md hover:bg-muted transition-colors shadow-sm"
                    title="Cancel"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Activity Content Body */}
      <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed mt-2">
        {item.val}
      </div>
    </motion.div>
  );
}
