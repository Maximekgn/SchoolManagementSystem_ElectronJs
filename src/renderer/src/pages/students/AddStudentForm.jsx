import React, { useState, useEffect, useCallback, useMemo } from 'react';

const AddStudentForm = ({ onAdd, onClose }) => {
  const initialFormData = useMemo(() => ({
    surname: '', 
    name: '', 
    dateOfBirth: new Date().toISOString().split('T')[0], 
    placeOfBirth: 'unknown', 
    gender: 'Male',
    registrationNumber: 'unknown', 
    dateOfAdmission: new Date().toISOString().split('T')[0], 
    classId: '', 
    discountInFees: 0,
    bloodGroup: 'unknown',
    medicalCondition: '', 
    previousSchool: '', 
    religion: 'unknown', 
    parentName: '',
    parentSurname: '', 
    parentMobileNumber: ''
  }), []);

  const [formData, setFormData] = useState(initialFormData);
  const [classes, setClasses] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchClasses = useCallback(async () => {
    try {
      const response = await window.electron.ipcRenderer.invoke('get-classes');
      setClasses(response);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setErrors(prev => ({ ...prev, fetchClasses: 'Failed to fetch classes. Please try again.' }));
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
    setErrors(prev => ({ ...prev, [name]: '', submit: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['name', 'surname', 'classId', 'registrationNumber'];
    
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const studentData = {
          ...formData,
          placeOfBirth: formData.placeOfBirth || 'unknown',
          bloodGroup: formData.bloodGroup || 'unknown',
          medicalCondition: formData.medicalCondition || '',
          previousSchool: formData.previousSchool || '',
          religion: formData.religion || 'unknown',
          parentName: formData.parentName || '',
          parentSurname: formData.parentSurname || '',
          parentMobileNumber: formData.parentMobileNumber || ''
        };
        
        const selectedClass = classes.find(c => c.id === studentData.classId);
        studentData.school_fee = selectedClass?.class_fees || 0;
        
        const result = await window.electron.ipcRenderer.invoke('add-student', studentData);
        if (result.id) {
          onAdd(result.id);
          setFormData(initialFormData);
          onClose(); 
        } else {
          throw new Error('Failed to add student');
        }
      } catch (error) {
        console.error('Error adding student:', error);
        setErrors(prev => ({ ...prev, submit: 'Failed to add student. Please try again.' }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderInput = useMemo(() => (name, label, type = 'text', options = null) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {options ? (
        <select
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors[name] ? 'border-red-500' : ''}`}
          required={['classId', 'gender'].includes(name)}
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
          value={formData[name]}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors[name] ? 'border-red-500' : ''}`}
          required={['name', 'surname', 'registrationNumber'].includes(name)}
        />
      )}
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  ), [formData, errors, handleChange]);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Add a new student</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Student Information</h3>
              {renderInput('surname', 'Surname')}
              {renderInput('name', 'Name')}
              {renderInput('dateOfBirth', 'Date of Birth', 'date')}
              {renderInput('placeOfBirth', 'Place of Birth')}
              {renderInput('gender', 'Gender', 'select', [
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' }
              ])}
              {renderInput('registrationNumber', 'Registration Number')}
              {renderInput('dateOfAdmission', 'Date of Admission', 'date')}
              {renderInput('classId', 'Class', 'select', [
                { value: '', label: 'Select a class' },
                ...classes.map(cls => ({ value: cls.id, label: cls.name }))
              ])}
              {renderInput('bloodGroup', 'Blood Group')}
              {renderInput('medicalCondition', 'Medical Condition')}
              {renderInput('previousSchool', 'Previous School')}
              {renderInput('religion', 'Religion')}
              {renderInput('discountInFees', 'Discount in Fees', 'number')}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Parent Information</h3>
              {renderInput('parentName', 'Parent Name')}
              {renderInput('parentSurname', 'Parent Surname')}
              {renderInput('parentMobileNumber', 'Parent Mobile Number', 'tel')}
            </div>
          </div>
          {errors.submit && <p className="text-red-500 text-sm mt-2">{errors.submit}</p>}
          <div className="flex justify-end space-x-4 mt-8">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentForm;