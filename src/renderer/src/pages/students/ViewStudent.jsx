import React, { useEffect, useCallback } from 'react';

const ViewStudent = ({ student, onClose }) => {
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }, []);

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
    <div className="mb-6">
      <h3 className="text-xl font-bold text-blue-700 border-b border-blue-200 pb-2 mb-3">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );

  const InfoItem = ({ label, value }) => (
    <div className="bg-white p-3 rounded-lg shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-gray-800">{value || 'N/A'}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-100 rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">Student Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

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
          <InfoItem label="School Fees" value={`${student.schoolFee || 0} FCFA`} />
          <InfoItem label="Paid Fees" value={`${student.paidFee || 0} FCFA`} />
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

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewStudent;
