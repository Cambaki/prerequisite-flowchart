// src/Components/ProgramSelector.js

import React from 'react';

export const ProgramSelector = ({ selectedProgram, onProgramChange }) => {
  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      <label className="block text-lg font-semibold mb-2">
        Select Your Program:
      </label>
      <div className="flex gap-4">
        <button
          onClick={() => onProgramChange('EE')}
          className={`
            px-6 py-3 rounded-lg font-medium transition-all
            ${selectedProgram === 'EE'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }
          `}
        >
          Electrical Engineering (EE)
        </button>
        <button
          onClick={() => onProgramChange('CE')}
          className={`
            px-6 py-3 rounded-lg font-medium transition-all
            ${selectedProgram === 'CE'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }
          `}
        >
          Computer Engineering (CE)
        </button>
      </div>
    </div>
  );
};

// Using named export instead