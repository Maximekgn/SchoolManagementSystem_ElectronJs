import React, { useState, useEffect, useCallback } from 'react';
import AddStudentForm from './AddStudentForm';
import ViewStudent from './ViewStudent';
import StudentEdit from './EditStudent';

const StudentTable = ({ students, onViewStudent, onEditStudent, onDeleteStudent }) => (
  <table className="w-full border-collapse">
    <thead>
      <tr>
        {['Name', 'Surname', 'Class', 'Parent Phone', 'Actions'].map((header) => (
          <th key={header} className="border p-2">{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {students.map((student) => (
        <tr key={student.id}>
          <td className="border p-2">{student.name}</td>
          <td className="border p-2">{student.surname}</td>
          <td className="border p-2">{student.class_name}</td>
          <td className="border p-2">{student.parent_mobile_number || 'N/A'}</td>
          <td className="border p-2">
            <button onClick={() => onViewStudent(student)} className="mr-2 text-blue-500">View</button>
            <button onClick={() => onEditStudent(student)} className="mr-2 text-green-500">Edit</button>
            <button onClick={() => onDeleteStudent(student.id)} className="text-red-500">Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="mt-4">
    <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
    <span className="mx-2">{currentPage} / {totalPages}</span>
    <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student List</h1>

      <div className="mb-4">
        <button onClick={() => setIsAdding(true)} className="bg-blue-500 text-white p-2 rounded">Add Student</button>
        <input
          type="text"
          placeholder="Search for a student..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="ml-4 p-2 border rounded"
        />
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
          onClose={() => { setSelectedStudent(null); setIsEditing(false); }}
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