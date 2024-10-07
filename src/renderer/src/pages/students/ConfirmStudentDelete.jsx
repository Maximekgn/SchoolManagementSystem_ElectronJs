import React from "react";

const ConfirmStudentDelete = ({ shouldDelete, setShouldDelete, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Are you sure you want to delete this student?
        </h2>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="mt-6 w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 ease-in-out font-medium mr-2"
          >
            Delete
          </button>
          <button
            onClick={() => setShouldDelete(false)}
            className="mt-6 w-full px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-300 ease-in-out"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmStudentDelete;
