import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaTrashAlt } from 'react-icons/fa';
import { getCategoryById, getCategoryIcon } from '../../lib/expense-categories';

const ExpenseCard = ({ expense, groupName, sessionUser }) => {
  const [expanded, setExpanded] = useState(false);
  const CategoryIcon = getCategoryIcon(expense.category);
  const categoryName = getCategoryById(expense.category).name;

  const dateObj = new Date(expense.date);
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const day = dateObj.getDate();

  const owedToYou = [];
  const youOwe = [];
  let totalOwedToYou = 0;
  let totalYouOwe = 0;

  Object.entries(expense.summary).forEach(([debtor, amount]) => {
    const amt = parseFloat(amount);
    if (expense.paidBy === sessionUser && debtor !== sessionUser) {
      totalOwedToYou += amt;
      owedToYou.push(`${debtor} owes you Rs ${amt.toFixed(2)}`);
    }
    if (debtor === sessionUser && expense.paidBy !== sessionUser) {
      totalYouOwe += amt;
      youOwe.push(`You owe ${expense.paidBy} Rs ${amt.toFixed(2)}`);
    }
  });

  const payerLabel = expense.paidBy === sessionUser ? 'You' : expense.paidBy;

  return (
    <div className="mb-5 bg-white border border-[#ccc] rounded-lg px-6 py-5 shadow hover:shadow-md transition">
      <div className="flex justify-between items-start gap-4">
        
        <div className="flex flex-col items-center text-[#2a806d] font-bold">
          <div className="text-2xl">{month}</div>
          <div className="text-2xl">{day}</div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 text-[#2a806d] font-semibold text-xl mt-2">
            <CategoryIcon className="w-7 h-7" />
            <span>{categoryName}</span>
          </div>
          <div className="text-m text-gray-500 text-m">{groupName}</div>
        </div>

        <div className="text-right min-w-[110px] text-[15px] space-y-1">
          <div className="text-[#333] font-semibold">{payerLabel} paid</div>
          <div className="font-bold text-[#111] text-xl">Rs {expense.amount}</div>

          {totalOwedToYou > 0 && (
            <div className="text-green-600 font-semibold">
              You are owed <br />
              <span className="font-bold text-lg">Rs {totalOwedToYou.toFixed(2)}</span>
            </div>
          )}

          {totalYouOwe > 0 && (
            <div className="text-red-600 font-semibold">
              You owe {expense.paidBy === sessionUser ? 'others' : expense.paidBy}
              <br />
              <span className="font-bold text-lg">Rs {totalYouOwe.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      {(owedToYou.length > 0 || youOwe.length > 0) && (
        <>
          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-base text-[#2a806d] font-medium flex items-center gap-2"
            >
              {expanded ? <FaChevronUp /> : <FaChevronDown />}
              {expanded ? 'Hide Details' : 'Show Details'}
            </button>

            <button
              onClick={() => console.log("Delete logic here")}
              className="text-red-600 hover:text-red-700"
              title="Delete"
            >
              <FaTrashAlt size={18} />
            </button>
          </div>

          {expanded && (
            <div className="mt-4 grid md:grid-cols-2 gap-6 text-[14px] font-medium">
              <div className="bg-[#f0fcf9] border border-[#2a806d] rounded-xl p-4">
                <h4 className="font-semibold text-[#1cc29f] text-lg mb-3">Owed to You</h4>
                {owedToYou.length > 0 ? (
                  <ul className="list-disc ml-6 text-[#075e54] space-y-1">
                    {owedToYou.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#666]">None</p>
                )}
              </div>

              <div className="bg-[#fff4f4] border border-[#ef4444] rounded-xl p-4">
                <h4 className="font-semibold text-[#ef4444] text-lg mb-3">You Owe</h4>
                {youOwe.length > 0 ? (
                  <ul className="list-disc ml-6 text-[#7f1d1d] space-y-2">
                    {youOwe.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#666]">None</p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExpenseCard;
