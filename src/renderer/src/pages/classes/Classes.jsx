import React, { useEffect, useState } from 'react';
import ViewClass from './ViewClass';
import AddClass from './AddClass';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [isAddingClass, setIsAddingClass] = useState(false);

  useEffect(() => {
    fetchClasses();
    return () => {
      // Cleanup effect if needed (e.g., abort fetch requests, unsubscribes)
    };
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await window.electron.ipcRenderer.invoke('get-classes');
      setClasses(data);
    } catch (err) {
      console.error("Error fetching classes:", err); // Logging the error for devs
      setError('Failed to fetch classes.');
    }
  };

  const addClass = async (newClass) => {
    if (!newClass.name || !newClass.capacity || !newClass.class_fees) {
      setError('Please fill in all fields correctly.');
      return;
    }
    try {
      const result = await window.electron.ipcRenderer.invoke('add-class', newClass);
      setClasses([...classes, result]);
      setIsAddingClass(false);
    } catch (err) {
      console.error("Error adding class:", err);
      setError('Failed to add class.');
    }
  };

  const deleteClass = async (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await window.electron.ipcRenderer.invoke('delete-class', classId);
        setClasses(classes.filter((cls) => cls.id !== classId));
      } catch (err) {
        console.error("Error deleting class:", err);
        setError('Failed to delete class.');
      }
    }
  };

  const viewClass = async (classId) => {
    const selected = classes.find((cls) => cls.id === classId);
    setSelectedClass(selected);
  };

  const editClass = async (classId) => {
    // Edit logic here, if it requires async operation
    console.log('Edit class with ID:', classId);
  };

  const closeModal = () => {
    setSelectedClass(null);
    setIsAddingClass(false);
  };

  const toggleAddClassModal = () => {
    setIsAddingClass((prev) => !prev);
    setError(''); // Clear errors when opening the modal
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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50" aria-hidden={!selectedClass}>
          <ViewClass classDetails={selectedClass} onClose={closeModal} />
        </div>
      )}

      {/* Add Class Modal */}
      {isAddingClass && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50" aria-hidden={!isAddingClass}>
          <div className="bg-white p-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out">
            <AddClass onAddClass={addClass} onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;
