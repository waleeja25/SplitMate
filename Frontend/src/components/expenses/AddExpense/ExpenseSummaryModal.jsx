import React from "react";
import {
  getCategoryById,
  getCategoryIcon,
} from "../../../lib/expense-categories";
import { useRef, useEffect } from "react";
import { useExpenses } from "../../../context/UseExpenses";
const ExpenseSummaryModal = ({ show, onClose, alert, alertDisplay }) => {
  const { expenses } = useExpenses();
  const latestExpense = expenses[expenses.length - 1];
  const currentUser = {
    name: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
  };
  const dialogRef = useRef(null);

  useEffect(() => {
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }, []);
  if (!latestExpense || !show) return null;
  const handleClose = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    onClose();
  };
  const visible = !!latestExpense;
  const categoryDetails = visible
    ? getCategoryById(latestExpense.category)
    : null;
  const CategoryIcon = visible ? getCategoryIcon(latestExpense.category) : null;

  const owedToYou = [];
  const youOwe = [];

  if (visible) {
    const paidByName =
      typeof latestExpense.paidBy === "object"
        ? latestExpense.paidBy.name
        : latestExpense.paidBy;

    Object.entries(latestExpense.summary).forEach(([memberKey, amt]) => {
      const memberName =
        typeof memberKey === "object" ? memberKey.name : memberKey;

      if (paidByName === currentUser.name) {
        if (memberName !== currentUser.name) {
          owedToYou.push({ name: memberName, amt });
        }
      } else if (memberName === currentUser.name) {
        youOwe.push({
          name: latestExpense.paidBy.name || latestExpense.paidBy,
          amt,
        });
      }
    });
  }

  return (
    <dialog ref={dialogRef} open className="modal z-50">
      <div className="modal-box bg-white rounded-2xl shadow border border-[#d9f0ea] max-w-md w-full p-6">
        <div>{alert && alertDisplay(alert)}</div>
        <div className="flex items-center gap-2 mb-4">
          {CategoryIcon && <CategoryIcon className="w-6 h-6 text-[#2a806d]" />}
          <h2 className="text-2xl font-bold text-[#2a806d]">
            {categoryDetails?.name || "Unknown Category"}
          </h2>
        </div>

        <div className="text-[#1c4f45] space-y-1 text-sm font-medium mb-4">
          <p>
            Total:{" "}
            <span className="text-[#333] font-medium">
              Rs {parseFloat(latestExpense.amount).toFixed(2)}
            </span>
          </p>
          <p>
            Paid By:{" "}
            <span className="text-[#333] font-medium">
              {latestExpense.paidBy.name}
            </span>
          </p>
          <p>
            Date:{" "}
            <span className="text-[#333] font-medium">
              {new Date(latestExpense.date).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
        </div>

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

        {owedToYou.length > 0 && (
          <div className="mb-4 bg-[#f0fdf4] border border-green-200 rounded-lg p-3 shadow-sm">
            <h4 className="text-green-600 font-bold mb-2 text-sm">
              Owed To You
            </h4>
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
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ExpenseSummaryModal;
