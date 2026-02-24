import { ceCourses } from './ceCourses';

const meSharedCourses = {
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
  'ENGL-0101': ceCourses['ENGL-0101'],
  'ENGL-0102': ceCourses['ENGL-0102'],
  'CSCI-0229': ceCourses['CSCI-0229'],
  'OREN-0100': ceCourses['OREN-0100'],
  'OREN-0101': ceCourses['OREN-0101'],
  'PE-1': ceCourses['PE-1'],
  'PE-2': ceCourses['PE-2'],
  'MENG-0441': ceCourses['MENG-0441']
};

export const meCourses = {
  ...meSharedCourses,

  'MENG-0131': {
    id: 'MENG-0131',
    name: 'Engineering Graphics',
    credits: 2,
    prerequisites: [],
    category: 'core',
    semesters: ['Fall']
  },
  'MENG-0132': {
    id: 'MENG-0132',
    name: 'Freshman Design',
    credits: 3,
    prerequisites: ['MENG-0131'],
    category: 'core',
    semesters: ['Spring']
  },
  'HIST-0103': {
    id: 'HIST-0103',
    name: 'History I',
    credits: 3,
    prerequisites: [],
    category: 'gen-ed',
     semesters: ['Fall', 'Spring']
  },
  'HIST-0104': {
    id: 'HIST-0104',
    name: 'History II',
    credits: 3,
    prerequisites: [],
    category: 'gen-ed',
     semesters: ['Fall', 'Spring']
  },
  BIOL: {
    id: 'BIOL',
    name: 'Biology',
    credits: 3,
    prerequisites: [],
    category: 'gen-ed',
    semesters: ['Fall', 'Spring']
  },
  SBS1: {
    id: 'SBS1',
    name: 'Social & Behavioral Science I',
    credits: 3,
    prerequisites: [],
    category: 'gen-ed',
    semesters: ['Fall', 'Spring']
  },
  SBS2: {
    id: 'SBS2',
    name: 'Social & Behavioral Science II',
    credits: 3,
    prerequisites: [],
    category: 'gen-ed',
    semesters: ['Fall', 'Spring']
  },
  FPAR: {
    id: 'FPAR',
    name: 'Fine Arts Elective',
    credits: 2,
    prerequisites: [],
    category: 'gen-ed',
    semesters: ['Fall', 'Spring']
  },
  ENGL: {
    id: 'ENGL',
    name: 'English Literature',
    credits: 3,
    prerequisites: ['ENGL-0102'],
    category: 'gen-ed',
    semesters: ['Fall', 'Spring']
  },

  'MATH-0307': {
    id: 'MATH-0307',
    name: 'Differential Equations',
    credits: 3,
    prerequisites: ['MATH-0209'],
    category: 'core',
    semesters: ['Fall', 'Spring']
  },
  'MENG-0206': {
    id: 'MENG-0206',
    name: 'Mechanical Dissection',
    credits: 2,
    prerequisites: ['MENG-0132'],
    category: 'core',
     semesters: ['Fall']
  },
  'MENG-0211': {
    id: 'MENG-0211',
    name: 'Statics',
    credits: 3,
    prerequisites: ['MENG-0206', 'MATH-0208'],
    category: 'core',
     semesters: ['Fall', 'Spring']
  },
  'MENG-0212': {
    id: 'MENG-0212',
    name: 'Dynamics',
    credits: 3,
    prerequisites: ['MENG-0211'],
    category: 'core',
     semesters: ['Fall', 'Spring']
  },
  'MENG-0237': {
    id: 'MENG-0237',
    name: 'Probability & Statistics for Engineers',
    credits: 3,
    prerequisites: ['MATH-0207'],
    category: 'core',
     semesters: ['Fall', 'Spring']
  },
  'MENG-0310': {
    id: 'MENG-0310',
    name: 'Experimental Mechanics Lab I',
    credits: 1,
    prerequisites: ['MENG-0211'],
    category: 'core',
     semesters: ['Fall', 'Spring']
  },
  'MENG-0311': {
    id: 'MENG-0311',
    name: 'Thermodynamics I',
    credits: 3,
    prerequisites: ['CHEM-0231', 'PHYS-310', 'MATH-0208'],
    category: 'core',
     semesters: ['Fall', 'Spring']
  },
  'MENG-0312': {
    id: 'MENG-0312',
    name: 'Thermodynamics II',
    credits: 3,
    prerequisites: ['MENG-0311'],
    category: 'core',
     semesters: ['Fall', 'Spring']
  },
  'MENG-0313': {
    id: 'MENG-0313',
    name: 'Fluid Mechanics',
    credits: 3,
    prerequisites: ['MENG-0212', 'MENG-0311'],
    category: 'core',
    semesters: ['Fall', 'Spring']
  },
  'MENG-0314': {
    id: 'MENG-0314',
    name: 'Manufacturing Processes',
    credits: 3,
    prerequisites: ['MENG-0206'],
    category: 'core',
    semesters: ['Spring']
  },
  'MENG-0315': {
    id: 'MENG-0315',
    name: 'Theory of Machines',
    credits: 3,
    prerequisites: ['MENG-0212', 'MENG-0316'],
    category: 'core',
    semesters: ['Fall']
  },
  'MENG-0316': {
    id: 'MENG-0316',
    name: 'Strength of Materials',
    credits: 3,
    prerequisites: ['MENG-0211'],
    category: 'core',
    semesters: ['Fall','Spring']
  },
  'MENG-0317': {
    id: 'MENG-0317',
    name: 'Measurements & Analysis Lab',
    credits: 1,
    prerequisites: ['MENG-0310'],
    category: 'core',
     semesters: ['Fall', 'Spring']
  },
  'MENG-0318': {
    id: 'MENG-0318',
    name: 'Materials Engineering',
    credits: 3,
    prerequisites: ['CHEM-0231'],
    category: 'core',
    semesters: ['Spring']
  },
  'MENG-0319': {
    id: 'MENG-0319',
    name: 'Advanced Materials Lab',
    credits: 1,
    prerequisites: ['MENG-0318'],
    category: 'core',
     semesters: ['Fall', 'Spring']
  },
  'MENG-0390': {
    id: 'MENG-0390',
    name: 'Engineering Ethics',
    credits: 3,
    prerequisites: [],
    category: 'gen-ed',
     semesters: ['Fall', 'Spring']
  },
  'MENG-0412': {
    id: 'MENG-0412',
    name: 'Thermal Science Lab',
    credits: 1,
    prerequisites: ['MENG-0312'],
    corequisite: 'MENG-0414',
    category: 'core',
     semesters: ['Fall', 'Spring']
  },
  'MENG-0414': {
    id: 'MENG-0414',
    name: 'Heat Transfer',
    credits: 3,
    prerequisites: ['MENG-0312', 'MENG-0313'],
    category: 'core',
     semesters: ['Fall', 'Spring']
  },
  'MENG-0416': {
    id: 'MENG-0416',
    name: 'Mechanical Design',
    credits: 3,
    prerequisites: ['MENG-0316'],
    category: 'core',
     semesters: ['Fall', 'Spring']
  },
  'MENG-0418': {
    id: 'MENG-0418',
    name: 'HVAC',
    credits: 3,
    prerequisites: ['MENG-0414'],
    category: 'elective',
     semesters: ['Fall', 'Spring']
  },
  'MENG-0420': {
    id: 'MENG-0420',
    name: 'CAD',
    credits: 2,
    prerequisites: ['MENG-0416'],
    category: 'core',
     semesters: ['Fall', 'Spring']
  },
  'MENG-0422': {
    id: 'MENG-0422',
    name: 'Capstone Design',
    credits: 3,
    prerequisites: ['MENG-0416', 'MENG-0317'],
    category: 'capstone',
     semesters: ['Fall', 'Spring']
  },
  'MENG-0425': {
    id: 'MENG-0425',
    name: 'Renewable Energy',
    credits: 2,
    prerequisites: ['MENG-0312'],
    category: 'elective',
     semesters: ['Spring']
  },
  'MENG-0429': {
    id: 'MENG-0429',
    name: 'Engineering Economics',
    credits: 2,
    prerequisites: ['MATH-0207'],
    category: 'gen-ed',
     semesters: ['Fall', 'Spring']
  },
  'MENG-0432': {
    id: 'MENG-0432',
    name: 'Mechatronics',
    credits: 3,
    prerequisites: ['EENG-0380', 'CSCI-0229'],
    category: 'elective',
     semesters: ['Fall', 'Spring']
  },
  'EENG-0380': {
    id: 'EENG-0380',
    name: 'Principles of Electrical Engineering',
    credits: 3,
    prerequisites: ['PHYS-311'],
    corequisite: 'EENG-380L',
    category: 'support',
     semesters: ['Fall', 'Spring']
  },
  'EENG-380L': {
    id: 'EENG-380L',
    name: 'Principles of Electrical Engineering Lab',
    credits: 1,
    prerequisites: ['PHYS-311'],
    corequisite: 'EENG-0380',
    category: 'support',
     semesters: ['Fall', 'Spring']
  },
  'TECH-ELEC-A': {
    id: 'TECH-ELEC-A',
    name: 'Technical Elective A',
    credits: 3,
    prerequisites: [],
    category: 'elective',
     semesters: ['Fall', 'Spring']
  }
};
