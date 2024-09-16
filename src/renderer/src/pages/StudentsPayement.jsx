import React, { useEffect, useState } from 'react';

const StudentsPayment = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  useEffect(() => {
    // Récupérer la liste des élèves
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:3001/students'); // API pour récupérer tous les élèves
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des élèves', error);
      }
    };

    fetchStudents();
  }, []);

  const handlePayment = async () => {
    if (!selectedStudent || !paymentAmount) {
      alert('Veuillez sélectionner un élève et entrer un montant');
      return;
    }

    // Envoyer le paiement pour l'élève sélectionné
    try {
      const response = await fetch(`http://localhost:3001/students/${selectedStudent}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount_paid: paymentAmount, payment_method: 'Cash' }),
      });
      if (response.ok) {
        alert('Paiement effectué avec succès');
        setPaymentAmount(''); // Réinitialiser le montant
      } else {
        alert('Erreur lors du paiement');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du paiement', error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Student Payment</h2>
      <select 
        className="border p-2 mt-4" 
        value={selectedStudent} 
        onChange={(e) => setSelectedStudent(e.target.value)}
      >
        <option value="">Select a Student</option>
        {students.map(student => (
          <option key={student.id} value={student.id}>
            {student.name} {student.surname}
          </option>
        ))}
      </select>

      <div className="mt-4">
        <input 
          type="number" 
          className="border p-2"
          placeholder="Enter payment amount" 
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
        />
        <button 
          className="bg-blue-500 text-white px-4 py-2 ml-4" 
          onClick={handlePayment}
        >
          Submit Payment
        </button>
      </div>
    </div>
  );
};

export default StudentsPayment;
