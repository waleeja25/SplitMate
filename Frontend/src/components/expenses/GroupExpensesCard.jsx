"use client";
import React, { useState } from "react";
import { ArrowLeft, ArrowLeftRight, PlusCircle, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getExpensesForGroup } from "./AddExpense/helpers";
import { getCategoryById, getCategoryIcon } from "../../lib/expense-categories";

export default function GroupExpensesCard({ groups = [] }) {
  const navigate = useNavigate
  const sessionUser = localStorage.getItem('username');
  const { groupName } = useParams();
  const groupExpenses = getExpensesForGroup(groupName);
  const [activeTab, setActiveTab] = useState("expenses");
  console.log(groupExpenses)
  const matchedGroup = groups.find((g) => g.name === groupName);
  const members = matchedGroup?.members || [];

  const owedToYou = [];
  const youOwe = [];
  let totalOwedToYou = 0;
  let totalYouOwe = 0;

  groupExpenses.forEach((expense) => {
    if (!expense.summary || typeof expense.summary !== "object") return;

    Object.entries(expense.summary).forEach(([debtor, amount]) => {
      const amt = parseFloat(amount);
      if (expense.paidBy === sessionUser && debtor !== sessionUser) {
        totalOwedToYou += amt;
        owedToYou.push(`${debtor} owes you Rs ${amt.toFixed(2)} `);
      }
      if (debtor === sessionUser && expense.paidBy !== sessionUser) {
        totalYouOwe += amt;
        youOwe.push(`You owe ${expense.paidBy} Rs ${amt.toFixed(2)} `);
      }
    });
  });

  const totalBalance = totalOwedToYou - totalYouOwe;
  const settlements = [
    { from: "Ali", to: "Sara", amount: 2000 },
    { from: "Ahmed", to: "Waleeja", amount: 1500 },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 min-h-screen">
      {/* Back Button */}
           <button onClick={() => window.history.back()} className="btn  btn-sm mb-8 btn-outline text-[#2A806D] hover:bg-[#2A806D] hover:text-white">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>

      {/* Group Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#2a806d] p-4 rounded-md text-white">
            <Users className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1c4f45]">{groupName}</h1>
            <p className="text-sm text-gray-500 mt-1"> {members.length} member{members.length !== 1 && "s"}</p>
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


      {/* Cards Grid */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
<div className="lg:col-span-2">
  <div className="bg-white border border-[#d9f0ea] rounded-2xl p-6 shadow-md">
    
    {/* Total Balance Section */}
    <h2 className="text-xl font-bold text-[#2a806d] mb-4">Total Balance</h2>
    <div className="text-center mb-6">
      <span
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
      </span>
    </div>

    {/* Group Balances Section */}
    <h2 className="text-xl font-bold text-[#2a806d] mb-4">Group Balances</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* You Are Owed */}
      <div className="bg-[#f0fcf9] border border-[#a7f3d0] rounded-xl p-4 shadow-sm">
        <h4 className="text-[#1cc29f] font-semibold mb-2 text-base">You are owed</h4>
        {owedToYou.length > 0 ? (
          <ul className="text-gray-700 italic text-sm list-disc ml-5 space-y-1">
            {owedToYou.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 italic text-sm">No one owes you.</p>
        )}
      </div>

      {/* You Owe */}
      <div className="bg-[#fff7f7] border border-[#fecaca] rounded-xl p-4 shadow-sm">
        <h4 className="text-[#f87171] font-semibold mb-2 text-base">You owe</h4>
        {youOwe.length > 0 ? (
          <ul className="text-gray-700 italic text-sm list-disc ml-5 space-y-1">
            {youOwe.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 italic text-sm">You owe no one.</p>
        )}
      </div>
    </div>
  </div>
</div>





       <div>
          <div className="bg-white border border-[#d9f0ea] rounded-2xl p-5 shadow">
            <h2 className="text-xl font-bold text-[#2a806d] mb-2">Group Members</h2>
            <ul className="mt-2 space-y-1 text-sm text-[#333]">
               {members.map((member) => (
              <li key={member.name}>{member.name}</li>
            ))}
            </ul>
          </div>
        </div>
      </div>  


      {/* Tabs */}
      <div role="tablist" className="tabs tabs-boxed mb-4 bg-[#e5f6f3]">
        <a
          role="tab"
          className={`tab font-medium text-[#2a806d] ${activeTab === "expenses" ? "tab-active bg-white" : ""
            }`}
          onClick={() => setActiveTab("expenses")}
        >
          Expenses ({groupExpenses.length})

        </a>
        <a
          role="tab"
          className={`tab font-medium text-[#2a806d] ${activeTab === "settlements" ? "tab-active bg-white" : ""
            }`}
          onClick={() => setActiveTab("settlements")}
        >
          Settlements ({settlements.length})
        </a>
      </div>

      {/* Tab Content */}
      {activeTab === "expenses" && (
        <div className="space-y-4">
          {groupExpenses.map((exp, idx) => {
             const CategoryIcon = getCategoryIcon(exp.category);
            const categoryName = getCategoryById(exp.category).name;
return (
            <div
              key={idx}
              className="card bg-white border shadow-sm hover:shadow-md transition">
                <div className="card-body space-y-1">
    <div className="flex items-center gap-2 text-[#2a806d] font-semibold text-2xl">
      <CategoryIcon className="w-6 h-6" />
      <span>{categoryName}</span>
    </div>

    {/* Paid by and Owe summary side by side */}
    <div className="flex justify-between items-start text-sm text-gray-600">
      <p>
        Paid by <strong>{exp.paidBy}</strong> on{" "}
        <span className="italic">{exp.date}</span>
      </p>
      <ul  className="text-right text-gray-500 italic text-sm">
  {groupExpenses.map((exp, idx) => {
    const userOwes = exp.summary[sessionUser];

    if (userOwes > 0) {
      return (
        <li key={idx}>
          You owe Rs {userOwes.toFixed(2)} 
        </li>
      );
    }

    return null;
  })}
</ul>

    </div>

    <p className="text-sm text-gray-800">Total: Rs {exp.amount}</p>
  </div>
            </div>
          );
          })}
        </div>
      )}

      {activeTab === "settlements" && (
        <div className="space-y-3">
          {settlements.map((settle, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white border border-[#e5f6f3] shadow-sm"
            >
              <p className="text-sm text-[#333]">
                {settle.from} paid {settle.to}{" "}
                <span className="font-semibold text-[#2a806d]">Rs. {settle.amount}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
