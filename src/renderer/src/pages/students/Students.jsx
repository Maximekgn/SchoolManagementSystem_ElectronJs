import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import AddStudentForm from './AddStudentForm';
import ViewStudent from './ViewStudent';
import StudentEdit from './EditStudent';
const StudentTable = ({ students, onViewStudent, onEditStudent, onDeleteStudent }) => (
  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {['ID', 'Name', 'Surname', 'Class', 'Parent Phone Number', 'Actions'].map((header) => (
            <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {students.map((student) => (
          <tr key={student.id} className="hover:bg-gray-50 transition duration-150">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.surname}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.class_name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.parent_mobile_number || 'N/A'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button onClick={() => onViewStudent(student)} className="text-blue-600 hover:text-blue-900 transition duration-300 mr-2">
                View
              </button>
              <button onClick={() => onEditStudent(student)} className="text-green-600 hover:text-green-900 transition duration-300 mr-2">
                Edit
              </button>
              <button onClick={() => onDeleteStudent(student.id)} className="text-red-600 hover:text-red-900 transition duration-300">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center mt-4">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-3 py-1 bg-gray-200 rounded mr-2"
    >
      Previous
    </button>
    <span>{currentPage} of {totalPages}</span>
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-3 py-1 bg-gray-200 rounded ml-2"
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  // Fetch students from the API
  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await window.electron.ipcRenderer.invoke('get-students');
      setStudents(response);
    } catch (error) {
      setError('Failed to fetch students. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleAddStudent = async (newStudent) => {
    try {
      const result = await window.electron.ipcRenderer.invoke('add-student', newStudent);
      if (result.success) {
        await fetchStudents();
        setIsAdding(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setError('Failed to add student. Please try again.');
    }
  };

  const handleDeleteStudent = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this student?');
    if (!confirmDelete) return;

    try {
      const result = await window.electron.ipcRenderer.invoke('delete-student', id);
      if (result.success) {
        await fetchStudents();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setError('Failed to delete student. Please try again.');
    }
  };

  const handleSearchChange = useMemo(() => debounce((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  }, 300), []);

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setIsViewing(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setIsEditing(true);
    fetchStudents();
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.surname.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * studentsPerPage;
    return filteredStudents.slice(start, start + studentsPerPage);
  }, [filteredStudents, currentPage, studentsPerPage]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Student List</h1>

      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setIsAdding(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
          Add Student
        </button>
        <input
          type="text"
          placeholder="Search for a student..."
          onChange={handleSearchChange}
          className="border p-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500">Loading students...</div>
      ) : filteredStudents.length > 0 ? (
        <>
          <StudentTable
            students={paginatedStudents}
            onViewStudent={handleViewStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
          />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      ) : (
        <div className="text-center text-gray-500">No students found.</div>
      )}

      {isViewing && (
        <ViewStudent
          student={selectedStudent}
          onClose={() => {
            setSelectedStudent(null);
            setIsViewing(false);
          }}
        />
      )}

      {isEditing && (
        <StudentEdit
          student={selectedStudent}
          onClose={() => {
            setSelectedStudent(null);
            setIsEditing(false);
          }}
          onUpdate={fetchStudents}
        />
      )}

      {isAdding && (
        <React.Suspense fallback={<div>Loading form...</div>}>
          <AddStudentForm onAdd={handleAddStudent} onClose={() => setIsAdding(false)} />
        </React.Suspense>
      )}

      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default Students;
