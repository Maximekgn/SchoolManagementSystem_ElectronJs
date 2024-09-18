import React, { useState } from 'react';
import StudentsPayment from './StudentsPayement';
import EmployeesPayment from './EmployeesPayement';

const Payment = () => {
  const [paymentType, setPaymentType] = useState(''); // Gère le type de paiement sélectionné

  const handlePaymentTypeChange = (type) => {
    setPaymentType(type);
  };

  return (
    <>
      <h1 className="font-bold text-3xl text-center">Payment Page</h1>
      <h2 className="text-center mt-4">Select One Type of Payment</h2>
      <div className="flex justify-center mt-4">
        <button 
          className="bg-blue-500 text-white px-4 py-2 mr-4"
          onClick={() => handlePaymentTypeChange('student')}
        >
          Student Payment
        </button>
        <button 
          className="bg-green-500 text-white px-4 py-2"
          onClick={() => handlePaymentTypeChange('employee')}
        >
          Employee Salary Payment
        </button>
      </div>

      <div className="mt-8">
        {paymentType === 'student' && <StudentsPayment />}
        {paymentType === 'employee' && <EmployeesPayment />}
      </div>
    </>
  );
};

export default Payment;
