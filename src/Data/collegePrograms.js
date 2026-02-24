import { eeCourses } from './eeCourses';
import { ceCourses } from './ceCourses';
import { meCourses } from './meCourses';
import { aeCourses } from './aeCourses';
import { chemECourses } from './chemECourses';

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
    availability: 'full',
    requiredCredits: 131,
    courses: chemECourses
  },
  AE: {
    id: 'AE',
    name: 'Aerospace Science Engineering',
    department: 'Aerospace Science Engineering',
    availability: 'full',
    requiredCredits: 131,
    courses: aeCourses
  },
  AV: {
    id: 'AV',
    name: 'Aviation Science',
    department: 'Aerospace Science Engineering',
    availability: 'pending',
    requiredCredits: null,
    courses: {}
  }
};

export const collegeProgramList = Object.values(collegePrograms);
