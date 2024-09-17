import React, { useState, useEffect } from 'react';

// Composant pour afficher un formulaire d'ajout d'employés
const AddEmployeeForm = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    date_of_birth: '',
    gender: 'Male',
    registration_number: '',
    picture: null,
    national_id: '',
    mobile_number: '',
    nationality: '',
    date_of_joining: '',
    employee_role: '',
    monthly_salary: 0,
    experience: '',
    religion: '',
    email: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, picture: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      name: '',
      surname: '',
      date_of_birth: '',
      gender: 'Male',
      registration_number: '',
      picture: null,
      national_id: '',
      mobile_number: '',
      nationality: '',
      date_of_joining: '',
      employee_role: '',
      monthly_salary: 0,
      experience: '',
      religion: '',
      email: '',
      address: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add New Employee</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(formData).map((key) => {
            if (key === 'picture') {
              return (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Picture</label>
                  <input
                    type="file"
                    name="picture"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  />
                </div>
              );
            }

            let inputType = 'text';
            if (key === 'date_of_birth' || key === 'date_of_joining') {
              inputType = 'date';
            } else if (key === 'monthly_salary') {
              inputType = 'number';
            } else if (key === 'gender') {
              return (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              );
            }

            return (
              <div key={key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">{key.replace(/_/g, ' ').toUpperCase()}</label>
                <input
                  type={inputType}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required={['name', 'surname', 'date_of_birth'].includes(key)}
                />
              </div>
            );
          })}
          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Composant principal pour gérer et afficher les employés
const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await window.electron.ipcRenderer.invoke('get-employees');
        if (data) 
        {
          setEmployees(data);
        }
      setError(null);
    } catch (error) {
      console.error('Error fetching Employees:', error);
      setError('Failed to load Employees. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddEmployee = async (newEmployee) => {
    try {
      const formData = new FormData();
      Object.keys(newEmployee).forEach((key) => {
        if (newEmployee[key] !== null) {
          formData.append(key, newEmployee[key]);
        }
      });

      const response = await fetch('http://localhost:3001/employees', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to add employee');
      }

      await fetchEmployees();
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding employee:', error);
      setError('Failed to add employee. Please try again.');
    }
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.surname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div></div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-xl text-red-500">{error}</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Employees Management</h1>

      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 01-2 0v-6H3a1 1 0 110-2h6V3a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Employee
        </button>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by name or surname..."
          className="w-full max-w-md border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {isAdding && <AddEmployeeForm onAdd={handleAddEmployee} onClose={() => setIsAdding(false)} />}

      <table className="min-w-full divide-y divide-gray-200 mt-4">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surname</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredEmployees.map((employee) => (
            <tr key={employee.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.surname}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.employee_role}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => setSelectedEmployee(employee)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedEmployee && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Employee Details</h2>
            <div className="flex items-center mb-4">
              {selectedEmployee.picture && (
                <img
                  src={`data:image/jpeg;base64,${selectedEmployee.picture}`}
                  alt="Employee"
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div className="ml-4">
                <h3 className="text-lg font-bold">{selectedEmployee.name} {selectedEmployee.surname}</h3>
                <p className="text-sm text-gray-600">Role: {selectedEmployee.employee_role}</p>
                <p className="text-sm text-gray-600">Email: {selectedEmployee.email}</p>
                <p className="text-sm text-gray-600">Phone: {selectedEmployee.mobile_number}</p>
                {/* Ajouter d'autres informations pertinentes */}
              </div>
            </div>
            <button
              onClick={() => setSelectedEmployee(null)}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
