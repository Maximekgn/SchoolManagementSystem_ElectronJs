import React, { useState, useEffect, useCallback } from "react";
import AddStudentForm from "./AddStudentForm";
import ViewStudent from "./ViewStudent";
import StudentEdit from "./EditStudent";
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiUserPlus,
  FiFilter,
} from "react-icons/fi";

const StudentTable = ({
  students,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
}) => (
  <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-100">
        <tr>
          {["Name", "Surname", "Class", "Parent Phone", "Actions"].map(
            (header) => (
              <th
                key={header}
                className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                {header}
              </th>
            ),
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {students.map((student) => (
          <tr
            key={student.id}
            className="hover:bg-gray-50 transition-colors duration-200 py-2"
          >
            <td className="px-4 py-3.5 whitespace-nowrap text-sm font-medium text-gray-900">
              {student.name}
            </td>
            <td className="px-4 py-3.5 whitespace-nowrap text-sm text-gray-500">
              {student.surname}
            </td>
            <td className="px-4 py-3.5 whitespace-nowrap text-sm text-gray-500">
              {student.className}
            </td>
            <td className="px-4 py-3.5 whitespace-nowrap text-sm text-gray-500">
              {student.parentPhone || "N/A"}
            </td>
            <td className="px-4 py-3.5 whitespace-nowrap text-sm font-medium">
              <button
                onClick={() => onViewStudent(student)}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 mr-2"
              >
                <FiEye className="inline-block mr-1" />{" "}
                <span className="hidden sm:inline">View</span>
              </button>
              <button
                onClick={() => onEditStudent(student)}
                className="text-green-600 hover:text-green-800 transition-colors duration-200 mr-2"
              >
                <FiEdit className="inline-block mr-1" />{" "}
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                onClick={() => onDeleteStudent(student.id)}
                className="text-red-600 hover:text-red-800 transition-colors duration-200"
              >
                <FiTrash2 className="inline-block mr-1" />{" "}
                <span className="hidden sm:inline">Delete</span>
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

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(10);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [isVisibleConfirmDialog, SetIsVisibleConfirmDialog] = useState(false);

  const fetchStudents = useCallback(async () => {
    try {
      const response = await window.electron.ipcRenderer.invoke("get-students");
      setStudents(response);
      const uniqueClasses = [
        ...new Set(response.map((student) => student.className)),
      ];
      setClasses(uniqueClasses);
    } catch (error) {
      console.error("Error fetching students:", error);
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

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAddStudent = async (newStudent) => {
    try {
      await fetchStudents();
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };
  const handleDeleteStudent = async (id) => {
    const confirmation = window.confirm("Are you sure you want to delete this student?");
    if (confirmation) {
      try {
        await window.electron.ipcRenderer.invoke("delete-student", id);
        await fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      `${student.name} ${student.surname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (selectedClass === "" || student.className === selectedClass),
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage,
  );

  return (
    <div className="container mx-auto px-4 py-8 show-up">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
        Student Management
      </h1>

      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-center">
        <button
          onClick={() => setIsAdding(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-colors duration-200 mb-4 sm:mb-0"
        >
          <FiUserPlus className="mr-2" /> Add Student
        </button>
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
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <StudentTable
        students={paginatedStudents}
        onViewStudent={(student) => {
          setSelectedStudent(student);
          setIsViewing(true);
        }}
        onEditStudent={(student) => {
          setSelectedStudent(student);
          setIsEditing(true);
        }}
        onDeleteStudent={handleDeleteStudent}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {isVisibleConfirmDialog && (
        <ConfirmStudentDelete
          student={selectedStudent}
          onClose={() => SetIsVisibleConfirmDialog(false)}
        />
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
        <AddStudentForm
          onAdd={handleAddStudent}
          onClose={() => setIsAdding(false)}
        />
      )}
    </div>
  );
};

export default Students;
