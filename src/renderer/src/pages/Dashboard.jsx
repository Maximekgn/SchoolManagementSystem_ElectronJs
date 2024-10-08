import React, { useState, useEffect, useCallback } from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaUsers, FaSchool, FaMoneyBill } from 'react-icons/fa';

const Dashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalClasses, setTotalClasses] = useState(0);
  const [totalRegistrationsFee, setTotalRegistrationsFee] = useState(0);
  const [totalTuitionFee, setTotalTuitionFee] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const students = await window.electron.ipcRenderer.invoke('get-students');
      const employees = await window.electron.ipcRenderer.invoke('get-employees');
      const classes = await window.electron.ipcRenderer.invoke('get-classes');
      const payments = await window.electron.ipcRenderer.invoke('get-all-payments');

      setTotalStudents(students?.length || 0);
      setTotalEmployees(employees?.length || 0);
      setTotalTeachers(employees?.filter(employee => employee.role.toLowerCase() === 'teacher').length || 0);
      setTotalClasses(classes?.length || 0);

      if (payments) {
        setTotalRegistrationsFee(payments.filter(payment => payment.title.toLowerCase().trim() === 'registration fee').reduce((sum, payment) => sum + payment.amountPaid, 0));
        setTotalTuitionFee(payments.filter(payment => payment.title.toLowerCase().trim() === 'tuition fee').reduce((sum, payment) => sum + payment.amountPaid, 0));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center space-x-4 show-up">
      <div className="p-3 rounded-full bg-blue-100 text-blue-600">
        {icon}
      </div>
      <div>
        <h2 className="text-sm font-medium text-gray-500">{title}</h2>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">School Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Students" value={totalStudents} icon={<FaUserGraduate className="text-2xl" />} />
        <StatCard title="Total Teachers" value={totalTeachers} icon={<FaChalkboardTeacher className="text-2xl" />} />
        <StatCard title="Total Employees" value={totalEmployees} icon={<FaUsers className="text-2xl" />} />
        <StatCard title="Total Classes" value={totalClasses} icon={<FaSchool className="text-2xl" />} />
        <StatCard title="Total Registrations Fee" value={`FCFA ${totalRegistrationsFee.toLocaleString('en-US')}`} icon={<FaMoneyBill className="text-2xl" />} />
        <StatCard title="Total Tuition Fee" value={`FCFA ${totalTuitionFee.toLocaleString('en-US')}`} icon={<FaMoneyBill className="text-2xl" />} />
      </div>
    </div>
  );
};

export default Dashboard;
