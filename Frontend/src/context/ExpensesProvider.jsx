// import { useState } from "react";
// import { ExpensesContext } from "./ExpensesContext";

// export default function ExpensesProvider({ children }) {
//   const [expenses, setExpenses] = useState([]);

//   return (
//     <ExpensesContext.Provider value={{ expenses, setExpenses }}>
//       {children}
//     </ExpensesContext.Provider>
//   );
// }
// context/ExpensesProvider.js
import { useState, useEffect, useCallback } from "react";
import { ExpensesContext } from "./ExpensesContext";

export default function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("objectId");

      if (!token || !userId) return;

      const res = await fetch(`http://localhost:3001/api/expenses/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        setExpenses(data.expenses || []);
      } else {
        console.error("Failed to fetch expenses:", data.message);
      }
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return (
    <ExpensesContext.Provider value={{ expenses, setExpenses }}>
      {children}
    </ExpensesContext.Provider>
  );
}
