import { useState, useEffect } from 'react';

/**
 * Custom hook to manage saving and retrieving schedule tasks per day.
 * Synchronizes with localStorage like useNotes.
 */
export function useTasks() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('calendar_tasks');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('calendar_tasks', JSON.stringify(tasks));
  }, [tasks]);

  /**
   * Adds a new task appended to a specific date key.
   */
  const addTask = (key, taskPayload) => {
    const newTask = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      completed: false,
      ...taskPayload
    };
    
    setTasks(prev => {
      const currentTasks = prev[key] || [];
      return {
        ...prev,
        [key]: [...currentTasks, newTask].sort((a, b) => a.time.localeCompare(b.time))
      };
    });
  };

  /**
   * Toggles the completion status of a specific task.
   */
  const toggleTaskCompletion = (key, taskId) => {
    setTasks(prev => {
      const currentTasks = prev[key] || [];
      return {
        ...prev,
        [key]: currentTasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
      };
    });
  };

  /**
   * Discards a specific task from a date entirely.
   */
  const deleteTask = (key, taskId) => {
    setTasks(prev => {
      const currentTasks = prev[key] || [];
      return {
        ...prev,
        [key]: currentTasks.filter(t => t.id !== taskId)
      };
    });
  };

  /**
   * Edits the text and time of a specific task.
   */
  const editTask = (key, taskId, updatedTaskPayload) => {
    setTasks(prev => {
      const currentTasks = prev[key] || [];
      const updatedTasks = currentTasks.map(t => 
        t.id === taskId ? { ...t, ...updatedTaskPayload } : t
      ).sort((a, b) => a.time.localeCompare(b.time));
      
      return {
        ...prev,
        [key]: updatedTasks
      };
    });
  };

  /**
   * Returns sorted tasks for a specified day.
   */
  const getTasks = (key) => {
    return tasks[key] || [];
  };

  return {
    tasks,
    addTask,
    toggleTaskCompletion,
    deleteTask,
    editTask,
    getTasks
  };
}
