import { useMemo } from "react";
import ExpenseCard from "./ExpenseCard";
import { useState, useEffect } from "react";
import alertDisplay from "../ui/alertDisplay";
import { BalanceUpdate } from "./AddExpense/helpers";
const backendUrl = import.meta.env.VITE_BACKEND_URI;

const AllExpenses = () => {
  const sessionUser = useMemo(() => {
    return {
      token: localStorage.getItem("token"),
      name: localStorage.getItem("username"),
      email: localStorage.getItem("email"),
      userId: localStorage.getItem("userId"),
      objectId: localStorage.getItem("objectId"),
    };
  }, []);

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const showAlert = (alertObj) => {
    setAlert(alertObj);
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  useEffect(() => {
    const fetchExpensess = async () => {
      if (!sessionUser?.token || !sessionUser?.userId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `${backendUrl}/api/expenses/${sessionUser.objectId}`,
          {
            headers: {
              Authorization: `Bearer ${sessionUser.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        if (!res.ok) {
          console.error("Backend error:", data);
          throw new Error(data.message || "Server error");
        }

        const flatExpenses = data.expenses.map((expense) => {
          const otherMembers = (expense.members || [])
            .filter((m) => String(m.userId.email) !== String(sessionUser.email))
            .map((m) => m.name);

          let groupName;
          let tooltip = "";

          if (expense.group) {
            groupName = expense.group.name;
          } else if (otherMembers.length === 1) {
            groupName = otherMembers[0];
          } else if (otherMembers.length > 1) {
            groupName = "Multiple people";
            tooltip = otherMembers.join(", ");
          } else {
            groupName = "No Group";
          }

          return { ...expense, groupName, tooltip };
        });

        setExpenses(flatExpenses);
      } catch (err) {
        console.error("Error fetching expenses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpensess();
  }, [sessionUser]);

  const handleDeleteExpense = async (expenseId) => {
    const token = localStorage.getItem("token");
    try {
      const deletedExpense = expenses.find((f) => f.expenseId === expenseId);
      if (!deletedExpense) throw new Error("Expense not found");
      console.log("Delete Expense", deletedExpense);
      const res = await fetch(
        `${backendUrl}/api/expense/${expenseId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!data.success)
        throw new Error(data.message || "Failed to delete expense");

      const negativeSummary = {};
      Object.entries(deletedExpense.summary).forEach(([user, amt]) => {
        negativeSummary[user] = -Math.abs(amt);
      });

      const payload = {
        summary:negativeSummary, 
        paidBy: deletedExpense.paidBy.name,
        amount: -Math.abs(deletedExpense.amount),
        splitType: deletedExpense.splitType,
        groupId:deletedExpense.group._id,
        type: deletedExpense.type,
      };

      await BalanceUpdate(payload, sessionUser.token);
      setExpenses((prev) => prev.filter((f) => f.expenseId !== expenseId));

      showAlert({
        type: "success",
        title: "Deleted",
        message: "Expense deleted successfully",
        color: "#a5d6a7",
      });
    } catch (err) {
      showAlert({
        type: "error",
        title: "Error",
        message: err.message,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <div className="w-16 h-16 border-4 border-t-4 border-[#2A806D] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#2A806D] text-lg font-medium">
          Loading your Expenses...
        </p>
      </div>
    );
  }
  return (
    <div className="p-6 max-w-3xl mx-auto bg-[rgb(245,252,250)] min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-5xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2A806D] via-[#36a186] to-[#2A806D] drop-shadow-sm">
          All Expenses
        </h1>
        <p className="text-[#333] mt-1 italic">
          Track who paid, who owes, and how it splits.
        </p>
        <div className="mt-2 border-b-2 border-[#2a806d] w-3/4 mx-auto" />
      </div>
      <div className="text-left w-full">{alert && alertDisplay(alert)}</div>
      {expenses.length === 0 ? (
        <p className="text-center text-gray-500">No expenses found.</p>
      ) : (
        expenses.map((expense, idx) => (
          <ExpenseCard
            key={idx}
            expense={expense}
            groupName={expense.groupName}
            sessionUser={sessionUser}
            handleDeleteExpense={handleDeleteExpense}
          />
        ))
      )}
    </div>
  );
};

export default AllExpenses;
