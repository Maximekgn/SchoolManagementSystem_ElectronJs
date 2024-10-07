import React, { useState, useEffect, useCallback } from 'react';
import AddMark from './AddMark';
import ReportCard from '../../components/ReportCard';
import EditMark from './EditMark';
import { FiEye, FiEdit, FiPlus, FiSearch, FiFilter } from 'react-icons/fi';

const ReportTable = ({ students, onViewReport, onEditReport, onAddMark }) => (
  <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-100">
        <tr>
          {['Name', 'Surname', 'Class', 'Parent Phone', 'Actions'].map((header) => (
            <th key={header} className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {students.map((student) => (
          <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-200">
            <td className="px-4 py-3.5 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
            <td className="px-4 py-3.5 whitespace-nowrap text-sm text-gray-500">{student.surname}</td>
            <td className="px-4 py-3.5 whitespace-nowrap text-sm text-gray-500">{student.className}</td>
            <td className="px-4 py-3.5 whitespace-nowrap text-sm text-gray-500">{student.parentPhone || 'N/A'}</td>
            <td className="px-4 py-3.5 whitespace-nowrap text-sm font-medium">
              <button onClick={() => onAddMark(student)} className="text-green-600 hover:text-green-800 transition-colors duration-200 mr-2">
                <FiPlus className="inline-block mr-1" /> <span className="hidden sm:inline">Add</span>
              </button>
              <button onClick={() => onEditReport(student)} className="text-blue-600 hover:text-blue-800 transition-colors duration-200 mr-2">
                <FiEdit className="inline-block mr-1" /> <span className="hidden sm:inline">Edit</span>
              </button>
              <button onClick={() => onViewReport(student)} className="text-purple-600 hover:text-purple-800 transition-colors duration-200">
                <FiEye className="inline-block mr-1" /> <span className="hidden sm:inline">View</span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="mt-6 flex flex-wrap items-center justify-center">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-3 py-1 m-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      Previous
    </button>
    <span className="mx-2 text-sm text-gray-700">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-3 py-1 m-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      Next
    </button>
  </div>
);

const Reports = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(10);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');

  const fetchStudents = useCallback(async () => {
    try {
      const response = await window.electron.ipcRenderer.invoke('get-students');
      setStudents(response);
      const uniqueClasses = [...new Set(response.map(student => student.className))];
      setClasses(uniqueClasses);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setStudentsPerPage(5);
      } else {
        setStudentsPerPage(10);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddMark = (student) => {
    setSelectedStudent(student);
    setIsAdding(true);
  };

  const handleEditReport = (student) => {
    setSelectedStudent(student);
    setIsEditing(true);
  };

  const handleViewReport = (student) => {
    setSelectedStudent(student);
    setIsViewing(true);
  };

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.surname}`.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedClass === '' || student.className === selectedClass)
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Student Reports</h1>

      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex flex-col sm:flex-row w-full sm:w-auto">
          <div className="relative w-full sm:w-64 mb-4 sm:mb-0 sm:mr-4">
            <input
              type="text"
              placeholder="Search for a student..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative w-full sm:w-64">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
            >
              <option value="">All Classes</option>
              {classes.map((className) => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <ReportTable
        students={paginatedStudents}
        onViewReport={handleViewReport}
        onEditReport={handleEditReport}
        onAddMark={handleAddMark}
      />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {isViewing && (
        <ReportCard
          student={selectedStudent}
          onClose={() => { setSelectedStudent(null); setIsViewing(false); }}
        />
      )}

      {isEditing && (
        <EditMark
          student={selectedStudent}
          onClose={() => { setSelectedStudent(null); setIsEditing(false); }}
          onUpdate={fetchStudents}
        />
      )}

      {isAdding && (
        <AddMark
          student={selectedStudent}
          onAdd={() => { setSelectedStudent(null); setIsAdding(false); fetchStudents(); }}
          onClose={() => { setSelectedStudent(null); setIsAdding(false); }}
        />
      )}
    </div>
  );
};

export default Reports;
