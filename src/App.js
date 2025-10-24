import React, { useState, useMemo, useEffect, Component } from 'react';
import { CourseNode } from './Components/CourseNode';
import { ProgramSelector } from './Components/ProgramSelector';
import { eeCourses } from './Data/eeCourses';
import { ceCourses } from './Data/ceCourses';
import { getCourseStatus, getAvailableCourses } from './Utils/prerequisiteChecker';
import './App.css';

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
  const [mathReadinessLevel, setMathReadinessLevel] = useState(null);

  // Debug logging
  useEffect(() => {
    console.log('Course data available:', {
      eeCourses: typeof eeCourses !== 'undefined' ? Object.keys(eeCourses || {}).length : 'undefined',
      ceCourses: typeof ceCourses !== 'undefined' ? Object.keys(ceCourses || {}).length : 'undefined'
    });
  }, []);

  const currentCourses = useMemo(() => {
    return selectedProgram === 'EE' ? eeCourses : ceCourses;
  }, [selectedProgram]);

  const handleCourseClick = (courseId) => {
    const status = getCourseStatus(courseId, completedCourses, currentCourses);

    // Only allow toggling completed when the course is available or already completed
    if (status === 'completed') {
      setCompletedCourses(prev => prev.filter(id => id !== courseId));
      return;
    }

    if (status !== 'available') return; // locked/blocked - do nothing

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
    setCompletedCourses([]);
  };

  const handleMathReadiness = (level) => {
    setMathReadinessLevel(level);
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
            if (id === 'EENG-0192' || id === 'EENG-0210' || id === 'CSCI-0229' || 
                id === 'MATH-0207' || id === 'MATH-0208' || id === 'PHYS-310' || 
                id === 'PHYS-313' || id === 'CHEM-0231' || id === 'CHEM-0233') {
              categories.freshman.push({ id, ...course });
            } else if (id.startsWith('EENG-02') || id.startsWith('EENG-0260') || 
                      id.startsWith('EENG-221') || id.startsWith('EENG-260') ||
                      id === 'EENG-0225' || id === 'COEG-0300' || id === 'MENG-0237' ||
                      id === 'PHYS-311' || id === 'PHYS-314') {
              categories.sophomore.push({ id, ...course });
            } else if (id.startsWith('EENG-03') || id.startsWith('EENG-322') || 
                      id.startsWith('EENG-325') || id.startsWith('EENG-330') ||
                      id === 'COEG-0311' || id === 'COEG-0305' || id === 'EENG-0323' ||
                      id === 'EENG-0360' || id === 'MATH-0307' || id === 'MATH-0461') {
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
    Object.entries(currentCourses).forEach(([id, c]) => {
      // Courses marked with countForDegree: false do not contribute to graduation credit totals
      const counts = c.countForDegree !== false;
      const cr = Number(c.credits) || 0;
      if (counts) availableCredits += cr;
      if (counts && completedCourses.includes(id)) completedCredits += cr;
    });

    // Default: requiredCredits equals availableCredits (all courses required)
    let requiredCredits = availableCredits;
    // Graduation requirement: 129 credits for both CE and EE programs
    requiredCredits = 129;

    const remaining = Math.max(0, requiredCredits - completedCredits);
    return { completedCredits, requiredCredits, availableCredits, remaining };
  }, [currentCourses, completedCourses, selectedProgram]);

  const resetProgress = () => {
    setCompletedCourses([]);
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
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Math Readiness Check</h2>
            <p className="text-gray-600 mb-6">
              To help plan your course sequence, please select your current math preparation level:
            </p>
            
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
        <div className="bg-gray-400 text-white p-4 rounded-lg shadow">
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
              🎯 Technical Electives (Choose 3)
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Machine Learning, AI, Cybersecurity, Software Engineering, Mobile Security
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
            <div className="text-3xl font-bold text-gray-600">{stats.blocked}</div>
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