import React, { useState, useEffect, useCallback } from "react";
import {useExpenses} from '../../context/UseExpenses'
import {
  getMonthlyExpenses,
  getDatewiseExpenses,
} from "../expenses/AddExpense/helpers";
import DashboardCards from "../dashboard/DashboardCards";
import Sidebar from "../dashboard/SideBar";
import DashboardNavbar from "../dashboard/DashboardNavbar";
import ChartJSBar from "../ui/ChartJSBar";

const Dashboard = () => {
  const [viewMode, setViewMode] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [barData, setBarData] = useState([]);
  const [balances, setBalances] = useState([]);
  const { expenses } = useExpenses();
console.log(expenses)
  const user = {
    name: localStorage.getItem("username"),
    objectId: localStorage.getItem("objectId"),
    token: localStorage.getItem("token"),
  };

  const fetchBalances = useCallback(async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/balances/${user.objectId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const data = await res.json();
      if (data.success) {
        setBalances(Array.isArray(data.balances) ? data.balances : []);
      }
    } catch (err) {
      console.error("Error fetching balances:", err);
    }
  }, [user.objectId, user.token]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  useEffect(() => {
    if (viewMode === "monthly") {
      const monthlyData = getMonthlyExpenses(expenses);
      setBarData(
        monthlyData.map((entry) => ({
          month: new Date(entry.month + "-01").toLocaleString("default", {
            month: "long",
          }),
          total: entry.total,
        }))
      );
    } else if (viewMode === "datewise" && selectedMonth) {
      const datewiseData = getDatewiseExpenses(selectedMonth, expenses);
      setBarData(
        datewiseData.map((entry) => ({
          date: entry.date.split("-")[2],
          total: entry.total,
        }))
      );
    }
  }, [viewMode, selectedMonth, expenses]);

  const totalYouOwe = balances
    .filter((b) => b.amount < 0)
    .reduce((acc, entry) => acc + Math.abs(entry.amount), 0);

  const totalOwedToYou = balances
    .filter((b) => b.amount > 0)
    .reduce((acc, entry) => acc + entry.amount, 0);

  const totalBalance = totalOwedToYou - totalYouOwe;
  console.log("BarData passed to chart:", barData);


  return (
    <div className="min-h-screen flex flex-col bg-[rgb(245,252,250)]">
      <DashboardNavbar user={user} />

      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 px-4 py-4 sm:px-6 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2A806D] mb-5">
            Dashboard
          </h1>

          <DashboardCards
            totalBalance={totalBalance}
            totalYouOwe={totalYouOwe}
            totalOwedToYou={totalOwedToYou}
            owes={balances.filter((b) => b.amount < 0)}
            owed={balances.filter((b) => b.amount > 0)}
          />
          
          <div className="mt-8">
            <div className="bg-white border border-[#d9f0ea] rounded-2xl shadow-sm p-4 sm:p-6">
              <div className="flex flex-wrap sm:flex-nowrap justify-between items-center mb-4 gap-2">
                <h3 className="text-base sm:text-lg font-semibold text-[#2A806D]">
                  {viewMode === "monthly"
                    ? "Monthly Expense Summary"
                    : `Date-wise Summary for ${selectedMonth}`}
                </h3>

                <div className="flex items-center gap-4 flex-wrap justify-end">
                  <div className="tabs tabs-bordered">
                    <a
                      className={`tab min-w-[80px] text-sm ${
                        viewMode === "monthly" ? "tab-active" : ""
                      }`}
                      onClick={() => setViewMode("monthly")}
                    >
                      Monthly
                    </a>
                    <a
                      className={`tab min-w-[80px] text-sm ${
                        viewMode === "datewise" ? "tab-active" : ""
                      }`}
                      onClick={() => setViewMode("datewise")}
                    >
                      Date-wise
                    </a>
                  </div>
                  {viewMode === "datewise" && (
                    <div className="relative">
                      <select
                        className="select select-bordered text-sm min-w-[150px] sm:min-w-[180px] bg-white text-black font-medium focus:outline-none focus:ring-2 focus:ring-[#c1e7dd] focus:border-[#a3dcd0] transition-all duration-200"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                      >
                        <option disabled value="">
                          Select Month
                        </option>
                        {Array.from({ length: 12 }, (_, index) => {
                          const monthValue = `${new Date().getFullYear()}-${
                            index + 1
                          }`;
                          const monthLabel = new Date(
                            `${monthValue}-01`
                          ).toLocaleString("default", {
                            month: "long",
                          });
                          return (
                            <option key={monthValue} value={monthValue}>
                              {monthLabel}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}
                </div>

              </div>
              <ChartJSBar barData={barData} viewMode={viewMode} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
