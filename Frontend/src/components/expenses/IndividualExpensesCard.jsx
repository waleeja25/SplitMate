// import { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { PlusCircle, ArrowLeftRight, ArrowLeft } from "lucide-react";
// import UserAvatar from "../ui/UseAvatar";
// import { getExpensesForMember } from "./AddExpense/helpers";
// import { getCategoryById, getCategoryIcon } from "../../lib/expense-categories";

// export default function IndividualExpensesCard({ friends = [] }) {
//   const navigate = useNavigate();
//   const { friendName } = useParams();
//   const friendExpenses = getExpensesForMember(friendName);
//   const [activeTab, setActiveTab] = useState("expenses");
//   const sessionUser = localStorage.getItem('username');

//   const owedToYou = [];
//   const youOwe = [];
//   let totalOwedToYou = 0;
//   let totalYouOwe = 0;

//   const otherUser =
//     friends.find((f) => f.name === friendName) || {
//       name: friendName || "Unknown",
//       email: "not-found@example.com",
//       imageUrl: "",
//     };
//   friendExpenses.forEach((expense) => {
//     if (!expense.summary || typeof expense.summary !== "object") return;

//     Object.entries(expense.summary).forEach(([debtor, amount]) => {
//       const amt = parseFloat(amount);
//       if (expense.paidBy === sessionUser && debtor !== sessionUser) {
//         totalOwedToYou += amt;
//         owedToYou.push(`${debtor} owes you Rs ${amt.toFixed(2)} for ${expense.category}`);
//       }
//       if (debtor === sessionUser && expense.paidBy !== sessionUser) {
//         totalYouOwe += amt;
//         youOwe.push(`You owe ${expense.paidBy} Rs ${amt.toFixed(2)} for ${expense.category}`);
//       }
//     });
//   });

//   const totalBalance = totalOwedToYou - totalYouOwe;

//   const settlements = [
//     { title: "Settled via cash", amount: 100 },
//     { title: "Settled via bank", amount: 50 },
//   ];

//   console.log(friendExpenses);

//   return (
//     <div className="max-w-4xl mx-auto py-6 px-4 min-h-screen">
//       <button onClick={() => navigate(-1)} className="btn btn-sm btn-outline mb-4">
//         <ArrowLeft className="w-4 h-4 mr-2" />
//         Back
//       </button>

//       <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
//         <div className="flex items-center gap-4">
//           <div className="avatar">
//             <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
//               <UserAvatar name={otherUser} size={70} />
//             </div>
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-primary">{otherUser.name}</h1>
//             <p className="text-sm text-gray-500">{otherUser.email}</p>
//           </div>
//         </div>

//         <div className="flex gap-2">
//           <button 
//           onClick={() => {
//             navigate('/settleUp')
//           }}
//           className="btn btn-outline btn-primary">
//             <ArrowLeftRight className="w-4 h-4 mr-2" />
//             Settle up
//           </button>
//           <button 
//           onClick={() => {
//             navigate("/addExpense")
//           }}
//           className="btn btn-primary">
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
//               {totalBalance === 0 ? (
//                 <p>You are all settled up</p>
//               ) : totalBalance > 0 ? (
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
//               className={`text-2xl font-bold ${totalBalance > 0
//                   ? "text-green-600"
//                   : totalBalance < 0
//                     ? "text-red-600"
//                     : "text-gray-500"
//                 }`}
//             >
//               {totalBalance > 0
//                 ? `+Rs ${totalBalance.toFixed(2)}`
//                 : totalBalance < 0
//                   ? `-Rs ${Math.abs(totalBalance).toFixed(2)}`
//                   : "Rs 0.00"}
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
//           Expenses ({friendExpenses.length})
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

//           {friendExpenses.map((expense, idx) => {
//             const CategoryIcon = getCategoryIcon(expense.category);
//             const categoryName = getCategoryById(expense.category).name
//             return (
//               <div key={idx} className="card bg-base-100 shadow border">
//                 <div className="card-body">

//                   <div className="flex items-center gap-2 text-[#2a806d] font-semibold text-xl mt-2">
//                     <CategoryIcon className="w-7 h-7" />
//                     <span>{categoryName}</span>
//                   </div>
//                   <p className="text-sm text-gray-500">Amount: ${expense.amount}</p>
//                 </div>
//               </div>)

//           })}

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


import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PlusCircle, ArrowLeftRight, ArrowLeft } from "lucide-react";
import UserAvatar from "../ui/UseAvatar";
import { getExpensesForMember } from "./AddExpense/helpers";
import { getCategoryById, getCategoryIcon } from "../../lib/expense-categories";

export default function IndividualExpensesCard({ friends = [] }) {
  const navigate = useNavigate();
  const { friendName } = useParams();
  const friendExpenses = getExpensesForMember(friendName);
  const [activeTab, setActiveTab] = useState("expenses");
  const sessionUser = localStorage.getItem("username");

  const owedToYou = [];
  const youOwe = [];
  let totalOwedToYou = 0;
  let totalYouOwe = 0;

  const otherUser =
    friends.find((f) => f.name === friendName) || {
      name: friendName || "Unknown",
      email: "not-found@example.com",
      imageUrl: "",
    };

  friendExpenses.forEach((expense) => {
    if (!expense.summary || typeof expense.summary !== "object") return;

    Object.entries(expense.summary).forEach(([debtor, amount]) => {
      const amt = parseFloat(amount);
      if (expense.paidBy === sessionUser && debtor !== sessionUser) {
        totalOwedToYou += amt;
        owedToYou.push(`${debtor} owes you Rs ${amt.toFixed(2)} for ${expense.category}`);
      }
      if (debtor === sessionUser && expense.paidBy !== sessionUser) {
        totalYouOwe += amt;
        youOwe.push(`You owe ${expense.paidBy} Rs ${amt.toFixed(2)} for ${expense.category}`);
      }
    });
  });

  const totalBalance = totalOwedToYou - totalYouOwe;

  const settlements = [
    { title: "Settled via cash", amount: 100 },
    { title: "Settled via bank", amount: 50 },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 min-h-screen">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="btn  btn-sm mb-8 btn-outline text-[#2A806D] hover:bg-[#2A806D] hover:text-white">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>

      {/* User Info and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <UserAvatar name={otherUser} size={70} />
            </div>
          </div>
          <div>
            <h1 className="text-4xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2A806D] via-[#36a186] to-[#2A806D] drop-shadow-sm">{otherUser.name}</h1>
            <p className="text-sm text-gray-500">{otherUser.email}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => navigate("/settleUp")} className="btn btn-outline text-[#2A806D] hover:bg-[#2A806D] hover:text-white">
            <ArrowLeftRight className="w-4 h-4 mr-2" />
            Settle up
          </button>
          <button onClick={() => navigate("/addExpense")} className="btn btn-outline bg-[#2A806D] text-white hover:bg-[#368c79]">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add expense
          </button>
        </div>
      </div>

      {/* Balance Card */}
      {/* <div className="card bg-base-100 shadow border mb-6">
        <div className="card-body">
          <h2 className="card-title">Balance</h2>
          <div className="flex justify-between items-center mt-2">
            <div>
              {totalBalance === 0 ? (
                <p className="text-gray-500">You are all settled up</p>
              ) : totalBalance > 0 ? (
                <p>
                  <span className="font-semibold">{otherUser.name}</span> owes you
                </p>
              ) : (
                <p>
                  You owe <span className="font-semibold">{otherUser.name}</span>
                </p>
              )}
            </div>
            <div
              className={`text-2xl font-bold ${
                totalBalance > 0
                  ? "text-green-600"
                  : totalBalance < 0
                  ? "text-red-600"
                  : "text-gray-500"
              }`}
            >
              {totalBalance > 0
                ? `+Rs ${totalBalance.toFixed(2)}`
                : totalBalance < 0
                ? `-Rs ${Math.abs(totalBalance).toFixed(2)}`
                : "Rs 0.00"}
            </div>
          </div>
        </div>
      </div> */}
      <div className="card bg-base-100 shadow border mb-6">
  <div className="card-body">
    <h2 className="text-3xl sm:text-2xl font-semibold">Total Balance</h2>

    <div className="grid grid-cols-2 mt-4 items-center">
      {/* Left side: sentence */}
      <div className="text-sm sm:text-base text-gray-700">
        {totalBalance === 0 ? (
          <p className="text-gray-500">You are all settled up</p>
        ) : totalBalance > 0 ? (
          <p>
            <span className="font-semibold">{otherUser.name}</span> owes you
          </p>
        ) : (
          <p>
            You owe <span className="font-semibold">{otherUser.name}</span>
          </p>
        )}
      </div>

      {/* Right side: amount */}
      <div className="text-right">
        <span
          className={`text-xl sm:text-2xl font-bold ${
            totalBalance > 0
              ? "text-green-600"
              : totalBalance < 0
              ? "text-red-600"
              : "text-gray-500"
          }`}
        >
          {totalBalance > 0
            ? `+Rs ${totalBalance.toFixed(2)}`
            : totalBalance < 0
            ? `-Rs ${Math.abs(totalBalance).toFixed(2)}`
            : "Rs 0.00"}
        </span>
      </div>
    </div>
  </div>
</div>


      {/* Tabs */}
      <div className="tabs tabs-boxed mb-4">
        <a
          className={`tab ${activeTab === "expenses" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("expenses")}
        >
          Expenses ({friendExpenses.length})
        </a>
        <a
          className={`tab ${activeTab === "settlements" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("settlements")}
        >
          Settlements ({settlements.length})
        </a>
      </div>

      {/* Expenses List */}
      {activeTab === "expenses" && (
        <div className="space-y-4">
          {friendExpenses.map((expense, idx) => {
            const CategoryIcon = getCategoryIcon(expense.category);
            const categoryName = getCategoryById(expense.category).name;

            return (
              // <div key={idx} className="card bg-white border shadow-sm hover:shadow-md transition">
              //   <div className="card-body space-y-1">
              //     <div className="flex items-center gap-2 text-[#2a806d] font-semibold text-lg">
              //       <CategoryIcon className="w-6 h-6" />
              //       <span>{categoryName}</span>
              //     </div>
              //     <p className="text-sm text-gray-600">
              //       Paid by <strong>{expense.paidBy}</strong> on{" "}
              //       <span className="italic">{expense.date}</span>
              //     </p>
              //     <p className="text-sm text-gray-800">Total: Rs {expense.amount}</p>
              //     <div className="text-xs text-gray-500 italic">
              //       {Object.entries(expense.summary).map(([name, amt]) => (
              //         <div key={name}>
              //           {name === sessionUser ? "You" : name} owe Rs {amt}
              //         </div>
              //       ))}
              //     </div>
              //   </div>
              // </div>
              <div key={idx} className="card bg-white border shadow-sm hover:shadow-md transition">
  <div className="card-body space-y-1">
    <div className="flex items-center gap-2 text-[#2a806d] font-semibold text-2xl">
      <CategoryIcon className="w-6 h-6" />
      <span>{categoryName}</span>
    </div>

    {/* Paid by and Owe summary side by side */}
    <div className="flex justify-between items-start text-sm text-gray-600">
      <p>
        Paid by <strong>{expense.paidBy}</strong> on{" "}
        <span className="italic">{expense.date}</span>
      </p>
      <div className="text-right text-gray-500 italic text-sm">
        {Object.entries(expense.summary).map(([name, amt]) => (
          <div key={name}>
            {name === sessionUser ? "You" : name} owe Rs {amt.toFixed(2)}
          </div>
        ))}
      </div>
    </div>

    <p className="text-sm text-gray-800">Total: Rs {expense.amount}</p>
  </div>
</div>

            );
          })}
        </div>
      )}

      {/* Settlements List */}
      {activeTab === "settlements" && (
        <div className="space-y-4">
          {settlements.map((settlement, idx) => (
            <div
              key={idx}
              className="card bg-white border shadow-sm hover:shadow-md transition"
            >
              <div className="card-body">
                <h3 className="text-lg font-semibold">{settlement.title}</h3>
                <p className="text-sm text-gray-600">Amount: Rs {settlement.amount}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}




// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { FaArrowLeft, FaMoneyBillWave, FaHandHoldingUsd } from "react-icons/fa";
// // Removed: import { Tabs, Tab } from "react-daisyui";

// const IndividualExpensesCard = () => {
//   const { friendName } = useParams();
//   const navigate = useNavigate();
//   const sessionUser = localStorage.getItem("username");

//   const [expenses, setExpenses] = useState([]);
//   const [balance, setBalance] = useState(0);
//   const [selectedTab, setSelectedTab] = useState("expenses");

//   useEffect(() => {
//     const allExpenses = JSON.parse(localStorage.getItem("expenses") || "[]");

//     const relevantExpenses = allExpenses.filter((expense) => {
//       const involvedUsers = [expense.paidBy, ...Object.keys(expense.summary || {})];
//       return involvedUsers.includes(sessionUser) && involvedUsers.includes(friendName);
//     });

//     let newBalance = 0;
//     const extractedExpenses = [];

//     relevantExpenses.forEach((expense) => {
//       const summary = expense.summary || {};
//       const friendAmt = parseFloat(summary[friendName]) || 0;
//       const userAmt = parseFloat(summary[sessionUser]) || 0;

//       extractedExpenses.push({
//         title: expense.title || expense.category || "Shared Expense",
//         amount:
//           expense.paidBy === sessionUser ? friendAmt : expense.paidBy === friendName ? userAmt : 0,
//         date: expense.date,
//         category: expense.category,
//         paidBy: expense.paidBy,
//         splitType: expense.splitType,
//       });

//       if (expense.paidBy === sessionUser && friendName in summary) {
//         newBalance += friendAmt;
//       } else if (expense.paidBy === friendName && sessionUser in summary) {
//         newBalance -= userAmt;
//       }
//     });

//     setExpenses(extractedExpenses);
//     setBalance(newBalance);
//   }, [friendName, sessionUser]);

//   const getBalanceText = () => {
//     if (balance > 0) {
//       return (
//         <span className="text-green-600 font-semibold">
//           {friendName} owes you ₹{balance.toFixed(2)}
//         </span>
//       );
//     } else if (balance < 0) {
//       return (
//         <span className="text-red-600 font-semibold">
//           You owe {friendName} ₹{Math.abs(balance).toFixed(2)}
//         </span>
//       );
//     } else {
//       return <span className="text-gray-600">You are all settled up</span>;
//     }
//   };

//   // Dummy settlements array for now
//   const dummySettlements = [
//     {
//       from: friendName,
//       to: sessionUser,
//       amount: "150",
//       date: "2025-07-20",
//     },
//   ];

//   return (
//     <div className="max-w-3xl mx-auto mt-6 bg-white p-6 rounded-2xl shadow-lg">
//       {/* Back button */}
//       <div className="flex items-center gap-4 mb-6">
//         <button
//           onClick={() => navigate(-1)}
//           className="text-[#2A806D] font-medium hover:underline flex items-center gap-2"
//         >
//           <FaArrowLeft />
//           Back
//         </button>
//         <h2 className="text-xl font-bold text-[#2A806D]">Expenses with {friendName}</h2>
//       </div>

//       {/* Balance summary */}
//       <div className="mb-6 text-lg">{getBalanceText()}</div>

//       {/* Tab Switch */}
//       <div className="flex gap-4 border-b border-gray-300 mb-4">
//         <button
//           onClick={() => setSelectedTab("expenses")}
//           className={`py-2 px-4 font-medium ${
//             selectedTab === "expenses"
//               ? "text-[#2A806D] border-b-2 border-[#2A806D]"
//               : "text-gray-500"
//           }`}
//         >
//           <FaMoneyBillWave className="inline mr-1" />
//           Expenses
//         </button>
//         <button
//           onClick={() => setSelectedTab("settlements")}
//           className={`py-2 px-4 font-medium ${
//             selectedTab === "settlements"
//               ? "text-[#2A806D] border-b-2 border-[#2A806D]"
//               : "text-gray-500"
//           }`}
//         >
//           <FaHandHoldingUsd className="inline mr-1" />
//           Settlements
//         </button>
//       </div>

//       {/* Expenses tab */}
//       {selectedTab === "expenses" && (
//         <div>
//           {expenses.length > 0 ? (
//             expenses.map((expense, index) => (
//               <div
//                 key={index}
//                 className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-3 shadow-sm"
//               >
//                 <div className="flex justify-between font-medium text-gray-700">
//                   <span>{expense.title}</span>
//                   <span>₹{expense.amount.toFixed(2)}</span>
//                 </div>
//                 <div className="text-sm text-gray-500 mt-1">
//                   {expense.paidBy} paid • {expense.splitType || "split"} • {expense.date}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">No expenses to show</p>
//           )}
//         </div>
//       )}

//       {/* Settlements tab with dummy data */}
//       {selectedTab === "settlements" && (
//         <div>
//           {dummySettlements.length > 0 ? (
//             dummySettlements.map((s, index) => (
//               <div
//                 key={index}
//                 className="bg-gray-100 border border-gray-300 p-4 rounded-lg mb-3"
//               >
//                 <span className="font-semibold text-gray-700">
//                   {s.from} paid ₹{s.amount} to {s.to}
//                 </span>
//                 <div className="text-sm text-gray-500">{s.date}</div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">No settlements to show</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default IndividualExpensesCard;
