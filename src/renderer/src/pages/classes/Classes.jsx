import React, { useState, useEffect, useCallback } from 'react';
import ViewClass from './ViewClass';
import AddClass from './AddClass';
import EditClass from './EditClass';
import { FiEye, FiEdit, FiTrash2, FiSearch, FiPlus } from 'react-icons/fi';

const ClassTable = ({ classes, onViewClass, onEditClass, onDeleteClass }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {['Class Name', 'Fees', 'Actions'].map((header) => (
            <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {classes.map((classItem) => (
          <tr key={classItem.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{classItem.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classItem.class_fees.toFixed(2)} €</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button onClick={() => onViewClass(classItem)} className="text-blue-600 hover:text-blue-900 mr-3">
                <FiEye className="inline-block mr-1" /> View
              </button>
              <button onClick={() => onEditClass(classItem)} className="text-green-600 hover:text-green-900 mr-3">
                <FiEdit className="inline-block mr-1" /> Edit
              </button>
              <button onClick={() => onDeleteClass(classItem.id)} className="text-red-600 hover:text-red-900">
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
    try {
      await window.electron.ipcRenderer.invoke('delete-class', id);
      await fetchClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Class Management</h1>

      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={() => setIsAdding(true)} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center"
        >
          <FiPlus className="mr-2" /> Add Class
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a class..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        />
      )}

      {isAdding && (
        <AddClass onAddClass={handleAddClass} onClose={() => setIsAdding(false)} />
      )}
    </div>
  );
};

export default Classes;
