import React, { useState, useEffect, useCallback } from 'react';
import ViewClass from './ViewClass';
import AddClass from './AddClass';
import EditClass from './EditClass';

const ClassTable = ({ classes, onViewClass, onEditClass, onDeleteClass }) => (
  <div className="bg-white shadow sm:rounded-lg">
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          {['Class Name', 'Fees', 'Actions'].map((header) => (
            <th key={header} className="px-6 py-3 text-xs font-bold uppercase">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {classes.map((classItem) => (
          <tr key={classItem.id}>
            <td className="border p-3 text-lg font-semibold">{classItem.name}</td>
            <td className="border p-3 text-lg font-semibold">{classItem.class_fees.toFixed(2)} €</td>
            <td className="border p-3 text-lg flex justify-center">
              <button onClick={() => onViewClass(classItem)} className="mr-2 text-blue-500">View</button>
              <button onClick={() => onEditClass(classItem)} className="mr-2 text-green-500">Edit</button>
              <button onClick={() => onDeleteClass(classItem.id)} className="text-red-500">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="mt-4">
    <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
    <span className="mx-2">{currentPage} / {totalPages}</span>
    <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Class List</h1>

      <div className="mb-4">
        <button onClick={() => setIsAdding(true)} className="bg-green-500 text-white p-2 rounded">Add Class</button>
        <input
          type="text"
          placeholder="Search for a class..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="ml-4 p-2 border rounded"
        />
      </div>

      <ClassTable
        classes={paginatedClasses}
        onViewClass={(classItem) => setSelectedClass(classItem)}
        onEditClass={(classItem) => { setSelectedClass(classItem); setIsEditing(true); }}
        onDeleteClass={handleDeleteClass}
      />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* View Class Modal */}
      {selectedClass && !isEditing && (
        <ViewClass
          classDetails={selectedClass}
          onClose={() => setSelectedClass(null)}
        />
      )}

      {/* Edit Class Modal */}
      {isEditing && (
        <EditClass
          classDetails={selectedClass}
          onClose={() => { setSelectedClass(null); setIsEditing(false); fetchClasses(); }}
        />
      )}

      {/* Add Class Modal */}
      {isAdding && (
        <AddClass onAddClass={handleAddClass} onClose={() => setIsAdding(false)} />
      )}
    </div>
  );
};

export default Classes;
