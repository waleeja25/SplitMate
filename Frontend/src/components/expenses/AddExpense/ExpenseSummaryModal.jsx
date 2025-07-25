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

    <dialog open className="modal z-50">
      <div className="modal-box bg-white rounded-2xl shadow border border-[#d9f0ea] max-w-md w-full p-6">

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          {CategoryIcon && <CategoryIcon className="w-6 h-6 text-[#2a806d]" />}
          <h2 className="text-2xl font-bold text-[#2a806d]">
            {categoryDetails?.name || 'Unknown Category'}
          </h2>
        </div>

        {/* Expense Info */}
        <div className="text-[#1c4f45] space-y-1 text-sm font-medium mb-4">
          <p>Total: <span className="text-[#333] font-medium">Rs {parseFloat(expense.amount).toFixed(2)}</span></p>
          <p>Paid By: <span className="text-[#333] font-medium">{expense.paidBy}</span></p>
          <p>Date: <span className="text-[#333] font-medium">{expense.date}</span></p>
        </div>

        {/* You Owe */}
        {youOwe.length > 0 && (
          <div className="mb-4 bg-[#fef2f2] border border-red-200 rounded-lg p-3 shadow-sm">
            <h4 className="text-red-600 font-bold mb-2 text-sm">You Owe</h4>
            <ul className="space-y-1 text-sm">
              {youOwe.map((entry, idx) => (
                <li key={idx} className="flex justify-between text-[#7f1d1d]">
                  <span>{entry.name}</span>
                  <span>Rs {parseFloat(entry.amt).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Owed to You */}
        {owedToYou.length > 0 && (
          <div className="mb-4 bg-[#f0fdf4] border border-green-200 rounded-lg p-3 shadow-sm">
            <h4 className="text-green-600 font-bold mb-2 text-sm">Owed To You</h4>
            <ul className="space-y-1 text-sm">
              {owedToYou.map((entry, idx) => (
                <li key={idx} className="flex justify-between text-[#14532d]">
                  <span>{entry.name}</span>
                  <span>Rs {parseFloat(entry.amt).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="modal-action mt-6">
          <button
            type="button"
            className="w-full bg-[#2a806d] hover:bg-[#256b5a] text-white font-semibold py-2 rounded-xl transition"
            onClick={() => {
              onClose();
              navigate('/allExpenses');
            }}
          >
            Close
          </button>
        </div>


      </div>
    </dialog>


  );
};

export default ExpenseSummaryModal;
