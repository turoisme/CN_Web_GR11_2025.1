import React from 'react';

export default function Loading({ size = 'medium', fullScreen = false }) {
  const sizeClasses = {
    small: 'w-8 h-8 border-2',
    medium: 'w-12 h-12 border-4',
    large: 'w-16 h-16 border-4'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`${sizeClasses[size]} border-gray-300 border-t-blue-600 rounded-full animate-spin`}
      ></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}