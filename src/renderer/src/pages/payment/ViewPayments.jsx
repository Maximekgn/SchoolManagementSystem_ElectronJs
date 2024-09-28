import { useCallback, useEffect, useState } from 'react';
const ViewPayments = ({ studentId, onClose }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const result = await window.electron.ipcRenderer.invoke('get-payments', studentId);
      if (result.success) {
        setPayments(result.payments);
      } else {
        setError('Failed to fetch payments.');
      }
    } catch (error) {
      setError('Error fetching payments.');
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Payment History</h2>

        <ul className="space-y-4">
          {payments.map((payment) => (
            <li key={payment.id} className="border border-gray-300 rounded-md p-4">
              <p className="font-medium">Title: {payment.title}</p>
              <p className="text-gray-500">Amount: {payment.amount_paid}</p>
              <p className="text-gray-500">Date: {new Date(payment.payment_date).toLocaleDateString()}</p>
              <p className="text-gray-500">Made by: {payment.payment_maker}</p>
            </li>
          ))}
        </ul>

        <div className="mt-4 text-right">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-gray-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPayments;