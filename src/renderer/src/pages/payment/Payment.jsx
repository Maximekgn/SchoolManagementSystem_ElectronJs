import React, { useState , useCallback, useEffect } from 'react';
import AddPayment from './AddPayment';
import ViewPayments from './ViewPayments';



const EmployeeTable = ({ students, onView, onEdit }) => (
  <div className="bg-white shadow sm:rounded-lg overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {[ 'Name', 'Surname', 'Class', 'Fees','Discount', 'Paid Fees', 'Actions'].map((header) => (
            <th key={header} className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {
        
        students.map((student) => (
          <tr key={student.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{student.surname}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{student.className}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{student.schoolFee}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{student.discountFee }</td>
            <td className="px-6 py-4 text-sm text-gray-500">{student.paidFee }</td>
            <td className="px-6 py-4 text-right text-sm font-medium flex">
              <button onClick={() => onView(student.id)} className="text-blue-600 hover:text-blue-900 mr-2">
                Make Payment
              </button>
              <button onClick={() => onEdit(student.id)} className="text-green-600 hover:text-green-900">
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
const Payment = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [viewingPayments, setViewingPayments] = useState(false);
  const [addingPayment, setAddingPayment] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await window.electron.ipcRenderer.invoke('get-students');
      setStudents(data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchStudents();
    console.log(students);
  }, [fetchStudents]);

  const handleView = (id) => {
    setSelectedStudentId(id);
    setAddingPayment(true);
  };

  const handleEdit = (id) => {
    setSelectedStudentId(id);
    setViewingPayments(true);
  };

  const closeModal = () => {
    setSelectedStudentId(null);
    setAddingPayment(false);
    setViewingPayments(false);
    fetchStudents(); // Refresh data after closing modal
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Payment</h1>
      <div className="max-w-6xl mx-auto">
        <EmployeeTable students={students} onView={handleView} onEdit={handleEdit} />
        {addingPayment && <AddPayment studentId={selectedStudentId} onClose={closeModal} />}
        {viewingPayments && <ViewPayments studentId={selectedStudentId} onClose={closeModal} />}
      </div>
    </div>
  );
};

export default Payment;
