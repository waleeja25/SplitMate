import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PlusCircle, ArrowLeftRight, ArrowLeft } from "lucide-react";
import UserAvatar from "../ui/UseAvatar";

import { getCategoryById, getCategoryIcon } from "../../lib/expense-categories";

export default function IndividualExpensesCard({ friends = [] }) {
  const navigate = useNavigate();
  const { friendId } = useParams();
  const [friendExpenses, setFriendExpenses] = useState([]);
  const [balance, setBalance] = useState(null);
  const [settlements, setSettlements] = useState([]);
  const [activeTab, setActiveTab] = useState("expenses");

  const sessionUser = useMemo(() => {
    return {
      name: localStorage.getItem("username"),
      email: localStorage.getItem("email"),
      userId: localStorage.getItem("userId"),
      objectId: localStorage.getItem("objectId"),
      token: localStorage.getItem("token"),
    };
  }, []);

  const otherUser = friends.find(
    (f) => String(f.friendId) === String(friendId)
  ) || {
    name: "Unknown",
    email: "not-found@example.com",
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const resExpenses = await fetch(
  //         `http://localhost:3001/api/expense/friend/${sessionUser.objectId}/${friendId}`,
  //         { headers: { Authorization: `Bearer ${sessionUser.token}` } }
  //       );
  //       const dataExpenses = await resExpenses.json();
  //       if (dataExpenses.success) setFriendExpenses(dataExpenses.expenses);

  //       const resBalance = await fetch(
  //         `http://localhost:3001/api/balances/${sessionUser.objectId}/${friendId}`,
  //         { headers: { Authorization: `Bearer ${sessionUser.token}` } }
  //       );
  //       const dataBalance = await resBalance.json();
  //       if (dataBalance.success) setBalance(dataBalance.balance);
  //     } catch (err) {
  //       console.error("Error fetching friend data:", err);
  //     }
  //   };

  //   fetchData();
  // }, [friendId, sessionUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resExpenses = await fetch(
          `http://localhost:3001/api/expense/friend/${sessionUser.objectId}/${friendId}`,
          { headers: { Authorization: `Bearer ${sessionUser.token}` } }
        );
        const dataExpenses = await resExpenses.json();
        if (dataExpenses.success) setFriendExpenses(dataExpenses.expenses);

        const resBalance = await fetch(
          `http://localhost:3001/api/balances/${sessionUser.objectId}/${friendId}`,
          { headers: { Authorization: `Bearer ${sessionUser.token}` } }
        );
        const dataBalance = await resBalance.json();
        if (dataBalance.success) setBalance(dataBalance.balance);

        const resSettlements = await fetch(
          `http://localhost:3001/api/settlement/${sessionUser.objectId}/${friendId}`,
          { headers: { Authorization: `Bearer ${sessionUser.token}` } }
        );
        const dataSettlements = await resSettlements.json();
        if (dataSettlements.success)
          setSettlements(dataSettlements.settlements);
      } catch (err) {
        console.error("Error fetching friend data:", err);
      }
    };

    fetchData();
  }, [friendId, sessionUser]);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="btn  btn-sm mb-8 btn-outline text-[#2A806D] hover:bg-[#2A806D] hover:text-white"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <UserAvatar name={otherUser.name} size={70} />
            </div>
          </div>
          <div>
            <h1 className="text-4xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2A806D] via-[#36a186] to-[#2A806D] drop-shadow-sm">
              {otherUser.name}
            </h1>
            <p className="text-sm text-gray-500">{otherUser.email}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/settleUp")}
            className="btn btn-outline text-[#2A806D] hover:bg-[#2A806D] hover:text-white"
          >
            <ArrowLeftRight className="w-4 h-4 mr-2" />
            Settle up
          </button>
          <button
            onClick={() => navigate("/addExpense")}
            className="btn btn-outline bg-[#2A806D] text-white hover:bg-[#368c79]"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add expense
          </button>
        </div>
      </div>

      <div className="card bg-base-100 shadow border mb-6">
        <div className="card-body">
          <h2 className="text-3xl sm:text-2xl font-semibold">Total Balance</h2>

          <div className="grid grid-cols-2 mt-4 items-center">
            <div className="text-sm sm:text-base text-gray-700">
              {!balance ? (
                <p className="text-gray-500">Loading balance...</p>
              ) : balance.amount === 0 ? (
                <p className="text-gray-500">You are all settled up</p>
              ) : balance.amount > 0 ? (
                <p>
                  <span className="font-semibold">{otherUser.name}</span> owes
                  you
                </p>
              ) : (
                <p>
                  You owe{" "}
                  <span className="font-semibold">{otherUser.name}</span>
                </p>
              )}
            </div>

            <div className="text-right">
              <span
                className={`text-xl sm:text-2xl font-bold ${
                  balance?.amount > 0
                    ? "text-green-600"
                    : balance?.amount < 0
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                {balance
                  ? balance.amount > 0
                    ? `+Rs ${balance.amount.toFixed(2)}`
                    : balance.amount < 0
                    ? `-Rs ${Math.abs(balance.amount).toFixed(2)}`
                    : "Rs 0.00"
                  : "--"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        role="tablist"
        className="flex space-x-2 mb-4 rounded-xl bg-[#e5f6f3] p-1"
      >
        <button
          role="tab"
          className={`flex-1 text-center font-medium text-[#2a806d] py-2 rounded-lg transition ${
            activeTab === "expenses"
              ? "bg-white shadow-md tab-active"
              : "hover:bg-[#d1eee5]"
          }`}
          onClick={() => setActiveTab("expenses")}
        >
          Expenses{" "}
          <span className="font-semibold">({friendExpenses.length})</span>
        </button>
        <button
          role="tab"
          className={`flex-1 text-center font-medium text-[#2a806d] py-2 rounded-lg transition ${
            activeTab === "settlements"
              ? "bg-white shadow-md tab-active"
              : "hover:bg-[#d1eee5]"
          }`}
          onClick={() => setActiveTab("settlements")}
        >
          Settlements{" "}
          <span className="font-semibold">({settlements.length})</span>
        </button>
      </div>

      {activeTab === "expenses" && (
        <div className="space-y-4">
          {friendExpenses.map((expense, idx) => {
            const CategoryIcon = getCategoryIcon(expense.category);
            const categoryName = getCategoryById(expense.category).name;

            return (
              <div
                key={idx}
                className="card bg-white border shadow-sm hover:shadow-md transition"
              >
                <div className="card-body space-y-2">
                  <div className="flex items-center gap-2 text-[#2a806d] font-semibold text-2xl">
                    <CategoryIcon className="w-6 h-6" />
                    <span>{categoryName}</span>
                  </div>

                  <div className="flex justify-between items-start text-sm text-gray-600">
                    <p>
                      Paid by{" "}
                      <strong>{expense.paidBy?.name || "Unknown"}</strong> on{" "}
                      <span className="italic">
                        {new Date(expense.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </p>

                    <div className="text-right text-gray-500 italic text-sm">
                      {Object.entries(expense.summary)
                        .filter(
                          ([name, amt]) =>
                            amt !== 0 &&
                            (name === sessionUser.name ||
                              name === otherUser.name)
                        )
                        .map(([name, amt]) => (
                          <div key={name}>
                            {name === sessionUser.name ? "You" : name} owe Rs{" "}
                            {amt.toFixed(2)}
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-700 border-t pt-2">
                    <p>
                      Total: <strong>Rs {expense.amount}</strong>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "settlements" && (
        <div className="space-y-4">
          {settlements.length === 0 ? (
            <p className="text-gray-500 text-center italic">
              No settlements yet
            </p>
          ) : (
            settlements.map((settlement, idx) => (
              <div
                key={idx}
                className="card bg-white border shadow-sm hover:shadow-md transition rounded-xl"
              >
                <div className="card-body space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-[#2a806d]">
                      {settlement.from.name === sessionUser.name
                        ? "You"
                        : settlement.from.name}{" "}
                      <span className="text-gray-700 font-normal">paid</span>{" "}
                      {settlement.to.name === sessionUser.name
                        ? "you"
                        : settlement.to.name}
                    </h3>
                    <span className="text-[#2a806d] font-bold text-xl">
                      Rs {settlement.amount}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="italic">
                      Mode: {settlement.paymentMode}
                    </span>
                    <span>
                      {new Date(settlement.date).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
