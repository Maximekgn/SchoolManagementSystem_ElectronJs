import React, { useState, useEffect, useCallback } from 'react';
import { FiUser, FiCalendar, FiMapPin, FiUsers, FiBookOpen, FiHeart, FiDollarSign, FiPhone, FiImage } from 'react-icons/fi';
import defaultAvatar from '/default.jpg';

const EditStudent = ({ student, onClose, onUpdate }) => {
  const [editedStudent, setEditedStudent] = useState({ ...student });
  const [classes, setClasses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(student.picture ? `data:image/jpeg;base64,${student.picture}` : defaultAvatar);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setEditedStudent(prev => ({ ...prev, picture: reader.result.split(',')[1] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  }, [editedStudent, onClose, onUpdate]);

  const renderField = (name, label, type = 'text', options = null, icon = null) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        {icon && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">{icon}</span>}
        {options ? (
          <select
            name={name}
            value={editedStudent[name]}
            onChange={handleChange}
            className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
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
            className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Edit Student</h2>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Student picture</h3>
              <div className="mb-4">
                <img
                  src={previewImage}
                  alt="Student"
                  className="w-48 h-48 object-cover rounded-full mx-auto mb-4"
                />
                <label className="block">
                  <span className="sr-only">Choose student picture</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </label>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Student Information</h3>
              {renderField('name', 'First Name', 'text', null, <FiUser />)}
              {renderField('surname', 'Last Name', 'text', null, <FiUser />)}
              {renderField('birthDate', 'Birth Date', 'date', null, <FiCalendar />)}
              {renderField('birthPlace', 'Birth Place', 'text', null, <FiMapPin />)}
              {renderField('gender', 'Gender', 'select', [
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' }
              ], <FiUsers />)}
              {renderField('regNumber', 'Registration Number', 'text', null, <FiBookOpen />)}
              {renderField('admissionDate', 'Admission Date', 'date', null, <FiCalendar />)}
              {renderField('classId', 'Class', 'select', [
                { value: '', label: 'Select a class' },
                ...classes.map(cls => ({ value: cls.id, label: cls.name }))
              ], <FiUsers />)}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Additional Information</h3>
              {renderField('bloodGroup', 'Blood Group', 'text', null, <FiHeart />)}
              {renderField('medicalCondition', 'Medical Condition', 'text', null, <FiHeart />)}
              {renderField('previousSchool', 'Previous School', 'text', null, <FiBookOpen />)}
              {renderField('religion', 'Religion', 'text', null, <FiUsers />)}
              <h3 className="text-xl font-semibold mb-4 mt-6 text-gray-700">Financial Information</h3>
              {renderField('schoolFee', 'School Fee', 'number', null, <FiDollarSign />)}
              {renderField('paidFee', 'Paid Fee', 'number', null, <FiDollarSign />)}
              <h3 className="text-xl font-semibold mb-4 mt-6 text-gray-700">Parent Information</h3>
              {renderField('parentName', 'Parent Name', 'text', null, <FiUser />)}
              {renderField('parentSurname', 'Parent Surname', 'text', null, <FiUser />)}
              {renderField('parentPhone', 'Parent Phone', 'tel', null, <FiPhone />)}
            </div>
          </div>
          {renderField('additionalNote', 'Additional Note', 'textarea', null, <FiBookOpen />)}
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;