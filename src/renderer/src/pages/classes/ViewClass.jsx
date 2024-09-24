import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation

const ViewClass = ({ classDetails, onClose }) => {
  const { name, teacher_name, capacity, class_fees } = classDetails; // Destructure classDetails

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Class Details</h1>
      <div className="mb-4">
        <p className="text-gray-700">Class Name: {name}</p>
        <p className="text-gray-700">Teacher: {teacher_name}</p>
        <p className="text-gray-700">Capacity: {capacity}</p> {/* Display capacity */}
        <p className="text-gray-700">Fees: ${class_fees.toFixed(2)}</p> {/* Display fees with two decimal points */}
      </div>
      <button 
        onClick={onClose} 
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
      >
        Close
      </button>
    </div>
  );
};

// Adding prop types for validation
ViewClass.propTypes = {
  classDetails: PropTypes.shape({
    name: PropTypes.string.isRequired,
    teacher_name: PropTypes.string.isRequired,
    capacity: PropTypes.number.isRequired,
    class_fees: PropTypes.number.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ViewClass;
