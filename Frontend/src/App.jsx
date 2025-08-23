import "./App.css";
import { RouterProvider } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRouter } from "./routes";
import ExpensesProvider from "./context/ExpensesProvider";
import { FormspreeProvider } from "@formspree/react";

function App() {
  const [friends, setFriends] = useState(() => {
    try {
      const stored = localStorage.getItem("friends");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("friends", JSON.stringify(friends));
  }, [friends]);

  const [groups, setGroups] = useState(() => {
    try {
      const storedGroups = localStorage.getItem("groups");
      return storedGroups ? JSON.parse(storedGroups) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("groups", JSON.stringify(groups));
  }, [groups]);

  const router = getRouter(friends, setFriends, groups, setGroups);
  return (
    <FormspreeProvider project="mvgqenwp">
      <ExpensesProvider>
        <RouterProvider router={router} />
      </ExpensesProvider>
    </FormspreeProvider>
  );
}

export default App;
