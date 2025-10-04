// src/data/eeCourses.js

export const eeCourses = {
  // ==================== MATH COURSES ====================
  'MATH-0107': {
    id: 'MATH-0107',
    name: 'Precalculus Algebra',
    credits: 3,
    prerequisites: [],
    category: 'foundation',
    semesters: ['Fall', 'Spring']
  },
  'MATH-0108': {
    id: 'MATH-0108',
    name: 'Precalculus Trigonometry',
    credits: 3,
    prerequisites: [],
    category: 'foundation',
    semesters: ['Fall', 'Spring']
  },
  'MATH-0207': {
    id: 'MATH-0207',
    name: 'Calculus I',
    credits: 4,
    prerequisites: ['MATH-0107', 'MATH-0108'],
    category: 'core',
    semesters: ['Fall', 'Spring']
  },
  'MATH-0208': {
    id: 'MATH-0208',
    name: 'Calculus II',
    credits: 4,
    prerequisites: ['MATH-0207'],
    category: 'core',
    semesters: ['Fall', 'Spring']
  },
  'MATH-0209': {
    id: 'MATH-0209',
    name: 'Calculus III',
    credits: 4,
    prerequisites: ['MATH-0207', 'MATH-0208'],
    category: 'core',
    semesters: ['Fall', 'Spring']
  },
  'MATH-0461': {
    id: 'MATH-0461',
    name: 'Engineering Math',
    credits: 3,
    prerequisites: ['EENG-0225'],
    category: 'core',
    semesters: ['Fall', 'Spring']
  },

  // ==================== PHYSICS COURSES ====================
  'PHYS-310': {
    id: 'PHYS-310',
    name: 'Physics I',
    credits: 3,
    prerequisites: ['MATH-0207'],
    corequisite: 'PHYS-313',
    category: 'core',
    semesters: ['Fall', 'Spring']
  },
  'PHYS-313': {
    id: 'PHYS-313',
    name: 'Physics I Lab',
    credits: 1,
    prerequisites: [],
    corequisite: 'PHYS-310',
    category: 'core',
    semesters: ['Fall', 'Spring']
  },
  'PHYS-311': {
    id: 'PHYS-311',
    name: 'Physics II',
    credits: 3,
    prerequisites: ['PHYS-310'],
    corequisite: 'PHYS-314',
    category: 'core',
    semesters: ['Fall', 'Spring']
  },
  'PHYS-314': {
    id: 'PHYS-314',
    name: 'Physics II Lab',
    credits: 1,
    prerequisites: [],
    corequisite: 'PHYS-311',
    category: 'core',
    semesters: ['Fall', 'Spring']
  },

  // ==================== CHEMISTRY COURSES ====================
  'CHEM-0231': {
    id: 'CHEM-0231',
    name: 'General Chemistry',
    credits: 4,
    prerequisites: [],
    // Chemistry must be taken with its lab and with Precalculus (MATH-0107) or higher
    corequisite: ['CHEM-0233', 'MATH-0107'],
    category: 'core',
    semesters: ['Fall', 'Spring']
  },
  'CHEM-0233': {
    id: 'CHEM-0233',
    name: 'General Chemistry Lab',
    credits: 1,
    prerequisites: [],
    corequisite: 'CHEM-0231',
    category: 'core',
    semesters: ['Fall', 'Spring']
  },

  // ==================== GENERAL EDUCATION ====================
  'LIFE-SCI': {
    id: 'LIFE-SCI',
    name: 'Life Science (Biology)',
    credits: 3,
    prerequisites: [],
    category: 'gen-ed',
    semesters: ['Fall', 'Spring']
  },
  'ENGL-1': {
    id: 'ENGL-1',
    name: 'English Composition I',
    credits: 3,
    prerequisites: [],
    category: 'gen-ed',
    semesters: ['Fall', 'Spring']
  },
  'ENGL-2': {
    id: 'ENGL-2',
    name: 'English Composition II',
    credits: 3,
    prerequisites: ['ENGL-1'],
    category: 'gen-ed',
    semesters: ['Fall', 'Spring']
  },
  'TECH-WRITING': {
    id: 'TECH-WRITING',
    name: 'Technical Writing',
    credits: 3,
    prerequisites: ['ENGL-1', 'ENGL-2'],
    category: 'gen-ed',
    semesters: ['Fall', 'Spring']
  },
  'ORIENTATION': {
    id: 'ORIENTATION',
    name: 'Orientation',
    credits: 1,
    prerequisites: [],
    category: 'gen-ed',
    semesters: ['Fall']
  },
  'HUMANITIES': {
    id: 'HUMANITIES',
    name: 'Humanities Elective',
    credits: 2,
    prerequisites: [],
    category: 'gen-ed',
    semesters: ['Fall', 'Spring']
  },
  'SOC-SCI-1': {
    id: 'SOC-SCI-1',
    name: 'Social Science I (History/Psychology)',
    credits: 3,
    prerequisites: [],
    category: 'gen-ed',
    semesters: ['Fall', 'Spring']
  },
  'SOC-SCI-2': {
    id: 'SOC-SCI-2',
    name: 'Social Science II',
    credits: 3,
    prerequisites: [],
    category: 'gen-ed',
    semesters: ['Fall', 'Spring']
  },
  'SOC-SCI-3': {
    id: 'SOC-SCI-3',
    name: 'Social Science III',
    credits: 3,
    prerequisites: [],
    category: 'gen-ed',
    semesters: ['Fall', 'Spring']
  },
  'SOC-SCI-4': {
    id: 'SOC-SCI-4',
    name: 'Social Science IV',
    credits: 3,
    prerequisites: [],
    category: 'gen-ed',
    semesters: ['Fall', 'Spring']
  },
  'PE': {
    id: 'PE',
    name: 'Physical Education',
    credits: 2,
    prerequisites: [],
    category: 'gen-ed',
    semesters: ['Fall', 'Spring']
  },
  'EENG-0441': {
    id: 'EENG-0441',
    name: 'EIT Review',
    credits: 1,
    prerequisites: ['EENG-0225'],
    category: 'support',
    semesters: ['Fall', 'Spring']
  },
  'MENG-0429': {
    id: 'MENG-0429',
    name: 'Engineering Economics',
    credits: 2,
    prerequisites: [],
    category: 'gen-ed',
    semesters: ['Fall', 'Spring']
  },
  'ENG-ECON': {
    id: 'ENG-ECON',
    name: 'Engineering Economics',
    credits: 2,
    prerequisites: ['MATH-0207'],
    category: 'gen-ed',
    semesters: ['Fall', 'Spring']
  },

  // ==================== FRESHMAN ENGINEERING ====================
  'EENG-0192': {
    id: 'EENG-0192',
    name: 'Freshman Design',
    credits: 3,
    prerequisites: [],
    category: 'core',
    semesters: ['Fall'] // ✅ Fall only
  },
  'EENG-0210': {
    id: 'EENG-0210',
    name: 'Python Programming',
    credits: 3,
    prerequisites: ['EENG-0192'],
    category: 'core',
    semesters: ['Fall'] // ✅ Fall only
  },
  'CSCI-0229': {
    id: 'CSCI-0229',
    name: 'Intro to C++ Programming',
    credits: 3,
    prerequisites: ['EENG-0192'],
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

  // ==================== CIRCUITS SEQUENCE ====================
  'EENG-0221': {
    id: 'EENG-0221',
    name: 'Circuits I',
    credits: 3,
    prerequisites: ['EENG-0192', 'MATH-0207'],
    corequisite: 'EENG-221L',
    category: 'core',
    semesters: ['Fall', 'Spring'] // ✅✅ Both
  },
  'EENG-221L': {
    id: 'EENG-221L',
    name: 'Circuits I Lab',
    credits: 1,
    prerequisites: [],
    corequisite: 'EENG-0221',
    category: 'core',
    semesters: ['Fall', 'Spring'] // ✅✅ Both
  },
  'EENG-0260': {
    id: 'EENG-0260',
    name: 'Intro to Logic Circuits',
    credits: 3,
    prerequisites: ['EENG-0192'],
    corequisite: 'EENG-260L',
    category: 'core',
    semesters: ['Spring'] // Spring only
  },
  'EENG-0322': {
    id: 'EENG-0322',
    name: 'Circuits II',
    credits: 3,
    prerequisites: ['EENG-0221', 'EENG-221L', 'MATH-0208'],
    corequisite: 'EENG-322L',
    category: 'core',
    semesters: ['Fall', 'Spring'] // ✅✅ Both
  },
  'EENG-322L': {
    id: 'EENG-322L',
    name: 'Circuits II Lab',
    credits: 1,
    prerequisites: [],
    corequisite: 'EENG-0322',
    category: 'core',
    semesters: ['Fall', 'Spring'] // ✅✅ Both
  },
  'EENG-260L': {
    id: 'EENG-260L',
    name: 'Logic Circuits Lab',
    credits: 1,
    prerequisites: [],
    corequisite: 'EENG-0260',
    category: 'core',
    semesters: ['Spring'] // ❌✅ Spring only
  },

  // ==================== MATH & THEORY ====================
  'EENG-0225': {
    id: 'EENG-0225',
    name: 'Differential Equations & Linear Algebra',
    credits: 4,
    prerequisites: ['MATH-0208'],
    category: 'core',
    semesters: ['Spring'] // ❌✅ Spring only
  },

  // ==================== SIGNALS & SYSTEMS ====================
  'EENG-0323': {
    id: 'EENG-0323',
    name: 'Signals & Systems',
    credits: 3,
    prerequisites: ['EENG-0225'],
    category: 'core',
    semesters: ['Fall'] // ✅ Fall only
  },

  // ==================== ELECTRONICS ====================
  'EENG-0325': {
    id: 'EENG-0325',
    name: 'Electronics I',
    credits: 3,
    prerequisites: ['EENG-0322', 'EENG-322L'],
    corequisite: 'EENG-0325L',
    category: 'core',
    semesters: ['Fall', 'Spring'] // ✅✅ Both (EE uses 0330)
  },
  'EENG-0325L': {
    id: 'EENG-0325L',
    name: 'Electronics I Lab',
    credits: 1,
    prerequisites: [],
    corequisite: 'EENG-0325',
    category: 'core',
    semesters: ['Fall', 'Spring'] // ✅✅ Both
  },
  'EENG-0330': {
    id: 'EENG-0330',
    name: 'Electronics II',
    credits: 3,
    prerequisites: ['EENG-0322', 'EENG-322L'],
    corequisite: 'EENG-0330L',
    category: 'core',
    semesters: ['Fall', 'Spring'] // ✅✅ Both
  },
  'EENG-0330L': {
    id: 'EENG-0330L',
    name: 'Electronics II Lab',
    credits: 1,
    prerequisites: [],
    corequisite: 'EENG-0330',
    category: 'core',
    semesters: ['Fall', 'Spring'] // ✅✅ Both
  },

  // ==================== MICROPROCESSORS ====================
  'EENG-0360': {
    id: 'EENG-0360',
    name: 'Microprocessors',
    credits: 3,
    prerequisites: ['EENG-0260', 'CSCI-0229'],
    category: 'core',
    semesters: ['Fall'] // ✅ Fall only
  },

  // ==================== ELECTROMAGNETICS ====================
  'EENG-0315': {
    id: 'EENG-0315',
    name: 'Electromagnetics',
    credits: 3,
    prerequisites: ['EENG-0225', 'EENG-0322', 'EENG-322L'],
    category: 'core',
    semesters: ['Fall'] // ✅ Fall only
  },

  // ==================== ADVANCED EE COURSES ====================
  'EENG-0390': {
    id: 'EENG-0390',
    name: 'Engineering Ethics & Society',
    credits: 3,
    prerequisites: [],
    category: 'gen-ed',
    semesters: ['Fall', 'Spring']
  },
  'EENG-0400': {
    id: 'EENG-0400',
    name: 'Microelectronics',
    credits: 3,
    // Require both Electronics II and Electromagnetics
    prerequisites: ['EENG-0330','EENG-0315'],
    category: 'core',
    semesters: ['Spring'] // ❌✅ Spring only
  },
  'EENG-0401': {
    id: 'EENG-0401',
    name: 'Communication Theory',
    credits: 3,
    prerequisites: ['EENG-0323'],
    category: 'core',
    semesters: ['Spring'] // ❌✅ Spring only
  },
  'EENG-0402': {
    id: 'EENG-0402',
    name: 'Fundamentals of Power & Energy',
    credits: 3,
    prerequisites: ['EENG-0315', 'EENG-0322', 'EENG-322L', 'EENG-0225'],
    category: 'core',
    semesters: ['Fall', 'Spring'] // ✅✅ Both (updated per your note)
  },
  'EENG-424L': {
    id: 'EENG-424L',
    name: 'Senior Electrical Lab',
    credits: 1,
    prerequisites: ['EENG-0330', 'EENG-0330L'],
    category: 'capstone',
    semesters: ['Spring'] // ❌✅ Spring only
  },
  // Computer Network Design removed - CE course only

  'EENG-0431': {
    id: 'EENG-0431',
    name: 'Control Systems',
    credits: 3,
    prerequisites: ['EENG-0323'],
    category: 'core',
    semesters: ['Spring'] // ❌✅ Spring only
  },
  'EENG-431L': {
    id: 'EENG-431L',
    name: 'Control Systems Lab',
    credits: 1,
    prerequisites: [],
    corequisite: 'EENG-0431',
    category: 'core',
    semesters: ['Spring'] // ❌✅ Spring only
  },

  // ==================== CAPSTONE ====================
  'EENG-0470': {
    id: 'EENG-0470',
    name: 'Senior Design I',
    credits: 2,
  prerequisites: ['EENG-0360', 'EENG-0330', 'EENG-0330L', 'MENG-0237', 'EENG-0315', 'EENG-0323'],
    category: 'capstone',
    semesters: ['Fall', 'Spring'] // ✅✅ Both
  },
  'EENG-0471': {
    id: 'EENG-0471',
    name: 'Senior Design II',
    credits: 2,
    prerequisites: ['EENG-0470'],
    category: 'capstone',
    semesters: ['Fall', 'Spring'] // ✅✅ Both
  }
};