import React from 'react';
import { FiHome, FiUsers, FiBriefcase, FiDollarSign, FiSettings, FiFileText } from 'react-icons/fi';

const SideBar = ({ setCurrentPage, currentPage }) => {
  const menuItems = [
    { name: 'dashboard', icon: FiHome, label: 'Dashboard' },
    { name: 'students', icon: FiUsers, label: 'Students' },
    { name: 'employees', icon: FiBriefcase, label: 'Employees' },
    { name: 'payments', icon: FiDollarSign, label: 'Payments' },
    { name: 'classes', icon: FiBriefcase, label: 'Classes' },
    { name: 'settings', icon: FiSettings, label: 'Settings' },
  ];

  return (
    <div className="w-64 px-[10px] bg-gray-100 text-gray-800 h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="p-3">

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
            <item.icon className="w-6 h-6 mr-3" />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SideBar;
