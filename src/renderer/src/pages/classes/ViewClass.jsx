import React from 'react';
import PropTypes from 'prop-types';
import { FaUser, FaUsers, FaDollarSign } from 'react-icons/fa'; // Icons for better visual presentation

const ViewClass = ({ classDetails, onClose }) => {
  if (!classDetails) {
    return (
      <div className="p-4 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Class Details</h1>
        <p className="text-red-500">Class details not available.</p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Close
        </button>
      </div>
    );
  }

  const { name, capacity, class_fees } = classDetails;

  return (
    <div className="p-6 bg-white shadow-xl rounded-lg max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Class Details</h1>
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <FaUser className="text-blue-500" size={24} />
          <p className="text-gray-700 text-lg font-semibold">Class Name: <span className="text-gray-900">{name}</span></p>
        </div>
        <div className="flex items-center gap-4">
          <FaUsers className="text-blue-500" size={24} />
          <p className="text-gray-700 text-lg font-semibold">Capacity: <span className="text-gray-900">{capacity}</span></p>
        </div>
        <div className="flex items-center gap-4">
          <FaDollarSign className="text-blue-500" size={24} />
          <p className="text-gray-700 text-lg font-semibold">Fees: <span className="text-gray-900">${class_fees.toFixed(2)}</span></p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="mt-6 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
        aria-label="Close class details"
      >
        Close
      </button>
    </div>
  );
};

ViewClass.propTypes = {
  classDetails: PropTypes.shape({
    name: PropTypes.string.isRequired,
    capacity: PropTypes.number.isRequired,
    class_fees: PropTypes.number.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ViewClass;
