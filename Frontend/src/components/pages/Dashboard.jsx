import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../dashboard/DashboardNavbar';
import { getMonthlyExpenses, getDatewiseExpenses, getUserBalances } from '../expenses/AddExpense/helpers';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import DashboardCards from '../dashboard/DashboardCards';

const Dashboard = () => {

  const [viewMode, setViewMode] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [barData, setBarData] = useState([]);
  const navigate = useNavigate();
  const user = localStorage.getItem('username');
  const { owes, owed } = getUserBalances(user);

  useEffect(() => {
    if (viewMode === "monthly") {
      const monthlyData = getMonthlyExpenses();
      setBarData(monthlyData.map((entry) => ({
        month: new Date(entry.month + "-01").toLocaleString("default", { month: "long" }),
        total: entry.total,
      })));
    } else if (viewMode === "datewise" && selectedMonth) {
      const datewiseData = getDatewiseExpenses(selectedMonth);
      setBarData(datewiseData.map((entry) => ({
        date: entry.date.split("-")[2],
        total: entry.total,
      })));
    }
  }, [viewMode, selectedMonth]);

  const totalYouOwe = owes.reduce((acc, entry) => acc + entry.amount, 0);
  const totalOwedToYou = owed.reduce((acc, entry) => acc + entry.amount, 0);
  const totalBalance = totalOwedToYou - totalYouOwe;

  const routes = {
    createGroup: () => navigate('/createGroup'),
    myFriends: () => navigate('/myFriends'),
    myGroups: () => navigate('/myGroups'),
    addExpense: () => navigate('/addExpense'),
    allExpenses: () => navigate('/allExpenses'),
    settleUp: () => navigate('/settleUp'),
  };

  return (
    <div className="bg-[rgb(245,252,250)] min-h-screen pb-20">
      <DashboardNavbar />

      <h1 className="text-3xl font-bold text-center text-[#2A806D] mt-10">
        Welcome, {user}
      </h1>
      
      <DashboardCards 
      totalBalance={totalBalance}  
      totalYouOwe = {totalYouOwe}  
      totalOwedToYou = {totalOwedToYou}  
      owes = {owes}  owed = {owed}/>

      <div className="mt-12 px-8">
        <div className="bg-white border border-[#d9f0ea] rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#2A806D]">
              {viewMode === 'monthly'
                ? 'Monthly Expense Summary'
                : `Date-wise Summary for ${selectedMonth}`}
            </h3>

            <div className="flex items-center gap-4">
              <div className="tabs tabs-bordered">
                <a
                  className={`tab ${viewMode === 'monthly' ? 'tab-active' : ''}`}
                  onClick={() => setViewMode('monthly')}
                >
                  Monthly
                </a>
                <a
                  className={`tab ${viewMode === 'datewise' ? 'tab-active' : ''}`}
                  onClick={() => setViewMode('datewise')}
                >
                  Date-wise
                </a>
              </div>

              {viewMode === 'datewise' && (
                <select
                  className="border p-2 rounded mb-4"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="">Select a Month</option>
                  {Array.from({ length: 12 }, (_, index) => {
                    const monthValue = `${new Date().getFullYear()}-${index + 1}`;
                    const monthLabel = new Date(`${monthValue}-01`).toLocaleString("default", { month: "long" });
                    return (
                      <option key={monthValue} value={monthValue}>
                        {monthLabel}
                      </option>
                    );
                  })}
                </select>
              )}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={viewMode === "monthly" ? "month" : "date"}
                interval={viewMode === "monthly" ? 0 : 3} // show all months or every 5th date
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#2A806D" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-8 mt-12">
        {[
          { label: 'Create a Group', action: routes.createGroup },
          { label: 'My Friends', action: routes.myFriends },
          { label: 'My Groups', action: routes.myGroups },
          { label: 'Add Expense', action: routes.addExpense },
          { label: 'All Expenses', action: routes.allExpenses },
          { label: 'Settle Up', action: routes.settleUp },
        ].map(({ label, action }) => (
          <div
            key={label}
            className="bg-white border border-[#d9f0ea] shadow-md hover:shadow-lg transition rounded-xl p-6 cursor-pointer hover:bg-[#f5fcfa]"
            onClick={action}
          >
            <h4 className="text-xl font-semibold text-[#2A806D]">{label}</h4>
            <p className="text-gray-500 mt-1">Click to view</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
