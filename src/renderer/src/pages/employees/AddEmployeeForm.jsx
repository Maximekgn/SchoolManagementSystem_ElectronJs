import React, { useState } from 'react';

const AddEmployeeForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    date_of_birth: new Date().toISOString().split('T')[0],
    gender: 'Male',
    registration_number: '',
    picture: null,
    national_id: '',
    mobile_number: '',
    nationality: '',
    date_of_joining: new Date().toISOString().split('T')[0],
    employee_role: '',
    monthly_salary: 0,
    experience: '',
    religion: '',
    email: '',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gestion du changement des inputs
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) || 0 : value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Gestion du fichier image
  const handleFileChange = (e) => setFormData(prev => ({ ...prev, picture: e.target.files[0] }));

  // Validation simple
  const validateForm = () => {
    const requiredFields = ['name', 'surname', 'employee_role', 'date_of_birth'];
    const newErrors = requiredFields.reduce((acc, field) => {
      if (!formData[field].trim()) acc[field] = `${field.replace(/_/g, ' ')} is required.`;
      return acc;
    }, {});
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await window.electron.ipcRenderer.invoke('add-employee', formData);
      onClose();
    } catch (error) {
      alert('Error adding employee. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour créer les champs de formulaire
  const renderInput = (name, label, type = 'text', isRequired = false) => (
    <div className="mb-4 w-full sm:w-1/2 px-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors[name] ? 'border-red-500' : ''}`}
        required={isRequired}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">Add New Employee</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderInput('surname', 'Surname', 'text', true)}
            {renderInput('name', 'Name', 'text', true)}
            {renderInput('date_of_birth', 'Date of Birth', 'date', true)}
            {renderInput('national_id', 'National ID')}
            {renderInput('mobile_number', 'Mobile Number', 'tel')}
            {renderInput('nationality', 'Nationality')}
            {renderInput('date_of_joining', 'Date of Joining', 'date', true)}
            {renderInput('employee_role', 'Role', 'text', true)}
            {renderInput('monthly_salary', 'Monthly Salary', 'number')}
            {renderInput('experience', 'Experience')}
            {renderInput('religion', 'Religion')}
            {renderInput('email', 'Email', 'email')}
            {renderInput('address', 'Address')}

            <div className="mb-4 w-full sm:w-1/2 px-2">
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-4 w-full sm:w-1/2 px-2">
              <label className="block text-sm font-medium text-gray-700">Picture</label>
              <input
                type="file"
                name="picture"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition ${isSubmitting ? 'opacity-50' : ''}`}
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
