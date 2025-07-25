"use client";
import React, { useState } from "react";
import { ArrowLeft, ArrowLeftRight, PlusCircle, Users } from "lucide-react";

export default function GroupExpensesCard() {
  const [activeTab, setActiveTab] = useState("expenses");

  const group = {
    name: "Trip to Murree",
    description: "Trip with university friends",
  };

  const members = ["Ali", "Sara", "Ahmed", "Waleeja"];
  const expenses = [
    { title: "Hotel", amount: 12000 },
    { title: "Food", amount: 5000 },
  ];
  const settlements = [
    { from: "Ali", to: "Sara", amount: 2000 },
    { from: "Ahmed", to: "Waleeja", amount: 1500 },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 bg-[#f5fcfa]">
      {/* Back Button */}
      <button
        className="btn btn-outline btn-sm mb-4 text-[#2a806d] border-[#2a806d]"
        onClick={() => window.history.back()}
      >
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
            <h1 className="text-3xl font-bold text-[#1c4f45]">{group.name}</h1>
            <p className="text-sm text-gray-500">{group.description}</p>
            <p className="text-sm text-gray-500 mt-1">{members.length} members</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm text-[#2a806d] border-[#2a806d]">
            <ArrowLeftRight className="w-4 h-4 mr-2" />
            Settle up
          </button>
          <button className="btn btn-sm bg-[#2a806d] text-white hover:bg-[#1c4f45]">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add expense
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-white border border-[#d9f0ea] rounded-2xl p-5 shadow">
            <h2 className="text-xl font-bold text-[#2a806d] mb-2">Group Balances</h2>
            <ul className="mt-2 space-y-1 text-sm text-[#333]">
              <li>Ali owes Sara Rs. 2000</li>
              <li>Sara owes Ahmed Rs. 1000</li>
              <li>Ahmed owes Waleeja Rs. 1500</li>
            </ul>
          </div>
        </div>

        <div>
          <div className="bg-white border border-[#d9f0ea] rounded-2xl p-5 shadow">
            <h2 className="text-xl font-bold text-[#2a806d] mb-2">Members</h2>
            <ul className="mt-2 space-y-1 text-sm text-[#333]">
              {members.map((member) => (
                <li key={member}>{member}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div role="tablist" className="tabs tabs-boxed mb-4 bg-[#e5f6f3]">
        <a
          role="tab"
          className={`tab font-medium text-[#2a806d] ${
            activeTab === "expenses" ? "tab-active bg-white" : ""
          }`}
          onClick={() => setActiveTab("expenses")}
        >
          Expenses ({expenses.length})
        </a>
        <a
          role="tab"
          className={`tab font-medium text-[#2a806d] ${
            activeTab === "settlements" ? "tab-active bg-white" : ""
          }`}
          onClick={() => setActiveTab("settlements")}
        >
          Settlements ({settlements.length})
        </a>
      </div>

      {/* Tab Content */}
      {activeTab === "expenses" && (
        <div className="space-y-3">
          {expenses.map((exp, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white border border-[#e5f6f3] shadow-sm"
            >
              <h3 className="font-semibold text-[#1c4f45]">{exp.title}</h3>
              <p className="text-sm text-gray-500">Amount: Rs. {exp.amount}</p>
            </div>
          ))}
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
