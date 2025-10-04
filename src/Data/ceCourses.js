// src/Data/ceCourses.js

export const ceCourses = {
  // ==================== MATH & SCIENCE ====================
  'MATH-0107': { id: 'MATH-0107', name: 'Precalculus Algebra', credits: 3, prerequisites: [], category: 'foundation', semesters: ['Fall','Spring'] },
  'MATH-0108': { id: 'MATH-0108', name: 'Precalculus Trigonometry', credits: 3, prerequisites: [], category: 'foundation', semesters: ['Fall','Spring'] },
  'MATH-0207': { id: 'MATH-0207', name: 'Calculus I', credits: 4, prerequisites: ['MATH-0107','MATH-0108'], category: 'core', semesters: ['Fall','Spring'] },
  'MATH-0208': { id: 'MATH-0208', name: 'Calculus II', credits: 4, prerequisites: ['MATH-0207'], category: 'core', semesters: ['Fall','Spring'] },
  'MATH-0307': { id: 'MATH-0307', name: 'Calculus III / Engineering Math', credits: 4, prerequisites: ['MATH-0208'], category: 'core', semesters: ['Fall','Spring'] },
  'EENG-0225': { id: 'EENG-0225', name: 'Differential Equations & Linear Algebra', credits: 4, prerequisites: ['MATH-0208'], category: 'core', semesters: ['Spring'] },

  'CHEM-0231': { id: 'CHEM-0231', name: 'General Chemistry', credits: 4, prerequisites: [], corequisite: ['CHEM-0233','MATH-0107'], category: 'core', semesters: ['Fall','Spring'] },
  'CHEM-0233': { id: 'CHEM-0233', name: 'General Chemistry Lab', credits: 1, prerequisites: [], corequisite: 'CHEM-0231', category: 'core', semesters: ['Fall','Spring'] },

  'PHYS-310': { id: 'PHYS-310', name: 'General Physics I', credits: 3, prerequisites: ['MATH-0207'], corequisite: 'PHYS-313', category: 'core', semesters: ['Fall','Spring'] },
  'PHYS-313': { id: 'PHYS-313', name: 'General Physics I Lab', credits: 1, prerequisites: [], corequisite: 'PHYS-310', category: 'core', semesters: ['Fall','Spring'] },
  'PHYS-311': { id: 'PHYS-311', name: 'General Physics II', credits: 3, prerequisites: ['PHYS-310'], corequisite: 'PHYS-314', category: 'core', semesters: ['Fall','Spring'] },
  'PHYS-314': { id: 'PHYS-314', name: 'General Physics II Lab', credits: 1, prerequisites: [], corequisite: 'PHYS-311', category: 'core', semesters: ['Fall','Spring'] },

  'LIFE-SCI': { id: 'LIFE-SCI', name: 'Science Elective (Biology)', credits: 3, prerequisites: [], category: 'gen-ed', semesters: ['Fall','Spring'] },

  // ==================== FRESHMAN ENGINEERING / SUPPORT ====================
  'EENG-0192': { id: 'EENG-0192', name: 'Freshman Engineering Design', credits: 3, prerequisites: [], category: 'core', semesters: ['Fall'] },
  'EENG-0210': { id: 'EENG-0210', name: 'Python Programming', credits: 3, prerequisites: ['EENG-0192'], category: 'core', semesters: ['Fall'] },
  'CSCI-0229': { id: 'CSCI-0229', name: 'C++ Programming', credits: 3, prerequisites: ['EENG-0192'], category: 'core', semesters: ['Fall','Spring'] },
  'MENG-0237': { id: 'MENG-0237', name: 'Probability & Statistics for Engineers', credits: 3, prerequisites: ['MATH-0207'], category: 'core', semesters: ['Fall','Spring'] },
  'EENG-0441': { id: 'EENG-0441', name: 'EIT Review', credits: 1, prerequisites: ['EENG-0225'], category: 'support', semesters: ['Fall','Spring'] },

  // ==================== CIRCUITS & LABS ====================
  'EENG-0221': { id: 'EENG-0221', name: 'Linear Networks & Circuits I', credits: 3, prerequisites: ['EENG-0192','MATH-0207'], corequisite: 'EENG-221L', category: 'core', semesters: ['Fall','Spring'] },
  'EENG-221L': { id: 'EENG-221L', name: 'Linear Networks & Circuits I Lab', credits: 1, prerequisites: [], corequisite: 'EENG-0221', category: 'core', semesters: ['Fall','Spring'] },
  'EENG-0322': { id: 'EENG-0322', name: 'Linear Networks & Circuits II', credits: 3, prerequisites: ['EENG-0221','EENG-221L','MATH-0208'], corequisite: 'EENG-322L', category: 'core', semesters: ['Fall','Spring'] },
  'EENG-322L': { id: 'EENG-322L', name: 'Linear Networks & Circuits II Lab', credits: 1, prerequisites: [], corequisite: 'EENG-0322', category: 'core', semesters: ['Fall','Spring'] },

  'EENG-0260': { id: 'EENG-0260', name: 'Intro. Logic Circuits', credits: 3, prerequisites: ['EENG-0192'], corequisite: 'EENG-260L', category: 'core', semesters: ['Spring'] },
  'EENG-260L': { id: 'EENG-260L', name: 'Intro. Logic Circuits Lab', credits: 1, prerequisites: [], corequisite: 'EENG-0260', category: 'core', semesters: ['Spring'] },

  'EENG-0323': { id: 'EENG-0323', name: 'Signals & Systems', credits: 3, prerequisites: ['EENG-0225'], category: 'core', semesters: ['Fall'] },
  'EENG-0325': { id: 'EENG-0325', name: 'Electronics I', credits: 3, prerequisites: ['EENG-0322','EENG-322L'], corequisite: 'EENG-325L', category: 'core', semesters: ['Fall','Spring'] },
  'EENG-325L': { id: 'EENG-325L', name: 'Electronics I Lab', credits: 1, prerequisites: [], corequisite: 'EENG-0325', category: 'core', semesters: ['Fall','Spring'] },
  'EENG-0330': { id: 'EENG-0330', name: 'Electronics II', credits: 3, prerequisites: ['EENG-0325','EENG-325L'], corequisite: 'EENG-330L', category: 'core', semesters: ['Fall','Spring'] },
  'EENG-330L': { id: 'EENG-330L', name: 'Electronics II Lab', credits: 1, prerequisites: [], corequisite: 'EENG-0330', category: 'core', semesters: ['Fall','Spring'] },

  'EENG-0360': { id: 'EENG-0360', name: 'Microprocessors', credits: 3, prerequisites: ['EENG-0260','CSCI-0229'], category: 'core', semesters: ['Fall'] },
  'EENG-0425': { id: 'EENG-0425', name: 'Computer Network Design', credits: 3, prerequisites: ['EENG-0323'], category: 'core', semesters: ['Fall','Spring'] },

  // ==================== COEG / CE SPECIALIZED ====================
  'COEG-0300': { id: 'COEG-0300', name: 'Discrete Math Structures I', credits: 3, prerequisites: ['MATH-0207','EENG-0210','CSCI-0229'], category: 'core', semesters: ['Fall','Spring'] },
  'COEG-0311': { id: 'COEG-0311', name: 'Data Structures & Algorithms', credits: 3, prerequisites: ['COEG-0300'], category: 'core', semesters: ['Fall','Spring'] },
  'COEG-0305': { id: 'COEG-0305', name: 'Fundamentals of Cybersecurity', credits: 3, prerequisites: ['EENG-0210','CSCI-0229'], category: 'core', semesters: ['Fall','Spring'] },
  'COEG-0405': { id: 'COEG-0405', name: 'Internet of Things (IoT)', credits: 3, prerequisites: ['EENG-0210','COEG-0305','EENG-0360','EENG-0425'], category: 'core', semesters: ['Fall'] },
  'COEG-0410': { id: 'COEG-0410', name: 'Computer Hardware Design', credits: 3, prerequisites: ['EENG-0360'], category: 'core', semesters: ['Fall','Spring'] },
  'COEG-0411': { id: 'COEG-0411', name: 'Hardware Security', credits: 3, prerequisites: ['COEG-0305','COEG-0410'], category: 'core', semesters: ['Fall','Spring'] },

  'COEG-0435': { id: 'COEG-0435', name: 'Machine Learning for Engineers', credits: 3, prerequisites: ['EENG-0210','EENG-0225','MENG-0237'], category: 'elective', semesters: ['Fall'] },
  'COEG-0445': { id: 'COEG-0445', name: 'Artificial Intelligence for Engineers', credits: 3, prerequisites: ['EENG-0210','EENG-0225','MENG-0237'], category: 'elective', semesters: ['Spring'] },
  'COEG-0456': { id: 'COEG-0456', name: 'Cybersecurity Engineering Practicum', credits: 3, prerequisites: ['COEG-0305','EENG-0425'], category: 'elective', semesters: ['Fall'] },
  'CSCI-0430': { id: 'CSCI-0430', name: 'Software Engineering', credits: 3, prerequisites: ['COEG-0300','COEG-0311'], category: 'elective', semesters: ['Fall','Spring'] },
  'CSCI-0436': { id: 'CSCI-0436', name: 'Mobile Security', credits: 3, prerequisites: ['COEG-0305','EENG-0425'], category: 'elective', semesters: ['Fall','Spring'] },

  // ==================== CAPSTONE ====================
  'COEG-0470': { id: 'COEG-0470', name: 'Senior Design I', credits: 2, prerequisites: ['EENG-0323','EENG-0360','COEG-0305','COEG-0311','MENG-0237'], category: 'capstone', semesters: ['Fall','Spring'] },
  'COEG-0471': { id: 'COEG-0471', name: 'Senior Design II', credits: 2, prerequisites: ['COEG-0470'], category: 'capstone', semesters: ['Fall','Spring'] }
};