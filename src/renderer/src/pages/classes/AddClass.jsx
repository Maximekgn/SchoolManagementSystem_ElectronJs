import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AddClass = ({ onAddClass, onClose }) => {
  const [className, setClassName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [classFees, setClassFees] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Reset error message

    if (!className || !capacity || !classFees) {
      setError('All fields are required.');
      return;
    }

    const parsedCapacity = parseInt(capacity, 10);
    const parsedClassFees = parseFloat(classFees);

    if (isNaN(parsedCapacity) || isNaN(parsedClassFees)) {
      setError('Capacity and Class Fees must be valid numbers.');
      return;
    }

    if (parsedCapacity <= 0) {
      setError('Capacity must be a positive number.');
      return;
    }

    if (parsedClassFees < 0) {
      setError('Class Fees must be a positive number or zero.');
      return;
    }

    const newClass = {
      name: className,
      capacity: parsedCapacity,
      class_fees: parsedClassFees,
    };

    onAddClass(newClass); // Call the function to add the class

    // Reset form fields after submission
    setClassName('');
    setCapacity('');
    setClassFees('');
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Add New Class</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Class Name"
            className="border p-2 rounded w-full mb-2"
            aria-label="Class Name"
            required
          />
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="Capacity"
            className="border p-2 rounded w-full mb-2"
            aria-label="Capacity"
            min="1"
            required
          />
          <input
            type="number"
            value={classFees}
            onChange={(e) => setClassFees(e.target.value)}
            placeholder="Class Fees"
            className="border p-2 rounded w-full mb-2"
            aria-label="Class Fees"
            min="0"
            step="0.01" // Allows up to two decimal points for fees
            required
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Add Class
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

AddClass.propTypes = {
  onAddClass: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddClass;
