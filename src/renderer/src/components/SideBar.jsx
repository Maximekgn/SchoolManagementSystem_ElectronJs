import React from 'react';
import { FiHome, FiUsers, FiBriefcase, FiDollarSign, FiSettings, FiFileText } from 'react-icons/fi';

const SideBar = ({ setCurrentPage, currentPage, isOpen }) => {
  const menuItems = [
    { name: 'dashboard', icon: FiHome, label: 'Dashboard' },
    { name: 'students', icon: FiUsers, label: 'Students' },
    { name: 'employees', icon: FiBriefcase, label: 'Employees' },
    { name: 'payments', icon: FiDollarSign, label: 'Payments' },
    { name: 'classes', icon: FiBriefcase, label: 'Classes' },
    { name: 'settings', icon: FiSettings, label: 'Settings' },
    { name: 'reports', icon: FiFileText, label: 'Reports' },
  ];

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} ml-4 bg-gray-100 text-gray-800 h-screen transition-all duration-300 ease-in-out`}>
      <div className="p-20">

      </div>
      <nav className="mt-8">
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`w-full text-left py-3 px-4 rounded-lg transition duration-200 ${
              currentPage === item.name ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
            } flex items-center space-x-3`}
            onClick={() => setCurrentPage(item.name)}
          >
            <item.icon className={`w-6 h-6 ${isOpen ? 'mr-3' : 'mx-auto'}`} />
            <span className={`text-sm font-medium ${isOpen ? 'block' : 'hidden'}`}>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SideBar;
