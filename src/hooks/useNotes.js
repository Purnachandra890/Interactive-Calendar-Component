import { useState, useEffect } from 'react';

/**
 * Custom hook to manage saving and retrieving user calendar notes.
 * Connects directly to window.localStorage to persist data across browser sessions.
 */
export function useNotes() {
  // Initialize state by trying to parse existing notes from localStorage
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('calendar_notes');
    return saved ? JSON.parse(saved) : {};
  });

  // Automatically synchronize React state with localStorage whenever the notes change
  useEffect(() => {
    localStorage.setItem('calendar_notes', JSON.stringify(notes));
  }, [notes]);

  /**
   * Saves or updates a note associated with a specific date range key.
   * @param {string} key - Unique identifier (usually the ISO date range string)
   * @param {string} text - The note content
   */
  const saveNote = (key, text) => {
    setNotes(prev => ({ ...prev, [key]: text }));
  };

  /**
   * Safely retrieves a note for a given key, defaulting to empty string.
   */
  const getNote = (key) => {
    return notes[key] || '';
  };

  /**
   * Deletes a note entirely using the specific date range key.
   */
  const deleteNote = (key) => {
    setNotes(prev => {
      const newNotes = { ...prev };
      delete newNotes[key]; // Mutate the copy to avoid strictly prohibited direct state mutation
      return newNotes;
    });
  };

  return {
    notes,
    saveNote,
    getNote,
    deleteNote
  };
}
