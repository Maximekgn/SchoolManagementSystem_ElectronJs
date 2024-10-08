import React from 'react';

const StudentList = ({ students }) => {

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left text-gray-600">Name</th>
            <th className="px-4 py-2 text-left text-gray-600">Email</th>
            <th className="px-4 py-2 text-left text-gray-600">Phone</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border-gray-200 border-b">
              <td className="px-4 py-2 text-gray-800">{student.name}</td>
              <td className="px-4 py-2 text-gray-800">{student.email}</td>
              <td className="px-4 py-2 text-gray-800">{student.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;