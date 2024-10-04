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
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  );

  const InfoItem = ({ label, value }) => (
    <div className="bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-base font-semibold text-gray-800">{value || 'N/A'}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Student Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

        <div className="mt-8 flex justify-end">
          <button 
            onClick={onClose} 
            className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewStudent;
