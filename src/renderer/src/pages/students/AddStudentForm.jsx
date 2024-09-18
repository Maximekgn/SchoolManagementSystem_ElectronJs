import React, { useState } from 'react';

const AddStudentForm = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    student: {
      lastName: '', firstName: '', dateOfBirth: '', placeOfBirth: '', gender: 'Male',
      picture: null, registrationNumber: '', dateOfAdmission: '', class: '',
      discountInFee: 0, bloodGroup: '', disease: '', previousSchool: '',
      religion: '', additionalNote: ''
    },
    parent: {
      lastName: '', firstName: '', relationship: 'Father', mobileNumber: '',
      email: '', occupation: '', address: ''
    }
  });

  const [errors, setErrors] = useState({});

  // Handle form input changes for both student and parent
  const handleChange = (e, type) => {
    const { name, value, type: inputType } = e.target;
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [name]: inputType === 'number' ? parseFloat(value) : value
      }
    }));

    if (errors[`${type}_${name}`]) {
      setErrors(prev => ({ ...prev, [`${type}_${name}`]: '' }));
    }
  };

  // Handle file (picture) changes for student
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({
        ...prev,
        student: { ...prev.student, picture: file }
      }));
      setErrors(prev => ({ ...prev, student_picture: '' }));
    } else {
      setErrors(prev => ({ ...prev, student_picture: 'Please select a valid image file.' }));
    }
  };

  // Validation logic
  const validateForm = () => {
    const newErrors = {};

    // Student validation
    if (!formData.student.firstName.trim()) newErrors.student_firstName = 'First name is required';
    if (!formData.student.lastName.trim()) newErrors.student_lastName = 'Last name is required';
    if (!formData.student.dateOfBirth) newErrors.student_dateOfBirth = 'Date of birth is required';
    if (!formData.student.class.trim()) newErrors.student_class = 'Class is required';
    if (!formData.student.registrationNumber.trim()) newErrors.student_registrationNumber = 'Registration number is required';
    if (formData.student.discountInFee < 0) newErrors.student_discountInFee = 'Discount cannot be negative';

    // Parent validation
    if (!formData.parent.firstName.trim()) newErrors.parent_firstName = 'Parent first name is required';
    if (!formData.parent.lastName.trim()) newErrors.parent_lastName = 'Parent last name is required';
    if (!formData.parent.email.trim()) {
      newErrors.parent_email = 'Parent email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.parent.email)) {
      newErrors.parent_email = 'Invalid email format';
    }
    if (!formData.parent.mobileNumber.trim()) {
      newErrors.parent_mobileNumber = 'Parent mobile number is required';
    } else if (!/^\d{10}$/.test(formData.parent.mobileNumber)) {
      newErrors.parent_mobileNumber = 'Mobile number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const result = await window.electron.ipcRenderer.invoke('add-student-with-parent', formData);
        if (result.success) {
          onAdd(result.student);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Error adding student and parent:', error);
        setErrors(prev => ({ ...prev, submit: 'Failed to add student and parent. Please try again.' }));
      }
    }
  };

  // Render input fields based on type
  const renderField = (key, value, type) => {
    switch (key) {
      case 'picture':
        return (
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange} 
            className="w-full p-2 border rounded"
            aria-label="Student picture upload"
          />
        );
      case 'gender':
      case 'relationship':
        return (
          <select 
            name={key} 
            value={value} 
            onChange={(e) => handleChange(e, type)} 
            className="w-full p-2 border rounded"
            aria-label={`${type} ${key}`}
          >
            {key === 'gender' ? (
              <>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </>
            ) : (
              <>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
              </>
            )}
          </select>
        );
      case 'additionalNote':
      case 'address':
        return (
          <textarea
            name={key}
            value={value}
            onChange={(e) => handleChange(e, type)}
            className="w-full p-2 border rounded"
            rows="3"
            aria-label={`${type} ${key}`}
          />
        );
      default:
        return (
          <input
            type={key.includes('date') ? 'date' : key === 'discountInFee' ? 'number' : 'text'}
            name={key}
            value={value}
            onChange={(e) => handleChange(e, type)}
            className={`w-full p-2 border rounded ${errors[`${type}_${key}`] ? 'border-red-500' : ''}`}
            required={['firstName', 'lastName', 'dateOfBirth', 'email'].includes(key)}
            aria-invalid={errors[`${type}_${key}`] ? 'true' : 'false'}
            aria-label={`${type} ${key}`}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Add a new student and parent</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Student information</h3>
              {Object.entries(formData.student).map(([key, value]) => (
                <div key={key} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  {renderField(key, value, 'student')}
                  {errors[`student_${key}`] && <p className="text-red-500 text-xs mt-1">{errors[`student_${key}`]}</p>}
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Parent information</h3>
              {Object.entries(formData.parent).map(([key, value]) => (
                <div key={key} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  {renderField(key, value, 'parent')}
                  {errors[`parent_${key}`] && <p className="text-red-500 text-xs mt-1">{errors[`parent_${key}`]}</p>}
                </div>
              ))}
            </div>
          </div>
          {errors.submit && <p className="text-red-500 text-sm mt-2">{errors.submit}</p>}
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
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentForm;
