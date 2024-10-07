import React, { useEffect } from 'react';

const ViewClass = ({ classDetails, onClose }) => {
  // Close on 'Esc' key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!classDetails) {
    return (
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300 ease-in-out"
        role="dialog"
        aria-labelledby="class-details-title"
        aria-modal="true"
      >
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 ease-out scale-95 sm:scale-100">
          <h2 id="class-details-title" className="text-3xl font-bold text-gray-800 mb-6">Class Details</h2>
          <p className="text-red-500 text-lg">Class details not available.</p>
          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-100 text-gray-800 px-6 py-3 rounded-full hover:bg-gray-200 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { name, capacity, class_fees } = classDetails;

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300 ease-in-out show-up"
      role="dialog"
      aria-labelledby="class-details-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 ease-out scale-95 sm:scale-100">
        <div className="flex justify-between items-center mb-8">
          <h2 id="class-details-title" className="text-3xl font-bold text-gray-800">Class Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
            aria-label="Close class details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500 mb-1">Class Name</p>
            <p className="text-lg font-semibold text-gray-900">{name || 'N/A'}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500 mb-1">Fees</p>
            <p className="text-lg font-semibold text-gray-900">{class_fees !== undefined ? `FCFA ${class_fees}` : 'N/A'}</p>
          </div>

          {capacity !== undefined && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500 mb-1">Capacity</p>
              <p className="text-lg font-semibold text-gray-900">{capacity}</p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewClass;
