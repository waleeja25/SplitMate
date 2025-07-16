import React from 'react';
import { getCategoryById, getCategoryIcon } from '../../lib/expense-categories';

const AllExpenses = () => {
  const allExpenses = JSON.parse(localStorage.getItem("expenses") || "[]");
  const sessionUser = localStorage.getItem("username");

  const groupWiseMap = {};

  allExpenses.forEach((expense) => {
    const { group, paidBy, summary = {}, category, amount, date, splitType } = expense;

    if (!groupWiseMap[group]) {
      groupWiseMap[group] = [];
    }

    groupWiseMap[group].push({
      category,
      amount,
      paidBy,
      summary,
      date,
      splitType,
    });
  });

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">All Expenses</h1>

      {Object.keys(groupWiseMap).length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        Object.entries(groupWiseMap).map(([groupName, groupExpenses], idx) => (
          <div key={idx} className="mb-10 bg-white border shadow p-6 rounded">
            <h2 className="text-xl font-bold text-cyan-800 mb-4">{groupName}</h2>

            {groupExpenses.map((expense, eIdx) => {
              const CategoryIcon = getCategoryIcon(expense.category);
              const categoryName = getCategoryById(expense.category).name;

              const owedToYou = [];
              const youOwe = [];

              Object.entries(expense.summary).forEach(([debtor, amount]) => {
                const formattedAmount = parseFloat(amount).toFixed(2);
                if (expense.paidBy === sessionUser && debtor !== sessionUser) {
                  owedToYou.push(`${debtor} owes you Rs ${formattedAmount}`);
                }
                if (debtor === sessionUser && expense.paidBy !== sessionUser) {
                  youOwe.push(`You owe ${expense.paidBy} Rs ${formattedAmount}`);
                }
              });

              return (
                <div
                  key={eIdx}
                  className="mb-6 p-4 bg-blue-50 rounded border border-blue-100"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <CategoryIcon className="w-5 h-5 text-cyan-700" />
                      {categoryName}
                    </h3>

                    <span className="text-gray-600 text-sm">{expense.date}</span>
                  </div>
                  <p><strong>Paid By:</strong> {expense.paidBy === sessionUser ? 'You' : expense.paidBy}</p>
                  <p><strong>Amount:</strong> Rs {expense.amount}</p>
                  <p><strong>Split Type:</strong> {expense.splitType}</p>

                  {(owedToYou.length > 0 || youOwe.length > 0) && (
                    <div className="mt-4">
                      {owedToYou.length > 0 && (
                        <div className="mb-2">
                          <h4 className="font-semibold text-green-700">Owed to You</h4>
                          <ul className="list-disc ml-6 text-sm">
                            {owedToYou.map((line, i) => (
                              <li key={i}>{line}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {youOwe.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-red-700">You Owe</h4>
                          <ul className="list-disc ml-6 text-sm">
                            {youOwe.map((line, i) => (
                              <li key={i}>{line}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
};

export default AllExpenses;
