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
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );

  const InfoItem = ({ label, value }) => (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-gray-800">{value || 'N/A'}</p>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 transition-opacity duration-300 ease-out"
      role="dialog" 
      aria-labelledby="employee-details-title" 
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-4xl max-h-90vh overflow-y-auto transform transition-all duration-300 ease-out scale-95 sm:scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 id="employee-details-title" className="text-3xl font-bold text-indigo-800">Employee Details</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-indigo-700 transition-colors duration-200" 
            aria-label="Close employee details"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <InfoSection title="Personal Information" icon={<FiUser className="text-indigo-600" />}>
          <InfoItem label="First Name" value={employee.name} />
          <InfoItem label="Last Name" value={employee.surname} />
          <InfoItem label="Date of Birth" value={formatDate(employee.birthDate)} />
          <InfoItem label="Gender" value={employee.gender} />
          <InfoItem label="Nationality" value={employee.nationality} />
          <InfoItem label="Religion" value={employee.religion} />
        </InfoSection>

        <InfoSection title="Employment Information" icon={<FiBriefcase className="text-indigo-600" />}>
          <InfoItem label="Employee Role" value={employee.role} />
          <InfoItem label="Date of Joining" value={formatDate(employee.joinDate)} />
          <InfoItem label="Monthly Salary" value={employee.salary ? `FCFA ${employee.salary}` : 'N/A'} />
          <InfoItem label="Experience" value={employee.experience} />
        </InfoSection>

        <InfoSection title="Contact Information" icon={<FiPhone className="text-indigo-600" />}>
          <InfoItem label="Mobile Number" value={employee.phone} />
          <InfoItem label="Email" value={employee.email} />
          <InfoItem label="Address" value={employee.address} />
        </InfoSection>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition duration-300 shadow-md hover:shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployee;
