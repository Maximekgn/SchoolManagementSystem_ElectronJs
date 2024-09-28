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
        className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 transition-opacity duration-300 ease-out"
        role="dialog" 
        aria-labelledby="class-details-title" 
        aria-modal="true"
      >
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-out scale-95 sm:scale-100">
          <h2 id="class-details-title" className="text-2xl font-bold text-gray-800 mb-4">Class Details</h2>
          <p className="text-red-500">Class details not available.</p>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
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
      className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 transition-opacity duration-300 ease-out"
      role="dialog" 
      aria-labelledby="class-details-title" 
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-out scale-95 sm:scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 id="class-details-title" className="text-2xl font-bold text-gray-800">Class Details</h2>
          <button 
            onClick={onClose} 
            className="text-gray-600 hover:text-gray-800" 
            aria-label="Close class details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Class Name</p>
            <p className="mt-1 text-sm text-gray-900">{name || 'N/A'}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Fees</p>
            <p className="mt-1 text-sm text-gray-900">{class_fees !== undefined ? `FCFA ${class_fees}` : 'N/A'}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewClass;
