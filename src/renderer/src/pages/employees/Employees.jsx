import React, { useState, useEffect, useCallback } from 'react';
import AddEmployeeForm from './AddEmployeeForm';
import ViewEmployee from './ViewEmployee';
import EditEmployee from './EditEmployee';
import { FiEye, FiEdit, FiTrash2, FiSearch, FiUserPlus } from 'react-icons/fi';

const EmployeeTable = ({ employees, onViewEmployee, onEditEmployee, onDeleteEmployee }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {['Name', 'Surname', 'Role', 'Phone', 'Actions'].map((header) => (
            <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {employees.map((employee) => (
          <tr key={employee.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.surname}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.role}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.phone || 'N/A'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button onClick={() => onViewEmployee(employee)} className="text-blue-600 hover:text-blue-900 mr-3">
                <FiEye className="inline-block mr-1" /> View
              </button>
              <button onClick={() => onEditEmployee(employee)} className="text-green-600 hover:text-green-900 mr-3">
                <FiEdit className="inline-block mr-1" /> Edit
              </button>
              <button onClick={() => onDeleteEmployee(employee.id)} className="text-red-600 hover:text-red-900">
                <FiTrash2 className="inline-block mr-1" /> Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="mt-4 flex items-center justify-center">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Previous
    </button>
    <span className="mx-4 text-sm text-gray-700">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </div>
);

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await window.electron.ipcRenderer.invoke('get-employees');
      setEmployees(response);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleAddEmployee = async (newEmployee) => {
    try {
      await window.electron.ipcRenderer.invoke('add-employee', newEmployee);
      await fetchEmployees();
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    const confirmation = window.confirm("Are you sure you want to delete this employee?");
    if (confirmation) {
      try {
        await window.electron.ipcRenderer.invoke('delete-employee', id);
        await fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const filteredEmployees = employees.filter((employee) =>
    `${employee.name} ${employee.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * employeesPerPage,
    currentPage * employeesPerPage
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Employee Management</h1>

      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center"
        >
          <FiUserPlus className="mr-2" /> Add Employee
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for an employee..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <EmployeeTable
        employees={paginatedEmployees}
        onViewEmployee={(employee) => { setSelectedEmployee(employee); setIsViewing(true); }}
        onEditEmployee={(employee) => { setSelectedEmployee(employee); setIsEditing(true); }}
        onDeleteEmployee={handleDeleteEmployee}
      />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {isViewing && (
        <ViewEmployee
          employee={selectedEmployee}
          onClose={() => { setSelectedEmployee(null); setIsViewing(false); }}
        />
      )}

      {isEditing && (
        <EditEmployee
          employee={selectedEmployee}
          onClose={() => { setSelectedEmployee(null); setIsEditing(false); fetchEmployees(); }}
          onUpdate={fetchEmployees}
        />
      )}

      {isAdding && (
        <AddEmployeeForm onAdd={handleAddEmployee} onClose={() => { setIsAdding(false); fetchEmployees(); }} />
      )}
    </div>
  );
};

export default Employees;
