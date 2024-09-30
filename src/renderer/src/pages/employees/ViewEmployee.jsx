import React, { useEffect } from 'react';
import { FiX, FiUser, FiBriefcase, FiPhone } from 'react-icons/fi';

const ViewEmployee = ({ employee, onClose }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const InfoSection = ({ title, icon, children }) => (
    <div className="mb-6">
      <h3 className="text-lg sm:text-xl font-semibold text-blue-700 mb-3 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );

  const InfoItem = ({ label, value }) => (
    <div className="bg-white p-3 rounded-lg shadow-sm">
      <p className="text-xs sm:text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-sm sm:text-base font-semibold text-gray-800">{value || 'N/A'}</p>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 transition-opacity duration-300 ease-out overflow-y-auto"
      role="dialog" 
      aria-labelledby="employee-details-title" 
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-2xl p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out scale-95 sm:scale-100">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 id="employee-details-title" className="text-xl sm:text-2xl font-bold text-blue-800">Employee Details</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-blue-700 transition-colors duration-200" 
            aria-label="Close employee details"
          >
            <FiX className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <InfoSection title="Personal Information" icon={<FiUser className="text-blue-600" />}>
          <InfoItem label="First Name" value={employee.name} />
          <InfoItem label="Last Name" value={employee.surname} />
          <InfoItem label="Date of Birth" value={formatDate(employee.birthDate)} />
          <InfoItem label="Gender" value={employee.gender} />
          <InfoItem label="Nationality" value={employee.nationality} />
          <InfoItem label="Religion" value={employee.religion} />
        </InfoSection>

        <InfoSection title="Employment Information" icon={<FiBriefcase className="text-blue-600" />}>
          <InfoItem label="Employee Role" value={employee.role} />
          <InfoItem label="Date of Joining" value={formatDate(employee.joinDate)} />
          <InfoItem label="Monthly Salary" value={employee.salary ? `${employee.salary} FCFA` : 'N/A'} />
          <InfoItem label="Experience" value={employee.experience} />
        </InfoSection>

        <InfoSection title="Contact Information" icon={<FiPhone className="text-blue-600" />}>
          <InfoItem label="Mobile Number" value={employee.phone} />
          <InfoItem label="Email" value={employee.email} />
          <InfoItem label="Address" value={employee.address} />
        </InfoSection>

        <div className="mt-6 sm:mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployee;
