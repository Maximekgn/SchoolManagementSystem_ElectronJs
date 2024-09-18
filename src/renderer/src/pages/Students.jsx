import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';

const StudentPaymentHistory = React.lazy(() => import('./StudentPaymentHistory'));

const AddStudentForm = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    student: {
      surname: '', name: '', date_of_birth: '', place_of_birth: '', gender: 'Male',
      picture: null, registration_number: '', date_of_admission: '', class: '',
      discount_in_fee: 0, blood_group: '', disease: '', previous_school: '',
      religion: '', additional_note: ''
    },
    parent: {
      surname: '', name: '', relationship: 'Father', mobile_number: '',
      email: '', occupation: '', address: ''
    }
  });
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.student.name.trim()) newErrors.student_name = 'Name is required';
    if (!formData.student.surname.trim()) newErrors.student_surname = 'Surname is required';
    if (!formData.student.date_of_birth) newErrors.student_date_of_birth = 'Date of birth is required';
    if (formData.student.discount_in_fee < 0) newErrors.student_discount_in_fee = 'Discount cannot be negative';
    if (!formData.parent.name.trim()) newErrors.parent_name = 'Parent name is required';
    if (!formData.parent.surname.trim()) newErrors.parent_surname = 'Parent surname is required';
    if (!formData.parent.email.trim()) newErrors.parent_email = 'Parent email is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const renderField = (key, value, type) => {
    switch (key) {
      case 'picture':
        return (
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange} 
            className="w-full p-2 border rounded" 
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
      case 'additional_note':
      case 'address':
        return (
          <textarea
            name={key}
            value={value}
            onChange={(e) => handleChange(e, type)}
            className="w-full p-2 border rounded"
            rows="3"
          />
        );
      default:
        return (
          <input
            type={key.includes('date') ? 'date' : key === 'discount_in_fee' ? 'number' : 'text'}
            name={key}
            value={value}
            onChange={(e) => handleChange(e, type)}
            className={`w-full p-2 border rounded ${errors[`${type}_${key}`] ? 'border-red-500' : ''}`}
            required={['name', 'surname', 'date_of_birth', 'email'].includes(key)}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Ajouter un nouvel élève et parent</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Informations de l'élève</h3>
              {Object.entries(formData.student).map(([key, value]) => (
                <div key={key} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}
                  </label>
                  {renderField(key, value, 'student')}
                  {errors[`student_${key}`] && <p className="text-red-500 text-xs mt-1">{errors[`student_${key}`]}</p>}
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Informations du parent</h3>
              {Object.entries(formData.parent).map(([key, value]) => (
                <div key={key} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}
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
              Annuler
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await window.electron.ipcRenderer.invoke('get-students');
      if (data) {
        setStudents(data);
      }
      setError(null);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to load students. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleAddStudent = async (newStudent) => {
    await fetchStudents();
    setIsAdding(false);
  };

  const debouncedSearch = useMemo(
    () => debounce((term) => setSearchTerm(term), 300),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.surname.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * studentsPerPage;
    return filteredStudents.slice(startIndex, startIndex + studentsPerPage);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  if (isLoading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="text-center mt-8 text-red-500 text-xl">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Liste des élèves</h1>
      
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setIsAdding(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
          Ajouter un élève
        </button>
        <input
          type="text"
          placeholder="Rechercher un élève..."
          onChange={handleSearchChange}
          className="border p-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['ID', 'Nom', 'Prénom', 'Actions'].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 transition duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.surname}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => setSelectedStudent(student)} className="text-blue-600 hover:text-blue-900 transition duration-300">
                    Voir détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Détails de l'élève</h2>
            {Object.entries(selectedStudent).map(([key, value]) => (
              <p key={key} className="mb-2">
                <span className="font-semibold">{key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}:</span> {value}
              </p>
            ))}
            <React.Suspense fallback={<div>Loading payment history...</div>}>
              <StudentPaymentHistory studentId={selectedStudent.id} />
            </React.Suspense>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelectedStudent(null)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {isAdding && (
        <React.Suspense fallback={<div>Loading form...</div>}>
          <AddStudentForm onAdd={handleAddStudent} onClose={() => setIsAdding(false)} />
        </React.Suspense>
      )}
    </div>
  );
};

export default Students;