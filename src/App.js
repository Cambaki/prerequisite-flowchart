import React, { useState, useMemo, useEffect, useRef, Component } from 'react';
import { CourseNode } from './Components/CourseNode';
import { ProgramSelector } from './Components/ProgramSelector';
import { eeCourses } from './Data/eeCourses';
import { ceCourses } from './Data/ceCourses';
import { getCourseStatus, getAvailableCourses, checkPrerequisites } from './Utils/prerequisiteChecker';
import ExcelJS from 'exceljs';
import './App.css';

const PROGRESS_STORAGE_KEY = 'prerequisite-flowchart-progress-v1';

const readStoredProgress = () => {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const parseCsvLine = (line) => {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];

    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === ',' && !inQuotes) {
      cells.push(current);
      current = '';
      continue;
    }

    current += ch;
  }

  cells.push(current);
  return cells;
};

const parseCsv = (csvText) => {
  const lines = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  return lines.map(parseCsvLine);
};

const normalizeCourseCode = (value) => {
  if (!value) return '';
  return String(value)
    .toUpperCase()
    .replace(/\./g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s*-\s*/g, '-')
    .replace(/^PHYS-0?(\d{3})$/, 'PHYS-$1')
    .replace(/^EENG-(\d{3})L$/, 'EENG-$1L')
    .replace(/^([A-Z]+)\s(\d+)/, '$1-$2');
};

const XLSX_STATUS_STYLES = {
  completed: {
    fill: 'FFD1D5DB',
    font: 'FF374151'
  },
  available: {
    fill: 'FFDCFCE7',
    font: 'FF166534'
  },
  blocked: {
    fill: 'FFFEE2E2',
    font: 'FF991B1B'
  },
  header: {
    fill: 'FF1F2937',
    font: 'FFFFFFFF'
  }
};

const thinBorder = {
  top: { style: 'thin', color: { argb: 'FFBFC5D2' } },
  left: { style: 'thin', color: { argb: 'FFBFC5D2' } },
  bottom: { style: 'thin', color: { argb: 'FFBFC5D2' } },
  right: { style: 'thin', color: { argb: 'FFBFC5D2' } }
};

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 p-6">
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">
              The application encountered an error. Please try:
              <ul className="list-disc pl-5 mt-2">
                <li>Refreshing the page</li>
                <li>Clearing your browser cache</li>
                <li>Checking your internet connection</li>
              </ul>
            </p>
            {this.state.error && (
              <pre className="bg-red-50 p-4 rounded text-sm text-red-700 overflow-auto">
                {this.state.error.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Main content component
function AppContent() {
  // State initialization
  const [selectedProgram, setSelectedProgram] = useState('EE');
  const [completedCourses, setCompletedCourses] = useState([]);
  const [showDetails, setShowDetails] = useState(true);
  const [showMathReadinessPopup, setShowMathReadinessPopup] = useState(true);
  const [guidanceMessage, setGuidanceMessage] = useState(null);
  const [provisionalTemplateRows, setProvisionalTemplateRows] = useState([]);
  const [provisionalTemplateName, setProvisionalTemplateName] = useState('');
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [exportStudentName, setExportStudentName] = useState('');
  const [provisionalError, setProvisionalError] = useState(null);
  const prevAvailableRef = useRef([]);
  const prevCompletedRef = useRef([]);

  const getSavedCoursesForProgram = (program) => {
    const stored = readStoredProgress();
    const saved = stored.completedByProgram?.[program];
    return Array.isArray(saved) ? saved : [];
  };

  // Debug logging
  useEffect(() => {
    console.log('Course data available:', {
      eeCourses: typeof eeCourses !== 'undefined' ? Object.keys(eeCourses || {}).length : 'undefined',
      ceCourses: typeof ceCourses !== 'undefined' ? Object.keys(ceCourses || {}).length : 'undefined'
    });
  }, []);

  useEffect(() => {
    const stored = readStoredProgress();
    const initialProgram = stored.selectedProgram === 'CE' ? 'CE' : 'EE';
    const savedCourses = Array.isArray(stored.completedByProgram?.[initialProgram])
      ? stored.completedByProgram[initialProgram]
      : [];

    setSelectedProgram(initialProgram);
    setCompletedCourses(savedCourses);

    if (typeof stored.showDetails === 'boolean') {
      setShowDetails(stored.showDetails);
    }

    if (stored.hasInitialized === true) {
      setShowMathReadinessPopup(false);
    }
  }, []);

  useEffect(() => {
    const stored = readStoredProgress();
    const completedByProgram = {
      EE: [],
      CE: [],
      ...(stored.completedByProgram || {})
    };

    completedByProgram[selectedProgram] = completedCourses;

    localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({
        ...stored,
        selectedProgram,
        completedByProgram,
        showDetails,
        hasInitialized: !showMathReadinessPopup
      })
    );
  }, [selectedProgram, completedCourses, showDetails, showMathReadinessPopup]);

  const currentCourses = useMemo(() => {
    return selectedProgram === 'EE' ? eeCourses : ceCourses;
  }, [selectedProgram]);

  const courseLookup = useMemo(() => {
    const lookup = new Map();

    Object.keys(currentCourses).forEach((id) => {
      const normalized = normalizeCourseCode(id);
      if (normalized) lookup.set(normalized, id);
      lookup.set(normalized.replace(/-/g, ''), id);
      lookup.set(normalized.replace(/-/g, ' '), id);
    });

    return lookup;
  }, [currentCourses]);

  const handleCourseClick = (courseId) => {
    const status = getCourseStatus(courseId, completedCourses, currentCourses);

    // Only allow toggling completed when the course is available or already completed
    if (status === 'completed') {
      setCompletedCourses(prev => prev.filter(id => id !== courseId));
      return;
    }

    if (status !== 'available') {
      const { missing } = checkPrerequisites(courseId, completedCourses, currentCourses);
      const shortMissing = missing.slice(0, 3);
      const missingNames = shortMissing
        .map(id => currentCourses[id]?.name || id)
        .join(', ');

      setGuidanceMessage({
        type: 'warning',
        title: `You are not ready for ${courseId} yet`,
        body: missing.length > 0
          ? `Complete these prerequisites first: ${missingNames}${missing.length > 3 ? ', ...' : ''}.`
          : 'This course is currently blocked. Complete earlier requirements first.'
      });
      return;
    }

    // Mark course as completed and also mark corequisites (same-semester labs)
    const course = currentCourses[courseId];
    const coreqs = Array.isArray(course.corequisite) ? course.corequisite : (course.corequisite ? [course.corequisite] : []);

    setCompletedCourses(prev => {
      const newSet = new Set(prev);
      newSet.add(courseId);
      coreqs.forEach(cq => { if (cq) newSet.add(cq); });
      return Array.from(newSet);
    });
  };

  const handleProgramChange = (program) => {
    setSelectedProgram(program);
    setCompletedCourses(getSavedCoursesForProgram(program));
    // Program switching should not force the math-readiness modal to reopen.
    setShowMathReadinessPopup(false);
    setGuidanceMessage(null);
    prevAvailableRef.current = [];
    prevCompletedRef.current = [];
  };

  const handleMathReadiness = (level) => {
    setShowMathReadinessPopup(false);
    
    // Auto-complete prerequisites based on math readiness level
    if (level === 'calculus-ready') {
      // Student can start with Calculus I immediately
      setCompletedCourses(['MATH-0107', 'MATH-0108']);
    } else if (level === 'precalc-trig-ready') {
      // Student needs Precalculus Trigonometry before Calculus I
      setCompletedCourses(['MATH-0107']);
    } else if (level === 'precalc-algebra-ready') {
      // Student needs both Precalculus courses before Calculus I
      setCompletedCourses([]);
    }
  };

  // Calculate available courses using the prerequisite checker
  const availableCourses = useMemo(() => {
    return getAvailableCourses(completedCourses, currentCourses);
  }, [completedCourses, currentCourses]);

  const graduationStatus = useMemo(() => {
    const degreeCourseEntries = Object.entries(currentCourses).filter(([, c]) => c.countForDegree !== false);

    if (selectedProgram === 'CE') {
      const requiredNonElective = degreeCourseEntries.filter(([, c]) => c.category !== 'elective');
      const remainingNonElective = requiredNonElective.filter(([id]) => !completedCourses.includes(id)).length;

      const electiveCompletedCredits = degreeCourseEntries
        .filter(([, c]) => c.category === 'elective')
        .reduce((sum, [id, c]) => sum + (completedCourses.includes(id) ? (Number(c.credits) || 0) : 0), 0);

      const remainingElectiveCredits = Math.max(0, 6 - electiveCompletedCredits);

      return {
        isComplete: remainingNonElective === 0 && remainingElectiveCredits === 0,
        remainingNonElective,
        remainingElectiveCredits
      };
    }

    const remainingRequiredCourses = degreeCourseEntries.filter(([id]) => !completedCourses.includes(id)).length;
    return {
      isComplete: remainingRequiredCourses === 0,
      remainingRequiredCourses
    };
  }, [currentCourses, selectedProgram, completedCourses]);

  useEffect(() => {
    const prevAvailable = prevAvailableRef.current;
    const prevCompleted = prevCompletedRef.current;

    const newlyCompleted = completedCourses.filter(id => !prevCompleted.includes(id));
    const newlyUnlocked = availableCourses.filter(id => !prevAvailable.includes(id));

    if (newlyCompleted.length > 0 && !graduationStatus.isComplete) {
      if (newlyUnlocked.length > 0) {
        const unlockedList = newlyUnlocked.slice(0, 4).map(id => `${id} (${currentCourses[id]?.name || 'Newly available'})`).join(', ');
        setGuidanceMessage({
          type: 'success',
          title: 'Nice work. You unlocked new course options.',
          body: `You can now take: ${unlockedList}${newlyUnlocked.length > 4 ? ', ...' : ''}.`
        });
      } else {
        setGuidanceMessage({
          type: 'info',
          title: 'Progress saved.',
          body: 'Prerequisites were updated. Keep completing available courses to unlock the next set.'
        });
      }
    }

    prevAvailableRef.current = availableCourses;
    prevCompletedRef.current = completedCourses;
  }, [availableCourses, completedCourses, currentCourses, graduationStatus.isComplete]);

  const categorizedCourses = useMemo(() => {
    try {
      const categories = {
        foundation: [],
        genEd: [],
        freshman: [],
        sophomore: [],
        junior: [],
        senior: [],
        elective: [],
        capstone: []
      };

      if (!currentCourses || typeof currentCourses !== 'object') {
        throw new Error('Invalid course data structure');
      }

      Object.entries(currentCourses).forEach(([id, course]) => {
        if (!course || typeof course !== 'object') {
          console.error(`Invalid course data for ${id}:`, course);
          return;
        }

        try {
          // Sort by category first
          if (course.category === 'capstone') {
            categories.capstone.push({ id, ...course });
          } else if (course.category === 'elective') {
            categories.elective.push({ id, ...course });
          } else if (course.category === 'foundation') {
            categories.foundation.push({ id, ...course });
          } else if (course.category === 'gen-ed') {
            categories.genEd.push({ id, ...course });
          } else {
            // Categorize core courses by typical year taken
            if (id === 'EENG-0192' || id === 'CSCI-0229' || 
                id === 'MATH-0207' || id === 'MATH-0208' || id === 'PHYS-310' || 
                id === 'PHYS-313' || id === 'CHEM-0231' || id === 'CHEM-0233') {
              categories.freshman.push({ id, ...course });
            } else if (id.startsWith('EENG-02') || id.startsWith('EENG-0260') || 
                      id.startsWith('EENG-221') || id.startsWith('EENG-260') ||
                      id.startsWith('EENG-322') || id === 'EENG-0322' ||
                      id === 'EENG-0210' || id === 'EENG-0225' || id === 'COEG-0300' || id === 'MENG-0237' ||
                      id === 'MATH-0209' || id === 'PHYS-311' || id === 'PHYS-314') {
              categories.sophomore.push({ id, ...course });
            } else if (id.startsWith('EENG-03') || 
                      id.startsWith('EENG-325') || id.startsWith('EENG-330') ||
                      id === 'COEG-0311' || id === 'COEG-0305' || id === 'EENG-0323' ||
                      id === 'EENG-0360' || id === 'MATH-0461') {
              categories.junior.push({ id, ...course });
            } else {
              // Senior level courses (EENG-04xx, COEG-04xx, etc.)
              categories.senior.push({ id, ...course });
            }
          }
        } catch (error) {
          console.error(`Error categorizing course ${id}:`, error);
        }
      });

      return categories;
    } catch (error) {
      console.error('Error processing courses:', error);
      return {
        foundation: [],
        genEd: [],
        freshman: [],
        sophomore: [],
        junior: [],
        senior: [],
        elective: [],
        capstone: []
      };
    }
  }, [currentCourses]);

  const stats = useMemo(() => ({
    total: Object.keys(currentCourses).length,
    completed: completedCourses.length,
    available: availableCourses.length,
    blocked: Object.keys(currentCourses).length - completedCourses.length - availableCourses.length
  }), [currentCourses, completedCourses, availableCourses]);

  // Credit counters
  // For CE program we treat required program credits as 131 (user-requested).
  // availableCredits is the sum of all courses in the catalog (the "168 available").
  const creditTotals = useMemo(() => {
    let completedCredits = 0;
    let availableCredits = 0;
    let completedElectiveCredits = 0;
    Object.entries(currentCourses).forEach(([id, c]) => {
      // Courses marked with countForDegree: false do not contribute to graduation credit totals
      const counts = c.countForDegree !== false;
      const cr = Number(c.credits) || 0;
      if (counts) availableCredits += cr;
      if (counts && completedCourses.includes(id)) {
        if (selectedProgram === 'CE' && c.category === 'elective') {
          completedElectiveCredits += cr;
        } else {
          completedCredits += cr;
        }
      }
    });

    // CE requires 6 elective credits (not a fixed number of elective courses).
    if (selectedProgram === 'CE') {
      completedCredits += Math.min(completedElectiveCredits, 6);
    }

    // Default: requiredCredits equals availableCredits (all courses required)
    let requiredCredits = availableCredits;
    // Graduation requirement: EE=130, CE=129
    requiredCredits = selectedProgram === 'EE' ? 130 : 129;

    const remaining = Math.max(0, requiredCredits - completedCredits);
    return { completedCredits, requiredCredits, availableCredits, remaining };
  }, [currentCourses, completedCourses, selectedProgram]);

  const provisionalPreview = useMemo(() => {
    if (!Array.isArray(provisionalTemplateRows) || provisionalTemplateRows.length === 0) {
      return [];
    }

    const preview = [];
    const seen = new Set();

    provisionalTemplateRows.forEach((row) => {
      [0, 9].forEach((startIdx) => {
        const rawCode = row[startIdx];
        const normalized = normalizeCourseCode(rawCode);
        if (!normalized) return;

        const mappedId = courseLookup.get(normalized) || courseLookup.get(normalized.replace(/-/g, ''));
        if (!mappedId || seen.has(`${startIdx}:${mappedId}`)) return;

        seen.add(`${startIdx}:${mappedId}`);
        preview.push({
          csvCode: rawCode,
          id: mappedId,
          name: currentCourses[mappedId]?.name || '',
          status: getCourseStatus(mappedId, completedCourses, currentCourses)
        });
      });
    });

    return preview;
  }, [provisionalTemplateRows, courseLookup, currentCourses, completedCourses]);

  const statusLabel = (status) => {
    if (status === 'completed') return 'COMPLETED';
    if (status === 'available') return 'READY TO TAKE';
    return 'NOT READY';
  };

  const applyStyledCell = (cell, options = {}) => {
    cell.border = thinBorder;
    cell.alignment = { vertical: 'middle', wrapText: true, horizontal: options.horizontal || 'left' };
    cell.font = {
      name: 'Calibri',
      size: 11,
      bold: Boolean(options.bold),
      color: options.fontColor ? { argb: options.fontColor } : undefined
    };

    if (options.fill) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: options.fill }
      };
    }
  };

  const styleStatusRange = (row, startCol, endCol, status) => {
    const statusStyle = XLSX_STATUS_STYLES[status] || XLSX_STATUS_STYLES.blocked;
    for (let col = startCol; col <= endCol; col += 1) {
      const cell = row.getCell(col);
      applyStyledCell(cell, {
        fill: statusStyle.fill,
        fontColor: statusStyle.font,
        horizontal: col === startCol ? 'left' : 'left'
      });
    }
  };

  const downloadWorkbook = async (workbook, fileName) => {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const buildTemplateWorkbook = (studentName) => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Prerequisite Flowchart';
    workbook.created = new Date();
    const worksheet = workbook.addWorksheet('Provisional Sheet', {
      views: [{ state: 'frozen', ySplit: 5 }]
    });

    worksheet.columns = [
      { width: 16 },
      { width: 35 },
      { width: 10 },
      { width: 10 },
      { width: 10 },
      { width: 12 },
      { width: 12 },
      { width: 10 },
      { width: 12 },
      { width: 16 },
      { width: 35 },
      { width: 10 },
      { width: 10 },
      { width: 10 },
      { width: 12 },
      { width: 12 },
      { width: 10 },
      { width: 12 },
      { width: 12 },
      { width: 12 }
    ];

    const leftEarnedRefs = [];
    const rightEarnedRefs = [];

    provisionalTemplateRows.forEach((rowValues, rowIndex) => {
      const row = worksheet.addRow(rowValues);
      row.height = 20;

      row.eachCell({ includeEmpty: true }, (cell) => {
        applyStyledCell(cell, { horizontal: 'left' });
      });

      const leftCode = normalizeCourseCode(rowValues[0]);
      const leftId = leftCode && (courseLookup.get(leftCode) || courseLookup.get(leftCode.replace(/-/g, '')));
      if (leftId) {
        const leftStatus = getCourseStatus(leftId, completedCourses, currentCourses);
        styleStatusRange(row, 1, 8, leftStatus);
        leftEarnedRefs.push(`D${row.number}`);
      }

      const rightCode = normalizeCourseCode(rowValues[9]);
      const rightId = rightCode && (courseLookup.get(rightCode) || courseLookup.get(rightCode.replace(/-/g, '')));
      if (rightId) {
        const rightStatus = getCourseStatus(rightId, completedCourses, currentCourses);
        styleStatusRange(row, 10, 17, rightStatus);
        rightEarnedRefs.push(`M${row.number}`);
      }

      if (typeof rowValues[0] === 'string' && rowValues[0].trim().toUpperCase().startsWith('ST. NAME:')) {
        const nextCell = row.getCell(2);
        nextCell.value = studentName;
        applyStyledCell(nextCell, { bold: true, horizontal: 'left' });
      }

      if (rowIndex <= 2) {
        row.eachCell({ includeEmpty: true }, (cell) => {
          applyStyledCell(cell, { bold: true, horizontal: 'left' });
        });
      }
    });

    worksheet.addRow([]);
    const summaryTitle = worksheet.addRow(['Auto Summary']);
    worksheet.mergeCells(summaryTitle.number, 1, summaryTitle.number, 4);
    applyStyledCell(summaryTitle.getCell(1), {
      fill: XLSX_STATUS_STYLES.header.fill,
      fontColor: XLSX_STATUS_STYLES.header.font,
      bold: true
    });

    const completedRefs = [...leftEarnedRefs, ...rightEarnedRefs];
    const completedFormula = completedRefs.length > 0 ? `SUM(${completedRefs.join(',')})` : '0';

    const completedRow = worksheet.addRow(['Total Completed Credits', { formula: completedFormula, result: creditTotals.completedCredits }]);
    const requiredRow = worksheet.addRow(['Required Credits', creditTotals.requiredCredits]);
    const remainingRow = worksheet.addRow(['Remaining Credits', {
      formula: `MAX(0,B${requiredRow.number}-B${completedRow.number})`,
      result: creditTotals.remaining
    }]);

    [completedRow, requiredRow, remainingRow].forEach((row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        applyStyledCell(cell, { horizontal: 'left' });
      });
    });

    applyStyledCell(completedRow.getCell(1), { bold: true, fill: 'FFF9FAFB' });
    applyStyledCell(requiredRow.getCell(1), { bold: true, fill: 'FFF9FAFB' });
    applyStyledCell(remainingRow.getCell(1), { bold: true, fill: 'FFF9FAFB' });

    return workbook;
  };

  const buildFallbackWorkbook = () => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Prerequisite Flowchart';
    workbook.created = new Date();
    const worksheet = workbook.addWorksheet('Provisional Sheet', {
      views: [{ state: 'frozen', ySplit: 5 }]
    });

    worksheet.columns = [
      { width: 16 },
      { width: 40 },
      { width: 10 },
      { width: 10 },
      { width: 18 },
      { width: 18 },
      { width: 18 },
      { width: 12 },
      { width: 14 }
    ];

    const titleRows = [
      'Department of Electrical and Computer Engineering (ECE)',
      'College of Engineering (COE), Tuskegee University (TU)',
      `Provisional Sheet for B.S. in ${selectedProgram === 'EE' ? 'Electrical Engineering (BSEE)' : 'Computer Engineering (BSCE)'} Program`
    ];

    titleRows.forEach((title) => {
      const row = worksheet.addRow([title]);
      worksheet.mergeCells(row.number, 1, row.number, 9);
      applyStyledCell(row.getCell(1), { bold: true, fill: 'FFF9FAFB' });
      row.height = 20;
    });

    worksheet.addRow([]);

    const sections = [
      { title: 'Foundation / Math Courses', courses: categorizedCourses.foundation },
      { title: 'General Education & Support Courses', courses: categorizedCourses.genEd },
      { title: 'Freshman Year', courses: categorizedCourses.freshman },
      { title: 'Sophomore Year', courses: categorizedCourses.sophomore },
      { title: 'Junior Year', courses: categorizedCourses.junior },
      { title: 'Senior Year', courses: categorizedCourses.senior },
      { title: 'Technical Electives', courses: categorizedCourses.elective },
      { title: 'Capstone', courses: categorizedCourses.capstone }
    ];

    const dataStartRows = [];

    sections.forEach((section) => {
      if (!section.courses || section.courses.length === 0) {
        return;
      }

      const sectionRow = worksheet.addRow([section.title]);
      worksheet.mergeCells(sectionRow.number, 1, sectionRow.number, 9);
      applyStyledCell(sectionRow.getCell(1), {
        bold: true,
        fill: XLSX_STATUS_STYLES.header.fill,
        fontColor: XLSX_STATUS_STYLES.header.font
      });

      const headerRow = worksheet.addRow(['Course No', 'Course Title', 'Credit', 'Earned Cr', 'Grade', 'Substitute', 'Univ.', 'Trns.Cr', 'Status']);
      headerRow.eachCell((cell) => {
        applyStyledCell(cell, {
          bold: true,
          fill: 'FFE5E7EB',
          horizontal: 'center'
        });
      });

      section.courses.forEach((course) => {
        const status = getCourseStatus(course.id, completedCourses, currentCourses);
        const earnedCredits = status === 'completed' ? Number(course.credits) || 0 : 0;
        const courseRow = worksheet.addRow([
          course.id,
          course.name,
          Number(course.credits) || 0,
          earnedCredits,
          '',
          '',
          '',
          '',
          statusLabel(status)
        ]);
        dataStartRows.push(courseRow.number);

        courseRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          applyStyledCell(cell, {
            fill: XLSX_STATUS_STYLES[status].fill,
            fontColor: XLSX_STATUS_STYLES[status].font,
            horizontal: colNumber === 2 ? 'left' : 'center'
          });
        });
      });

      worksheet.addRow([]);
    });

    const summaryTitle = worksheet.addRow(['Credit Summary']);
    worksheet.mergeCells(summaryTitle.number, 1, summaryTitle.number, 4);
    applyStyledCell(summaryTitle.getCell(1), {
      bold: true,
      fill: XLSX_STATUS_STYLES.header.fill,
      fontColor: XLSX_STATUS_STYLES.header.font
    });

    const firstDataRow = Math.min(...dataStartRows);
    const lastDataRow = Math.max(...dataStartRows);
    const completedRow = worksheet.addRow(['Credits Completed', {
      formula: `SUM(D${firstDataRow}:D${lastDataRow})`,
      result: creditTotals.completedCredits
    }]);
    const requiredRow = worksheet.addRow(['Required Credits', creditTotals.requiredCredits]);
    const remainingRow = worksheet.addRow(['Remaining Credits', {
      formula: `MAX(0,B${requiredRow.number}-B${completedRow.number})`,
      result: creditTotals.remaining
    }]);

    [completedRow, requiredRow, remainingRow].forEach((row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        applyStyledCell(cell, { horizontal: 'left' });
      });
    });

    return workbook;
  };

  const handleProvisionalFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = parseCsv(text);
      setProvisionalTemplateRows(parsed);
      setProvisionalTemplateName(file.name);
      setProvisionalError(null);
    } catch (error) {
      setProvisionalError('Could not read that CSV file. Please upload a valid provisional sheet CSV.');
      console.error('Provisional upload failed:', error);
    } finally {
      event.target.value = '';
    }
  };

  const saveProvisionalSheet = async () => {
    const cleanName = exportStudentName.trim();
    if (!cleanName) {
      setProvisionalError('Please enter your name before saving the provisional sheet.');
      return;
    }

    const programTag = selectedProgram === 'EE' ? 'Electrical-Engineering' : 'Computer-Engineering';
    const safeName = cleanName.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '');

    const workbook = provisionalTemplateRows.length > 0
      ? buildTemplateWorkbook(cleanName)
      : buildFallbackWorkbook();

    await downloadWorkbook(workbook, `${safeName || 'student'}-Provisional-${programTag}.xlsx`);

    setShowSavePopup(false);
    setProvisionalError(null);
  };

  const resetProgress = () => {
    setCompletedCourses([]);
    setProvisionalTemplateRows([]);
    setProvisionalTemplateName('');
    setProvisionalError(null);
    setExportStudentName('');
    setShowSavePopup(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Interactive Prerequisite Flowchart
            </h1>
            <p className="text-gray-600">
              Click courses to mark as completed. Available courses will highlight automatically.
            </p>
          </div>
          <button
            onClick={() => setShowMathReadinessPopup(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            Change Math Level
          </button>
        </div>
      </header>

      {/* Math Readiness Popup */}
      {showMathReadinessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Program & Math Readiness Check</h2>
            <p className="text-gray-600 mb-6">
              First, confirm your program and select your current math preparation level:
            </p>
            
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Your Program:</h3>
              <div className="text-sm text-blue-700">
                <select
                  value={selectedProgram}
                  onChange={(e) => handleProgramChange(e.target.value)}
                  className="w-full p-2 bg-white border border-blue-300 rounded"
                >
                  <option value="EE">Electrical Engineering (EE)</option>
                  <option value="CE">Computer Engineering (CE)</option>
                </select>
                <div className="text-xs mt-2">
                  Your progress is saved separately for each program.
                </div>
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-800 mb-3">Math Preparation Level:</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => handleMathReadiness('calculus-ready')}
                className="w-full p-4 text-left bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors"
              >
                <div className="font-semibold text-green-800">Ready for Calculus I</div>
                <div className="text-sm text-green-600">I have completed Precalculus Algebra & Trigonometry (or equivalent)</div>
              </button>
              
              <button
                onClick={() => handleMathReadiness('precalc-trig-ready')}
                className="w-full p-4 text-left bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg transition-colors"
              >
                <div className="font-semibold text-yellow-800">Need Precalculus Trigonometry</div>
                <div className="text-sm text-yellow-600">I have completed Precalculus Algebra but need Trigonometry</div>
              </button>
              
              <button
                onClick={() => handleMathReadiness('precalc-algebra-ready')}
                className="w-full p-4 text-left bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
              >
                <div className="font-semibold text-red-800">Need Precalculus Algebra</div>
                <div className="text-sm text-red-600">I need to start with Precalculus Algebra</div>
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800">
                <strong>Note:</strong> Calculus I (MATH 0207) requires both MATH 0107 (Precalculus Algebra) 
                and MATH 0108 (Precalculus Trigonometry) as prerequisites.
              </div>
            </div>
          </div>
        </div>
      )}

      <ProgramSelector 
        selectedProgram={selectedProgram}
        onProgramChange={handleProgramChange}
      />

      {graduationStatus.isComplete && (
        <div
          className="mb-6 p-4 rounded-lg"
          style={{ backgroundColor: '#dcfce7', border: '1px solid #16a34a', textAlign: 'left' }}
        >
          <h3 className="text-lg font-bold" style={{ color: '#166534' }}>
            Graduation Requirement Complete
          </h3>
          <p className="text-sm" style={{ color: '#166534' }}>
            You have completed all required coursework for the {selectedProgram} program.
          </p>
        </div>
      )}

      {guidanceMessage && !graduationStatus.isComplete && (
        <div
          className="mb-6 p-4 rounded-lg"
          style={{
            backgroundColor:
              guidanceMessage.type === 'warning' ? '#fee2e2' :
              guidanceMessage.type === 'success' ? '#fef9c3' : '#dbeafe',
            border:
              guidanceMessage.type === 'warning' ? '1px solid #dc2626' :
              guidanceMessage.type === 'success' ? '1px solid #ca8a04' : '1px solid #2563eb',
            textAlign: 'left'
          }}
        >
          <div className="text-sm font-bold" style={{
            color:
              guidanceMessage.type === 'warning' ? '#991b1b' :
              guidanceMessage.type === 'success' ? '#854d0e' : '#1e3a8a'
          }}>
            {guidanceMessage.title}
          </div>
          <div className="text-sm" style={{
            color:
              guidanceMessage.type === 'warning' ? '#991b1b' :
              guidanceMessage.type === 'success' ? '#854d0e' : '#1e3a8a'
          }}>
            {guidanceMessage.body}
          </div>
        </div>
      )}

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Courses</div>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold">{stats.completed}</div>
          <div className="text-sm">Completed</div>
        </div>
        <div className="bg-yellow-400 text-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold">{stats.available}</div>
          <div className="text-sm">Available</div>
        </div>
        <div className="bg-red-600 text-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold">{stats.blocked}</div>
          <div className="text-sm">Blocked</div>
        </div>
      </div>

      {/* Credit Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{creditTotals.completedCredits}</div>
          <div className="text-sm text-gray-600">Credits Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-800">{creditTotals.requiredCredits}</div>
          <div className="text-sm text-gray-600">Required for Graduation</div>
          <div className="text-xs text-gray-500 mt-1">Available catalog credits: {creditTotals.availableCredits}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">{creditTotals.remaining}</div>
          <div className="text-sm text-gray-600">Credits Remaining (to required)</div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all"
        >
          {showDetails ? 'Hide' : 'Show'} Prerequisites
        </button>
        <button
          onClick={resetProgress}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
        >
          Reset Progress
        </button>
      </div>

      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Provisional Sheet Generator</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload your provisional CSV template if you want to preserve the example layout, or save a built-in formatted Excel sheet directly from your current selections.
          Completed courses are gray, ready courses are green, and not-ready courses are red.
        </p>
        <p className="text-xs text-gray-500 mb-4">
          Uploading a template is optional. If none is uploaded, the export still generates a styled .xlsx file.
        </p>

        <div className="flex flex-wrap gap-4 items-center mb-4">
          <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-all">
            Import Provisional CSV
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleProvisionalFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              setExportStudentName('');
              setShowSavePopup(true);
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
          >
            Save Excel File
          </button>

          {provisionalTemplateName && (
            <div className="text-sm text-gray-700">Loaded template: {provisionalTemplateName}</div>
          )}
        </div>

        {provisionalError && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-800 border border-red-200 text-sm">
            {provisionalError}
          </div>
        )}

        {provisionalPreview.length > 0 && (
          <div>
            <div className="flex gap-3 mb-3 text-xs">
              <span className="px-2 py-1 rounded bg-gray-400 text-white">COMPLETED (gray)</span>
              <span className="px-2 py-1 rounded bg-green-500 text-white">READY TO TAKE (green)</span>
              <span className="px-2 py-1 rounded bg-red-600 text-white">NOT READY (red)</span>
            </div>

            <div className="max-h-64 overflow-auto border rounded">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="text-left p-2">Course</th>
                    <th className="text-left p-2">Title</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {provisionalPreview.map((item, idx) => {
                    const badgeClass =
                      item.status === 'completed'
                        ? 'bg-gray-400 text-white'
                        : item.status === 'available'
                          ? 'bg-green-500 text-white'
                          : 'bg-red-600 text-white';

                    return (
                      <tr key={`${item.id}-${idx}`} className="border-t">
                        <td className="p-2 font-medium">{item.csvCode}</td>
                        <td className="p-2">{item.name}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${badgeClass}`}>{statusLabel(item.status)}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Course Sections */}
      <div className="space-y-8">
        
        {/* Foundation Courses */}
        {categorizedCourses.foundation.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📐 Foundation (Precalculus)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categorizedCourses.foundation.map(course => (
                <CourseNode
                  key={course.id}
                  course={course}
                  status={getCourseStatus(course.id, completedCourses, currentCourses)}
                  onClick={() => handleCourseClick(course.id)}
                  showDetails={showDetails}
                />
              ))}
            </div>
          </section>
        )}

        {/* General Education */}
        {categorizedCourses.genEd.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📚 General Education & Support Courses
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              English, Social Sciences, Humanities, Engineering Ethics, Economics, etc.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categorizedCourses.genEd.map(course => (
                <CourseNode
                  key={course.id}
                  course={course}
                  status={getCourseStatus(course.id, completedCourses, currentCourses)}
                  onClick={() => handleCourseClick(course.id)}
                  showDetails={showDetails}
                />
              ))}
            </div>
          </section>
        )}

        {/* Freshman Year */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🎓 Freshman Year
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categorizedCourses.freshman.map(course => (
              <CourseNode
                key={course.id}
                course={course}
                status={getCourseStatus(course.id, completedCourses, currentCourses)}
                onClick={() => handleCourseClick(course.id)}
                showDetails={showDetails}
              />
            ))}
          </div>
        </section>

        {/* Sophomore Year */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            📊 Sophomore Year
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categorizedCourses.sophomore.map(course => (
              <CourseNode
                key={course.id}
                course={course}
                status={getCourseStatus(course.id, completedCourses, currentCourses)}
                onClick={() => handleCourseClick(course.id)}
                showDetails={showDetails}
              />
            ))}
          </div>
        </section>

        {/* Junior Year */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            ⚡ Junior Year
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categorizedCourses.junior.map(course => (
              <CourseNode
                key={course.id}
                course={course}
                status={getCourseStatus(course.id, completedCourses, currentCourses)}
                onClick={() => handleCourseClick(course.id)}
                showDetails={showDetails}
              />
            ))}
          </div>
        </section>

        {/* Senior Year */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🚀 Senior Year
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categorizedCourses.senior.map(course => (
              <CourseNode
                key={course.id}
                course={course}
                status={getCourseStatus(course.id, completedCourses, currentCourses)}
                onClick={() => handleCourseClick(course.id)}
                showDetails={showDetails}
              />
            ))}
          </div>
        </section>

        {/* Technical Electives (CE Only) */}
        {categorizedCourses.elective.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-purple-800 mb-4">
              🎯 Technical Electives (Need 6 Credits)
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Complete any 6 elective credits (typically 2 courses): Machine Learning, AI, Cybersecurity, Software Engineering, Mobile Security
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorizedCourses.elective.map(course => (
                <CourseNode
                  key={course.id}
                  course={course}
                  status={getCourseStatus(course.id, completedCourses, currentCourses)}
                  onClick={() => handleCourseClick(course.id)}
                  showDetails={showDetails}
                />
              ))}
            </div>
          </section>
        )}

        {/* Capstone */}
        <section>
          <h2 className="text-2xl font-bold text-red-800 mb-4">
            🎓 Senior Design (Capstone)
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            ⚠️ Note: Same-semester option may be needed to graduate on time in 2027
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categorizedCourses.capstone.map(course => (
              <CourseNode
                key={course.id}
                course={course}
                status={getCourseStatus(course.id, completedCourses, currentCourses)}
                onClick={() => handleCourseClick(course.id)}
                showDetails={showDetails}
              />
            ))}
          </div>
        </section>
      </div>

      {showSavePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Save Provisional Sheet</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter your name for the generated provisional sheet.
            </p>
            <input
              type="text"
              value={exportStudentName}
              onChange={(e) => setExportStudentName(e.target.value)}
              placeholder="Student full name"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSavePopup(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveProvisionalSheet}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Summary */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Progress Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Courses Completed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-600">{stats.available}</div>
            <div className="text-sm text-gray-600">Ready to Take</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-600">{stats.blocked}</div>
            <div className="text-sm text-gray-600">Still Blocked</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">
              {Math.round((stats.completed / stats.total) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App component
function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <AppContent />
      </div>
    </ErrorBoundary>
  );
}

export default App;