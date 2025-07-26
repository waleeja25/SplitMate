// import { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { PlusCircle, ArrowLeftRight, ArrowLeft } from "lucide-react";
// import UserAvatar from "../ui/UseAvatar";
// import { getExpensesForMember } from "./AddExpense/helpers";
// export default function IndividualExpensesCard({ friends = [] }) {
//   const { friendName } = useParams();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("expenses");
//   // console.log(friendName);
//   // console.log("Route params:", useParams());

//  const otherUser =
//     friends.find((f) => f.name === friendName) || {
//       name: friendName || "Unknown",
//       email: "not-found@example.com",
//       imageUrl: "",
//     };


//   const expenses = [
//     { title: "Dinner at Café", amount: 120 },
//     { title: "Groceries", amount: 80 },
//   ];

//   const settlements = [
//     { title: "Settled via cash", amount: 100 },
//     { title: "Settled via bank", amount: 50 },
//   ];

//   const balance = -100;
//   const friendExpenses = getExpensesForMember(friendName);
// console.log(friendExpenses);

//  return (
//     <div className="max-w-4xl mx-auto py-6 px-4">
//       <button onClick={() => navigate(-1)} className="btn btn-sm btn-outline mb-4">
//         <ArrowLeft className="w-4 h-4 mr-2" />
//         Back
//       </button>

//       <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
//         <div className="flex items-center gap-4">
//           <div className="avatar">
//             <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
//               {otherUser.imageUrl ? (
//                 <img src={otherUser.imageUrl} alt="Avatar" />
//               ) : (
//                 <div className="bg-neutral text-neutral-content flex items-center justify-center text-xl w-full h-full">
//                   {otherUser.name?.charAt(0)}
//                 </div>
//               )}
//             </div>
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-primary">{otherUser.name}</h1>
//             <p className="text-sm text-gray-500">{otherUser.email}</p>
//           </div>
//         </div>

//         <div className="flex gap-2">
//           <button className="btn btn-outline btn-primary">
//             <ArrowLeftRight className="w-4 h-4 mr-2" />
//             Settle up
//           </button>
//           <button className="btn btn-primary">
//             <PlusCircle className="w-4 h-4 mr-2" />
//             Add expense
//           </button>
//         </div>
//       </div>

//       {/* Balance Card */}
//       <div className="card bg-base-100 shadow border mb-6">
//         <div className="card-body">
//           <h2 className="card-title">Balance</h2>
//           <div className="flex justify-between items-center mt-2">
//             <div>
//               {balance === 0 ? (
//                 <p>You are all settled up</p>
//               ) : balance > 0 ? (
//                 <p>
//                   <span className="font-semibold">{otherUser.name}</span> owes you
//                 </p>
//               ) : (
//                 <p>
//                   You owe <span className="font-semibold">{otherUser.name}</span>
//                 </p>
//               )}
//             </div>
//             <div
//               className={`text-2xl font-bold ${
//                 balance > 0 ? "text-green-600" : balance < 0 ? "text-red-600" : ""
//               }`}
//             >
//               ${Math.abs(balance).toFixed(2)}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="tabs tabs-boxed mb-4">
//         <a
//           className={`tab ${activeTab === "expenses" ? "tab-active" : ""}`}
//           onClick={() => setActiveTab("expenses")}
//         >
//           Expenses ({expenses.length})
//         </a>
//         <a
//           className={`tab ${activeTab === "settlements" ? "tab-active" : ""}`}
//           onClick={() => setActiveTab("settlements")}
//         >
//           Settlements ({settlements.length})
//         </a>
//       </div>

//       {/* Tab Content */}
//       {activeTab === "expenses" && (
//         <div className="space-y-2">
//           {expenses.map((expense, idx) => (
//             <div key={idx} className="card bg-base-100 shadow border">
//               <div className="card-body">
//                 <h3 className="text-lg font-semibold">{expense.title}</h3>
//                 <p className="text-sm text-gray-500">Amount: ${expense.amount}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {activeTab === "settlements" && (
//         <div className="space-y-2">
//           {settlements.map((settlement, idx) => (
//             <div key={idx} className="card bg-base-100 shadow border">
//               <div className="card-body">
//                 <h3 className="text-lg font-semibold">{settlement.title}</h3>
//                 <p className="text-sm text-gray-500">Amount: ${settlement.amount}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaMoneyBillWave, FaHandHoldingUsd } from "react-icons/fa";
// Removed: import { Tabs, Tab } from "react-daisyui";

const IndividualExpensesCard = () => {
  const { friendName } = useParams();
  const navigate = useNavigate();
  const sessionUser = localStorage.getItem("username");

  const [expenses, setExpenses] = useState([]);
  const [balance, setBalance] = useState(0);
  const [selectedTab, setSelectedTab] = useState("expenses");

  useEffect(() => {
    const allExpenses = JSON.parse(localStorage.getItem("expenses") || "[]");

    const relevantExpenses = allExpenses.filter((expense) => {
      const involvedUsers = [expense.paidBy, ...Object.keys(expense.summary || {})];
      return involvedUsers.includes(sessionUser) && involvedUsers.includes(friendName);
    });

    let newBalance = 0;
    const extractedExpenses = [];

    relevantExpenses.forEach((expense) => {
      const summary = expense.summary || {};
      const friendAmt = parseFloat(summary[friendName]) || 0;
      const userAmt = parseFloat(summary[sessionUser]) || 0;

      extractedExpenses.push({
        title: expense.title || expense.category || "Shared Expense",
        amount:
          expense.paidBy === sessionUser ? friendAmt : expense.paidBy === friendName ? userAmt : 0,
        date: expense.date,
        category: expense.category,
        paidBy: expense.paidBy,
        splitType: expense.splitType,
      });

      if (expense.paidBy === sessionUser && friendName in summary) {
        newBalance += friendAmt;
      } else if (expense.paidBy === friendName && sessionUser in summary) {
        newBalance -= userAmt;
      }
    });

    setExpenses(extractedExpenses);
    setBalance(newBalance);
  }, [friendName, sessionUser]);

  const getBalanceText = () => {
    if (balance > 0) {
      return (
        <span className="text-green-600 font-semibold">
          {friendName} owes you ₹{balance.toFixed(2)}
        </span>
      );
    } else if (balance < 0) {
      return (
        <span className="text-red-600 font-semibold">
          You owe {friendName} ₹{Math.abs(balance).toFixed(2)}
        </span>
      );
    } else {
      return <span className="text-gray-600">You are all settled up</span>;
    }
  };

  // Dummy settlements array for now
  const dummySettlements = [
    {
      from: friendName,
      to: sessionUser,
      amount: "150",
      date: "2025-07-20",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto mt-6 bg-white p-6 rounded-2xl shadow-lg">
      {/* Back button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-[#2A806D] font-medium hover:underline flex items-center gap-2"
        >
          <FaArrowLeft />
          Back
        </button>
        <h2 className="text-xl font-bold text-[#2A806D]">Expenses with {friendName}</h2>
      </div>

      {/* Balance summary */}
      <div className="mb-6 text-lg">{getBalanceText()}</div>

      {/* Tab Switch */}
      <div className="flex gap-4 border-b border-gray-300 mb-4">
        <button
          onClick={() => setSelectedTab("expenses")}
          className={`py-2 px-4 font-medium ${
            selectedTab === "expenses"
              ? "text-[#2A806D] border-b-2 border-[#2A806D]"
              : "text-gray-500"
          }`}
        >
          <FaMoneyBillWave className="inline mr-1" />
          Expenses
        </button>
        <button
          onClick={() => setSelectedTab("settlements")}
          className={`py-2 px-4 font-medium ${
            selectedTab === "settlements"
              ? "text-[#2A806D] border-b-2 border-[#2A806D]"
              : "text-gray-500"
          }`}
        >
          <FaHandHoldingUsd className="inline mr-1" />
          Settlements
        </button>
      </div>

      {/* Expenses tab */}
      {selectedTab === "expenses" && (
        <div>
          {expenses.length > 0 ? (
            expenses.map((expense, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-3 shadow-sm"
              >
                <div className="flex justify-between font-medium text-gray-700">
                  <span>{expense.title}</span>
                  <span>₹{expense.amount.toFixed(2)}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {expense.paidBy} paid • {expense.splitType || "split"} • {expense.date}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No expenses to show</p>
          )}
        </div>
      )}

      {/* Settlements tab with dummy data */}
      {selectedTab === "settlements" && (
        <div>
          {dummySettlements.length > 0 ? (
            dummySettlements.map((s, index) => (
              <div
                key={index}
                className="bg-gray-100 border border-gray-300 p-4 rounded-lg mb-3"
              >
                <span className="font-semibold text-gray-700">
                  {s.from} paid ₹{s.amount} to {s.to}
                </span>
                <div className="text-sm text-gray-500">{s.date}</div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No settlements to show</p>
          )}
        </div>
      )}
    </div>
  );
};

export default IndividualExpensesCard;
