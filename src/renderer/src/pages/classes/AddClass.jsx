import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiX, FiBook, FiDollarSign } from 'react-icons/fi';

const AddClass = ({ onAddClass, onClose }) => {
  const [className, setClassName] = useState('');
  const [classFees, setClassFees] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!className || !classFees) {
      setError('All fields are required.');
      return;
    }

    const parsedClassFees = parseFloat(classFees);

    if (isNaN(parsedClassFees)) {
      setError('Class Fees must be a valid number.');
      return;
    }

    if (parsedClassFees < 0) {
      setError('Class Fees must be non-negative.');
      return;
    }

    const newClass = {
      name: className,
      class_fees: parsedClassFees,
    };

    onAddClass(newClass);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center show-up">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-bold text-gray-900">Add New Class</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <FiX className="h-6 w-6" />
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mb-4 bg-red-100 p-3 rounded-lg">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-2">Class Name</label>
            <div className="relative">
              <FiBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="className"
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Enter class name"
                className="pl-10 w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="classFees" className="block text-sm font-medium text-gray-700 mb-2">Class Fees</label>
            <div className="relative">
              <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="classFees"
                type="number"
                value={classFees}
                onChange={(e) => setClassFees(e.target.value)}
                placeholder="Enter class fees"
                className="pl-10 w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                step="0.01"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              Add Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddClass.propTypes = {
  onAddClass: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddClass;
