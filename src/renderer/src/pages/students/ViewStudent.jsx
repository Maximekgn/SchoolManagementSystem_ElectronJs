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

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const InfoSection = ({ title, children }) => (
    <>
      <div className="col-span-2 mt-8 mb-4">
        <h3 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2">{title}</h3>
      </div>
      {children}
    </>
  );

  const InfoItem = ({ label, value }) => (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-gray-800">{value || 'N/A'}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 transition-opacity duration-300 ease-out" role="dialog" aria-labelledby="student-details-title" aria-modal="true">
      <div className="bg-gray-100 rounded-xl shadow-2xl p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out scale-95 sm:scale-100">
        <div className="flex justify-between items-center mb-8">
          <h2 id="student-details-title" className="text-3xl font-extrabold text-indigo-800">Student Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600 transition-colors duration-200" aria-label="Close student details">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <InfoSection title="Personal Information">
            <InfoItem label="First Name" value={student.name} />
            <InfoItem label="Last Name" value={student.surname} />
            <InfoItem label="Date of Birth" value={formatDate(student.birthDate)} />
            <InfoItem label="Place of Birth" value={student.birthPlace} />
            <InfoItem label="Gender" value={student.gender} />
            <InfoItem label="Religion" value={student.religion} />
          </InfoSection>

          <InfoSection title="Academic Information">
            <InfoItem label="Registration Number" value={student.regNumber} />
            <InfoItem label="Date of Admission" value={formatDate(student.admissionDate)} />
            <InfoItem label="Class" value={student.className} />
            <InfoItem label="Previous School" value={student.previousSchool} />
            <InfoItem label="School Fees" value={`$${student.schoolFee || 0}`} />
            <InfoItem label="Paid Fees" value={`$${student.paidFee || 0}`} />
          </InfoSection>

          <InfoSection title="Health Information">
            <InfoItem label="Blood Group" value={student.bloodGroup} />
            <InfoItem label="Medical Condition" value={student.medicalCondition || 'None'} />
          </InfoSection>

          <InfoSection title="Parent Information">
            <InfoItem label="Parent's First Name" value={student.parentName} />
            <InfoItem label="Parent's Last Name" value={student.parentSurname} />
            <InfoItem label="Parent's Mobile Number" value={student.parentPhone} />
          </InfoSection>
        </div>

        <div className="mt-10 flex justify-end">
          <button onClick={onClose} className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition duration-300 shadow-md hover:shadow-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewStudent;
