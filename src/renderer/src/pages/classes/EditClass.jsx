import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const EditClass = ({ classDetails, onClose }) => {
  const [className, setClassName] = useState('');
  const [classFees, setClassFees] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (classDetails) {
      setClassName(classDetails.name);
      setClassFees(classDetails.classFee);
    }
  }, [classDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!className || !classFees) {
      setError('Both Class Name and Class Fees are required.');
      return;
    }

    if (isNaN(parseFloat(classFees)) || parseFloat(classFees) < 0) {
      setError('Class Fees must be a valid non-negative number.');
      return;
    }

    try {
      const formData = { id: classDetails.id, name: className, classFee: parseFloat(classFees) };
      const response = await window.electron.ipcRenderer.invoke('update-class', formData);

      if (response.success) {
        console.log("Class updated successfully:", response.updatedId);
        onClose();
      } else {
        setError(`Error: ${response.error}`);
      }
    } catch (err) {
      setError(`Unexpected error: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300 ease-in-out show-up">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 ease-in-out scale-95 sm:scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Edit Class</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="className">
              Class Name
            </label>
            <input
              type="text"
              id="className"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter class name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="classFees">
              Class Fees
            </label>
            <input
              type="number"
              id="classFees"
              value={classFees}
              onChange={(e) => setClassFees(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter class fees"
              step="0.01"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditClass.propTypes = {
  classDetails: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    classFee: PropTypes.number.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditClass;
