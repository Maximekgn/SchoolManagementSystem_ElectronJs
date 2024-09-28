import React, { useState, useEffect, useCallback } from 'react';
import AddEmployeeForm from './AddEmployeeForm';
import ViewEmployee from './ViewEmployee';
import EditEmployee from './EditEmployee';

const EmployeeTable = ({ employees, onViewEmployee, onEditEmployee, onDeleteEmployee }) => (
  <div className="bg-white shadow sm:rounded-lg">
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          {['Name', 'Surname', 'Role', 'Phone', 'Actions'].map((header) => (
            <th key={header} className="px-6 py-3 text-xs font-bold uppercase">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody className='bg-white divide-y divide-gray-200'>
        {employees.map((employee) => (
          <tr key={employee.id}>
            <td className="border p-3 text-lg font-semibold">{employee.name}</td>
            <td className="border p-3 text-lg font-semibold">{employee.surname}</td>
            <td className="border p-3 text-lg font-semibold">{employee.role}</td>
            <td className="border p-3 text-lg font-semibold">{employee.phone || 'N/A'}</td>
            <td className="border p-3 text-lg flex justify-center">
              <button onClick={() => onViewEmployee(employee)} className="mr-2 text-blue-500">View</button>
              <button onClick={() => onEditEmployee(employee)} className="mr-2 text-green-500">Edit</button>
              <button onClick={() => onDeleteEmployee(employee.id)} className="text-red-500">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="mt-4">
    <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
    <span className="mx-2">{currentPage} / {totalPages}</span>
    <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
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
    try {
      await window.electron.ipcRenderer.invoke('delete-employee', id);
      await fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Employee List</h1>

      <div className="mb-4">
        <button onClick={() => setIsAdding(true)} className="bg-blue-500 text-white p-2 rounded">Add Employee</button>
        <input
          type="text"
          placeholder="Search for an employee..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="ml-4 p-2 border rounded"
        />
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
        <AddEmployeeForm onAdd={handleAddEmployee} onClose={() => setIsAdding(false)} />
      )}
    </div>
  );
};

export default Employees;