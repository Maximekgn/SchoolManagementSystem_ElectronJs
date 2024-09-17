import React, { useState, useEffect, useCallback } from 'react';

const StudentPaymentHistory = ({ studentId }) => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await fetch(`http://localhost:3001/students/${studentId}/payments`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des paiements');
        }
        const data = await response.json();
        setPaymentHistory(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [studentId]);

  if (loading) return <p className="text-gray-600">Chargement de l'historique des paiements...</p>;
  if (error) return <p className="text-red-500">Erreur : {error}</p>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Historique des paiements</h2>
      {paymentHistory.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Date', 'Montant payé', 'Type', 'Méthode', 'Solde'].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paymentHistory.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(payment.payment_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.amount_paid}</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.fee_type}</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.payment_method}</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.balance_due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">Aucun paiement trouvé pour cet élève.</p>
      )}
    </div>
  );
};

const AddStudentForm = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    surname: '', name: '', date_of_birth: '', place_of_birth: '', gender: 'Male',
    picture: null, registration_number: '', date_of_admission: '', class: '',
    discount_in_fee: 0, blood_group: '', disease: '', previous_school: '',
    religion: '', additional_note: '', parent_name: '', parent_mobile_number: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, picture: file }));
      setErrors(prev => ({ ...prev, picture: '' }));
    } else {
      setErrors(prev => ({ ...prev, picture: 'Please select a valid image file.' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.surname.trim()) newErrors.surname = 'Surname is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (formData.discount_in_fee < 0) newErrors.discount_in_fee = 'Discount cannot be negative';
    // Add more validations as needed
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onAdd(formData);
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
            className="w-full p-2 border rounded" 
          />
        );
      case 'gender':
        return (
          <select 
            name={key} 
            value={value} 
            onChange={handleChange} 
            className="w-full p-2 border rounded"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        );
      case 'additional_note':
        return (
          <textarea
            name={key}
            value={value}
            onChange={handleChange}
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
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors[key] ? 'border-red-500' : ''}`}
            required={['name', 'surname', 'date_of_birth'].includes(key)}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Ajouter un nouvel élève</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}
                </label>
                {renderField(key, value)}
                {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
              </div>
            ))}
          </div>
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
    try {
      const result = await ipcRenderer.invoke('add-student', newStudent);
      
      if (result.success) {
        console.log('Student added successfully:', result.student);
        await fetchStudents();
        setIsAdding(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error adding student:', error);
      setError('Failed to add student. Please try again.');
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.surname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="text-center mt-8 text-red-500 text-xl">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Liste des élèves</h1>
      
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setIsAdding(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Ajouter un élève
        </button>
        <input
          type="text"
          placeholder="Rechercher un élève..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-64"
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
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.surname}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => setSelectedStudent(student)} className="text-blue-600 hover:text-blue-900">
                    Voir détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelectedStudent(null)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {isAdding && <AddStudentForm onAdd={handleAddStudent} onClose={() => setIsAdding(false)} />}
    </div>
  );
};

export default Students;