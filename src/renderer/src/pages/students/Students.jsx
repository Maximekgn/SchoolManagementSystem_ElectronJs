import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import AddStudentForm from './AddStudentForm';
import StudentDetails from './StudentDetails';  // Component to view details

const StudentTable = ({ students, onSelectStudent, onDeleteStudent }) => (
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
          <tr key={student.student_id} className="hover:bg-gray-50 transition duration-150">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.surname}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.class_name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.parent_mobile_number || 'N/A'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium ">
              <button onClick={() => onSelectStudent(student)} className="text-blue-600 hover:text-blue-900 transition duration-300">
                View/edit
              </button>
              <button className='text-red-600 hover:text-red-900 mx-2' onClick={() => handleDelete(student.id, onDeleteStudent)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="mt-4 flex justify-center">
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`mx-1 px-3 py-1 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
      >
        {page}
      </button>
    ))}
  </div>
);

const handleDelete = async (id, onDeleteStudent) => {
  const confirmDelete = window.confirm('Are you sure you want to delete this student?');
  if (!confirmDelete) return;

  try {
    const result = await window.electron.ipcRenderer.invoke('delete-student', id);
    if (result.success) {
      onDeleteStudent();
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error deleting student:', error);
    setError(error.message || 'Failed to delete student. Please try again.');
  }
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  // Fetch students from the backend
  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const students = await window.electron.ipcRenderer.invoke('get-students');
      if (students) {
        setStudents(students);
        setError(null);
      } else {
        setError('No students found.');
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load students. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Handle adding a student
  const handleAddStudent = async () => {
    await fetchStudents();
    setIsAdding(false);
  };

  // Debounced search
  const debouncedSearch = useMemo(() => debounce((term) => setSearchTerm(term), 300), []);
  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const fullName = `${student.name} ${student.surname}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
  }, [students, searchTerm]);

  // Pagination logic
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * studentsPerPage;
    return filteredStudents.slice(startIndex, startIndex + studentsPerPage);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  useEffect(() => {
    // Reset page number if filtering changes the number of students
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredStudents, totalPages, currentPage]);

  // Handle loading state
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div></div>;
  }

  // Handle error state
  if (error) {
    return <div className="text-center mt-8 text-red-500 text-xl">{error}</div>;
  }

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

      {filteredStudents.length > 0 ? (
        <>
          <StudentTable students={paginatedStudents} onSelectStudent={setSelectedStudent} onDeleteStudent={fetchStudents} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      ) : (
        <div className="text-center text-gray-500">No students found.</div>
      )}

      {selectedStudent && (
        <StudentDetails
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {isAdding && (
        <React.Suspense fallback={<div>Loading form...</div>}>
          <AddStudentForm onAdd={handleAddStudent} onClose={() => setIsAdding(false)} />
        </React.Suspense>
      )}
    </div>
  );
};

export default Students;
