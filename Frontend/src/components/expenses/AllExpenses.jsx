import React from 'react';
import { getCategoryById, getCategoryIcon } from '../../lib/expense-categories';
import { FaUserFriends, FaMoneyBillWave, FaExchangeAlt } from 'react-icons/fa';
import ExpenseCard from './ExpenseCard';

const AllExpenses = () => {
  const allExpenses = JSON.parse(localStorage.getItem("expenses") || "[]");
  const sessionUser = localStorage.getItem("username");
  const groupWiseMap = {};
  const memberWiseMap = {};

  // allExpenses.forEach((expense) => {
  //   const { group, paidBy, summary = {}, category, amount, date, splitType, member } = expense;
  //   if (!groupWiseMap[group]) groupWiseMap[group] = [];
  //   if (!memberWiseMap[member]) memberWiseMap[member] = [];

  //   groupWiseMap[group].push({ category, amount, paidBy, summary, date, splitType });
  //   memberWiseMap[member].push({ category, amount, paidBy, summary, date, splitType });
  // });
allExpenses.forEach((expense) => {
  const { group, members, paidBy, summary = {}, category, amount, date, splitType } = expense;

  // Group expense
  if (group) {
    if (!groupWiseMap[group]) groupWiseMap[group] = [];
    groupWiseMap[group].push({ category, amount, paidBy, summary, date, splitType });
  }

  // Individual (non-group) expense
  if (!group && Array.isArray(members)) {
    members.forEach((member) => {
      const memberName = member.name;
      if (!memberWiseMap[memberName]) memberWiseMap[memberName] = [];
      memberWiseMap[memberName].push({ category, amount, paidBy, summary, date, splitType });
    });
  }
});

  console.log(groupWiseMap);
  console.log(memberWiseMap);
  return (
    <div className="p-6 max-w-4xl mx-auto bg-[rgb(245,252,250)]">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#2a806d] tracking-wide">All Expenses</h1>
        <p className="text-[#333] mt-1">Track who paid, who owes, and how it splits.</p>
        <div className="mt-2 border-b-2 border-[#2a806d] w-3/4 mx-auto" />
      </div>

      {Object.keys(groupWiseMap).length === 0 ? (
        <p className="text-center text-gray-500">No expenses found.</p>
      ) : (
        // Object.entries(groupWiseMap).map(([groupName, groupExpenses], idx) => (
        //   <div
        //     key={idx}
        //     className="mb-10 bg-white border border-[#ccc] shadow p-6 rounded-lg hover:shadow-md transition-transform hover:scale-[1.01]"
        //   >
        //     <h2 className="text-2xl font-semibold text-[#2a806d] flex items-center gap-2 mb-6">
        //       <FaUserFriends className="text-[#2a806d]" />
        //       {groupName}
        //     </h2>

        //     {groupExpenses.map((expense, eIdx) => {
        //       const CategoryIcon = getCategoryIcon(expense.category);
        //       const categoryName = getCategoryById(expense.category).name;

        //       const owedToYou = [];
        //       const youOwe = [];

        //       Object.entries(expense.summary).forEach(([debtor, amount]) => {
        //         const formattedAmount = parseFloat(amount).toFixed(2);
        //         if (expense.paidBy === sessionUser && debtor !== sessionUser) {
        //           owedToYou.push(`${debtor} owes you Rs ${formattedAmount}`);
        //         }
        //         if (debtor === sessionUser && expense.paidBy !== sessionUser) {
        //           youOwe.push(`You owe ${expense.paidBy} Rs ${formattedAmount}`);
        //         }
        //       });

        //       return (
        //         <div
        //           key={eIdx}
        //           className="mb-6 p-4 border border-[#ccc] rounded-lg hover:shadow transition-shadow duration-300"
        //         >
        //           <div className="flex justify-between items-center mb-3">
        //             <h3 className="text-lg font-semibold flex items-center gap-2 text-[#2a806d]">
        //               <CategoryIcon className="w-5 h-5 text-[#2a806d]" />
        //               {categoryName}
        //             </h3>
        //             <span className="text-sm text-[#666]">{expense.date}</span>
        //           </div>

        //           <div className="grid sm:grid-cols-3 gap-4 text-sm text-[#333]">
        //             <div className="flex items-center gap-2">
        //               <FaMoneyBillWave className="text-[#2a806d]" />
        //               <span><strong>Paid By:</strong> {expense.paidBy === sessionUser ? 'You' : expense.paidBy}</span>
        //             </div>
        //             <div className="flex items-center gap-2">
        //               <FaMoneyBillWave className="text-[#2a806d]" />
        //               <span><strong>Amount:</strong> Rs {expense.amount}</span>
        //             </div>
        //             <div className="flex items-center gap-2">
        //               <FaExchangeAlt className="text-[#2a806d]" />
        //               <span><strong>Split Type:</strong> {expense.splitType}</span>
        //             </div>
        //           </div>

        //           {(owedToYou.length > 0 || youOwe.length > 0) && (
        //             <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
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
        //         </div>
        //       );

        //     })}
        //   </div>

        // ))
       Object.entries(groupWiseMap).map(([groupName, groupExpenses], idx) => (
  <div key={idx} className="mb-10">
    {groupExpenses.map((expense, eIdx) => (
      <ExpenseCard
        key={eIdx}
        expense={expense}
        groupName={groupName}
        sessionUser={sessionUser}
      />
    ))}
  </div>
))



      )}

{Object.entries(memberWiseMap).map(([memberName, memberExpenses], idx) => (
  <div key={idx} className="mb-10">
    {memberExpenses.map((expense, eIdx) => (
      <ExpenseCard
        key={eIdx}
        expense={expense}
        groupName={memberName}
        sessionUser={sessionUser}
      />
    ))}
  </div>
))}

    </div>


  );

};

export default AllExpenses;
