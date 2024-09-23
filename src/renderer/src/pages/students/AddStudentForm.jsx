import React, { useState, useEffect } from 'react';

const AddStudentForm = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    surname: '', name: '', dateOfBirth: '', placeOfBirth: 'unknown', gender: 'Male',
    registrationNumber: 'unknown', dateOfAdmission: '', classId: '', bloodGroup: 'unknown',
    medicalCondition: '', previousSchool: '', religion: 'unknown', parentName: '',
    parentSurname: '', parentMobileNumber: ''
  });
  
  const [classes, setClasses] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch classes from backend
    const fetchClasses = async () => {
      try {
        const response = await window.electron.ipcRenderer.invoke('get-classes');
        setClasses(response); // Assuming the response is an array of classes
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const result = await window.electron.ipcRenderer.invoke('add-student', {
          surname: formData.surname,
          name: formData.name,
          date_of_birth: formData.dateOfBirth,
          place_of_birth: formData.placeOfBirth,
          gender: formData.gender,
          registration_number: formData.registrationNumber,
          date_of_admission: formData.dateOfAdmission,
          class_id: formData.classId,
          blood_group: formData.bloodGroup,
          medical_condition: formData.medicalCondition,
          previous_school: formData.previousSchool,
          religion: formData.religion,
          parent_name: formData.parentName,
          parent_surname: formData.parentSurname,
          parent_mobile_number: formData.parentMobileNumber
        });
        if (result.id) {
          onAdd(result.id); // Assuming the callback expects the ID of the new student
        } else {
          throw new Error('Failed to add student');
        }
      } catch (error) {
        console.error('Error adding student:', error);
        setErrors(prev => ({ ...prev, submit: 'Failed to add student. Please try again.' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.surname.trim()) newErrors.surname = 'Surname is required';
    if (!formData.classId.trim()) newErrors.classId = 'Class ID is required';
    if (!formData.registrationNumber.trim()) newErrors.registrationNumber = 'Registration number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Add a new student</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Student Information</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Surname</label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.surname ? 'border-red-500' : ''}`}
                  required
                  aria-invalid={errors.surname ? 'true' : 'false'}
                />
                {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
                  required
                  aria-invalid={errors.name ? 'true' : 'false'}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
                <input
                  type="text"
                  name="placeOfBirth"
                  value={formData.placeOfBirth}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.registrationNumber ? 'border-red-500' : ''}`}
                  required
                  aria-invalid={errors.registrationNumber ? 'true' : 'false'}
                />
                {errors.registrationNumber && <p className="text-red-500 text-xs mt-1">{errors.registrationNumber}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Admission</label>
                <input
                  type="date"
                  name="dateOfAdmission"
                  value={formData.dateOfAdmission}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.classId ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                {errors.classId && <p className="text-red-500 text-xs mt-1">{errors.classId}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                <input
                  type="text"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical Condition</label>
                <input
                  type="text"
                  name="medicalCondition"
                  value={formData.medicalCondition}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Previous School</label>
                <input
                  type="text"
                  name="previousSchool"
                  value={formData.previousSchool}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                <input
                  type="text"
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Parent Information</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name</label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Surname</label>
                <input
                  type="text"
                  name="parentSurname"
                  value={formData.parentSurname}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Mobile Number</label>
                <input
                  type="tel"
                  name="parentMobileNumber"
                  value={formData.parentMobileNumber}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
          {errors.submit && <p className="text-red-500 text-sm mt-2">{errors.submit}</p>}
          <div className="flex justify-end space-x-4 mt-8">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentForm;
