import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AddClass = ({ onAddClass, onClose }) => {
  const [className, setClassName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [classFees, setClassFees] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!className  || !classFees) {
      setError('All fields are required.');
      return;
    }

    const parsedClassFees = parseFloat(classFees);

    if (isNaN(parsedClassFees)) {
      setError('Capacity and Class Fees must be valid numbers.');
      return;
    }

    if ( parsedClassFees < 0) {
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
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div style={{ margin: '100px auto', padding: '20px', background: '#fff', borderRadius: '5px', width: '300px' }}>
        <h3 style={{ marginBottom: '10px', textAlign: 'center' }}>Add New Class</h3>
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red', fontSize: '12px', textAlign: 'center' }}>{error}</p>}
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Class Name"
            style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="number"
            value={classFees}
            onChange={(e) => setClassFees(e.target.value)}
            placeholder="Class Fees"
            style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '3px', border: '1px solid #ccc' }}
            step="0.01"
            required
          />
          <button
            type="submit"
            style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
          >
            Add Class
          </button>
        </form>
        <button
          onClick={onClose}
          style={{ marginTop: '10px', width: '100%', padding: '10px', backgroundColor: '#ccc', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

AddClass.propTypes = {
  onAddClass: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddClass;
