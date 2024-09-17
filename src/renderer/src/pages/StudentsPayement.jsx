import React, { useEffect, useState } from 'react';

const StudentsPayment = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudentsPayments = async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = await window.electron.ipcRenderer.invoke('get-students-payments', query);
      setStudents(data);
    } catch (err) {
      setError('Failed to fetch student payments. Please try again.');
      console.error('Error fetching student payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsPayments();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    fetchStudentsPayments(searchQuery);
  };

  const handleAddPayment = async () => {
    if (selectedStudent && amount > 0) {
      setLoading(true);
      setError(null);
      try {
        await window.electron.ipcRenderer.invoke('add-student-payment', selectedStudent.id, parseFloat(amount));
        await fetchStudentsPayments();
        setAmount('');
        setSelectedStudent(null);
      } catch (err) {
        setError('Failed to add payment. Please try again.');
        console.error('Error adding payment:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 font-sans">
      <h1 className="text-2xl font-bold mb-5">Student Payments</h1>

      <form onSubmit={handleSearch} className="mb-5">
        <div className="flex">
          <input
            type="text"
            placeholder="Search student by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-l-md"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600">
            Search
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-5" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <p className="text-center p-5 italic text-gray-600">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Surname</th>
                <th className="p-2 text-left">Total Fee</th>
                <th className="p-2 text-left">Amount Paid</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="p-2">{student.name}</td>
                  <td className="p-2">{student.surname}</td>
                  <td className="p-2">{student.total_fee}</td>
                  <td className="p-2">{student.amount_paid}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded ${
                      student.status === 'Paid' ? 'bg-green-200 text-green-800' : 
                      student.status === 'Partial' ? 'bg-yellow-200 text-yellow-800' : 
                      'bg-red-200 text-red-800'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="p-2">
                    <button 
                      onClick={() => setSelectedStudent(student)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedStudent && (
        <div className="mt-5 p-5 border border-gray-300 rounded-md">
          <h3 className="text-xl mb-3">Add Payment for {selectedStudent.name} {selectedStudent.surname}</h3>
          <div className="flex">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-l-md"
            />
            <button 
              onClick={handleAddPayment}
              className="bg-green-500 text-white p-2 rounded-r-md hover:bg-green-600"
              disabled={!amount || amount <= 0}
            >
              Add Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsPayment;