import { useContext } from "react";
import { ExpensesContext } from "./ExpensesContext";

export function useExpenses() {
  return useContext(ExpensesContext);
}
