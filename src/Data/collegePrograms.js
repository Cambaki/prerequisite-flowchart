import { eeCourses } from './eeCourses';
import { ceCourses } from './ceCourses';
import { meCourses } from './meCourses';

const sharedCoreCourses = {
  'MATH-0107': ceCourses['MATH-0107'],
  'MATH-0108': ceCourses['MATH-0108'],
  'MATH-0207': ceCourses['MATH-0207'],
  'MATH-0208': ceCourses['MATH-0208'],
  'MATH-0209': ceCourses['MATH-0209'],
  'CHEM-0231': ceCourses['CHEM-0231'],
  'CHEM-0233': ceCourses['CHEM-0233'],
  'PHYS-310': ceCourses['PHYS-310'],
  'PHYS-313': ceCourses['PHYS-313'],
  'PHYS-311': ceCourses['PHYS-311'],
  'PHYS-314': ceCourses['PHYS-314'],
  'EENG-0192': ceCourses['EENG-0192'],
  'ENGL-0101': ceCourses['ENGL-0101'],
  'ENGL-0102': ceCourses['ENGL-0102'],
  'EENG-0390': ceCourses['EENG-0390'],
  'MENG-0429': ceCourses['MENG-0429']
};

export const collegePrograms = {
  EE: {
    id: 'EE',
    name: 'Electrical Engineering',
    department: 'Electrical & Computer Engineering',
    availability: 'full',
    requiredCredits: 129,
    courses: eeCourses
  },
  CE: {
    id: 'CE',
    name: 'Computer Engineering',
    department: 'Electrical & Computer Engineering',
    availability: 'full',
    requiredCredits: 129,
    courses: ceCourses
  },
  ME: {
    id: 'ME',
    name: 'Mechanical Engineering',
    department: 'Mechanical Engineering',
    availability: 'full',
    requiredCredits: 131,
    courses: meCourses
  },
  CH: {
    id: 'CH',
    name: 'Chemical Engineering',
    department: 'Chemical Engineering',
    availability: 'beta',
    requiredCredits: null,
    courses: sharedCoreCourses
  },
  AE: {
    id: 'AE',
    name: 'Aerospace Engineering',
    department: 'Aerospace Science Engineering',
    availability: 'beta',
    requiredCredits: null,
    courses: sharedCoreCourses
  }
};

export const collegeProgramList = Object.values(collegePrograms);
