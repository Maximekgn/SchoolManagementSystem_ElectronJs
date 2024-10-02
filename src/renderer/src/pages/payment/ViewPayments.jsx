import { useCallback, useEffect, useState } from 'react';
import { FiX, FiCalendar, FiChevronDown, FiChevronUp, FiPercent, FiEdit, FiDollarSign } from 'react-icons/fi';

const ViewPayments = ({ studentId, onClose }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [editingPayment, setEditingPayment] = useState(null);

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

  const groupedPayments = payments.reduce((acc, payment) => {
    if (!acc[payment.title]) {
      acc[payment.title] = [];
    }
    acc[payment.title].push(payment);
    return acc;
  }, {});

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleEditPayment = (payment) => {
    setEditingPayment(payment);
  };

  const handleSaveEdit = async (editedPayment) => {
    try {
      editedPayment.amount_paid = editedPayment.amount - editedPayment.discount;
      const result = await window.electron.ipcRenderer.invoke('edit-payment', editedPayment);
      if (result.success) {
        setEditingPayment(null);
        // Update the payments state locally instead of fetching again
        setPayments(prevPayments => prevPayments.map(payment => 
          payment.id === editedPayment.id ? editedPayment : payment
        ));
      } else {
        setError('Failed to edit payment.');
      }
    } catch (error) {
      setError('Error while editing payment.');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
          <p className="text-red-500 text-center">{error}</p>
          <button onClick={onClose} className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-700">Payment History</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-indigo-700 transition-colors duration-200">
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {Object.keys(groupedPayments).length === 0 ? (
          <p className="text-center text-gray-500">No payments found.</p>
        ) : (
          <ul className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(groupedPayments).map(([category, categoryPayments]) => (
              <li key={category} className="bg-gray-50 rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300 ease-in-out">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg text-indigo-600">{category}</h3>
                  <div className="flex items-center">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium mr-2">
                      {categoryPayments.reduce((sum, payment) => sum + payment.amount_paid, 0)} FCFA
                    </span>
                    <button 
                      onClick={() => toggleCategory(category)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      {expandedCategories[category] ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                  </div>
                </div>
                {expandedCategories[category] && (
                  <ul className="mt-2 space-y-2">
                    {categoryPayments.map((payment) => (
                      <li key={payment.id} className="bg-white rounded p-2 shadow-sm">
                        {editingPayment && editingPayment.id === payment.id ? (
                          <div className="space-y-2">
                            <input
                              type="date"
                              value={editingPayment.payment_date}
                              onChange={(e) => setEditingPayment({...editingPayment, payment_date: e.target.value})}
                              className="w-full p-2 border rounded"
                            />
                            <input
                              type="number"
                              value={editingPayment.amount}
                              onChange={(e) => setEditingPayment({...editingPayment, amount: parseFloat(e.target.value)})}
                              className="w-full p-2 border rounded"
                            />
                            <input
                              type="number"
                              value={editingPayment.discount}
                              onChange={(e) => setEditingPayment({...editingPayment, discount: parseFloat(e.target.value)})}
                              className="w-full p-2 border rounded"
                            />
                            <div className="flex justify-end space-x-2">
                              <button onClick={() => handleSaveEdit(editingPayment)} className="px-4 py-2 bg-green-500 text-white rounded">Save</button>
                              <button onClick={() => setEditingPayment(null)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center">
                                <FiCalendar className="mr-2 text-gray-500" />
                                <span className="text-gray-600">Date:</span>
                              </div>
                              <span>{new Date(payment.payment_date).toLocaleDateString()}</span>
                              
                              <div className="flex items-center">
                                <FiDollarSign className="mr-2 text-gray-500" />
                                <span className="text-gray-600">Amount:</span>
                              </div>
                              <span>{payment.amount} FCFA</span>
                              
                              <div className="flex items-center">
                                <FiPercent className="mr-2 text-orange-500" />
                                <span className="text-gray-600">Discount:</span>
                              </div>
                              <span className="text-orange-500">{payment.discount || 0} FCFA</span>
                            </div>
                            <button 
                              onClick={() => handleEditPayment(payment)}
                              className="mt-2 text-indigo-600 hover:text-indigo-800 flex items-center"
                            >
                              <FiEdit className="mr-1" />
                              Edit
                            </button>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 text-right">
          <button onClick={onClose} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPayments;