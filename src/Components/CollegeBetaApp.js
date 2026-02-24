import React, { useMemo, useState } from 'react';
import { collegePrograms, collegeProgramList } from '../Data/collegePrograms';
import { getAvailableCourses, getCourseStatus } from '../Utils/prerequisiteChecker';

const SECTION_ORDER = ['foundation', 'gen-ed', 'core', 'elective', 'capstone', 'support', 'other'];

const SECTION_TITLES = {
  foundation: 'Foundation Courses',
  'gen-ed': 'General Education & Support',
  core: 'Core Engineering',
  elective: 'Electives',
  capstone: 'Capstone',
  support: 'Support Courses',
  other: 'Other Courses'
};

function normalizeSections(courses) {
  const sections = SECTION_ORDER.reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});

  Object.values(courses || {}).forEach((course) => {
    const category = course.category || 'other';
    const normalized = sections[category] ? category : 'other';
    sections[normalized].push(course);
  });

  SECTION_ORDER.forEach((key) => {
    sections[key].sort((a, b) => a.id.localeCompare(b.id));
  });

  return sections;
}

function AccessibleCourseCard({ course, status, showDetails, onToggle }) {
  const statusStyles = {
    completed: 'bg-[#9B1B30] text-white border-[#9B1B30]',
    available: 'bg-yellow-100 text-gray-900 border-yellow-300',
    blocked: 'bg-gray-100 text-gray-600 border-gray-300'
  };

  const isBlocked = status === 'blocked';
  const statusText = status === 'completed' ? 'Completed' : status === 'available' ? 'Available' : 'Blocked';
  const prereqText = (course.prerequisites || []).join(', ');
  const coreqList = Array.isArray(course.corequisite)
    ? course.corequisite.join(', ')
    : course.corequisite || '';

  return (
    <button
      type="button"
      onClick={isBlocked ? undefined : onToggle}
      disabled={isBlocked}
      aria-pressed={status === 'completed'}
      aria-label={`${course.id} ${course.name}. Status ${statusText}. ${isBlocked ? 'Prerequisites not met.' : 'Toggle completion.'}`}
      className={`w-full text-left rounded-lg border p-4 transition-all ${statusStyles[status] || statusStyles.blocked}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{course.id}</div>
          <div className="font-medium">{course.name}</div>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wide">{statusText}</span>
      </div>
      <div className="mt-1 text-xs opacity-90">{course.credits} credits</div>

      {showDetails && (
        <div className="mt-3 space-y-1 text-xs">
          {!!course.description && <div>{course.description}</div>}
          {course.semesters?.length > 0 && <div><strong>Offered:</strong> {course.semesters.join(', ')}</div>}
          {!!prereqText && <div><strong>Prerequisites:</strong> {prereqText}</div>}
          {!!coreqList && <div><strong>Corequisite:</strong> {coreqList}</div>}
        </div>
      )}
    </button>
  );
}

export function CollegeBetaApp() {
  const [selectedProgram, setSelectedProgram] = useState('EE');
  const [completedCourses, setCompletedCourses] = useState([]);
  const [showDetails, setShowDetails] = useState(true);

  const programMeta = collegePrograms[selectedProgram];
  const currentCourses = useMemo(() => programMeta?.courses || {}, [programMeta]);

  const availableCourses = useMemo(
    () => getAvailableCourses(completedCourses, currentCourses),
    [completedCourses, currentCourses]
  );

  const sections = useMemo(() => normalizeSections(currentCourses), [currentCourses]);

  const stats = useMemo(() => {
    const total = Object.keys(currentCourses).length;
    const completed = completedCourses.length;
    const available = availableCourses.length;
    return {
      total,
      completed,
      available,
      blocked: Math.max(0, total - completed - available)
    };
  }, [currentCourses, completedCourses, availableCourses]);

  const creditSummary = useMemo(() => {
    let completedCredits = 0;
    let totalCreditsInCatalog = 0;

    Object.entries(currentCourses).forEach(([courseId, course]) => {
      const counts = course.countForDegree !== false;
      const credits = Number(course.credits) || 0;
      if (counts) totalCreditsInCatalog += credits;
      if (counts && completedCourses.includes(courseId)) completedCredits += credits;
    });

    const requiredCredits = programMeta.requiredCredits || totalCreditsInCatalog;
    const remaining = Math.max(0, requiredCredits - completedCredits);

    return {
      completedCredits,
      totalCreditsInCatalog,
      requiredCredits,
      remaining
    };
  }, [currentCourses, completedCourses, programMeta]);

  const onProgramChange = (programId) => {
    setSelectedProgram(programId);
    setCompletedCourses([]);
  };

  const onToggleCourse = (courseId) => {
    const status = getCourseStatus(courseId, completedCourses, currentCourses);
    if (status === 'blocked') return;

    setCompletedCourses((prev) => {
      if (prev.includes(courseId)) {
        return prev.filter((id) => id !== courseId);
      }
      return [...prev, courseId];
    });
  };

  return (
    <div className="max-w-7xl mx-auto" role="main" aria-labelledby="beta-title">
      <header className="mb-6">
        <h1 id="beta-title" className="text-4xl font-bold text-gray-800 mb-2">
          College of Engineering Planner (Beta)
        </h1>
        <p className="text-gray-600">
          Accessible beta version for engineering students. Currently available disciplines are Electrical (EE), Computer (CE), Aerospace (AE), Chemical (CH), and Mechanical (ME). Mechanical now includes a dedicated pathway, while Aerospace and Chemical remain in-progress.
        </p>
      </header>

      <section className="bg-white rounded-lg shadow p-4 mb-6" aria-label="Program selection">
        <label htmlFor="program-select" className="block text-sm font-semibold text-gray-800 mb-2">
          Select engineering program
        </label>
        <select
          id="program-select"
          value={selectedProgram}
          onChange={(event) => onProgramChange(event.target.value)}
          className="w-full md:w-[420px] border border-gray-300 rounded-lg px-3 py-2"
        >
          {collegeProgramList.map((program) => (
            <option key={program.id} value={program.id}>
              {program.name} ({program.id})
            </option>
          ))}
        </select>

        <div className="mt-3 text-sm text-gray-700">
          <div><strong>Department:</strong> {programMeta.department}</div>
          <div>
            <strong>Catalog status:</strong> {programMeta.availability === 'full' ? 'Full prerequisite map' : 'Beta shared-core map'}
          </div>
          <div>
            <strong>In progress:</strong> Aerospace and Chemical full pathways are under development.
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" aria-label="Progress statistics">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Courses</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">{stats.available}</div>
          <div className="text-sm text-gray-600">Available</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-600">{stats.blocked}</div>
          <div className="text-sm text-gray-600">Blocked</div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" aria-label="Credit summary">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{creditSummary.completedCredits}</div>
          <div className="text-sm text-gray-600">Credits Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-800">{creditSummary.requiredCredits}</div>
          <div className="text-sm text-gray-600">Required Credits</div>
          <div className="text-xs text-gray-500 mt-1">Catalog credits: {creditSummary.totalCreditsInCatalog}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">{creditSummary.remaining}</div>
          <div className="text-sm text-gray-600">Credits Remaining</div>
        </div>
      </section>

      <section className="mb-6 flex flex-wrap gap-3" aria-label="Display controls">
        <button
          type="button"
          onClick={() => setShowDetails((value) => !value)}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
        >
          {showDetails ? 'Hide' : 'Show'} details
        </button>
        <button
          type="button"
          onClick={() => setCompletedCourses([])}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Reset progress
        </button>
      </section>

      <div className="space-y-8">
        {SECTION_ORDER.map((sectionKey) => {
          const sectionCourses = sections[sectionKey];
          if (!sectionCourses || sectionCourses.length === 0) return null;

          return (
            <section key={sectionKey} aria-labelledby={`section-${sectionKey}`}>
              <h2 id={`section-${sectionKey}`} className="text-2xl font-bold text-gray-800 mb-3">
                {SECTION_TITLES[sectionKey]}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sectionCourses.map((course) => (
                  <AccessibleCourseCard
                    key={course.id}
                    course={course}
                    showDetails={showDetails}
                    status={getCourseStatus(course.id, completedCourses, currentCourses)}
                    onToggle={() => onToggleCourse(course.id)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
