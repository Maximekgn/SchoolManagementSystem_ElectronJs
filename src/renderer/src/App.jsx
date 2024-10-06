import React, { useState } from 'react';
import SideBar from './components/SideBar';
import Dashboard from './pages/Dashboard';
import Students from './pages/students/Students';
import Employees from './pages/employees/Employees';
import Payment from './pages//payment/Payment';
import Settings from './pages/settings/Settings';
import Classes from './pages/classes/Classes';
import Reports from './pages/reports/Reports';

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
      case 'classes':
        return <Classes/>
      case 'reports':
        return <Reports/>
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
        <main className="flex-grow overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;