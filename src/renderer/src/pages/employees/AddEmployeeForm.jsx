import React, { useState } from 'react';
import { FiUser, FiCalendar, FiPhone, FiFlag, FiDollarSign, FiBriefcase, FiMail, FiMapPin } from 'react-icons/fi';

const AddEmployeeForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    birthDate: new Date().toISOString().split('T')[0],
    gender: 'Male',
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
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) || 0 : value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const requiredFields = ['name', 'surname', 'role', 'birthDate'];
    const newErrors = requiredFields.reduce((acc, field) => {
      if (!formData[field].trim()) acc[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
      return acc;
    }, {});
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await window.electron.ipcRenderer.invoke('add-employee', formData);
      onClose();
    } catch (error) {
      console.error('Error adding employee:', error);
      setErrors({ submit: error.message || 'Failed to add employee. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = (name, label, type = 'text', isRequired = false, icon) => (
    <div className="mb-4 w-full sm:w-1/2 px-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
          {icon}
        </span>
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={`w-full pl-10 p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${errors[name] ? 'border-red-500' : ''}`}
          required={isRequired}
        />
      </div>
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 show-up">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Add New Employee</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {renderInput('surname', 'Surname', 'text', true, <FiUser />)}
            {renderInput('name', 'Name', 'text', true, <FiUser />)}
            {renderInput('birthDate', 'Date of Birth', 'date', true, <FiCalendar />)}
            {renderInput('nationalId', 'National ID', 'text', false, <FiUser />)}
            {renderInput('phone', 'Mobile Number', 'tel', false, <FiPhone />)}
            {renderInput('nationality', 'Nationality', 'text', false, <FiFlag />)}
            {renderInput('joinDate', 'Date of Joining', 'date', true, <FiCalendar />)}
            {renderInput('role', 'Role', 'text', true, <FiBriefcase />)}
            {renderInput('salary', 'Monthly Salary', 'number', false, <FiDollarSign />)}
            {renderInput('experience', 'Experience', 'text', false, <FiBriefcase />)}
            {renderInput('religion', 'Religion', 'text', false, <FiUser />)}
            {renderInput('email', 'Email', 'email', false, <FiMail />)}
            {renderInput('address', 'Address', 'text', false, <FiMapPin />)}

            <div className="mb-4 w-full sm:w-1/2 px-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <FiUser />
                </span>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full pl-10 p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8 space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeForm;
