import React, { useEffect, useState, useCallback } from 'react';

const ViewStudent = ({ student, onClose }) => {

  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }, []);

  const fetchClasses = useCallback(async () => {
    try {
      const response = await window.electron.ipcRenderer.invoke('get-classes');
      setClasses(response);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  }, []);

  useEffect(() => {
    console.log(student);
  }, [fetchClasses, student]);

  // Close on 'Esc' key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 transition-opacity duration-300 ease-out"
      role="dialog"
      aria-labelledby="student-details-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl transform transition-all duration-300 ease-out scale-95 sm:scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 id="student-details-title" className="text-2xl font-bold text-gray-800">Student Details</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
            aria-label="Close student details"
          >
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
            <p className="text-sm font-medium text-gray-500">First Name</p>
            <p className="mt-1  font-semibold">{student.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Last Name</p>
            <p className="mt-1  font-semibold">{student.surname}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Date of Birth</p>
            <p className="mt-1  font-semibold">{formatDate(student.birthDate)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Place of Birth</p>
            <p className="mt-1  font-semibold">{student.birthPlace || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Gender</p>
            <p className="mt-1  font-semibold">{student.gender || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Religion</p>
            <p className="mt-1  font-semibold">{student.religion || 'N/A'}</p>
          </div>

          {/* Academic Information */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Academic Information</h3>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Registration Number</p>
            <p className="mt-1  font-semibold">{student.regNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Date of Admission</p>
            <p className="mt-1  font-semibold">{formatDate(student.admissionDate)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Class</p>
            <p className="mt-1  font-semibold">{student.className}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Previous School</p>
            <p className="mt-1  font-semibold">{student.previousSchool || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">School Fees</p>
            <p className="mt-1  font-semibold">{student.schoolFee}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Paid Fees</p>
            <p className="mt-1  font-semibold">{student.paidFee || 0}</p>
          </div>

          {/* Health Information */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Health Information</h3>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Blood Group</p>
            <p className="mt-1  font-semibold">{student.bloodGroup || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Medical Condition</p>
            <p className="mt-1  font-semibold">{student.medicalCondition || 'None'}</p>
          </div>

          {/* Parent Information */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Parent Information</h3>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Parent's First Name</p>
            <p className="mt-1  font-semibold">{student.parentName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Parent's Last Name</p>
            <p className="mt-1  font-semibold">{student.parentSurname}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Parent's Mobile Number</p>
            <p className="mt-1  font-semibold">{student.parentPhone|| 'N/A'}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
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

export default ViewStudent;
