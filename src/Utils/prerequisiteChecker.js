// src/utils/prerequisiteChecker.js

// Collect missing prerequisites that are not in completedCourses.
// This recursively traverses the prerequisite graph and returns
// the set of prerequisite course IDs that must be completed first.
const collectMissingPrereqs = (courseId, completedCourses, allCourses, visited = new Set()) => {
  if (visited.has(courseId)) return [];
  visited.add(courseId);

  const course = allCourses[courseId];
  if (!course) return [courseId];

  const prerequisites = course.prerequisites || [];
  let missing = [];

  for (const prereq of prerequisites) {
    // If the prerequisite is already completed, it's fine
    if (completedCourses.includes(prereq)) continue;

    // Otherwise, the prereq itself is missing. Add it and also
    // traverse that prereq's prerequisites to show the full chain.
    missing.push(prereq);
    const nested = collectMissingPrereqs(prereq, completedCourses, allCourses, visited);
    missing = missing.concat(nested.filter(m => !missing.includes(m)));
  }

  return missing;
};

export const checkPrerequisites = (courseId, completedCourses, allCourses) => {
  const course = allCourses[courseId];
  
  if (!course) {
    return { canTake: false, missing: [] };
  }
  
  if (completedCourses.includes(courseId)) {
    return { canTake: true, missing: [], alreadyCompleted: true };
  }
  // Determine missing prerequisites (require completion). This will
  // return an array of course IDs that are not yet completed and are
  // required before taking this course.
  const missingPrereqs = collectMissingPrereqs(courseId, completedCourses, allCourses);

  // Normalize corequisite to array to support multiple coreqs (lab + math)
  const coreqs = Array.isArray(course.corequisite) ? course.corequisite : (course.corequisite ? [course.corequisite] : []);

  const corequisiteMet = coreqs.every(cq => completedCourses.includes(cq));

  // Corequisites do not block availability (they may be taken concurrently).
  const canTake = missingPrereqs.length === 0;

  return {
    canTake,
    missing: missingPrereqs,
    corequisite: coreqs,
    corequisiteMet
  };
};

export const getCourseStatus = (courseId, completedCourses, allCourses) => {
  if (completedCourses.includes(courseId)) {
    return 'completed';
  }
  
  const { canTake } = checkPrerequisites(courseId, completedCourses, allCourses);
  
  return canTake ? 'available' : 'blocked';
};

export const getAvailableCourses = (completedCourses, allCourses) => {
  if (!allCourses || typeof allCourses !== 'object') {
    console.error('getAvailableCourses: allCourses is invalid', allCourses);
    return [];
  }
  return Object.keys(allCourses).filter(courseId => {
    const { canTake } = checkPrerequisites(courseId, completedCourses, allCourses);
    return canTake && !completedCourses.includes(courseId);
  });
};