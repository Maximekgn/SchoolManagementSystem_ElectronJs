import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AddClass = ({ onAddClass }) => {
  const [className, setClassName] = useState('');
  const [teacherName, setTeacherName] = useState(''); // Changed from selectedTeacherId to teacherName
  const [capacity, setCapacity] = useState('');
  const [classFees, setClassFees] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Reset error message

    if (!className || !teacherName || !capacity || !classFees) {
      setError('All fields are required.');
      return;
    }

    const newClass = {
      name: className,
      teacher_name: teacherName, // Use teacher_name directly
      capacity: parseInt(capacity, 10),
      class_fees: parseFloat(classFees),
    };

    onAddClass(newClass); // Call the function to add the class
    // Reset form fields after submission
    setClassName('');
    setTeacherName(''); // Reset the teacher name
    setCapacity('');
    setClassFees('');
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Add New Class</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Class Name"
            className="border p-2 rounded w-full mb-2"
            required
          />
          <input
            type="text"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            placeholder="Teacher Name"
            className="border p-2 rounded w-full mb-2"
            required
          />
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="Capacity"
            className="border p-2 rounded w-full mb-2"
            required
          />
          <input
            type="number"
            value={classFees}
            onChange={(e) => setClassFees(e.target.value)}
            placeholder="Class Fees"
            className="border p-2 rounded w-full mb-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Add Class
        </button>
      </form>
    </div>
  );
};

AddClass.propTypes = {
  onAddClass: PropTypes.func.isRequired,
};

export default AddClass;
