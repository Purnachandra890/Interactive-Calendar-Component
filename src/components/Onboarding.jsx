import { useEffect, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { startOfToday, addDays, format } from 'date-fns';
import { useCalendarContext } from '../context/CalendarContext';

export function Onboarding() {
  const contextProps = useCalendarContext();
  const { setActiveTab } = contextProps;
  // Use a ref to always have access to the latest state in driver.js callbacks
  const stateRef = useRef(contextProps);
  stateRef.current = contextProps;

  useEffect(() => {
    // Check if onboarding was already shown
    const hasSeenOnboarding = localStorage.getItem('cal_onboarding_done');
    
    // We only show it if the item is explicitly null/undefined (not set yet)
    if (!hasSeenOnboarding) {

      const today = startOfToday();
      const nextDay = addDays(today, 2);

      // Wait a moment for layout to settle and initial animations to finish
      const timer = setTimeout(() => {
        const driverObj = driver({
          showProgress: true,
          animate: true,
          allowClose: false,
          smoothScroll: true,
          popoverClass: 'driver-onboarding-theme',
          onPopoverRender: (popover) => {
            const closeBtn = popover.wrapper.querySelector('.driver-popover-close-btn');
            if (closeBtn) {
              closeBtn.style.display = 'block';
              closeBtn.addEventListener('click', () => {
                driverObj.destroy();
              });
            }
          },
          steps: [
            {
              popover: {
                title: 'Welcome to your new Calendar! 👋',
                description: 'Let\'s take a quick look around.',
              },
              onNextClick: () => {
                stateRef.current.clearSelection();
                setActiveTab('schedules');
                setTimeout(() => driverObj.moveNext(), 150);
              }
            },
            {
              element: '.tour-calendar-grid',
              popover: {
                title: 'Select a Date Range',
                description: 'You can select a start date and an end date to build a continuous range. <strong>Note: Don\'t click on Next without selecting both the start and end dates on the calendar first!</strong>',
                side: 'left',
                align: 'center'
              },
              onNextClick: () => {
                const { startDate, endDate } = stateRef.current;
                if (!startDate || !endDate) {
                  // Direct DOM manipulation for immediate feedback
                  const popoverDesc = document.querySelector('.driver-popover-description');
                  const popoverTitle = document.querySelector('.driver-popover-title');
                  
                  if (popoverDesc) {
                    popoverDesc.innerHTML = '<strong style="color: #ef4444; display: block; margin-top: 10px;">Please select the start and end date first!</strong>';
                  }
                  if (popoverTitle) {
                    popoverTitle.style.color = '#ef4444';
                    popoverTitle.innerText = 'Action Required';
                  }
                  
                  // Also use alert as a fallback/extra nudge as requested
                  alert('Please select the start and end date on the calendar grid!');
                  return;
                }
                setTimeout(() => driverObj.moveNext(), 150);
              },
              onPrevClick: () => {
                driverObj.movePrevious();
              }
            },
            {
              element: '.tour-note-input',
              popover: {
                title: 'Write an Entry',
                description: 'Use this area to write free-form notes for the dates you just selected.',
                side: 'top',
                align: 'center'
              },
              onNextClick: () => {
                driverObj.moveNext();
              },
              onPrevClick: () => {
                stateRef.current.clearSelection();
                setActiveTab('schedules');
                setTimeout(() => driverObj.movePrevious(), 150);
              }
            },
            {
              element: '.tour-save-button',
              popover: {
                title: 'Save Your Events',
                description: 'Don\'t forget to securely save your new schedule! <strong>Ensure you click "Save" before clicking "Done" to finish the tour.</strong>',
                side: 'top',
                align: 'center'
              },
              onNextClick: () => {
                driverObj.destroy();
              },
              onPrevClick: () => {
                driverObj.movePrevious();
              }
            }
          ],
          onDestroyStarted: () => {
            // Clean up selections when tour completes or is skipped
            stateRef.current.clearSelection();
            driverObj.destroy();
          }
        });

        // Set the flag safely inside the timer so it's not run if timer is cleared
        localStorage.setItem('cal_onboarding_done', 'true');
        driverObj.drive();
      }, 600);

      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return null; // This component is strictly behavioral and UI-less
}
