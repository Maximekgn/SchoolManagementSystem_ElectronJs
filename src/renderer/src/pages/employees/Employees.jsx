import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import AddEmployeeForm from './AddEmployeeForm';
import ViewEmployee from './ViewEmployee';
import EditEmployee from './EditEmployee';

// EmployeeTable Component
const EmployeeTable = ({ employees, onView, onEdit, onDelete }) => (
  <div className="bg-white shadow sm:rounded-lg">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {['ID', 'Name', 'Surname', 'Role', 'Phone', 'Actions'].map((header) => (
            <th key={header} className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {employees.map(({ id, name, surname, employee_role, mobile_number }) => (
          <tr key={id} className="hover:bg-gray-50">
            <td className="p-6 py-4 text-sm">{id}</td>
            <td className="p-6 py-4 text-sm font-medium text-gray-900">{name}</td>
            <td className="p-6 py-4 text-sm">{surname}</td>
            <td className="p-6 py-4 text-sm">{employee_role}</td>
            <td className="p-6 py-4 text-sm">{mobile_number || 'N/A'}</td>
            <td className="p-6 py-4 text-right text-sm font-medium">
              <button onClick={() => onView(id)} className="text-blue-600 hover:text-blue-900 mr-2">View</button>
              <button onClick={() => onEdit(id)} className="text-green-600 hover:text-green-900 mr-2">Edit</button>
              <button onClick={() => onDelete(id)} className="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Pagination Component
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

// Main Employees Component
const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewState, setViewState] = useState({ adding: false, viewing: false, editing: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const employeesPerPage = 10;

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const response = await window.electron.ipcRenderer.invoke('get-employees');
      setEmployees(response);
    } catch {
      setError('Failed to fetch employees. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleAddEmployee = async (newEmployee) => {
    try {
      const result = await window.electron.ipcRenderer.invoke('add-employee', newEmployee);
      if (result.success) {
        fetchEmployees();
        setViewState({ ...viewState, adding: false });
      } else throw new Error(result.error);
    } catch {
      setError('Failed to add employee. Please try again.');
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    try {
      const result = await window.electron.ipcRenderer.invoke('delete-employee', id);
      if (result.success) fetchEmployees();
      else throw new Error(result.error);
    } catch {
      setError('Failed to delete employee. Please try again.');
    }
  };

  const handleSearchChange = useMemo(() => debounce((e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  }, 300), []);

  const filteredEmployees = useMemo(() => (
    employees.filter(({ name, surname }) =>
      name.toLowerCase().includes(searchTerm) || surname.toLowerCase().includes(searchTerm)
    )
  ), [employees, searchTerm]);

  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * employeesPerPage;
    return filteredEmployees.slice(start, start + employeesPerPage);
  }, [filteredEmployees, currentPage]);

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Employee List</h1>

      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setViewState({ ...viewState, adding: true })} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Employee
        </button>
        <input
          type="text"
          placeholder="Search employees..."
          onChange={handleSearchChange}
          className="border p-2 rounded w-64"
        />
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading employees...</div>
      ) : (
        <>
          {paginatedEmployees.length > 0 ? (
            <>
              <EmployeeTable
                employees={paginatedEmployees}
                onView={(id) => setViewState({ ...viewState, viewing: true, selectedEmployeeId: id })}
                onEdit={(id) => setViewState({ ...viewState, editing: true, selectedEmployeeId: id })}
                onDelete={handleDeleteEmployee}
              />
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </>
          ) : (
            <div className="text-center text-gray-500">No employees found.</div>
          )}
        </>
      )}

      {viewState.viewing && (
        <ViewEmployee
          employee={selectedEmployee}
          onClose={() => setViewState({ ...viewState, viewing: false })}
        />
      )}

      {viewState.editing && (
        <EditEmployee
          employee={selectedEmployee}
          onClose={() => setViewState({ ...viewState, editing: false })}
          onUpdate={fetchEmployees}
        />
      )}

      {viewState.adding && (
        <React.Suspense fallback={<div>Loading form...</div>}>
          <AddEmployeeForm onAdd={handleAddEmployee} onClose={() => setViewState({ ...viewState, adding: false })} />
        </React.Suspense>
      )}

      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default Employees;
