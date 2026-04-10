# Interactive Calendar Component

---

##  Project Overview

This project is built as part of the **Frontend Engineering Challenge: Interactive Calendar Component**.

The main objective was to transform a static wall calendar design into a fully interactive, responsive, and user-friendly web component, focusing purely on frontend development.

---

## Evaluation Highlights (Why This Codebase Stands Out)

This project is designed to show strong frontend skills in these key areas:

### 1. Robust Testing Suite (Vitest & React Testing Library)

* **Comprehensive Coverage:** Implemented 7 advanced test cases covering UI components, complex user workflows, and form error validations.
* **Integration Testing ("The User Flow"):** Tests a real-world scenario (clicking a date -> typing a note -> saving -> verifying UI changes), proving that the application state is flawless.
* **Accessibility (a11y) Validated:** Custom CSS classes (`selected`, `range-start`) and Aria-labels (`aria-selected`) were added to guarantee elements are readable by tools and screen-readers.

<img width="1172" height="629" alt="Screenshot 2026-04-09 193855" src="https://github.com/user-attachments/assets/e0378906-7bce-4da4-a07e-4257c6c6fae4" />

## For More Details About Testing Read "README_TESTING.md"

### 2. Code Quality

* Code is clean and easy to understand
* Uses clear variable names and helpful comments
* Each part of the code does only one job (Single Responsibility Principle)
* Easy to maintain and update

### 3. Component Architecture

* Large components are broken into smaller, reusable parts
* Example:

  * NotesPanel
  * ActivityOverview
  * DailyJournalEditor
  * DailyTasksEditor
* This makes the code easier to manage and reuse

### 4. Project Structure

* Files are well organized into folders like:

  * `/components`
  * `/context`
  * `/hooks`
  * `/config`
* Logic is separated properly, so the project can scale easily

### 5. State Management

* Avoided passing data through too many components (no prop drilling)
* Used React Context (`CalendarContext`) to manage data centrally
* Makes data handling clean and simple

### 6. UI/UX Details

* Focus on user experience and accessibility
* Keyboard navigation is supported (focus styles added)
* Smooth animations using Framer Motion
* Forms are validated to prevent user errors

### 7. Responsive Design

* Works well on all screen sizes (mobile, tablet, desktop)
* Uses Tailwind CSS with a mobile-first approach
* Layout adjusts smoothly without breaking

---

## Live Demo

View Live Project  
https://interactive-calendar-component-nine.vercel.app/

---

## Demo Video

Watch Demo  
https://youtu.be/wscy6og0_mw

---

## How to Run Locally

```bash
# Clone the repository
git clone https://github.com/Purnachandra890/Interactive-Calendar-Component.git

# Navigate to the project directory
cd Interactive-Calendar-Component

# Install dependencies
npm install

# Run the development server
npm run dev

```

---

##  Features

###  1. Wall Calendar Aesthetic

- Clean and modern UI inspired by a physical wall calendar  
- Dedicated hero image section for strong visual appeal  
- Balanced layout between image and calendar grid  

---

###  2. Date Range Selection

- Users can select a start date and an end date  
- Clear visual states for:
  - Start date  
  - End date  
  - Dates in between  
- Smooth and intuitive user interaction  

---

###  3. Notes & Tasks Planner

- Users can write free-form **Notes** for a selected single date or a multi-day event.
- Users can toggle a dedicated **Tasks** mode to build a chronological daily **To-Do list**.
- Includes inline editing, native OS time-picker integration, and deletion safety checks.
- Helps seamlessly organize checklists, reminders, and daily journaling.  

---

###  4. Fully Responsive Design

#### Desktop

- Side-by-side layout (image + calendar)  
- Maintains a clean and structured UI  

#### Mobile

- Stacked layout for better usability  
- Fully optimized for touch interactions  

---

##  Extra Features (To Stand Out)

- Auto saving notes
- First-time user demo / onboarding experience
- Framer motions for entries (event notes, daily notes, & tasks)
- Built-in time-based To-Do list scheduler for individual days
- Dynamic background/theme based on the selected month   
- Holiday markers to highlight important days  
- Smooth UI interactions and transitions

---

##  Tech Stack

- **Framework:** React  
- **Styling:** Tailwind CSS  
- **State Management:** React Context API & Custom Hooks
- **Storage:** localStorage (for saving notes and selections)
- **Animations:** Framer Motion

---