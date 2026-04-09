# 🧪 Testing Guide: React Calendar

This guide explains how the unit testing suite is structured and how to run it. We use **Vitest** and **React Testing Library** for a modern, fast testing experience.

## 📁 Folder Structure
```text
/
├── package.json              # Contains "test" scripts
├── vitest.config.js          # Main Vitest configuration
├── /src
│   ├── /test
│   │   └── setup.js          # Testing Library & Jest-DOM setup
│   └── /components
│       └── Calendar.test.jsx # Your core unit & integration tests
```

## 🚀 How to Run Tests

Since this is a specialized environment, follow these steps:

1. **Install Dependencies** (Run this in your terminal):
   ```bash
   npm install
   ```

2. **Run Tests**:
   ```bash
   npm test
   ```

3. **Run with UI** (Visual mode):
   ```bash
   npm run test:ui
   ```

4. **Check Code Coverage**:
   ```bash
   npm run test:coverage
   ```

## 📝 Understanding the Tests

The tests are located in `src/components/Calendar.test.jsx`. Here is a brief explanation of what each test does:

### 1. Simple Selection
**Goal**: Verify that clicking a date highlights it.
- We find a date by its "accessibility label" (e.g., "April 15, 2026").
- We simulate a click.
- We check if the element now has the CSS class `.selected`.

### 2. Range Selection
**Goal**: Verify that selecting two dates highlights the space between them.
- We click a start date and an end date.
- We verify the start has `.range-start` and the end has `.range-end`.
- We verify a date in the middle has `.in-range`.

### 3. Integrated User Flow (Expert Level)
**Goal**: Verify that the entire "Schedule" system works together.
- This is a "real-world" test. It clicks dates, types a note into the editor, clicks Save, and then checks if the calendar shows the updated data. This proves that your **State Management (Context API)** and **Components** are working perfectly together.

### 4. Navigation Testing
**Goal**: Verify the custom `date-fns` integration works accurately.
- We simulate clicks on the "Next month", "Previous month", and "Jump to today" buttons.
- We verify that the main Title Header transforms to show the dynamically expected Month string exactly.

### 5. Selection Toggling
**Goal**: Verify the user bounds interactions.
- We deliberately click a selected start date for a second time, proving that the State automatically disengages the selection securely.

### 6. Validation & Security Checks
**Goal**: Verify we safely block empty submissions.
- We simulate a user trying to "Save" an immediately empty text document.
- We use asynchronous testing hooks to wait and verify that the "Save" button instantly pulses red and transforms its text to inform the user that it blocked the save!

## 7 Accessibility Notes
We added `aria-label` and `aria-selected` to the `DayCell` component. This not only makes the tests easier to write but also makes your calendar accessible to screen readers, which is a huge plus for professional developers!
