import React, { useState } from 'react';
import { FiDollarSign, FiUser, FiCalendar, FiX } from 'react-icons/fi';

const AddPayment = ({ studentId, onClose }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error on submit

    if (!title || !amount ||  !paymentDate) {
      setError('All fields are required.');
      return;
    }

    const newPayment = {
      title,
      student_id: studentId,
      payment_date: paymentDate,
      amount_paid: amount,
      discount: discount,
    };

    try {
      const result = await window.electron.ipcRenderer.invoke('make-payment', newPayment);
      if (result.success) {
        onClose();
      } else {
        setError('Failed to add payment.');
      }
    } catch (error) {
      setError('Error while adding payment.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-700">Add Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-indigo-700 transition-colors duration-200">
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {error && <p className="text-red-500 mb-4 bg-red-100 p-3 rounded">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Title</label>
            <div className="relative">
              <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="pl-10 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                required
              >
                <option value="">Select a payment title</option>
                <option value="Tuition Fee">Tuition Fee</option>
                <option value="Uniform Fee">Uniform Fee</option>
                <option value="Registration Fee">Registration Fee</option>
                <option value="Exam Fee">Exam Fee</option>
                <option value="books Fee">books Fee</option>
                <option value="Transportation Fee">Transportation Fee</option>
                <option value="Other">Other</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <div className="relative">
              <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
            <div className="relative">
              <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="pl-10 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="pl-10 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPayment;