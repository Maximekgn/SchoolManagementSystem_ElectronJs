import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const EditClass = ({ classDetails, onClose }) => {
  const [className, setClassName] = useState('');
  const [classFees, setClassFees] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (classDetails) {
      setClassName(classDetails.name);
      setClassFees(classDetails.class_fees); // Set initial fees value
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
      const formData = { id: classDetails.id, name: className, class_fees: parseFloat(classFees) }; // Include class_fees
      const response = await window.electron.ipcRenderer.invoke('update-class', formData);
      
      if (response.success) {
        console.log("Class updated successfully:", response.updatedId);
        onClose(); // Close the modal on success
      } else {
        setError(`Error: ${response.error}`);
      }
    } catch (err) {
      setError(`Unexpected error: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 transition-opacity duration-300 ease-out">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-out scale-95 sm:scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Class</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="className">Class Name</label>
            <input
              type="text"
              id="className"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-3 py-2 border rounded shadow focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter class name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="classFees">Class Fees</label>
            <input
              type="number"
              id="classFees"
              value={classFees}
              onChange={(e) => setClassFees(e.target.value)}
              className="w-full px-3 py-2 border rounded shadow focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter class fees"
              step="0.01"
              required
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
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
    class_fees: PropTypes.number.isRequired, // Ensure class_fees is included
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditClass;
