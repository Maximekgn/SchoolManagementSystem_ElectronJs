import React, { useEffect, useState } from 'react';
import ViewClass from './ViewClass';
import AddClass from './AddClass'; // Import the new AddClass component

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [isAddingClass, setIsAddingClass] = useState(false); // State to control the AddClass modal

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await window.electron.ipcRenderer.invoke('get-classes');
      setClasses(data);
    } catch (err) {
      setError('Failed to fetch classes.');
    }
  };

  const fetchTeachers = async () => {
    try {
      const data = await window.electron.ipcRenderer.invoke('get-teachers');
      setTeachers(data);
    } catch (err) {
      setError('Failed to fetch teachers.');
    }
  };

  const addClass = async (newClass) => {
    try {
      const result = await window.electron.ipcRenderer.invoke('add-class', newClass);
      setClasses([...classes, result]);
      setIsAddingClass(false); // Close the modal after adding
    } catch (err) {
      setError('Failed to add class.');
    }
  };

  const deleteClass = async (classId) => {
    try {
      await window.electron.ipcRenderer.invoke('delete-class', classId);
      setClasses(classes.filter((cls) => cls.id !== classId));
    } catch (err) {
      setError('Failed to delete class.');
    }
  };

  const viewClass = (classId) => {
    const selected = classes.find((cls) => cls.id === classId);
    setSelectedClass(selected);
  };

  const editClass = (classId) => {
    console.log('Edit class with ID:', classId);
  };

  const closeModal = () => {
    setSelectedClass(null);
    setIsAddingClass(false); // Close the AddClass modal as well
  };

  const toggleAddClassModal = () => {
    setIsAddingClass((prev) => !prev); // Toggle the AddClass modal
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Classes</h1>

      <button
        onClick={toggleAddClassModal}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 mb-4"
      >
        Add New Class
      </button>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Class Name', 'Capacity', 'Fees', 'Actions'].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classes.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No classes available.
                </td>
              </tr>
            ) : (
              classes.map((classItem) => (
                <tr key={classItem.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{classItem.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classItem.capacity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classItem.class_fees.toFixed(2)} €</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => viewClass(classItem.id)} className="text-blue-600 hover:text-blue-900 transition duration-300 mr-2">
                      View
                    </button>
                    <button onClick={() => editClass(classItem.id)} className="text-green-600 hover:text-green-900 transition duration-300 mr-2">
                      Edit
                    </button>
                    <button onClick={() => deleteClass(classItem.id)} className="text-red-600 hover:text-red-900 transition duration-300">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Class Modal */}
      {selectedClass && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <ViewClass classDetails={selectedClass} onClose={closeModal} />
        </div>
      )}

      {/* Add Class Modal */}
      {isAddingClass && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <AddClass onAddClass={addClass} teachers={teachers} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;
