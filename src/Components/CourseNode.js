// src/Components/CourseNode.js

import React from 'react';
import { CheckCircle, Lock, Circle } from 'lucide-react';

export const CourseNode = ({ course, status, onClick, showDetails }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 hover:bg-green-600';
      case 'available':
        return 'bg-yellow-400 hover:bg-yellow-500';
      case 'blocked':
        return 'bg-gray-400 cursor-not-allowed';
      default:
        return 'bg-gray-300';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'blocked':
        return <Lock className="w-5 h-5" />;
      default:
        return <Circle className="w-5 h-5" />;
    }
  };

  const isClickable = status !== 'blocked';

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      className={`
        ${getStatusColor()}
        text-white p-4 rounded-lg shadow-lg
        transition-all duration-200
        ${isClickable ? 'cursor-pointer transform hover:scale-105' : ''}
        min-w-[200px] max-w-[250px]
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-sm">{course.id}</span>
        {getIcon()}
      </div>
      <div className="text-sm font-medium mb-1">{course.name}</div>
      <div className="text-xs opacity-90">{course.credits} credits</div>
      
      {showDetails && (
        <div className="mt-2 pt-2 border-t border-white border-opacity-30 text-xs">
          {course.description && (
            <div className="mb-2">
              <strong>Description:</strong>
              <div className="mt-1 text-xs opacity-90">{course.description}</div>
            </div>
          )}

          {course.offered && (
            <div className="mb-2">
              <strong>Offered:</strong>
              <div className="mt-1">{course.offered}</div>
            </div>
          )}

          {course.prerequisites && course.prerequisites.length > 0 && (
            <div className="mb-2">
              <strong>Prerequisites:</strong>
              <div className="mt-1">{course.prerequisites.join(', ')}</div>
            </div>
          )}

          {course.corequisite && (
            <div className="mb-1">
              <strong>Corequisite:</strong>{' '}
              {Array.isArray(course.corequisite) ? course.corequisite.join(', ') : course.corequisite}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Using named export instead