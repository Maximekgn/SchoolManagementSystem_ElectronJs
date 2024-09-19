import React, { useState, useEffect } from 'react';

// Composant pour afficher un formulaire d'ajout d'employés
const AddEmployeeForm = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    date_of_birth: '',
    gender: 'Male',
    registration_number: '',
    picture: null,
    national_id: '',
    mobile_number: '',
    nationality: '',
    date_of_joining: '',
    employee_role: '',
    monthly_salary: 0,
    experience: '',
    religion: '',
    email: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, picture: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      name: '',
      surname: '',
      date_of_birth: '',
      gender: 'Male',
      registration_number: '',
      picture: null,
      national_id: '',
      mobile_number: '',
      nationality: '',
      date_of_joining: '',
      employee_role: '',
      monthly_salary: 0,
      experience: '',
      religion: '',
      email: '',
      address: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add New Employee</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(formData).map((key) => {
            if (key === 'picture') {
              return (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Picture</label>
                  <input
                    type="file"
                    name="picture"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  />
                </div>
              );
            }

            let inputType = 'text';
            if (key === 'date_of_birth' || key === 'date_of_joining') {
              inputType = 'date';
            } else if (key === 'monthly_salary') {
              inputType = 'number';
            } else if (key === 'gender') {
              return (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              );
            }

            return (
              <div key={key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">{key.replace(/_/g, ' ').toUpperCase()}</label>
                <input
                  type={inputType}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required={['name', 'surname', 'date_of_birth'].includes(key)}
                />
              </div>
            );
          })}
          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default AddEmployeeForm;