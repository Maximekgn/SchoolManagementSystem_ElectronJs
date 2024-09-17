import React from 'react';
import { FiHome, FiUsers, FiBriefcase, FiDollarSign, FiSettings } from 'react-icons/fi';

const SideBar = ({ setCurrentPage, currentPage, isOpen }) => {
  const menuItems = [
    { name: 'dashboard', icon: FiHome, label: 'Dashboard' },
    { name: 'students', icon: FiUsers, label: 'Students' },
    { name: 'employees', icon: FiBriefcase, label: 'Employees' },
    { name: 'payments', icon: FiDollarSign, label: 'Payments' },
    { name: 'settings', icon: FiSettings, label: 'Settings' },
  ];

  return (
    <div className={`w-64 bg-blue-900 text-white h-screen shadow-lg transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="p-6">
        <h1 className="text-3xl font-bold tracking-wide text-center">SchoolMS</h1>
      </div>
      <nav className="mt-10">
        {menuItems.map((item) => (
          <button 
            key={item.name}
            className={`w-full text-left py-3 px-5 rounded-lg transition duration-300 ${
              currentPage === item.name ? 'bg-blue-700' : 'hover:bg-blue-700'
            } flex items-center space-x-3`}
            onClick={() => setCurrentPage(item.name)}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-lg font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SideBar;