import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { FaUserGraduate, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';

const Dashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('students');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const students = await window.electron.ipcRenderer.invoke('get-students');
        if (students) 
        {
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

        // Simulated recent activity (you may want to implement this on the backend)
        setRecentActivity([
          { id: 1, action: 'New student enrolled', timestamp: '2 minutes ago', icon: '🎓' },
          { id: 2, action: 'Teacher added', timestamp: '1 hour ago', icon: '👩‍🏫' },
          { id: 3, action: 'Fee payment received', timestamp: '3 hours ago', icon: '💰' },
          { id: 4, action: 'New course added', timestamp: '5 hours ago', icon: '📚' },
          { id: 5, action: 'Employee hired', timestamp: '1 day ago', icon: '👤' },
        ]);

        // Simulated chart data (you may want to implement this on the backend)
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
    <div className={`bg-white p-6 rounded-lg shadow-lg flex items-center justify-between transform hover:scale-105 transition-transform duration-300 border-l-4 ${color}`}>
      <div>
        <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`text-${color.split('-')[1]} text-4xl`}>
        {icon}
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">School Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <StatCard title="Total Students" value={totalStudents} icon={<FaUserGraduate />} color="border-blue-500" />
        <StatCard title="Total Teachers" value={totalTeachers} icon={<FaChalkboardTeacher />} color="border-green-500" />
        <StatCard title="Total Employees" value={totalEmployees} icon={<FaUsers />} color="border-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Growth Over Time</h2>
          <div className="mb-4">
            <select 
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              <option value="students">Students</option>
              <option value="teachers">Teachers</option>
              <option value="employees">Employees</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={selectedMetric} fill={selectedMetric === 'students' ? '#3B82F6' : selectedMetric === 'teachers' ? '#10B981' : '#8B5CF6'} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
          <ul className="divide-y divide-gray-200">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="py-4 flex items-center">
                <span className="text-2xl mr-4">{activity.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.timestamp}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;