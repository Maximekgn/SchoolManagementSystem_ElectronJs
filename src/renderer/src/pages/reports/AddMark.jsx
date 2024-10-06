import React, { useState } from 'react';

const AddMark = ({ student, onAdd, onClose }) => {
  const [title, setTitle] = useState('');
  const [mark, setMark] = useState('');
  const [teacherName, setTeacherName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ title, mark, teacherName, studentId: student.id });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add Mark for {student.name} {student.surname}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="mark" className="block text-gray-700 text-sm font-bold mb-2">Mark</label>
            <input
              type="number"
              id="mark"
              value={mark}
              onChange={(e) => setMark(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="teacherName" className="block text-gray-700 text-sm font-bold mb-2">Teacher Name</label>
            <input
              type="text"
              id="teacherName"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Mark
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMark;