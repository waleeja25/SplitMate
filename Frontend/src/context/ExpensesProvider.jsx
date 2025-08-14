import { useState } from "react";
import { ExpensesContext } from "./ExpensesContext";

export default function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState([]);

  return (
    <ExpensesContext.Provider value={{ expenses, setExpenses }}>
      {children}
    </ExpensesContext.Provider>
  );
}
