# Interactive Calendar Component

---

##  Project Overview

This project is built as part of the **Frontend Engineering Challenge: Interactive Calendar Component**.

The main objective was to transform a static wall calendar design into a fully interactive, responsive, and user-friendly web component, focusing purely on frontend development.

---

## Evaluation Highlights (Why This Codebase Stands Out)

This project is designed to show strong frontend skills in these key areas:

### 1. Code Quality

* Code is clean and easy to understand
* Uses clear variable names and helpful comments
* Each part of the code does only one job (Single Responsibility Principle)
* Easy to maintain and update

### 2. Component Architecture

* Large components are broken into smaller, reusable parts
* Example:

  * NotesPanel
  * ActivityOverview
  * DailyJournalEditor
* This makes the code easier to manage and reuse

### 3. Project Structure

* Files are well organized into folders like:

  * `/components`
  * `/context`
  * `/hooks`
  * `/config`
* Logic is separated properly, so the project can scale easily

### 4. State Management

* Avoided passing data through too many components (no prop drilling)
* Used React Context (`CalendarContext`) to manage data centrally
* Makes data handling clean and simple

### 5. UI/UX Details

* Focus on user experience and accessibility
* Keyboard navigation is supported (focus styles added)
* Smooth animations using Framer Motion
* Forms are validated to prevent user errors

### 6. Responsive Design

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

###  3. Notes Section

- Users can add notes for:
  - Selected date  
  - Entire month  
- Helps in tracking tasks, reminders, and plans  

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
- Framer motions for entries (schedules & daily journals)
- Daily journal feature
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