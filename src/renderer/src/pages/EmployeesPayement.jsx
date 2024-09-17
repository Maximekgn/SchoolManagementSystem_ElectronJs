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

  // Fonction pour récupérer les paiements des employés
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

  // Charger les paiements au démarrage
  useEffect(() => {
    fetchEmployeesPayments();
  }, []);

  // Fonction de recherche
  const handleSearch = async (e) => {
    e.preventDefault();
    fetchEmployeesPayments(searchQuery);
  };

  // Fonction pour ajouter un paiement pour un employé
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
        setAmount('');
        setDescription('');
        setSelectedEmployee(null);
        setAddPaymentVisible(false);
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
  };

  return (
    <div className="max-w-4xl mx-auto p-5 font-sans">
      <h1 className="text-gray-800 mb-5 text-2xl">Employees Payment</h1>

      {/* Recherche */}
      <div className="mb-5">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            placeholder="Search for an employee"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow p-2 text-lg border border-gray-300 rounded-l-md"
          />
          <button
            type="submit"
            className="p-2 text-lg bg-green-500 text-white border border-green-500 rounded-r-md hover:bg-green-600"
          >
            Search
          </button>
        </form>
      </div>

      {/* Ajouter un paiement */}
      <div className="mb-7">
        <h2 className="text-xl text-gray-800 mb-3">Add Payment</h2>
        <button
          className="bg-blue-500 text-white p-2 text-lg rounded-md mb-3 hover:bg-blue-600"
          onClick={() => setAddPaymentVisible(!addPaymentVisible)}
        >
          {addPaymentVisible ? 'Hide Add Payment' : 'Show Add Payment'}
        </button>

        {/* Formulaire d'ajout de paiement */}
        {addPaymentVisible && (
          <div className="bg-gray-100 p-5 rounded-md">
            <select
              value={selectedEmployee ? JSON.stringify(selectedEmployee) : ''}
              onChange={(e) => setSelectedEmployee(e.target.value ? JSON.parse(e.target.value) : null)}
              className="w-full p-2 mb-3 text-lg border border-gray-300 rounded-md"
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
              className="w-full p-2 mb-3 text-lg border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Payment Type (Salary, Bonus, etc.)"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full p-2 mb-3 text-lg border border-gray-300 rounded-md"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 mb-3 text-lg border border-gray-300 rounded-md"
            />
            <div className="flex justify-between">
              <button
                onClick={handleAddPayment}
                className="bg-green-500 text-white p-2 text-lg rounded-md hover:bg-green-600"
                disabled={!selectedEmployee || amount <= 0 || !paymentType}
              >
                Add Payment
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-500 text-white p-2 text-lg rounded-md hover:bg-gray-600"
              >
                Reset Form
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Affichage des erreurs */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-5" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Liste des paiements des employés */}
      {loading ? (
        <p className="text-center p-5 italic text-gray-600">Loading payments...</p>
      ) : employeesPayments.length === 0 ? (
        <p className="text-center p-5 italic text-gray-600">No payments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 border-b border-gray-300 bg-gray-200 font-semibold">Employee Name</th>
                <th className="text-left p-3 border-b border-gray-300 bg-gray-200 font-semibold">Amount</th>
                <th className="text-left p-3 border-b border-gray-300 bg-gray-200 font-semibold">Payment Date</th>
                <th className="text-left p-3 border-b border-gray-300 bg-gray-200 font-semibold">Payment Type</th>
                <th className="text-left p-3 border-b border-gray-300 bg-gray-200 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {employeesPayments.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="p-3 border-b border-gray-300">{payment.name} {payment.surname}</td>
                  <td className="p-3 border-b border-gray-300">{payment.amount}</td>
                  <td className="p-3 border-b border-gray-300">{payment.payment_date}</td>
                  <td className="p-3 border-b border-gray-300">{payment.payment_type}</td>
                  <td className="p-3 border-b border-gray-300">{payment.description}</td>
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