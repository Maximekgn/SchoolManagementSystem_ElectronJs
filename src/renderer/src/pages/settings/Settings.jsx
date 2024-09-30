import React, { useState } from 'react';
import { FiTrash2, FiDownload, FiAlertTriangle } from 'react-icons/fi';

const Settings = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleResetData = () => {
    setShowConfirmation(true);
  };

  const confirmResetData = () => {
    window.electron.ipcRenderer.invoke('reset-database')
      .then(response => {
        setResetMessage(response);
        setShowConfirmation(false);
      })
      .catch(error => {
        console.error('Error resetting database:', error);
        setResetMessage('Failed to reset database. Please try again.');
        setShowConfirmation(false);
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 border-b pb-4">Settings</h1>
      
      {resetMessage && (
        <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-lg">
          {resetMessage}
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
          <div>
            <h2 className="text-xl font-semibold text-red-700 mb-2">Reset Data</h2>
            <p className="text-red-600">Warning: This action will delete all data and cannot be undone.</p>
          </div>
          <button 
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center"
            onClick={handleResetData}
          >
            <FiTrash2 className="mr-2" /> Reset Data
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
          <div>
            <h2 className="text-xl font-semibold text-green-700 mb-2">Export Data</h2>
            <p className="text-green-600">Download a backup of all your data.</p>
          </div>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center">
            <FiDownload className="mr-2" /> Export Data
          </button>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md">
            <FiAlertTriangle className="text-5xl text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-center">Confirm Data Reset</h2>
            <p className="mb-6 text-center">Are you sure you want to reset all data? This action cannot be undone.</p>
            <div className="flex justify-center space-x-4">
              <button 
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={confirmResetData}
              >
                Yes, Reset Data
              </button>
              <button 
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
