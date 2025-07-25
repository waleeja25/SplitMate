import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, ArrowLeftRight, ArrowLeft } from "lucide-react";

export default function IndividualExpensesCard() {
//   const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("expenses");

  const otherUser = {
    name: "John Doe",
    email: "john@example.com",
    imageUrl: "",
  };

  const expenses = [
    { title: "Dinner at Café", amount: 120 },
    { title: "Groceries", amount: 80 },
  ];

  const settlements = [
    { title: "Settled via cash", amount: 100 },
    { title: "Settled via bank", amount: 50 },
  ];

  const balance = -100;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <button onClick={() => navigate(-1)} className="btn btn-sm btn-outline mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              {otherUser.imageUrl ? (
                <img src={otherUser.imageUrl} alt="Avatar" />
              ) : (
                <div className="bg-neutral text-neutral-content flex items-center justify-center text-xl w-full h-full">
                  {otherUser.name?.charAt(0)}
                </div>
              )}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary">{otherUser.name}</h1>
            <p className="text-sm text-gray-500">{otherUser.email}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="btn btn-outline btn-primary">
            <ArrowLeftRight className="w-4 h-4 mr-2" />
            Settle up
          </button>
          <button className="btn btn-primary">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add expense
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="card bg-base-100 shadow border mb-6">
        <div className="card-body">
          <h2 className="card-title">Balance</h2>
          <div className="flex justify-between items-center mt-2">
            <div>
              {balance === 0 ? (
                <p>You are all settled up</p>
              ) : balance > 0 ? (
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
                balance > 0 ? "text-green-600" : balance < 0 ? "text-red-600" : ""
              }`}
            >
              ${Math.abs(balance).toFixed(2)}
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
          Expenses ({expenses.length})
        </a>
        <a
          className={`tab ${activeTab === "settlements" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("settlements")}
        >
          Settlements ({settlements.length})
        </a>
      </div>

      {/* Tab Content */}
      {activeTab === "expenses" && (
        <div className="space-y-2">
          {expenses.map((expense, idx) => (
            <div key={idx} className="card bg-base-100 shadow border">
              <div className="card-body">
                <h3 className="text-lg font-semibold">{expense.title}</h3>
                <p className="text-sm text-gray-500">Amount: ${expense.amount}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "settlements" && (
        <div className="space-y-2">
          {settlements.map((settlement, idx) => (
            <div key={idx} className="card bg-base-100 shadow border">
              <div className="card-body">
                <h3 className="text-lg font-semibold">{settlement.title}</h3>
                <p className="text-sm text-gray-500">Amount: ${settlement.amount}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
