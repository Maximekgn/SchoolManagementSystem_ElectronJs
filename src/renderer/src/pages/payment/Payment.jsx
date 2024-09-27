import React, { useCallback, useEffect, useState } from 'react';

// AddPayment Component// AddPayment Component
const AddPayment = ({ studentId, onClose }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMaker, setPaymentMaker] = useState('');
  const [paymentDate, setPaymentDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPayment = {
      title,
      student_id: studentId,
      payment_maker: paymentMaker,
      payment_date: paymentDate,
      amount_paid: amount,
    };

    try {
      const result = await window.electron.ipcRenderer.invoke('make-payment', newPayment);
      if (result.success) {
        onClose();
      }
    } catch (error) {
      console.error('Failed to add payment:', error);
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Payment Title" required />
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" required />
        <input type="text" value={paymentMaker} onChange={(e) => setPaymentMaker(e.target.value)} placeholder="Payment Maker" required />
        <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} required />
        <button type="submit">Submit</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

// ViewPayments Component
const ViewPayments = ({ studentId, onClose }) => {
  const [payments, setPayments] = useState([]);

  const fetchPayments = useCallback(async () => {
    try {
      const result = await window.electron.ipcRenderer.invoke('get-payments', studentId);
      if (result.success) {
        setPayments(result.payments);
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    }
  }, [studentId]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return (
    <div className="modal">
      <ul>
        {payments.map((payment) => (
          <li key={payment.id}>
            {payment.payment_date}: {payment.amount_paid} - {payment.title}
          </li>
        ))}
      </ul>
      <button onClick={onClose}>Close</button>
    </div>
  );
};
// EmployeeTable Component
const EmployeeTable = ({ students, onView, onEdit }) => (
  <div className="bg-white shadow sm:rounded-lg">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {['ID', 'Name', 'Surname', 'Class', 'Fees', 'Paid Fees', 'Actions'].map((header) => (
            <th key={header} className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {students.map(({ id, name, surname, class_name, school_fees, paid_fees }) => (
          <tr key={id} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm text-gray-500">{id}</td>
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{name}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{surname}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{class_name}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{school_fees || 'N/A'}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{paid_fees || 'N/A'}</td>
            <td className="px-6 py-4 text-right text-sm font-medium">
              <button onClick={() => onView(id)} className="text-blue-600 hover:text-blue-900 mr-2">Make Payment</button>
              <button onClick={() => onEdit(id)} className="text-green-600 hover:text-green-900">View</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Payment Component
const Payment = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [viewingPayments, setViewingPayments] = useState(false);
  const [addingPayment, setAddingPayment] = useState(false);

  const fetchStudents = useCallback(async () => {
    try {
      const data = await window.electron.ipcRenderer.invoke('get-students');
      setStudents(data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
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

  return (
    <div>
      <EmployeeTable students={students} onView={handleView} onEdit={handleEdit} />
      {addingPayment && <AddPayment studentId={selectedStudentId} onClose={closeModal} />}
      {viewingPayments && <ViewPayments studentId={selectedStudentId} onClose={closeModal} />}
    </div>
  );
};

export default Payment;