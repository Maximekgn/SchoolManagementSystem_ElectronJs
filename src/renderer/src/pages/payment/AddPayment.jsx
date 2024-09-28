import React, { useState } from 'react';

const AddPayment = ({ studentId, onClose }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMaker, setPaymentMaker] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error on submit

    if (!title || !amount || !paymentMaker || !paymentDate) {
      setError('All fields are required.');
      return;
    }

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
      } else {
        setError('Failed to add payment.');
      }
    } catch (error) {
      setError('Error while adding payment.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Add Payment</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Payment Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Payment Maker</label>
            <input
              type="text"
              value={paymentMaker}
              onChange={(e) => setPaymentMaker(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Payment Date</label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-gray-700">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
              Submit Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPayment;