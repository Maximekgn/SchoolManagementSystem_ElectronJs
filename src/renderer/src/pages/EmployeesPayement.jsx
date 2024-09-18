import React, { useState, useEffect } from 'react';

const EmployeesPayment = () => {
  const [employeesPayments, setEmployeesPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState('Salary');
  const [description, setDescription] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [addPaymentVisible, setAddPaymentVisible] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const paymentTypes = ['Salary', 'Bonus', 'Reimbursement', 'Advance', 'Other'];

  const fetchEmployeesPayments = async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = await window.electron.ipcRenderer.invoke('get-payments', 'employee', query);
      setEmployeesPayments(data);
    } catch (err) {
      setError('Failed to fetch employee payments. Please try again.');
      console.error('Error fetching employee payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeesPayments();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    fetchEmployeesPayments(searchQuery);
  };

  const handleAddPayment = async () => {
    if (selectedEmployee && amount > 0 && paymentType) {
      setLoading(true);
      setError(null);
      try {
        await window.electron.ipcRenderer.invoke(
          'add-payment',
          null,
          selectedEmployee.id,
          parseFloat(amount),
          paymentType,
          description
        );
        await fetchEmployeesPayments();
        resetForm();
      } catch (err) {
        setError('Failed to add payment. Please try again.');
        console.error('Error adding payment:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setAmount('');
    setPaymentType('Salary');
    setDescription('');
    setSelectedEmployee(null);
    setAddPaymentVisible(false);
  };

  const filteredPayments = employeesPayments.filter(payment => 
    filterType === 'all' || payment.payment_type === filterType
  );

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' 
        ? new Date(a.payment_date) - new Date(b.payment_date)
        : new Date(b.payment_date) - new Date(a.payment_date);
    } else if (sortBy === 'amount') {
      return sortOrder === 'asc' 
        ? a.amount - b.amount
        : b.amount - a.amount;
    }
    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto p-5 font-sans">
      <h1 className="text-gray-800 mb-5 text-3xl font-bold">Employees Payment</h1>

      <div className="mb-5 flex space-x-4">
        <form onSubmit={handleSearch} className="flex-grow">
          <div className="flex">
            <input
              type="text"
              placeholder="Search for an employee"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow p-2 text-lg border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="p-2 text-lg bg-blue-500 text-white border border-blue-500 rounded-r-md hover:bg-blue-600 transition duration-300"
            >
              Search
            </button>
          </div>
        </form>
        <button
          className="bg-green-500 text-white p-2 text-lg rounded-md hover:bg-green-600 transition duration-300"
          onClick={() => setAddPaymentVisible(!addPaymentVisible)}
        >
          {addPaymentVisible ? 'Hide Form' : 'Add Payment'}
        </button>
      </div>

      {addPaymentVisible && (
        <div className="bg-gray-100 p-5 rounded-md mb-7 shadow-md">
          <h2 className="text-xl text-gray-800 mb-3 font-semibold">Add New Payment</h2>
          <select
            value={selectedEmployee ? JSON.stringify(selectedEmployee) : ''}
            onChange={(e) => setSelectedEmployee(e.target.value ? JSON.parse(e.target.value) : null)}
            className="w-full p-2 mb-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Employee</option>
            {employeesPayments.map((emp) => (
              <option key={emp.id} value={JSON.stringify(emp)}>
                {emp.name} {emp.surname}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 mb-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            className="w-full p-2 mb-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {paymentTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 mb-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-between">
            <button
              onClick={handleAddPayment}
              className="bg-green-500 text-white p-2 text-lg rounded-md hover:bg-green-600 transition duration-300"
              disabled={!selectedEmployee || amount <= 0 || !paymentType}
            >
              Add Payment
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-500 text-white p-2 text-lg rounded-md hover:bg-gray-600 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-5" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="mb-5 flex justify-between items-center">
        <div>
          <label className="mr-2">Filter by:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {paymentTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mr-2">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-center p-5 italic text-gray-600">Loading payments...</p>
      ) : sortedPayments.length === 0 ? (
        <p className="text-center p-5 italic text-gray-600">No payments found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="text-left p-3 font-semibold">Employee Name</th>
                <th className="text-left p-3 font-semibold">Amount</th>
                <th className="text-left p-3 font-semibold">Payment Date</th>
                <th className="text-left p-3 font-semibold">Payment Type</th>
                <th className="text-left p-3 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {sortedPayments.map((payment, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="p-3">{payment.name} {payment.surname}</td>
                  <td className="p-3">${payment.amount.toFixed(2)}</td>
                  <td className="p-3">{new Date(payment.payment_date).toLocaleDateString()}</td>
                  <td className="p-3">{payment.payment_type}</td>
                  <td className="p-3">{payment.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeesPayment;