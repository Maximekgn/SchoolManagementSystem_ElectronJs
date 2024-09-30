import React, { useState, useEffect, useCallback } from 'react';
import AddStudentForm from './AddStudentForm';
import ViewStudent from './ViewStudent';
import StudentEdit from './EditStudent';
import { FiEye, FiEdit, FiTrash2, FiSearch, FiUserPlus } from 'react-icons/fi';

const StudentTable = ({ students, onViewStudent, onEditStudent, onDeleteStudent }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {['Name', 'Surname', 'Class', 'Parent Phone', 'Actions'].map((header) => (
            <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {students.map((student) => (
          <tr key={student.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.surname}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.className}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.parentPhone || 'N/A'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button onClick={() => onViewStudent(student)} className="text-blue-600 hover:text-blue-900 mr-3">
                <FiEye className="inline-block mr-1" /> View
              </button>
              <button onClick={() => onEditStudent(student)} className="text-green-600 hover:text-green-900 mr-3">
                <FiEdit className="inline-block mr-1" /> Edit
              </button>
              <button onClick={() => onDeleteStudent(student.id)} className="text-red-600 hover:text-red-900">
                <FiTrash2 className="inline-block mr-1" /> Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="mt-4 flex items-center justify-center">
    <button 
      onClick={() => onPageChange(currentPage - 1)} 
      disabled={currentPage === 1}
      className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Previous
    </button>
    <span className="mx-4 text-sm text-gray-700">
      Page {currentPage} of {totalPages}
    </span>
    <button 
      onClick={() => onPageChange(currentPage + 1)} 
      disabled={currentPage === totalPages}
      className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </div>
);

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const fetchStudents = useCallback(async () => {
    try {
      const response = await window.electron.ipcRenderer.invoke('get-students');
      setStudents(response);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleAddStudent = async (newStudent) => {
    try {
      await window.electron.ipcRenderer.invoke('add-student', newStudent);
      await fetchStudents();
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await window.electron.ipcRenderer.invoke('delete-student', id);
      await fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Management</h1>

      <div className="mb-6 flex justify-between items-center">
        <button 
          onClick={() => setIsAdding(true)} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
        >
          <FiUserPlus className="mr-2" /> Add Student
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a student..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <StudentTable
        students={paginatedStudents}
        onViewStudent={(student) => { setSelectedStudent(student); setIsViewing(true); }}
        onEditStudent={(student) => { setSelectedStudent(student); setIsEditing(true); }}
        onDeleteStudent={handleDeleteStudent}
      />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {isViewing && (
        <ViewStudent
          student={selectedStudent}
          onClose={() => { setSelectedStudent(null); setIsViewing(false); }}
        />
      )}

      {isEditing && (
        <StudentEdit
          student={selectedStudent}
          onClose={() => { setSelectedStudent(null); setIsEditing(false); fetchStudents(); }}
          onUpdate={fetchStudents}
        />
      )}

      {isAdding && (
        <AddStudentForm onAdd={handleAddStudent} onClose={() => setIsAdding(false)} />
      )}
    </div>
  );
};

export default Students;