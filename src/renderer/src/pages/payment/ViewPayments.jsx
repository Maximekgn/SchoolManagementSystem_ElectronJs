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
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="text-center mt-6 text-gray-700 font-medium">Loading payments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <p className="text-red-600 text-center font-medium">{error}</p>
          <button onClick={onClose} className="mt-6 w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out font-medium">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-700">Payment History</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-indigo-700 transition-colors duration-200">
            <FiX className="h-8 w-8" />
          </button>
        </div>

        {Object.keys(groupedPayments).length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No payments found.</p>
        ) : (
          <ul className="space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto pr-4">
            {Object.entries(groupedPayments).map(([category, categoryPayments]) => (
              <li key={category} className="bg-gray-50 rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300 ease-in-out">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-xl text-indigo-700">{category}</h3>
                  <div className="flex items-center">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3">
                      {categoryPayments.reduce((sum, payment) => sum + payment.amount_paid, 0)} FCFA
                    </span>
                    <button 
                      onClick={() => toggleCategory(category)}
                      className="text-indigo-600 hover:text-indigo-800 focus:outline-none"
                    >
                      {expandedCategories[category] ? <FiChevronUp className="h-6 w-6" /> : <FiChevronDown className="h-6 w-6" />}
                    </button>
                  </div>
                </div>
                {expandedCategories[category] && (
                  <ul className="mt-4 space-y-4">
                    {categoryPayments.map((payment) => (
                      <li key={payment.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition duration-300">
                        {editingPayment && editingPayment.id === payment.id ? (
                          <div className="space-y-4">
                            <input
                              type="date"
                              value={editingPayment.payment_date}
                              onChange={(e) => setEditingPayment({...editingPayment, payment_date: e.target.value})}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <input
                              type="number"
                              value={editingPayment.amount}
                              onChange={(e) => setEditingPayment({...editingPayment, amount: parseFloat(e.target.value)})}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Amount"
                            />
                            <input
                              type="number"
                              value={editingPayment.discount}
                              onChange={(e) => setEditingPayment({...editingPayment, discount: parseFloat(e.target.value)})}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Discount"
                            />
                            <div className="flex justify-end space-x-3">
                              <button onClick={() => handleSaveEdit(editingPayment)} className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300">Save</button>
                              <button onClick={() => setEditingPayment(null)} className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center">
                                <FiCalendar className="mr-2 text-indigo-500" />
                                <span className="text-gray-700 font-medium">Date:</span>
                              </div>
                              <span className="text-gray-800">{new Date(payment.payment_date).toLocaleDateString()}</span>
                              
                              <div className="flex items-center">
                                <FiDollarSign className="mr-2 text-indigo-500" />
                                <span className="text-gray-700 font-medium">Amount:</span>
                              </div>
                              <span className="text-gray-800">{payment.amount} FCFA</span>
                              
                              <div className="flex items-center">
                                <FiPercent className="mr-2 text-orange-500" />
                                <span className="text-gray-700 font-medium">Discount:</span>
                              </div>
                              <span className="text-orange-500 font-medium">{payment.discount || 0} FCFA</span>
                            </div>
                            <button 
                              onClick={() => handleEditPayment(payment)}
                              className="mt-4 text-indigo-600 hover:text-indigo-800 flex items-center transition duration-300"
                            >
                              <FiEdit className="mr-2" />
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

        <div className="mt-8 text-right">
          <button onClick={onClose} className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPayments;