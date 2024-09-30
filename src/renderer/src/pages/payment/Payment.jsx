import React, { useState, useCallback, useEffect } from 'react';
import AddPayment from './AddPayment';
import ViewPayments from './ViewPayments';
import { FiDollarSign, FiEye, FiSearch } from 'react-icons/fi';

const StudentTable = React.memo(({ students, onMakePayment, onViewPayments }) => (
  <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-blue-600">
        <tr>
          {['Name', 'Surname', 'Class', 'Fees', 'Discount', 'Paid', 'Actions'].map((header) => (
            <th key={header} className="px-2 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {students.map((student) => (
          <tr key={student.id} className="hover:bg-blue-50 transition-colors duration-150">
            <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{student.surname}</td>
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{student.className}</td>
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{student.schoolFee} FCFA</td>
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{student.discountFee} FCFA</td>
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{student.paidFee} FCFA</td>
            <td className="px-2 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                onClick={() => onMakePayment(student.id)}
                className="text-blue-600 hover:text-blue-900 mr-2"
              >
                <FiDollarSign className="inline-block mr-1" /> <span className="hidden sm:inline">Pay</span>
              </button>
              <button
                onClick={() => onViewPayments(student.id)}
                className="text-green-600 hover:text-green-900"
              >
                <FiEye className="inline-block mr-1" /> <span className="hidden sm:inline">View</span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

const Pagination = React.memo(({ currentPage, totalPages, onPageChange }) => (
  <div className="mt-4 flex flex-wrap items-center justify-center">
    <button 
      onClick={() => onPageChange(currentPage - 1)} 
      disabled={currentPage === 1}
      className="px-3 py-1 m-1 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Previous
    </button>
    <span className="mx-2 text-sm text-gray-700">
      Page {currentPage} of {totalPages}
    </span>
    <button 
      onClick={() => onPageChange(currentPage + 1)} 
      disabled={currentPage === totalPages}
      className="px-3 py-1 m-1 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </div>
));

const Payment = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [viewingPayments, setViewingPayments] = useState(false);
  const [addingPayment, setAddingPayment] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await window.electron.ipcRenderer.invoke('get-students');
      setStudents(response);
      setError(null);
    } catch (err) {
      setError('Failed to fetch students. Please try again.');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleMakePayment = useCallback((id) => {
    setSelectedStudentId(id);
    setAddingPayment(true);
  }, []);

  const handleViewPayments = useCallback((id) => {
    setSelectedStudentId(id);
    setViewingPayments(true);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedStudentId(null);
    setAddingPayment(false);
    setViewingPayments(false);
    fetchStudents();
  }, [fetchStudents]);

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-8 p-4">
        <p>{error}</p>
        <button 
          onClick={fetchStudents} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-blue-800">Payment Management</h1>
      <div className="max-w-full mx-auto">
        <div className="mb-4 flex flex-col sm:flex-row items-center">
          <div className="relative w-full sm:w-64 mb-2 sm:mb-0">
            <input
              type="text"
              placeholder="Search for a student..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <StudentTable
          students={paginatedStudents}
          onMakePayment={handleMakePayment}
          onViewPayments={handleViewPayments}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        {addingPayment && (
          <AddPayment 
            studentId={selectedStudentId} 
            onClose={closeModal}
          />
        )}
        {viewingPayments && (
          <ViewPayments studentId={selectedStudentId} onClose={closeModal} />
        )}
      </div>
    </div>
  );
};

export default React.memo(Payment);