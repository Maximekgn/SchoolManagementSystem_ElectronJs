import React, { useEffect, useState, useCallback } from 'react';

const StudentEdit = ({ student, onClose, onSave }) => {
  const [editedStudent, setEditedStudent] = useState({ ...student });
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditedStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const fetchClasses = useCallback(async () => {
    try {
      const response = await window.electron.ipcRenderer.invoke('get-classes');
      setClasses(response);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  }, []);

  const handleSave = useCallback(() => {
    const updatedStudent = {
      ...editedStudent,
      class_id: getClassId(editedStudent.class_name),
    };
    delete updatedStudent.class_name;
    console.log('Updated student:', updatedStudent);
    window.electron.ipcRenderer.invoke('update-student', updatedStudent);
    onClose();
  }, [editedStudent, onClose]);

  const getClassId = useCallback((className) => {
    const selectedClass = classes.find((classe) => classe.name === className);
    return selectedClass ? selectedClass.id : null;
  }, [classes]);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Student</h2>
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
              value={editedStudent.name}
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
              value={editedStudent.surname}
              onChange={handleChange}
              placeholder="Last Name"
              className="border p-2 rounded w-full mb-2"
            />
          </div>
          <div>
            <label htmlFor="date_of_birth" className="text-sm font-medium text-gray-500">Date of Birth</label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={editedStudent.birthDate}
              onChange={handleChange}
              className="border p-2 rounded w-full mb-2"
            />
          </div>
          <div>
            <label htmlFor="place_of_birth" className="text-sm font-medium text-gray-500">Place of Birth</label>
            <input
              type="text"
              id="place_of_birth"
              name="place_of_birth"
              value={editedStudent.birthPlace}
              onChange={handleChange}
              placeholder="Place of Birth"
              className="border p-2 rounded w-full mb-2"
            />
          </div>
          <div>
            <label htmlFor="gender" className="text-sm font-medium text-gray-500">Gender</label>
            <select
              id="gender"
              name="gender"
              value={editedStudent.gender}
              onChange={handleChange}
              className="border p-2 rounded w-full mb-2"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="religion" className="text-sm font-medium text-gray-500">Religion</label>
            <input
              type="text"
              id="religion"
              name="religion"
              value={editedStudent.religion}
              onChange={handleChange}
              placeholder="Religion"
              className="border p-2 rounded w-full mb-2"
            />
          </div>

          {/* Academic Information */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Academic Information</h3>
          </div>
          <div>
            <label htmlFor="registration_number" className="text-sm font-medium text-gray-500">Registration Number</label>
            <input
              type="text"
              id="registration_number"
              name="registration_number"
              value={editedStudent.regNumber}
              onChange={handleChange}
              placeholder="Registration Number"
              className="border p-2 rounded w-full mb-2"
            />
          </div>
          <div>
            <label htmlFor="date_of_admission" className="text-sm font-medium text-gray-500">Date of Admission</label>
            <input
              type="date"
              id="date_of_admission"
              name="date_of_admission"
              value={editedStudent.admissionDate}
              onChange={handleChange}
              className="border p-2 rounded w-full mb-2"
            />
          </div>
          <div>
            <label htmlFor="class_name" className="text-sm font-medium text-gray-500">Class</label>
            <select
              id="class_name"
              name="class_name"
              value={editedStudent.className}
              onChange={handleChange}
              className="border p-2 rounded w-full mb-2"
            >
              <option value="">Select a class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="previous_school" className="text-sm font-medium text-gray-500">Previous School</label>
            <input
              type="text"
              id="previous_school"
              name="previous_school"
              value={editedStudent.previousSchool}
              onChange={handleChange}
              placeholder="Previous School"
              className="border p-2 rounded w-full mb-2"
            />
          </div>

          {/* Health Information */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Health Information</h3>
          </div>
          <div>
            <label htmlFor="blood_group" className="text-sm font-medium text-gray-500">Blood Group</label>
            <input
              type="text"
              id="blood_group"
              name="blood_group"
              value={editedStudent.bloodGroup}
              onChange={handleChange}
              placeholder="Blood Group"
              className="border p-2 rounded w-full mb-2"
            />
          </div>
          <div>
            <label htmlFor="medical_condition" className="text-sm font-medium text-gray-500">Medical Condition</label>
            <input
              type="text"
              id="medical_condition"
              name="medical_condition"
              value={editedStudent.medicalCondition}
              onChange={handleChange}
              placeholder="Medical Condition"
              className="border p-2 rounded w-full mb-2"
            />
          </div>

          {/* Parent Information */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Parent Information</h3>
          </div>
          <div>
            <label htmlFor="parent_name" className="text-sm font-medium text-gray-500">Parent's First Name</label>
            <input
              type="text"
              id="parent_name"
              name="parent_name"
              value={editedStudent.parentName}
              onChange={handleChange}
              placeholder="Parent's First Name"
              className="border p-2 rounded w-full mb-2"
            />
          </div>
          <div>
            <label htmlFor="parent_surname" className="text-sm font-medium text-gray-500">Parent's Last Name</label>
            <input
              type="text"
              id="parent_surname"
              name="parent_surname"
              value={editedStudent.parentSurname}
              onChange={handleChange}
              placeholder="Parent's Last Name"
              className="border p-2 rounded w-full mb-2"
            />
          </div>
          <div>
            <label htmlFor="parent_mobile_number" className="text-sm font-medium text-gray-500">Parent's Mobile Number</label>
            <input
              type="tel"
              id="parent_mobile_number"
              name="parent_mobile_number"
              value={editedStudent.parentPhone}
              onChange={handleChange}
              placeholder="Parent's Mobile Number"
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

export default StudentEdit;
