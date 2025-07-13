import React from 'react';

const AllExpenses = () => {
  const allExpenses = JSON.parse(localStorage.getItem("expenses") || "[]");

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Expenses</h1>

      {allExpenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        allExpenses.map((expense, index) => (
          <div key={index} className="mb-4 p-4 border rounded shadow-sm bg-white">
            <h2 className="font-semibold text-lg">{expense.category}</h2>
            <p><strong>Amount:</strong> Rs {expense.amount}</p>
            <p><strong>Paid By:</strong> {expense.paidBy}</p>
            <p><strong>Date:</strong> {expense.date}</p>
            <p><strong>Split Type:</strong> {expense.splitType}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default AllExpenses;
