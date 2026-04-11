import { useState } from 'react';
import { isBefore, startOfToday } from 'date-fns';
import { Plus, Trash2, Check, Clock, X, Pencil, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalendarContext } from '../context/CalendarContext';
import { CustomTimePicker } from './CustomTimePicker';

/**
 * DailyTasksEditor Component
 * 
 * An aesthetic and functional view specifically tailored for scheduling
 * time-based tasks on a single selected date. Operates entirely independently 
 * of the text-based Journal notes.
 */
export function DailyTasksEditor({ currentKey }) {
  const { getTasks, addTask, toggleTaskCompletion, deleteTask, editTask, startDate } = useCalendarContext();
  const tasks = getTasks(currentKey);
  
  const isPastDate = startDate && isBefore(startDate, startOfToday());
  
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  
  const [editTaskText, setEditTaskText] = useState('');
  const [editTaskTime, setEditTaskTime] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim() || !newTaskTime) return;
    
    addTask(currentKey, {
      text: newTaskText.trim(),
      time: newTaskTime
    });
    
    setNewTaskText('');
    // Intentionally leaving the time input intact to allow users to quickly add multiple tasks around the same time block
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditTaskText(task.text);
    setEditTaskTime(task.time);
  };

  const handleSaveEdit = (taskId) => {
    if (!editTaskText.trim() || !editTaskTime) return;
    editTask(currentKey, taskId, { text: editTaskText.trim(), time: editTaskTime });
    setEditingTaskId(null);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col pt-2 animate-in fade-in duration-500">
      
      {/* Interactive Form Input logic tailored for fast data entry */}
      {!isPastDate ? (
        <form onSubmit={handleAddTask} className="mb-6 flex flex-col gap-2.5">
          <div className="relative w-full">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Add a new task..."
              className="w-full bg-background/50 border border-border/40 rounded-lg pl-4 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium placeholder:text-muted-foreground/60 shadow-sm"
            />
          </div>
          
          <div className="flex gap-2 w-full">
            {/* Premium Custom Time Picker Component */}
            <div className="relative flex-1 shrink-0">
               <div className="hidden sm:block">
                 <CustomTimePicker value={newTaskTime} onChange={setNewTaskTime} />
               </div>
               {/* Mobile Custom Time Layout tracking Native Input */}
               <div className="relative w-full sm:hidden border border-border/40 rounded-lg bg-background/50 shadow-sm focus-within:ring-2 focus-within:ring-primary/40 transition-all">
                 <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
                   <div className={`flex items-center gap-2 ${!newTaskTime ? 'text-muted-foreground' : 'text-foreground font-semibold'}`}>
                     <Clock className={`w-4 h-4 ${!newTaskTime ? 'opacity-70' : 'text-primary'}`} />
                     <span className="text-sm">{newTaskTime || 'Select time'}</span>
                   </div>
                   {!newTaskTime && <ChevronDown className="w-4 h-4 text-muted-foreground opacity-50" />}
                 </div>
                 <input
                   type="time"
                   value={newTaskTime}
                   onChange={(e) => setNewTaskTime(e.target.value)}
                   onClick={(e) => {
                     try { if (e.target.showPicker) e.target.showPicker(); } catch (err) {}
                   }}
                   className="w-full opacity-0 cursor-pointer py-2.5 outline-none pl-3"
                 />
               </div>
            </div>
            
            <button
              type="submit"
              title="Add task"
              disabled={!newTaskText.trim() || !newTaskTime}
              className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg flex items-center justify-center disabled:opacity-50 transition-all hover:bg-primary/90 active:scale-95 shadow-md hover:shadow-lg disabled:hover:shadow-none shrink-0"
            >
              <Plus className="w-5 h-5" />
              <span className="ml-1 text-sm font-semibold hidden sm:inline-block">Add</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 bg-muted/40 border border-border/50 rounded-xl p-4 text-center animate-in fade-in">
          <p className="text-sm font-semibold text-muted-foreground tracking-tight">Past schedule is locked</p>
          <p className="text-[11px] text-muted-foreground/70 mt-1 max-w-[200px] mx-auto leading-relaxed">You can review previous activities, but new tasks cannot be added to past dates.</p>
        </div>
      )}

      {/* Main List Rendering mapped into framer-motion orchestration */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-2 custom-scroll pb-6">
        <AnimatePresence>
          {tasks.length > 0 ? tasks.map((task) => (
            <motion.div
              layout
              key={task.id}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(2px)', transition: { duration: 0.15 } }}
              whileHover={{ scale: 1.01, y: -1 }}
              transition={{ duration: 0.2, layout: { duration: 0.2 } }}
              className={`group flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
                task.completed 
                  ? 'bg-muted/30 border-border/30 opacity-70 shadow-none' 
                  : 'bg-background hover:border-primary/20 hover:shadow-md border-border/60'
              }`}
            >
              {editingTaskId === task.id ? (
                <div className="flex flex-col gap-2.5 w-full animate-in fade-in zoom-in-95 duration-200">
                  <input
                    type="text"
                    value={editTaskText}
                    onChange={(e) => setEditTaskText(e.target.value)}
                    autoFocus
                    className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-inner"
                  />
                  
                  <div className="flex gap-2 w-full border-border/50">
                    <div className="relative flex-1 shrink-0">
                      {/* Mobile Overlay */}
                      <div className="relative sm:hidden w-full bg-background border border-border/60 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-primary/40 transition-all">
                        <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
                          <div className={`flex items-center gap-2 ${!editTaskTime ? 'text-muted-foreground' : 'text-foreground font-semibold'}`}>
                            <Clock className={`w-4 h-4 ${!editTaskTime ? 'opacity-70' : 'text-primary'}`} />
                            <span className="text-sm">{editTaskTime || 'Select time'}</span>
                          </div>
                          {!editTaskTime && <ChevronDown className="w-4 h-4 text-muted-foreground opacity-50" />}
                        </div>
                        <input
                          type="time"
                          value={editTaskTime}
                          onChange={(e) => setEditTaskTime(e.target.value)}
                          onClick={(e) => {
                            try { if (e.target.showPicker) e.target.showPicker(); } catch (err) {}
                          }}
                          required
                          className="w-full opacity-0 cursor-pointer py-2 outline-none pl-3"
                        />
                      </div>
                      {/* Desktop Input */}
                      <input
                        type="time"
                        value={editTaskTime}
                        onChange={(e) => setEditTaskTime(e.target.value)}
                        required
                        className="hidden sm:block w-full bg-background border border-border/60 rounded-lg pl-3 pr-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground font-semibold shadow-sm"
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2 shrink-0">
                      <button onClick={() => setEditingTaskId(null)} className="px-3 py-2 bg-muted/80 hover:bg-muted text-muted-foreground text-xs font-semibold rounded-lg transition-all border border-border/50">Cancel</button>
                      <button onClick={() => handleSaveEdit(task.id)} className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5"><Check className="w-3.5 h-3.5"/> Save</button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Specialized Checkbox Logic */}
                  <button
                    onClick={() => toggleTaskCompletion(currentKey, task.id)}
                    className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all duration-300 border shadow-sm ${
                      task.completed 
                        ? 'bg-primary border-primary text-primary-foreground rotate-0 scale-100' 
                        : 'bg-background border-muted-foreground/30 text-transparent hover:border-primary/60 hover:bg-primary/5 active:scale-90'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 transition-transform duration-300 ${task.completed ? 'scale-100' : 'scale-50'}`} />
                  </button>

                  {/* Time Representation Element */}
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md shrink-0 transition-colors duration-300 ${
                    task.completed ? 'bg-border/40 text-muted-foreground/70' : 'bg-primary/10 text-primary border border-primary/10'
                  }`}>
                    {task.time}
                  </span>

                  {/* Primary Content Label */}
                  <span className={`flex-1 text-sm font-medium break-words whitespace-pre-wrap transition-all duration-300 ${
                    task.completed ? 'line-through text-muted-foreground italic' : 'text-foreground'
                  }`}>
                    {task.text}
                  </span>

                  {/* Action Controllers */}
                  <div className="flex gap-1 shrink-0 items-center">
                    <AnimatePresence mode="wait">
                      {deletingTaskId === task.id ? (
                        <motion.div 
                          key="confirm"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex items-center gap-1 bg-destructive/10 p-1 rounded-lg border border-destructive/20 ml-2 shadow-sm"
                        >
                          <button 
                             onClick={() => deleteTask(currentKey, task.id)}
                             title="Confirm Delete"
                             className="p-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-md transition-colors"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button 
                             onClick={() => setDeletingTaskId(null)}
                             title="Cancel"
                             className="p-1 bg-background hover:bg-muted text-muted-foreground border border-border/50 rounded-md transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="actions"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="opacity-0 group-hover:opacity-100 flex items-center transition-opacity"
                        >
                          <button
                            onClick={() => startEditing(task)}
                            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all shrink-0"
                            title="Edit task"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingTaskId(task.id)}
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all shrink-0 focus:opacity-100"
                            title="Delete task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </motion.div>
          )) : (
            <motion.div 
              key="empty-state"
              initial={{ opacity: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.1 }}
              className="h-full flex flex-col items-center justify-center text-center opacity-70 pb-12"
            >
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4 border border-border/40 shadow-inner">
                 <Clock className="w-8 h-8 text-muted-foreground/60" />
              </div>
              <p className="text-sm font-bold tracking-tight text-foreground">No tasks scheduled</p>
              <p className="text-xs text-muted-foreground mt-1.5 max-w-[200px] leading-relaxed">Assign tasks above to start organizing this day's itinerary.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
