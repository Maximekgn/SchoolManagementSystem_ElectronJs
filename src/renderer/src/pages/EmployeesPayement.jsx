import React, { useEffect, useState } from 'react';

const EmployeesPayment = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  useEffect(() => {
    // Récupérer la liste des employés
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:3001/employees'); // API pour récupérer tous les employés
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des employés', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleSalaryPayment = async () => {
    if (!selectedEmployee || !paymentAmount) {
      alert('Veuillez sélectionner un employé et entrer un montant');
      return;
    }

    // Envoyer le paiement de salaire pour l'employé sélectionné
    try {
      const response = await fetch(`http://localhost:3001/employees/${selectedEmployee}/salaries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount_paid: paymentAmount }),
      });
      if (response.ok) {
        alert('Salaire payé avec succès');
        setPaymentAmount(''); // Réinitialiser le montant
      } else {
        alert('Erreur lors du paiement');
      }
    } catch (error) {
      console.error('Erreur lors du paiement du salaire', error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Employee Salary Payment</h2>
      <select 
        className="border p-2 mt-4" 
        value={selectedEmployee} 
        onChange={(e) => setSelectedEmployee(e.target.value)}
      >
        <option value="">Select an Employee</option>
        {employees.map(employee => (
          <option key={employee.id} value={employee.id}>
            {employee.name} {employee.surname}
          </option>
        ))}
      </select>

      <div className="mt-4">
        <input 
          type="number" 
          className="border p-2"
          placeholder="Enter salary payment amount" 
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
        />
        <button 
          className="bg-green-500 text-white px-4 py-2 ml-4" 
          onClick={handleSalaryPayment}
        >
          Submit Payment
        </button>
      </div>
    </div>
  );
};

export default EmployeesPayment;
