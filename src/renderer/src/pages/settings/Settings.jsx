import React from 'react';

const Settings = () => {
  // Function to handle Reset Data click
  const handleResetData = () => {
    // Send a message to the main process to reset the database
    window.electron.ipcRenderer.invoke('reset-database')
      .then(response => {
        alert(response);  // Show success message when database is reset
      })
      .catch(error => {
        console.error('Error resetting database:', error);
      });
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <button 
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full mb-4"
        onClick={handleResetData} // Attach the click handler here
      >
        RESET DATA
      </button>
      <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">
        EXPORT DATA
      </button>
    </div>
  );
};

export default Settings;
