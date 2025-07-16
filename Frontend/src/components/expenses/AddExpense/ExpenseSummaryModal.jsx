import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategoryById, getCategoryIcon } from '../../../lib/expense-categories';

const ExpenseSummaryModal = ({ expense, onClose }) => {
  const navigate = useNavigate();
  if (!expense) return null;

  const sessionUser = localStorage.getItem('username');
  const categoryDetails = getCategoryById(expense.category);
  const CategoryIcon = getCategoryIcon(expense.category);

  const owedToYou = [];
  const youOwe = [];

  Object.entries(expense.summary).forEach(([name, amt]) => {
    if (expense.paidBy === sessionUser) {
      if (name !== sessionUser) owedToYou.push({ name, amt });
    } else if (name === sessionUser) {
      youOwe.push({ name: expense.paidBy, amt });
    }
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <div className="flex items-center gap-2 mb-2">
          {CategoryIcon && <CategoryIcon className="w-6 h-6 text-cyan-700" />}
          <h2 className="text-xl font-bold">
            {categoryDetails?.name || 'Unknown Category'}
          </h2>
        </div>

        <h4 className="text-gray-700 mb-2">Total: Rs {parseFloat(expense.amount).toFixed(2)}</h4>
        <p className="mb-2">
          <strong>Paid By:</strong> {expense.paidBy}
        </p>
        <p className="mb-2">
          <strong>Date:</strong> {expense.date}
        </p>

        <div className="mb-4">
          {youOwe.length > 0 && (
            <div className="mb-2">
              <strong className="text-red-600">You owe:</strong>
              <ul className="list-disc pl-6 text-sm">
                {youOwe.map((entry, idx) => (
                  <li key={idx}>
                    {entry.name}: Rs {parseFloat(entry.amt).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {owedToYou.length > 0 && (
            <div className="mb-2">
              <strong className="text-green-600">Owed to you:</strong>
              <ul className="list-disc pl-6 text-sm">
                {owedToYou.map((entry, idx) => (
                  <li key={idx}>
                    {entry.name}: Rs {parseFloat(entry.amt).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          type='button'
          className="px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-800"
          onClick={() => {
            onClose();
            navigate('/allExpenses');
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ExpenseSummaryModal;
