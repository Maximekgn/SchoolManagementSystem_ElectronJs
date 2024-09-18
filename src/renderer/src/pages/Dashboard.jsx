import React, { useState, useEffect } from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaUsers} from 'react-icons/fa';

const Dashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const students = await window.electron.ipcRenderer.invoke('get-students');
        if (students) {
          setTotalStudents(students.length);
        }
        const teachers = await window.electron.ipcRenderer.invoke('get-teachers');
        if (teachers) {
          setTotalTeachers(teachers.length);
        }

        const employees = await window.electron.ipcRenderer.invoke('get-employees');
        if (employees) {
          setTotalEmployees(employees.length);
        }

        // Simulated recent activity
        setRecentActivity([
          { id: 1, action: 'New student enrolled', timestamp: '2 minutes ago', icon: '🎓' },
          { id: 2, action: 'Teacher added', timestamp: '1 hour ago', icon: '👩‍🏫' },
          { id: 3, action: 'Fee payment received', timestamp: '3 hours ago', icon: '💰' },
          { id: 4, action: 'New course added', timestamp: '5 hours ago', icon: '📚' },
          { id: 5, action: 'Employee hired', timestamp: '1 day ago', icon: '👤' },
        ]);

        // Simulated chart data
        setChartData([
          { name: 'Jan', students: 300, teachers: 40, employees: 60 },
          { name: 'Feb', students: 320, teachers: 42, employees: 62 },
          { name: 'Mar', students: 310, teachers: 45, employees: 63 },
          { name: 'Apr', students: 340, teachers: 48, employees: 65 },
          { name: 'May', students: 350, teachers: 50, employees: 67 },
          { name: 'Jun', students: 370, teachers: 52, employees: 70 },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
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
      </div>

    </div>
  );
};

export default Dashboard;