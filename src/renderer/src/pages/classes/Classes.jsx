import React, { useState, useEffect, useCallback } from 'react';
import ViewClass from './ViewClass';
import AddClass from './AddClass';
import EditClass from './EditClass';
import { FiEye, FiEdit, FiTrash2, FiSearch, FiPlus } from 'react-icons/fi';

const ClassTable = ({ classes, onViewClass, onEditClass, onDeleteClass }) => (
  <div className="bg-white shadow-lg rounded-xl overflow-hidden">
    <table className="w-full">
      <thead className="bg-gray-100">
        <tr>
          {['Class Name', 'Fees', 'Actions'].map((header) => (
            <th key={header} className="px-6 py-4 text-left text-sm font-semibold text-gray-600">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {classes.map((classItem) => (
          <tr key={classItem.id} className="hover:bg-gray-50 transition-colors duration-200">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{classItem.name}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{classItem.class_fees.toFixed(2)} FCFA</td>
            <td className="px-6 py-4 text-sm space-x-2">
              <button onClick={() => onViewClass(classItem)} className="text-blue-500 hover:text-blue-700 transition-colors duration-200">
                <FiEye className="inline-block mr-1" /> View
              </button>
              <button onClick={() => onEditClass(classItem)} className="text-green-500 hover:text-green-700 transition-colors duration-200">
                <FiEdit className="inline-block mr-1" /> Edit
              </button>
              <button onClick={() => onDeleteClass(classItem.id)} className="text-red-500 hover:text-red-700 transition-colors duration-200">
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
  <div className="mt-6 flex items-center justify-center space-x-4">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      Previous
    </button>
    <span className="text-sm text-gray-700">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      Next
    </button>
  </div>
);

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const classesPerPage = 10;

  const fetchClasses = useCallback(async () => {
    try {
      const data = await window.electron.ipcRenderer.invoke('get-classes');
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleAddClass = async (newClass) => {
    try {
      await window.electron.ipcRenderer.invoke('add-class', newClass);
      await fetchClasses();
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding class:', error);
    }
  };

  const handleDeleteClass = async (id) => {
    const confirmation = window.confirm("Are you sure you want to delete this class?");
    if (confirmation) {
      try {
        await window.electron.ipcRenderer.invoke('delete-class', id);
        await fetchClasses();
      } catch (error) {
        console.error('Error deleting class:', error);
      }
    }
  };

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClasses.length / classesPerPage);
  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * classesPerPage,
    currentPage * classesPerPage
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Class Management</h1>

      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <button
          onClick={() => setIsAdding(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center justify-center"
        >
          <FiPlus className="mr-2" /> Add Class
        </button>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search for a class..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <ClassTable
        classes={paginatedClasses}
        onViewClass={(classItem) => setSelectedClass(classItem)}
        onEditClass={(classItem) => { setSelectedClass(classItem); setIsEditing(true); }}
        onDeleteClass={handleDeleteClass}
      />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {selectedClass && !isEditing && (
        <ViewClass
          classDetails={selectedClass}
          onClose={() => setSelectedClass(null)}
        />
      )}

      {isEditing && (
        <EditClass
          classDetails={selectedClass}
          onClose={() => { setSelectedClass(null); setIsEditing(false); fetchClasses(); }}
          onUpdate={fetchClasses}
        />
      )}

      {isAdding && (
        <AddClass onAddClass={handleAddClass} onClose={() => setIsAdding(false)} />
      )}
    </div>
  );
};

export default Classes;
