import React from 'react';

const StudentDetails = ({ student, onClose }) => {
  if (!student) return null;

  // Format student properties for better readability
  const formatDetail = (key, value) => {
    if (value === null || value === undefined) return 'N/A';
    return value;
  };

  return (
    <div className="fixed inset-0  bg-opacity-80 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Student Details</h2>
        
        <div className="space-y-3">
          {Object.entries(student).map(([key, value]) => (
            <div key={key} className="flex justify-between text-gray-600">
              <span className="font-medium">
                {key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}:
              </span>
              <span>{formatDetail(key, value)}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
