import React, { useState, useEffect } from 'react';

const StudentEditForm = ({ student, onClose, onUpdate, onDelete }) => {
  const [formData, setFormData] = useState({ ...student });
  const [error, setError] = useState('');
  const [classes, setClasses] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setFormData({ ...student });
    fetchClasses();
  }, [student]);

  const fetchClasses = async () => {
    try {
      const result = await window.electron.ipcRenderer.invoke('get-classes');
      if (result) {
        setClasses(result);
      } else {
        throw new Error('Failed to fetch classes');
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('Failed to load classes. Please try again.');
    }
  };



  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({
        ...prev,
        picture: {
          path: file.path,
          name: file.name,
          type: file.type
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await window.electron.ipcRenderer.invoke('update-student', formData);
      if (result) {
        if (typeof onUpdate === 'function') {
          onUpdate(formData);
        } else {
          console.warn('onUpdate is not a function. Unable to update parent component.');
        }
        onClose();
      } else {
        throw new Error('Failed to update student');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      setError(error.message || 'Failed to update student. Please try again.');
    }
  };

  const renderField = (key, value) => {
    switch (key) {
      case 'picture':
        return (
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        );
      case 'gender':
      case 'blood_group':
        return (
          <select
            name={key}
            value={value}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {key === 'gender' ? (
              <>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </>
            ) : (
              ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(group => (
                <option key={group} value={group}>{group}</option>
              ))
            )}
          </select>
        );
      case 'class_name':
        return (
          <select
            name="class_id"
            value={formData.class_id || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a class</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        );
      case 'additional_note':
      case 'place_of_birth':
      case 'medical_condition':
      case 'previous_school':
      case 'religion':
        return (
          <textarea
            name={key}
            value={value || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="3"
          />
        );
      default:
        return (
          <input
            type={key.includes('date') ? 'date' : key === 'discount_in_fee' ? 'number' : 'text'}
            name={key}
            value={value || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Edit Student Details</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.entries(formData).map(([key, value]) => (
            key !== 'id' && (
              <div key={key} className="flex flex-col">
                <label className="mb-1 font-semibold text-gray-700">
                  {key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}
                </label>
                {renderField(key, value)}
              </div>
            )
          ))}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex justify-between space-x-4 mt-8">
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this student? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentEditForm;