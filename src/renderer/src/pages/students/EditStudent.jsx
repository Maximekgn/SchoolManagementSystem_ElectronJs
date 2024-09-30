import React, { useState, useEffect, useCallback } from 'react';

const EditStudent = ({ student, onClose, onUpdate }) => {
  const [editedStudent, setEditedStudent] = useState({ ...student });
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = useCallback(async () => {
    try {
      const response = await window.electron.ipcRenderer.invoke('get-classes');
      setClasses(response);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value, type } = e.target;
    setEditedStudent((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  }, []);

  const handleSave = useCallback(async () => {
    try {
      const result = await window.electron.ipcRenderer.invoke('update-student', editedStudent);
      if (result.success) {
        onUpdate();
        onClose();
      } else {
        console.error('Failed to update student:', result.error);
        // Handle error (e.g., show error message to user)
      }
    } catch (error) {
      console.error('Error updating student:', error);
      // Handle error (e.g., show error message to user)
    }
  }, [editedStudent, onClose, onUpdate]);

  const renderField = (name, label, type = 'text', options = null) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {options ? (
        <select
          name={name}
          value={editedStudent[name]}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={editedStudent[name]}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
        />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Student</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Student Information</h3>
              {renderField('name', 'First Name')}
              {renderField('surname', 'Last Name')}
              {renderField('birthDate', 'Birth Date', 'date')}
              {renderField('birthPlace', 'Birth Place')}
              {renderField('gender', 'Gender', 'select', [
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' }
              ])}
              {renderField('regNumber', 'Registration Number')}
              {renderField('admissionDate', 'Admission Date', 'date')}
              {renderField('classId', 'Class', 'select', [
                { value: '', label: 'Select a class' },
                ...classes.map(cls => ({ value: cls.id, label: cls.name }))
              ])}
              {renderField('bloodGroup', 'Blood Group')}
              {renderField('medicalCondition', 'Medical Condition')}
              {renderField('previousSchool', 'Previous School')}
              {renderField('religion', 'Religion')}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Financial Information</h3>
              {renderField('schoolFee', 'School Fee', 'number')}
              {renderField('discountFee', 'Discount Fee', 'number')}
              {renderField('paidFee', 'Paid Fee', 'number')}
              <h3 className="text-xl font-semibold mb-4 mt-6">Parent Information</h3>
              {renderField('parentName', 'Parent Name')}
              {renderField('parentSurname', 'Parent Surname')}
              {renderField('parentPhone', 'Parent Phone', 'tel')}
              <h3 className="text-xl font-semibold mb-4 mt-6">Additional Information</h3>
              {renderField('additionalNote', 'Additional Note', 'textarea')}
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;