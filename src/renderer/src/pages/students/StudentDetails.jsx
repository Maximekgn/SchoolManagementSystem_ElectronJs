import { useState, useEffect } from 'react';

const StudentDetails = ({ student, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-opacity-80 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Student Details</h2>
        
        {isEditing ? (
          <StudentEditForm student={student} onClose={handleCloseEdit} onUpdate={onUpdate} />
        ) : (
          <>
            <div className="space-y-3">
              {Object.entries(student).map(([key, value]) => (
                <div key={key} className="flex justify-between text-gray-600">
                  <span className="font-medium">
                    {key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}:
                  </span>
                  <span>{value || 'N/A'}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end space-x-4">
              <button 
                onClick={handleEditClick}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
              >
                Edit
              </button>
              <button 
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};



const StudentEditForm = ({ student, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({ ...student });

  useEffect(() => {
    setFormData({ ...student });
  }, [student]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({
        ...prev,
        picture: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await window.electron.ipcRenderer.invoke('update-student', formData);
      if (result.success) {
        onUpdate(formData);
        onClose();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const renderField = (key, value) => {
    switch (key) {
      case 'picture':
        return (
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        );
      case 'gender':
      case 'blood_group':
        return (
          <select
            name={key}
            value={value}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {key === 'gender' ? (
              <>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </>
            ) : (
              <>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </>
            )}
          </select>
        );
      case 'additional_note':
      case 'place_of_birth':
      case 'medical_condition':
      case 'previous_school':
      case 'religion':
        return (
          <textarea
            name={key}
            value={value || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="3"
          />
        );
      default:
        return (
          <input
            type={key.includes('date') ? 'date' : key === 'discount_in_fee' ? 'number' : 'text'}
            name={key}
            value={value || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Edit Student Details</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(student).map((key) => (
              <div key={key} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}
                </label>
                {renderField(key, formData[key])}
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentDetails;
