import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CalendarProvider } from '../context/CalendarContext';
import { CalendarCard } from './CalendarCard';
import { format, addDays, startOfMonth, addMonths, subMonths } from 'date-fns';

/**
 * Helper to render the calendar with its required Context Provider
 */
const renderCalendar = () => {
  return render(
    <CalendarProvider>
      <CalendarCard />
    </CalendarProvider>
  );
};

describe('Calendar Component Tests', () => {
  
  it('should mark a date as selected when clicked', async () => {
    renderCalendar();
    
    // 1. Find a date to click (e.g., the 15th of the current month)
    const today = new Date();
    const testDate = new Date(today.getFullYear(), today.getMonth(), 15);
    const dateLabel = format(testDate, 'MMMM d, yyyy');
    
    const dateButton = screen.getByLabelText(dateLabel);
    
    // 2. Click the date
    fireEvent.click(dateButton);
    
    // 3. Verify it has the 'selected' class
    expect(dateButton).toHaveClass('selected');
  });

  it('should highlight a range when start and end dates are selected', async () => {
    renderCalendar();
    
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 10);
    const endDate = new Date(today.getFullYear(), today.getMonth(), 15);
    
    const startLabel = format(startDate, 'MMMM d, yyyy');
    const endLabel = format(endDate, 'MMMM d, yyyy');
    
    const startButton = screen.getByLabelText(startLabel);
    const endButton = screen.getByLabelText(endLabel);
    
    // 1. Click start date
    fireEvent.click(startButton);
    expect(startButton).toHaveClass('range-start');
    
    // 2. Click end date
    fireEvent.click(endButton);
    
    // 3. Verify both have correct classes
    expect(startButton).toHaveClass('range-start');
    expect(endButton).toHaveClass('range-end');
    
    // 4. Verify a date in between is in range
    const middleDate = new Date(today.getFullYear(), today.getMonth(), 12);
    const middleLabel = format(middleDate, 'MMMM d, yyyy');
    const middleButton = screen.getByLabelText(middleLabel);
    expect(middleButton).toHaveClass('in-range');
  });

  it('should update the UI when a note is added', async () => {
    renderCalendar();
    
    // 1. Select a valid date (use today to avoid future-date lock)
    const today = new Date();
    const dateLabel = format(today, 'MMMM d, yyyy');
    
    // Find the date and click it
    const dateButton = screen.getByLabelText(dateLabel);
    fireEvent.click(dateButton);
    
    // 2. Find the textarea (allow more time for transition)
    const textarea = await screen.findByPlaceholderText(/How was your day/i, {}, { timeout: 3000 });
    fireEvent.change(textarea, { target: { value: 'This is a test note' } });
    
    // 3. Click Save button
    const saveButton = screen.getByText(/Save Journal/i);
    fireEvent.click(saveButton);
    
    // 4. Verify the note indicator exists on the calendar
    await waitFor(() => {
      expect(screen.getByText('This is a test note')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  /**
   * INTEGRATION TEST: "The Stand-Out Flow"
   * This simulates a real user selecting a range and adding a schedule.
   */
  it('should complete a full Schedule Flow: Select Range -> Add Note -> Verify Indicator', async () => {
    renderCalendar();

    // 1. Select Start Date (e.g., allow past dates or today)
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 2);
    const endDate = new Date(today.getFullYear(), today.getMonth(), 4);
    
    fireEvent.click(screen.getByLabelText(format(startDate, 'MMMM d, yyyy')));
    fireEvent.click(screen.getByLabelText(format(endDate, 'MMMM d, yyyy')));

    // 2. Fill in the Schedule note
    const textarea = await screen.findByPlaceholderText(/Plan your schedule/i, {}, { timeout: 3000 });
    fireEvent.change(textarea, { target: { value: 'Vacation Trip' } });

    // 3. Save the schedule
    const saveButton = screen.getByText(/Save Schedule/i);
    fireEvent.click(saveButton);

    // 4. Wait for the 1.5s redirection timeout
    await screen.findByText(/Activity Overview/i, {}, { timeout: 5000 });
    
    // 5. Switch to schedules tab
    const schedulesTab = screen.getByRole('button', { name: /Schedules/i });
    fireEvent.click(schedulesTab);

    // 6. Verify the note is recorded (using findBy to wait for Framer Motion animations)
    const recordedNote = await screen.findByText(/Vacation Trip/i, {}, { timeout: 3000 });
    expect(recordedNote).toBeInTheDocument();
  });

  /**
   * NAVIGATION TEST
   */
  it('should navigate to next and previous months and jump to today', async () => {
    renderCalendar();

    const today = new Date();
    const nextMonth = addMonths(today, 1);
    const prevMonth = subMonths(today, 1);

    const currentMonthLabel = format(today, 'MMMM yyyy');
    const nextMonthLabel = format(nextMonth, 'MMMM yyyy');
    const prevMonthLabel = format(prevMonth, 'MMMM yyyy');

    // 1. Initial State
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent(currentMonthLabel);

    // 2. Next Month
    const nextBtn = screen.getByRole('button', { name: /Next month/i });
    fireEvent.click(nextBtn);
    expect(heading).toHaveTextContent(nextMonthLabel);

    // 3. Previous Month (clicked twice to go past current month)
    const prevBtn = screen.getByRole('button', { name: /Previous month/i });
    fireEvent.click(prevBtn); // Back to today's month
    fireEvent.click(prevBtn); // Back to previous month
    expect(heading).toHaveTextContent(prevMonthLabel);

    // 4. Jump to Today
    const todayBtn = screen.getByRole('button', { name: /Jump to today/i });
    fireEvent.click(todayBtn);
    expect(heading).toHaveTextContent(currentMonthLabel);
  });

  /**
   * SELECTION TOGGLE TEST
   */
  it('should clear selection when the same start date is clicked twice', async () => {
    renderCalendar();

    const today = new Date();
    const dateLabel = format(today, 'MMMM d, yyyy');
    const dateButton = screen.getByLabelText(dateLabel);

    // Click once to select
    fireEvent.click(dateButton);
    expect(dateButton).toHaveClass('selected');

    // Click again to deselect
    fireEvent.click(dateButton);
    expect(dateButton).not.toHaveClass('selected');
  });

  /**
   * VALIDATION TEST
   */
  it('should show a warning when attempting to save an empty note', async () => {
    renderCalendar();

    // 1. Open editor
    const today = new Date();
    const dateLabel = format(today, 'MMMM d, yyyy');
    fireEvent.click(screen.getByLabelText(dateLabel));

    // Wait for the textarea to be available
    await screen.findByPlaceholderText(/How was your day/i, {}, { timeout: 3000 });

    // 2. Attempt to save an explicitly empty value
    const saveButton = screen.getByText(/Save Journal/i);
    fireEvent.click(saveButton);

    // 3. Verify the button morphs into warning state
    const warningText = await screen.findByText(/Entry is empty!/i);
    expect(warningText).toBeInTheDocument();
  });

});
