// src/data/eeCourses.js

export const eeCourses = {
  // ==================== MATH COURSES ====================
  'MATH-0107': {
    id: 'MATH-0107',
    name: 'Precalculus Algebra',
    credits: 4,
    prerequisites: [],
    description: 'Precalculus algebra covering functions, polynomials, exponential and logarithmic functions, and equations needed for calculus readiness.',
    category: 'foundation',
    semesters: ['Fall', 'Spring'],
    countForDegree: false
  },
  'MATH-0108': {
    id: 'MATH-0108',
    name: 'Precalculus Trigonometry',
    credits: 4,
    prerequisites: [],
    description: 'Trigonometry and analytic geometry fundamentals including trigonometric functions, identities, and applications for engineering.',
    category: 'foundation',
    semesters: ['Fall', 'Spring'],
    countForDegree: false
  },
  'MATH-0207': {
    id: 'MATH-0207',
    name: 'Calculus I',
    credits: 4,
    prerequisites: ['MATH-0107', 'MATH-0108'],
    description: 'Introduction to differential and integral calculus of a single variable: limits, derivatives, applications, and basic integration.',
    category: 'core',
    semesters: ['Fall', 'Spring']
  },
  'MATH-0208': {
    id: 'MATH-0208',
    name: 'Calculus II',
    credits: 4,
    prerequisites: ['MATH-0207'],
    description: 'Techniques of integration, applications, sequences and series, and introductory differential equations relevant to engineering.',
    category: 'core',
    semesters: ['Fall', 'Spring']
  },
  'MATH-0209': {
    id: 'MATH-0209',
    name: 'Calculus III',
    credits: 4,
    prerequisites: ['MATH-0207', 'MATH-0208'],
    description: 'Multivariable calculus including partial derivatives, multiple integrals, vector calculus, and applications to physical systems.',
    category: 'core',
    semesters: ['Fall', 'Spring']
  },
  'MATH-0461': {
    id: 'MATH-0461',
    name: 'Engineering Math',
    credits: 3,
    prerequisites: ['EENG-0225'],
    description: 'Engineering-focused differential equations and linear algebra: solution techniques, matrix methods, and applications to systems modeling.',
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
    description: 'Mechanics: motion, forces, energy, momentum, rotational dynamics, and oscillations; foundation for later physics and engineering courses.',
    category: 'core',
    semesters: ['Fall', 'Spring']
  },
  'PHYS-313': {
    id: 'PHYS-313',
    name: 'Physics I Lab',
    credits: 1,
    // Match lecture prerequisites (PHYS-310 requires MATH-0207)
    prerequisites: ['MATH-0207'],
    corequisite: 'PHYS-310',
    description: 'Laboratory experiments supporting Physics I topics such as kinematics, dynamics, energy, and measurement techniques.',
    category: 'core',
    semesters: ['Fall', 'Spring']
  },
  'PHYS-311': {
    id: 'PHYS-311',
    name: 'Physics II',
    credits: 3,
    prerequisites: ['PHYS-310'],
    corequisite: 'PHYS-314',
    description: 'Electricity, magnetism, waves, and optics; builds on Physics I and supports electromagnetics and circuits courses.',
    category: 'core',
    semesters: ['Fall', 'Spring']
  },
  'PHYS-314': {
    id: 'PHYS-314',
    name: 'Physics II Lab',
    credits: 1,
    // Match lecture prerequisites (PHYS-311 requires PHYS-310)
    prerequisites: ['PHYS-310'],
    corequisite: 'PHYS-311',
    description: 'Laboratory for Physics II focusing on circuits, electromagnetism, and wave phenomena experiments.',
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
    description: 'Fundamental concepts in chemistry including atomic structure, bonding, stoichiometry, thermodynamics, kinetics, and equilibria.',
    category: 'core',
    semesters: ['Fall', 'Spring']
  },
  'CHEM-0233': {
    id: 'CHEM-0233',
    name: 'General Chemistry Lab',
    credits: 1,
    // Match lecture prerequisites (CHEM-0231 has no formal prerequisites)
    prerequisites: [],
    corequisite: 'CHEM-0231',
    description: 'Experimental laboratory exercises that reinforce concepts from General Chemistry through hands-on measurements and analysis.',
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
    description: 'Biology elective covering foundational topics in life sciences; may include cell biology, ecology, genetics, and organismal biology.',
    semesters: ['Fall', 'Spring']
  },
  'ENGL-0101': {
    id: 'ENGL-0101',
    name: 'English Composition I',
    credits: 3,
    // No prerequisites - unlocked for students
    prerequisites: [],
    category: 'gen-ed',
    description: 'Introduction to college-level writing, focusing on essay composition, grammar, style, organization, and critical thinking.',
    semesters: ['Fall', 'Spring']
  },
  'ENGL-0102': {
    id: 'ENGL-0102',
    name: 'English Composition II',
    credits: 3,
    prerequisites: ['ENGL-0101'],
    category: 'gen-ed',
    description: 'Continuation of ENGL-0101, emphasizing research writing, argumentation, documentation, and advanced rhetorical techniques.',
    semesters: ['Fall', 'Spring']
  },
  'ENGL-0203': {
    id: 'ENGL-0203',
    name: 'Technical Writing',
    credits: 3,
    prerequisites: ['ENGL-0101', 'ENGL-0102'],
    category: 'gen-ed',
    description: 'Development of professional writing skills, including technical reports, proposals, manuals, and visual documentation for engineering contexts.',
    semesters: ['Fall', 'Spring']
  },
  'OREN-0100': {
    id: 'OREN-0100',
    name: 'Individual Development & Growth',
    credits: 1,
    prerequisites: [],
    category: 'gen-ed',
    description: 'Course focused on personal and professional development, including goal setting, self-assessment, and effective communication skills.',
    semesters: ['Fall']
  },
  'OREN-0101': {
    id: 'OREN-0101',
    name: 'Individual Development & Growth II',
    credits: 1,
    prerequisites: ['OREN-0100'],
    category: 'gen-ed',
    description: 'Continuation of OREN-0100, emphasizing leadership skills, teamwork, time management, and personal growth strategies.',
    semesters: ['Spring']
  },
  'EPE': {
    id: 'EPE',
    name: 'English Proficiency',
    credits: 0,
    prerequisites: [],
    category: 'gen-ed',
    description: 'Assessment-based course to evaluate and ensure proficiency in English reading, writing, and comprehension.',
    semesters: ['Fall','Spring']
  },
  'HUMANITIES': {
    id: 'HUMANITIES',
    name: 'Humanities Elective',
    credits: 2,
    prerequisites: [],
    category: 'gen-ed',
    description: 'Exploration of visual and performing arts, emphasizing creative expression, appreciation, and analysis of cultural works.',
    semesters: ['Fall', 'Spring']
  },
  'SOC-SCI-1': {
    id: 'SOC-SCI-1',
    name: 'Social Science I (History/Psychology)',
    credits: 3,
    prerequisites: [],
    category: 'gen-ed',
    description: 'Study of historical events, movements, and figures to develop critical understanding of societal development.',
    semesters: ['Fall', 'Spring']
  },
  'SOC-SCI-2': {
    id: 'SOC-SCI-2',
    name: 'Social Science II',
    credits: 3,
    prerequisites: [],
    category: 'gen-ed',
    description: 'Continuation of historical study, covering additional periods, cultural contexts, and historical analysis techniques.',
    semesters: ['Fall', 'Spring']
  },
  'SOC-SCI-3': {
    id: 'SOC-SCI-3',
    name: 'Social Science III',
    credits: 3,
    prerequisites: [],
    category: 'gen-ed',
    description: 'Introduction to sociology, exploring human behavior, social structures, institutions, and cultural norms.',
    semesters: ['Fall', 'Spring']
  },
  'SOC-SCI-4': {
    id: 'SOC-SCI-4',
    name: 'Social Science IV',
    credits: 3,
    prerequisites: [],
    category: 'gen-ed',
    description: 'Study of political systems, governmental structures, political behavior, and public policy processes.',
    semesters: ['Fall', 'Spring']
  },
  'PE-1': {
    id: 'PE-1',
    name: 'Physical Education',
    credits: 1,
    prerequisites: [],
    category: 'gen-ed',
    description: 'Physical activity course focusing on fitness, health, and basic athletic skills.',
    semesters: ['Fall', 'Spring']
  },
    'PE-2': {
    id: 'PE-2',
    name: 'Physical Education',
    credits: 1,
    prerequisites: [],
    category: 'gen-ed',
    description: 'Physical activity course focusing on fitness, health, and basic athletic skills.',
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
    description: 'Principles of engineering economics: time value of money, cost-benefit analysis, interest calculations, and decision-making for projects.',
    category: 'gen-ed',
    semesters: ['Fall', 'Spring']
  },

  // ==================== FRESHMAN ENGINEERING ====================
  'EENG-0192': {
    id: 'EENG-0192',
    name: 'Freshman Design',
    credits: 3,
    prerequisites: [],
    description: 'Introductory design course for first-year engineering students covering design thinking, teamwork, basic prototyping, and problem definition.',
    category: 'core',
    semesters: ['Fall'] // ✅ Fall only
  },
  'EENG-0210': {
    id: 'EENG-0210',
    name: 'Python Programming',
    credits: 3,
    prerequisites: ['EENG-0192'],
    description: 'Introduction to Python programming for engineering applications. Covers syntax, control structures, functions, modules, and basic data structures.',
    offered: 'All Terms, All Years',
    category: 'core',
    semesters: ['Fall'] // ✅ Fall only
  },
  'CSCI-0229': {
    id: 'CSCI-0229',
    name: 'Intro to C++ Programming',
    credits: 3,
    prerequisites: ['EENG-0192'],
    description: 'Introduction to C++: basic syntax, data types, control flow, functions, and introductory object-oriented programming concepts for engineering applications.',
    category: 'core',
    semesters: ['Fall', 'Spring']
  },
  'MENG-0237': {
    id: 'MENG-0237',
    name: 'Probability & Statistics for Engineers',
    credits: 3,
    prerequisites: ['MATH-0207'],
    description: 'Probability and statistics fundamentals for engineering applications, covering distributions, estimation, hypothesis testing, and regression.',
    category: 'core',
    semesters: ['Fall', 'Spring']
  },
  // ==================== CIRCUITS SEQUENCE ====================
  'EENG-0221': {
    id: 'EENG-0221',
    name: 'Circuits I',
    credits: 3,
    prerequisites: ['EENG-0192', 'MATH-0207'],
  description: 'Study of basic electric circuits, including Ohm’s Law, Kirchhoff’s Laws, network theorems, transient and steady-state analysis of DC and AC circuits.',
    offered: 'All Terms, All Years',
  corequisite: 'EENG-221L',
    semesters: ['Fall', 'Spring'] // ✅✅ Both
  },
  'EENG-221L': {
    id: 'EENG-221L',
    name: 'Circuits I Lab',
    credits: 1,
    // Mirror Circuits I prerequisites (exclude lab IDs to avoid circular refs)
    prerequisites: ['EENG-0192', 'MATH-0207'],
    description: 'Laboratory experiments to supplement EENG-0221. Includes practical circuit construction, measurement, and analysis.',
    offered: 'All Terms, All Years',
    corequisite: 'EENG-0221',
    category: 'core',
    semesters: ['Fall', 'Spring'] // ✅✅ Both
  },
  'EENG-0260': {
    id: 'EENG-0260',
    name: 'Intro to Logic Circuits',
    credits: 3,
    prerequisites: ['EENG-0192'],
    description: 'Fundamentals of digital logic design, including Boolean algebra, logic gates, combinational and sequential circuits.',
    offered: 'All Terms, All Years',
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
    description: 'Advanced circuit analysis including AC steady-state, resonance, power, polyphase systems, and introduction to network functions.',
    offered: 'All Terms, All Years',
    category: 'core',
    semesters: ['Fall', 'Spring'] // ✅✅ Both
  },
  'EENG-322L': {
    id: 'EENG-322L',
    name: 'Circuits II Lab',
    credits: 1,
    // Mirror Circuits II prerequisites (exclude other lab IDs)
    prerequisites: ['EENG-0221', 'MATH-0208'],
    description: 'Laboratory experiments to accompany EENG-0322. Includes circuit construction, measurement, and analysis.',
    offered: 'All Terms, All Years',
    corequisite: 'EENG-0322',
    category: 'core',
    semesters: ['Fall', 'Spring'] // ✅✅ Both
  },
  'EENG-260L': {
    id: 'EENG-260L',
    name: 'Logic Circuits Lab',
    credits: 1,
    // Mirror Intro to Logic Circuits prerequisites
    prerequisites: ['EENG-0192'],
    description: 'Laboratory and design experiences accompanying EENG-0260. Practical implementation of logic circuits and troubleshooting.',
    offered: 'All Terms, All Years',
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
    description: 'Differential equations and linear algebra with engineering applications, including matrix methods, eigenvalues, and systems of linear differential equations.',
    category: 'core',
    semesters: ['Spring'] // ❌✅ Spring only
  },

  // ==================== SIGNALS & SYSTEMS ====================
  'EENG-0323': {
    id: 'EENG-0323',
    name: 'Signals & Systems',
    credits: 3,
    prerequisites: ['EENG-0322', 'EENG-322L', 'EENG-0225'],
    description: 'Analysis of continuous and discrete-time signals and systems, Fourier and Laplace transforms, convolution, stability, and frequency response.',
    offered: 'All Terms, All Years',
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
    description: 'Introduction to semiconductor devices, diode and transistor circuits, amplifiers, and basic analog circuit design.',
    offered: 'All Terms, All Years',
    category: 'core',
    semesters: ['Fall', 'Spring'] // ✅✅ Both (EE uses 0330)
  },
  'EENG-0325L': {
    id: 'EENG-0325L',
    name: 'Electronics I Lab',
    credits: 1,
    // Mirror Electronics I prerequisites (exclude lab IDs)
    prerequisites: ['EENG-0322', 'EENG-322L'],
    description: 'Experimental study of electronic circuits, device characteristics, amplifiers, and switching applications.',
    offered: 'All Terms, All Years',
    corequisite: 'EENG-0325',
    category: 'core',
    semesters: ['Fall', 'Spring'] // ✅✅ Both
  },
  'EENG-0330': {
    id: 'EENG-0330',
    name: 'Electronics II',
    credits: 3,
    // Fix typo: require Electronics I lecture and its lab (use correct lab id EENG-0325L)
    prerequisites: ['EENG-0325','EENG-0325L'],
    corequisite: 'EENG-0330L',
    description: 'Continuation of Electronics I; advanced transistor circuits, operational amplifiers, analog signal processing.',
    offered: 'All Terms, All Years',
    category: 'core',
    semesters: ['Fall', 'Spring'] // ✅✅ Both
  },
  'EENG-0330L': {
    id: 'EENG-0330L',
    name: 'Electronics II Lab',
    credits: 1,
    // Mirror Electronics II prerequisites (exclude lab IDs)
    prerequisites: ['EENG-0325'],
    description: 'Laboratory for EENG-0330. Conventional and experimental study of electronic circuit design and analysis.',
    offered: 'All Terms, All Years',
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
    description: 'Study of microprocessor architecture, programming, interfacing, and applications in embedded systems.',
    offered: 'All Terms, All Years',
    category: 'core',
    semesters: ['Fall'] // ✅ Fall only
  },

  // ==================== ELECTROMAGNETICS ====================
  'EENG-0315': {
    id: 'EENG-0315',
    name: 'Electromagnetic Theory & Appl',
    credits: 3,
    prerequisites: ['EENG-0225', 'EENG-0322', 'EENG-322L'],
    category: 'core',
    description: 'Study of electromagnetism including Maxwell’s equations, fields, waves, and practical applications in engineering.',
    semesters: ['Fall'] // ✅ Fall only
  },

  // ==================== ADVANCED EE COURSES ====================
  'EENG-0390': {
    id: 'EENG-0390',
    name: 'Engineering Ethics & Society',
    credits: 3,
    prerequisites: [],
    description: 'Study of professional ethics, societal impacts of engineering decisions, responsibilities of engineers, and case studies in ethical dilemmas.',
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
    description: 'Semiconductor physics, device operation, integrated circuits, and basic fabrication concepts.',
    semesters: ['Spring'] // ❌✅ Spring only
  },
  'EENG-0400L': {
    id: 'EENG-0400L',
    name: 'Senior Electrical Lab',
    credits: 1,
    // Mirror Microelectronics prerequisites
    prerequisites: ['EENG-0330','EENG-0315'],
    description: 'Laboratory and design experience to accompany EENG-0400. Includes semiconductor devices, power systems, and circuits.',
    corequisite: 'EENG-0400',
    category: 'capstone',
    semesters: ['Spring']
  },
  'EENG-0401': {
    id: 'EENG-0401',
    name: 'Communication Theory',
    credits: 3,
    prerequisites: ['EENG-0323'],
    category: 'core',
    description: 'Introduction to analog and digital communication systems, modulation, demodulation, and information theory basics.',
    semesters: ['Spring'] // ❌✅ Spring only
  },
  'EENG-0402': {
    id: 'EENG-0402',
    name: 'Fundamentals of Power & Energy',
    credits: 3,
    prerequisites: ['EENG-0315', 'EENG-0322', 'EENG-322L', 'EENG-0225'],
    category: 'core',
    description: 'Study of electrical energy generation, transmission, distribution, and basic power system operation and analysis.',
  // Per offering sheet: Fall only
  semesters: ['Fall']
  },
  
  // Computer Network Design removed - CE course only

  'EENG-0431': {
    id: 'EENG-0431',
    name: 'Control Systems',
    credits: 3,
    prerequisites: ['EENG-0323'],
    category: 'core',
    description: 'Analysis and design of feedback control systems, transfer functions, stability, and frequency response methods.',
  // Per offering sheet: Spring only
  semesters: ['Spring']
  },
  'EENG-431L': {
    id: 'EENG-431L',
    name: 'Control Systems Lab',
    credits: 1,
    // Mirror Control Systems prerequisites
    prerequisites: ['EENG-0323'],
    corequisite: 'EENG-0431',
    category: 'core',
    description: 'Experimental study of feedback control systems, components, open-loop and closed-loop analysis, and computer-aided design.',
    semesters: ['Spring'] // ❌✅ Spring only
  },

  // ==================== CAPSTONE ====================
  'EENG-0470': {
    id: 'EENG-0470',
    name: 'Senior Design I',
    credits: 2,
  prerequisites: ['EENG-0360', 'EENG-0330', 'EENG-0330L', 'MENG-0237', 'EENG-0315', 'EENG-0323'],
    category: 'capstone',
    description: 'Student teams develop proposals for a comprehensive analysis of an engineering product or process, applying the engineering design process. Includes project planning, specifications, and engineering ethics.',
    semesters: ['Fall', 'Spring'] // ✅✅ Both
  },
  'EENG-0471': {
    id: 'EENG-0471',
    name: 'Senior Design II',
    credits: 2,
    prerequisites: ['EENG-0470'],
    category: 'capstone',
    description: 'Continuation of Senior Design I. Students complete the steps of the design process, build prototypes, and present solutions.',
    semesters: ['Fall', 'Spring'] // ✅✅ Both
  },

  // ==================== SPECIAL TOPICS ====================
  'COEG-0493': {
    id: 'COEG-0493',
    name: 'Special Topics in Computer Engineering',
    credits: 3,
    prerequisites: [], // Approval of Instructor and Department Head
    description: 'Advanced topics in computer engineering not covered in regular courses. Content varies by semester based on current technological developments and student interest. Requires approval of instructor and department head.',
    category: 'elective',
    semesters: ['Fall', 'Spring']
  }
};