// import React, { useState } from 'react';
// import { FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
// import { getCategoryById, getCategoryIcon } from '../../lib/expense-categories';

// const ExpenseCard = ({ expense, groupName, sessionUser }) => {
//   const [expanded, setExpanded] = useState(false);
//   const CategoryIcon = getCategoryIcon(expense.category);
//   const categoryName = getCategoryById(expense.category).name;

//   // Date parts
//   const dateObj = new Date(expense.date);
//   const month = dateObj.toLocaleString('default', { month: 'short' });
//   const day = dateObj.getDate();

//   // Summary logic
//   const owedToYou = [];
//   const youOwe = [];
//   let totalOwedToYou = 0;
//   let totalYouOwe = 0;

//   Object.entries(expense.summary).forEach(([debtor, amount]) => {
//     const amt = parseFloat(amount);
//     if (expense.paidBy === sessionUser && debtor !== sessionUser) {
//       totalOwedToYou += amt;
//       owedToYou.push(`${debtor} owes you Rs ${amt.toFixed(2)}`);
//     }
//     if (debtor === sessionUser && expense.paidBy !== sessionUser) {
//       totalYouOwe += amt;
//       youOwe.push(`You owe ${expense.paidBy} Rs ${amt.toFixed(2)}`);
//     }
//   });

//   // Label helpers
//   const payerLabel = expense.paidBy === sessionUser ? 'You' : expense.paidBy;

//   return (
//     <div className="mb-6 bg-white border border-[#ccc] rounded-lg p-4 shadow hover:shadow-md transition duration-300">
//       <div className="flex justify-between items-start gap-4">
//         {/* Date */}
//         <div className="flex flex-col items-center text-[#2a806d] font-semibold">
//           <div className="text-sm">{month}</div>
//           <div className="text-xl">{day}</div>
//         </div>

//         {/* Icon + Header */}
//         <div className="flex-1">
//           <div className="flex items-center gap-2 text-[#2a806d] font-semibold">
//             <CategoryIcon className="w-5 h-5" />
//             <span>{categoryName}</span>
//           </div>
//           <div className="text-[#333] mt-1 text-sm font-medium">{expense.description || 'Trip'}</div>
//           <div className="text-xs text-gray-500">{groupName}</div>
//         </div>

//         {/* Summary on right */}
//         <div className="text-right text-sm space-y-1 min-w-[100px]">
//           <div className="text-[#444]">{payerLabel} paid</div>
//           <div className="font-bold text-[#222]">Rs {expense.amount}</div>

//           {totalOwedToYou > 0 && (
//             <div className="text-green-600">
//               You are owed
//               <br />
//               <span className="font-bold text-sm">Rs {totalOwedToYou.toFixed(2)}</span>
//             </div>
//           )}

//           {totalYouOwe > 0 && (
//             <div className="text-red-600">
//               You owe {expense.paidBy === sessionUser ? 'others' : expense.paidBy}
//               <br />
//               <span className="font-bold text-sm">Rs {totalYouOwe.toFixed(2)}</span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Expandable Details */}
//       {(owedToYou.length > 0 || youOwe.length > 0) && (
//         <>
//           <button
//             onClick={() => setExpanded(!expanded)}
//             className="mt-3 text-sm text-[#2a806d] flex items-center gap-1"
//           >
//             {expanded ? <FaChevronUp /> : <FaChevronDown />}
//             {expanded ? 'Hide Details' : 'Show Details'}
//           </button>

//           {expanded && (
//             <div className="mt-3 grid md:grid-cols-2 gap-4 text-sm">
//               <div className="bg-[#f9fffe] border border-[#2a806d] rounded-lg p-3">
//                 <h4 className="font-semibold text-[#1cc29f] mb-2">Owed to You</h4>
//                 {owedToYou.length > 0 ? (
//                   <ul className="list-disc ml-5 text-[#075e54]">
//                     {owedToYou.map((line, i) => (
//                       <li key={i}>{line}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-[#666]">None</p>
//                 )}
//               </div>

//               <div className="bg-[#fef9f9ce] border border-[#ef4444] rounded-lg p-3">
//                 <h4 className="font-semibold text-[#ef4444] mb-2">You Owe</h4>
//                 {youOwe.length > 0 ? (
//                   <ul className="list-disc ml-5 text-[#7f1d1d]">
//                     {youOwe.map((line, i) => (
//                       <li key={i}>{line}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-[#666]">None</p>
//                 )}
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default ExpenseCard;
import React, { useState } from 'react';
import { FaTrash, FaChevronDown, FaChevronUp, FaTrashAlt } from 'react-icons/fa';
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
        {/* Date */}
        <div className="flex flex-col items-center text-[#2a806d] font-bold">
          <div className="text-2xl">{month}</div>
          <div className="text-2xl">{day}</div>
        </div>

        {/* Header Block */}
        <div className="flex-1">
          <div className="flex items-center gap-2 text-[#2a806d] font-semibold text-2xl mt-2">
            <CategoryIcon className="w-7 h-7" />
            <span>{categoryName}</span>
          </div>
          <div className="text-m text-gray-500 text-m">{groupName}</div>
        </div>

        {/* Cost Summary */}
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

      {/* Expand Details */}
      {/* {(owedToYou.length > 0 || youOwe.length > 0) && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-sm text-[#2a806d] font-medium flex items-center gap-1"
          >
            {expanded ? <FaChevronUp /> : <FaChevronDown />}
            {expanded ? 'Hide Details' : 'Show Details'}
          </button>

          {expanded && (
            <div className="mt-3 grid md:grid-cols-2 gap-4 text-[15px]">
              <div className="bg-[#f0fcf9] border border-[#2a806d] rounded-lg p-3">
                <h4 className="font-semibold text-[#1cc29f] text-base mb-2">Owed to You</h4>
                {owedToYou.length > 0 ? (
                  <ul className="list-disc ml-5 text-[#075e54] space-y-1">
                    {owedToYou.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#666]">None</p>
                )}
              </div>

              <div className="bg-[#fff4f4] border border-[#ef4444] rounded-lg p-3">
                <h4 className="font-semibold text-[#ef4444] text-base mb-2">You Owe</h4>
                {youOwe.length > 0 ? (
                  <ul className="list-disc ml-5 text-[#7f1d1d] space-y-1">
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
      )} */}
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
