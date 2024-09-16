import React, { useState } from 'react';
import Header from './components/Header';
import SideBar from './components/SideBar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Employees from './pages/Employees';
import Payment from './pages/Payment';
import Settings from './pages/Settings';
import { FiMenu } from 'react-icons/fi';

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const renderPage = () => {
    switch (currentPage) {
      case 'students':
        return <Students />;
      case 'employees':
        return <Employees />;
      case 'payments':
        return <Payment />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        isOpen={isSidebarOpen}
      />
      <div className="flex flex-col flex-grow">
        <Header title="School Management System">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md lg:hidden hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <FiMenu className="h-6 w-6" />
          </button>
        </Header>
        <main className="flex-grow overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {renderPage()}
          </div>
        </main>
        <footer className="bg-white shadow-lg">
          <div className="container mx-auto px-6 py-4">
            <p className="text-center text-gray-600 text-sm">
              © 2024 School Management System. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;