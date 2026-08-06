# Department Maintenance Guide: Prerequisite Flowchart

## 1) Purpose of this guide

This document is the long-form operational and technical guide for the ECE department to understand, maintain, and safely evolve the Prerequisite Flowchart web app.

It is written for future faculty/staff, student workers, and developers who may inherit the project with limited context.

---

## 2) What this program is

The Prerequisite Flowchart is a React-based interactive advising tool that:

- Displays EE and CE curriculum courses as clickable cards.
- Computes course status in real time:
  - **Completed** (student marked done)
  - **Available** (all prerequisites met)
  - **Blocked** (one or more prerequisites missing)
- Auto-handles corequisite completion in click behavior (e.g., labs taken with lectures).
- Tracks credit progress toward graduation requirement.
- Supports a startup **math readiness** selection that pre-sets progress for students entering at different math levels.

The app is designed to be a practical advising simulation tool rather than an official registration system.

---

## 3) Where everything is (directory map)

> Important: In this workspace, there are duplicated top-level folders. The active app is the nested project folder.

### Active project root

- `prerequisite-flowchart/` (this is the project root to use)

### Main source code

- `prerequisite-flowchart/src/`
  - `App.js` — Main UI logic/state and layout
  - `index.js` — React entry point
  - `ErrorBoundary.js` — Global crash fallback wrapper
  - `App.css` — Utility-style CSS classes used by components
  - `index.css` — Tailwind directives + base styles
  - `Components/`
    - `CourseNode.js` — Individual course card
    - `ProgramSelector.js` — EE/CE toggle controls
  - `Data/`
    - `eeCourses.js` — EE catalog data and prerequisite graph
    - `ceCourses.js` — CE catalog data and prerequisite graph
  - `Utils/`
    - `prerequisiteChecker.js` — prerequisite and status logic

### Curriculum and reference data files

- `prerequisite-flowchart/BSCE-Curriculum.csv`
- `prerequisite-flowchart/BSEE-Curriculum.csv`
- `prerequisite-flowchart/Provisional-CE.csv`
- `prerequisite-flowchart/Provisional-EE.csv`
- `prerequisite-flowchart/ECE-prerequisites-content.txt`
- `prerequisite-flowchart/Course-Offerings.csv`
- `prerequisite-flowchart/ECE prerequisites - Updated October 2025.docx`

These are advisory/source-of-truth inputs for maintaining the JS data modules.

### Build/runtime config and scripts

- `prerequisite-flowchart/package.json` — dependencies and scripts
- `prerequisite-flowchart/tailwind.config.js`
- `prerequisite-flowchart/postcss.config.js`
- `prerequisite-flowchart/scripts/copy-assets.js`
- `prerequisite-flowchart/public/index.html`

### Output artifacts

- `prerequisite-flowchart/build/` — `react-scripts build` output
- `prerequisite-flowchart/dist/` — custom `esbuild` + copy script output

### Existing operational documentation

- `prerequisite-flowchart/README.md`
- `prerequisite-flowchart/PREREQUISITE-UPDATES-SUMMARY.md`
- `prerequisite-flowchart/LATE-START-PATHWAYS.md`

---

## 4) Runtime architecture (how app startup works)

### 4.1 Entry and mounting

1. Browser loads `public/index.html` with `<div id="root"></div>`.
2. `src/index.js` runs.
3. `initApp()` verifies root exists, and if not, creates one dynamically.
4. React root mounts `<ErrorBoundary><App /></ErrorBoundary>`.

### 4.2 Top-level app composition

- `App` (in `App.js`) wraps `AppContent` in a second local error boundary class.
- `AppContent` holds all state and rendering for courses/stats/sections.

### 4.3 State model in `AppContent`

Core state variables:

- `selectedProgram` (`'EE'` or `'CE'`)
- `completedCourses` (`string[]` of course IDs)
- `showDetails` (boolean for prerequisite text visibility)
- `showMathReadinessPopup` (boolean)
- `mathReadinessLevel` (current selection)

Derived/memoized values:

- `currentCourses` (either EE or CE data object)
- `availableCourses` (computed via checker util)
- `categorizedCourses` (grouped for UI sections)
- `stats` (total/completed/available/blocked)
- `creditTotals` (completed/required/available/remaining)

---

## 5) Course data model (critical for safe edits)

Each course entry in `eeCourses.js` and `ceCourses.js` is keyed by ID and usually has:

- `id`: canonical course ID used everywhere (must match key)
- `name`: display title
- `credits`: number used in totals
- `prerequisites`: array of course IDs
- `corequisite`: string or array of course IDs
- `description`: advising text shown in details panel
- `category`: one of `foundation`, `core`, `gen-ed`, `elective`, `capstone`, `support`
- `semesters`: array like `['Fall', 'Spring']`
- `countForDegree` (optional): if `false`, excluded from degree credit totals

### 5.1 Why ID consistency matters

IDs connect all logic paths:

- prerequisite graph traversal
- click behavior
- status coloring
- section categorization heuristics
- credit calculations

If an ID changes in one place and not another, course availability logic will silently break.

---

## 6) Prerequisite engine (how status is computed)

File: `src/Utils/prerequisiteChecker.js`

### 6.1 Core functions

- `collectMissingPrereqs(courseId, completed, allCourses, visited)`

  - Recursively traverses prerequisites.
  - Builds full missing prerequisite chain.
  - Uses `visited` set to avoid infinite loops on bad graphs.
- `checkPrerequisites(courseId, completed, allCourses)`

  - Returns whether course can be taken.
  - Normalizes `corequisite` to array.
  - Corequisites are not blocking in current design.
- `getCourseStatus(courseId, completed, allCourses)`

  - Returns `'completed' | 'available' | 'blocked'`.
- `getAvailableCourses(completed, allCourses)`

  - Returns all courses that can currently be taken.

### 6.2 Current policy encoded in logic

- **Prerequisites block**.
- **Corequisites do not block** (assumed can be co-enrolled).
- Clicking an available course marks it complete.
- Clicking a completed course un-completes it.
- Clicking a blocked course does nothing.

---

## 7) UI behavior by component

### 7.1 `ProgramSelector`

- Two buttons: EE and CE.
- Changing program resets completed progress.

### 7.2 `CourseNode`

- Uses status to determine:
  - background color
  - icon
  - clickability
- Shows summary + details (description, prereqs, coreqs, offerings).

### 7.3 `AppContent` layout sections

- Header and math-level controls
- Program selector
- Stats dashboard
- Credit summary
- Action controls (show details/reset)
- Course sections grouped by:
  - Foundation
  - Gen-ed
  - Freshman
  - Sophomore
  - Junior
  - Senior
  - Electives
  - Capstone
- Progress summary

---

## 8) Math readiness system (advising shortcut)

Startup popup offers three paths:

- `calculus-ready` → auto-completes both precalculus courses
- `precalc-trig-ready` → auto-completes algebra only
- `precalc-algebra-ready` → no auto-completion

This directly seeds `completedCourses` and changes availability graph from first render.

---

## 9) Credit accounting logic

In `App.js`, `creditTotals` computes:

- `availableCredits`: sum of all courses where `countForDegree !== false`
- `completedCredits`: completed subset of above
- `requiredCredits`: currently fixed to **129**
- `remaining`: `max(0, required - completed)`

### 9.1 Practical implication

- Catalog can contain more than required credits.
- Some courses are “available but not required for degree total”.
- If policy changes (e.g., CE to 131), edit this logic centrally.

---

## 10) Categorization logic caveat (important)

Course section placement is partly:

- from explicit `category`
- and partly from ID pattern heuristics in `App.js`

This means new course IDs can appear in unexpected year sections if not accounted for in heuristics. Always validate after adding/changing IDs.

---

## 11) Build and run workflows

From project root (`prerequisite-flowchart/`):

- Development server: `npm start`
- Standard production build: `npm run build`
- Tests (if present): `npm test`
- Alt static bundle: `npm run build:static`

### 11.1 Script notes

- `build` uses Create React App (`react-scripts`).
- `build:static` uses esbuild + `scripts/copy-assets.js`.
- `copy-assets.js` currently reads from `Public` (capital P). On case-sensitive systems this may fail because folder is usually `public`.

---

## 12) Data maintenance workflow (department process)

Use this process whenever curriculum changes are approved.

### Step A: Collect source documents

Use latest versions of:

- provisional sheets (CE/EE)
- curriculum sheets (BSCE/BSEE)
- prerequisite master document
- course offerings

### Step B: Decide source-of-truth priority

Recommended:

1. Official prerequisites document (hard prereq/coreq truth)
2. Department-approved provisional sheet
3. Curriculum sheet
4. Offerings sheet (semester availability)

### Step C: Update JS data modules

Edit:

- `src/Data/ceCourses.js`
- `src/Data/eeCourses.js`

For each course changed:

1. verify ID format consistency (e.g., `EENG-0323`)
2. ensure `id` matches object key
3. update prerequisites/corequisites
4. update semester availability
5. update category if needed
6. update description only if needed

### Step D: Validate graph consistency

Check for:

- references to non-existent IDs
- circular prerequisite chains
- outdated course IDs in prereq arrays

### Step E: Run app and perform smoke checks

- launch `npm start`
- test both programs
- click through known path milestones
- verify blocked/available transitions
- verify credit totals

### Step F: Document the change

Update:

- `PREREQUISITE-UPDATES-SUMMARY.md`

Include date, reason, files touched, policy source.

---

## 13) Common modifications and exactly how to do them

### 13.1 Add a new course

1. Add object in proper data file (`eeCourses.js` or `ceCourses.js`).
2. Include valid `id`, `credits`, `prerequisites` array (possibly empty).
3. Add `corequisite` if needed.
4. Set `category` and `semesters`.
5. If non-degree preparatory course, set `countForDegree: false`.
6. Ensure any referencing courses use the exact new ID.
7. Run app and verify it appears in expected section.

### 13.2 Remove a course

1. Remove course object.
2. Remove that ID from all prerequisite/corequisite arrays in same file.
3. Check other program file for cross-references.
4. Run and confirm no broken availability behavior.

### 13.3 Rename course title only

1. Update `name` field.
2. Do **not** change ID unless necessary.
3. Re-test view.

### 13.4 Change prerequisite chain

1. Edit `prerequisites` array in target course.
2. Verify referenced IDs exist.
3. Test progression by clicking through sequence.

### 13.5 Change semester offerings

1. Update `semesters` array.
2. Verify display in course card details.

### 13.6 Change graduation credit requirement

1. Edit required credit constant logic in `App.js` (`requiredCredits`).
2. Validate completed/remaining counts.

---

## 14) Known quirks and technical debt to track

1. Two ErrorBoundaries exist:

   - global one in `src/ErrorBoundary.js`
   - local class inside `App.js`
     This is redundant and could be simplified.
2. `src/App.js.tmp` exists and appears to be stale/alternate code.
   It is not the runtime entry, but can confuse future maintainers.
3. Styling is mixed:

   - Tailwind setup exists
   - many Tailwind-like utility classes are manually defined in `App.css`
4. Course categorization in UI relies partly on hardcoded ID patterns.
   Future IDs may need updates to categorization logic.
5. Workspace has duplicate project-looking directories at top level and nested level.
   Ensure edits happen in active nested project path.

---

## 15) Suggested governance for departmental continuity

### 15.1 Recommended roles

- **Curriculum owner**: approves academic logic changes
- **Data maintainer**: updates `eeCourses.js` / `ceCourses.js`
- **QA reviewer**: verifies app behavior against source sheets
- **Release custodian**: tags and deploys approved builds

### 15.2 Change control checklist (minimum)

Before merge/deploy:

- [ ] All changed courses traced to an official source
- [ ] No dangling prerequisite/corequisite IDs
- [ ] CE and EE both open and render
- [ ] At least one representative path tested per year
- [ ] Credit total policy confirmed
- [ ] Update summary markdown written

---

## 16) Fast onboarding for a new maintainer (60-minute plan)

1. Read this guide front to back (15 min).
2. Run app with `npm start` and click through UI (10 min).
3. Inspect `App.js`, `prerequisiteChecker.js`, `ceCourses.js`, `eeCourses.js` (20 min).
4. Make one tiny nonfunctional data edit and revert to learn workflow (10 min).
5. Read latest update summary and confirm branch status (5 min).

---

## 17) Emergency troubleshooting

### App fails to start

- Check node version and dependencies: reinstall with `npm install`.
- Check `package.json` scripts and dependency integrity.

### Blank page

- Open browser console for runtime errors.
- Confirm `index.html` has root element.
- Confirm `src/index.js` mounts correctly.

### Course statuses look wrong

- Verify ID typos between course key, `id`, and prerequisite references.
- Confirm removed course IDs are not still referenced.
- Check for accidental circular prerequisite dependencies.

### Credits do not match expected totals

- Check `countForDegree` flags.
- Check `requiredCredits` logic in `App.js`.
- Verify duplicate/obsolete courses are not present.

---

## 18) Recommended next improvements (optional roadmap)

If the department wants higher long-term reliability:

1. Move course data to validated JSON + schema checks.
2. Add script to detect dangling prerequisites automatically.
3. Add automated tests for prerequisite transitions.
4. Remove stale `App.js.tmp` after confirming not needed.
5. Consolidate to one ErrorBoundary implementation.
6. Normalize style strategy (pure Tailwind or pure CSS utilities).

---

## 19) Quick reference: files you will edit most often

- `src/Data/ceCourses.js`
- `src/Data/eeCourses.js`
- `src/Utils/prerequisiteChecker.js`
- `src/App.js`
- `PREREQUISITE-UPDATES-SUMMARY.md`

---

## 20) Final operational rule

Treat all curriculum/prerequisite changes as **data governance changes**, not cosmetic code edits.

In practice this means:

- every change must have source documentation
- every source update must be reflected consistently in IDs, prerequisites, and semesters
- every release should include a short written summary of what changed and why

This discipline is what keeps the advising tool trustworthy for students and staff over time.
