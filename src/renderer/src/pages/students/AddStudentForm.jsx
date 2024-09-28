import React, { useState, useEffect, useCallback } from 'react';

const AddEmployeeForm = ({ onAdd, onClose }) => {
  const initialFormData = {
    surname: '',
    name: '',
    birthDate: new Date().toISOString().split('T')[0],
    gender: 'Other',
    regNumber: '',
    nationalId: '',
    phone: '',
    nationality: '',
    joinDate: new Date().toISOString().split('T')[0],
    role: '',
    salary: 0,
    experience: '',
    religion: '',
    email: '',
    address: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value
    }));
    setErrors(prev => ({ ...prev, [name]: '', submit: '' }));
  };

  // Validate form before submitting
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['name', 'surname', 'birthDate', 'gender', 'joinDate', 'role'];

    requiredFields.forEach(field => {
      if (!formData[field].toString().trim()) {
        newErrors[field] = `${field} is required.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        const result = await window.electron.ipcRenderer.invoke('add-employee', formData);

        if (result.success) {
          onAdd(result);  // Callback pour mise à jour de la liste des employés
          setFormData(initialFormData); // Réinitialiser le formulaire après ajout
          onClose();  // Fermer le formulaire
        } else {
          throw new Error(result.error || 'Failed to add employee');
        }
      } catch (error) {
        console.error('Error adding employee:', error);
        setErrors(prev => ({
          ...prev,
          submit: error.message || 'Failed to add employee. Please try again.'
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Render field dynamically
  const renderField = (name, label, type = 'text', options = null) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {options ? (
        <select
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors[name] ? 'border-red-500' : ''}`}
          disabled={isSubmitting}
          required={['gender'].includes(name)}
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
          disabled={isSubmitting}
          required={['name', 'surname', 'birthDate', 'joinDate', 'role'].includes(name)}
        />
      )}
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Add New Employee</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Employee Information</h3>
              {renderField('surname', 'Surname')}
              {renderField('name', 'Name')}
              {renderField('birthDate', 'Birth Date', 'date')}
              {renderField('gender', 'Gender', 'select', [
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' }
              ])}
              {renderField('regNumber', 'Registration Number')}
              {renderField('nationalId', 'National ID')}
              {renderField('phone', 'Mobile Number', 'tel')}
              {renderField('nationality', 'Nationality')}
              {renderField('joinDate', 'Join Date', 'date')}
              {renderField('role', 'Role')}
              {renderField('salary', 'Monthly Salary', 'number')}
              {renderField('experience', 'Experience')}
              {renderField('religion', 'Religion')}
              {renderField('email', 'Email', 'email')}
              {renderField('address', 'Address')}
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

export default AddEmployeeForm;
