import React, { useState, useEffect } from 'react';
import { FiSave, FiX } from 'react-icons/fi';

const EditMark = ({ student, onClose, onUpdate }) => {
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const response = await window.electron.ipcRenderer.invoke('get-student-marks', student.id);
        setMarks(response);
      } catch (error) {
        console.error('Error fetching marks:', error);
      }
    };
    fetchMarks();
  }, [student.id]);

  const handleMarkChange = (index, field, value) => {
    const updatedMarks = [...marks];
    updatedMarks[index] = { ...updatedMarks[index], [field]: value };
    setMarks(updatedMarks);
  };

  const handleSave = async () => {
    try {
      await window.electron.ipcRenderer.invoke('update-student-marks', marks);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating marks:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Edit Marks for {student.name} {student.surname}</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Mark</th>
                <th className="px-4 py-2">Teacher Name</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((mark, index) => (
                <tr key={mark.id}>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={mark.title}
                      onChange={(e) => handleMarkChange(index, 'title', e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      value={mark.mark}
                      onChange={(e) => handleMarkChange(index, 'mark', e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={mark.teacherName}
                      onChange={(e) => handleMarkChange(index, 'teacherName', e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            <FiSave className="inline-block mr-2" /> Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            <FiX className="inline-block mr-2" /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMark;