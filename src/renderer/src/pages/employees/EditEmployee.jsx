import React, { useState, useEffect } from 'react';

const EditEmployee = ({ employee, onClose }) => {
  const [editedEmployee, setEditedEmployee] = useState({ ...employee });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {

    // Appel IPC pour sauvegarder les modifications
    window.electron.ipcRenderer.invoke('update-employee', editedEmployee);
    console.log('Employee updated:', editedEmployee);
    onClose(); // Ferme le formulaire après la sauvegarde
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center p-4 show-up">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Employee</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Personal Information</h3>
          </div>
          <div>
            <label htmlFor="name" className="text-sm font-medium text-gray-500">First Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedEmployee.name}
              onChange={handleChange}
              placeholder="First Name"
              className="border p-2 rounded w-full mb-2"
            />
          </div>
          <div>
            <label htmlFor="surname" className="text-sm font-medium text-gray-500">Last Name</label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={editedEmployee.surname}
              onChange={handleChange}
              placeholder="Last Name"
              className="border p-2 rounded w-full mb-2"
            />
          </div>
          <div>
            <label htmlFor="birthDate" className="text-sm font-medium text-gray-500">Date of Birth</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={editedEmployee.birthDate || ''}
              onChange={handleChange}
              className="border p-2 rounded w-full mb-2"
            />
          </div>
          <div>
            <label htmlFor="gender" className="text-sm font-medium text-gray-500">Gender</label>
            <select
              id="gender"
              name="gender"
              value={editedEmployee.gender}
              onChange={handleChange}
              className="border p-2 rounded w-full mb-2"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="nationality" className="text-sm font-medium text-gray-500">Nationality</label>
            <input
              type="text"
              id="nationality"
              name="nationality"
              value={editedEmployee.nationality || ''}
              onChange={handleChange}
              placeholder="Nationality"
              className="border p-2 rounded w-full mb-2"
            />
          </div>
          <div>
            <label htmlFor="religion" className="text-sm font-medium text-gray-500">Religion</label>
            <input
              type="text"
              id="religion"
              name="religion"
              value={editedEmployee.religion || ''}
              onChange={handleChange}
              placeholder="Religion"
              className="border p-2 rounded w-full mb-2"
            />
          </div>

          {/* Employment Information */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Employment Information</h3>
          </div>
          <div>
            <label htmlFor="role" className="text-sm font-medium text-gray-500">Role</label>
            <input
              type="text"
              id="role"
              name="role"
              value={editedEmployee.role || ''}
              onChange={handleChange}
              placeholder="Role"
              className="border p-2 rounded w-full mb-2"
            />
          </div>
          <div>
            <label htmlFor="joinDate" className="text-sm font-medium text-gray-500">Date of Joining</label>
            <input
              type="date"
              id="joinDate"
              name="joinDate"
              value={editedEmployee.joinDate || ''}
              onChange={handleChange}
              className="border p-2 rounded w-full mb-2"
            />
          </div>
          <div>
            <label htmlFor="salary" className="text-sm font-medium text-gray-500">Monthly Salary</label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={editedEmployee.salary || ''}
              onChange={handleChange}
              placeholder="Monthly Salary"
              className="border p-2 rounded w-full mb-2"
            />
          </div>
          <div>
            <label htmlFor="experience" className="text-sm font-medium text-gray-500">Experience</label>
            <input
              type="text"
              id="experience"
              name="experience"
              value={editedEmployee.experience || ''}
              onChange={handleChange}
              placeholder="Experience"
              className="border p-2 rounded w-full mb-2"
            />
          </div>

          {/* Contact Information */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Contact Information</h3>
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-medium text-gray-500">Mobile Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={editedEmployee.phone || ''}
              onChange={handleChange}
              placeholder="Mobile Number"
              className="border p-2 rounded w-full mb-2"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-500">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={editedEmployee.email || ''}
              onChange={handleChange}
              placeholder="Email"
              className="border p-2 rounded w-full mb-2"
            />
          </div>
          <div>
            <label htmlFor="address" className="text-sm font-medium text-gray-500">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={editedEmployee.address || ''}
              onChange={handleChange}
              placeholder="Address"
              className="border p-2 rounded w-full mb-2"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 mr-2"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
