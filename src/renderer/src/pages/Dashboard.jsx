import React, { useState, useEffect } from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaUsers , FaSchool} from 'react-icons/fa';

const Dashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalClasses, setTotalClasses] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await window.electron.ipcRenderer.invoke('get-students');
        console.log("Received students data:", data); // Log pour voir la structure des données
        if (data && data.success) {
          setTotalStudents(data.data.length); // Assure-toi d'accéder à la bonne propriété
        }
  
        const teachers = await window.electron.ipcRenderer.invoke('get-teachers');
        if (teachers) {
          setTotalTeachers(teachers.length);
        }
  
        const employees = await window.electron.ipcRenderer.invoke('get-employees');
        if (employees ) {
          setTotalEmployees(employees.length);
        }
        const classes = await window.electron.ipcRenderer.invoke('get-classes');
        if (classes) {
          setTotalClasses(classes.length);
        }
  
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  const StatCard = ({ title, value, icon }) => (
    <div className={`bg-white p-6 rounded-lg shadow-lg flex items-center justify-between transform  transition-transform duration-300 `}>
      <div>
        <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`text-4xl`}>
        {icon} 
      </div>
    </div>
  );



  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">School Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <StatCard title="Total Students" value={totalStudents} icon={<FaUserGraduate />} />
        <StatCard title="Total Teachers" value={totalTeachers} icon={<FaChalkboardTeacher />}  />
        <StatCard title="Total Employees" value={totalEmployees} icon={<FaUsers />} />
        <StatCard title="Total Classes" value={totalClasses} icon={<FaSchool />} />
      </div>

    </div>
  );
};

export default Dashboard;