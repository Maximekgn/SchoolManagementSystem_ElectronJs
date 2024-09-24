import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import AddEmployeeForm from './AddEmployeeForm';
import ViewEmployee from './ViewEmployee';
import EditEmployee from './EditEmployee';

const EmployeeTable = ({ employees, onViewEmployee, onEditEmployee, onDeleteEmployee }) => (
  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {['ID', 'Name', 'Surname', 'Role', 'Phone Number', 'Actions'].map((header) => (
            <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {employees.map((employee) => (
          <tr key={employee.id} className="hover:bg-gray-50 transition duration-150">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.surname}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.employee_role}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.mobile_number || 'N/A'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button onClick={() => onViewEmployee(employee)} className="text-blue-600 hover:text-blue-900 transition duration-300 mr-2">
                View
              </button>
              <button onClick={() => onEditEmployee(employee)} className="text-green-600 hover:text-green-900 transition duration-300 mr-2">
                Edit
              </button>
              <button onClick={() => onDeleteEmployee(employee.id)} className="text-red-600 hover:text-red-900 transition duration-300">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center mt-4">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-3 py-1 bg-gray-200 rounded mr-2"
    >
      Previous
    </button>
    <span>{currentPage} of {totalPages}</span>
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-3 py-1 bg-gray-200 rounded ml-2"
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;

  // Fetch employees from the API
  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await window.electron.ipcRenderer.invoke('get-employees');
      setEmployees(response);
    } catch (error) {
      setError('Failed to fetch employees. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleAddEmployee = async (newEmployee) => {
    try {
      const result = await window.electron.ipcRenderer.invoke('add-employee', newEmployee);
      if (result.success) {
        await fetchEmployees();
        setIsAdding(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setError('Failed to add employee. Please try again.');
    }
  };

  const handleDeleteEmployee = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this employee?');
    if (!confirmDelete) return;

    try {
      const result = await window.electron.ipcRenderer.invoke('delete-employee', id);
      if (result.success) {
        await fetchEmployees();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setError('Failed to delete employee. Please try again.');
    }
  };

  const handleSearchChange = useMemo(() => debounce((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  }, 300), []);

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsViewing(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsEditing(true);
    fetchEmployees();
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.surname.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * employeesPerPage;
    return filteredEmployees.slice(start, start + employeesPerPage);
  }, [filteredEmployees, currentPage, employeesPerPage]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Employee List</h1>

      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setIsAdding(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
          Add Employee
        </button>
        <input
          type="text"
          placeholder="Search for an employee..."
          onChange={handleSearchChange}
          className="border p-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500">Loading employees...</div>
      ) : filteredEmployees.length > 0 ? (
        <>
          <EmployeeTable
            employees={paginatedEmployees}
            onViewEmployee={handleViewEmployee}
            onEditEmployee={handleEditEmployee}
            onDeleteEmployee={handleDeleteEmployee}
          />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      ) : (
        <div className="text-center text-gray-500">No employees found.</div>
      )}

      {isViewing && (
        <ViewEmployee
          employee={selectedEmployee}
          onClose={() => {
            setSelectedEmployee(null);
            setIsViewing(false);
          }}
        />
      )}

      {isEditing && (
        <EditEmployee
          employee={selectedEmployee}
          onClose={() => {
            setSelectedEmployee(null);
            setIsEditing(false);
          }}
          onUpdate={fetchEmployees}
        />
      )}

      {isAdding && (
        <React.Suspense fallback={<div>Loading form...</div>}>
          <AddEmployeeForm onAdd={handleAddEmployee} onClose={() => setIsAdding(false)} />
        </React.Suspense>
      )}

      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default Employees;
