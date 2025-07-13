import React from 'react'
import DashboardNavbar from './DashboardNavbar';
import {useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const navigate = useNavigate();
  function createGroup() {
    navigate('/createGroup')
  }
  const user = localStorage.getItem('username');
  function myFriends() {
    navigate('/myFriends')
  }

  function myGroups() {
    navigate('/myGroups');
  }
  function AddExpense() {
    navigate('/addExpense');
  }
  function AllExpense() {
    navigate('/allExpenses');
  }
  return (
    <div>
      <DashboardNavbar />
      <div className="text-xl font-semibold">
        Welcome {user}
      </div>
      <div className="m-12 p-8 border-2 border-black bg-white rounded-xl shadow-md">
        <button onClick={createGroup} className="text-xl font-semibold">Create a Group</button>
        <p className="text-gray-700">Content goes here.</p>
      </div>

      <div className="m-12 p-8 border-2 border-black bg-white rounded-xl shadow-md">
        <button onClick={myFriends} className="text-xl font-semibold">My Friends</button>
        <p className="text-gray-700">Content goes here.</p>
      </div>

      <div className="m-12 p-8 border-2 border-black bg-white rounded-xl shadow-md">
        <button onClick={myGroups} className="text-xl font-semibold">My Groups</button>
        <p className="text-gray-700">Content goes here.</p>
      </div>

      <div className="m-12 p-8 border-2 border-black bg-white rounded-xl shadow-md">
        <button onClick={AddExpense} className="text-xl font-semibold">Add Expense</button>
        <p className="text-gray-700">Content goes here.</p>
      </div>

      <div className="m-12 p-8 border-2 border-black bg-white rounded-xl shadow-md">
        <button onClick={AllExpense} className="text-xl font-semibold">All Expenses</button>
        <p className="text-gray-700">Content goes here.</p>
      </div>
    </div>
  );
}

export default Dashboard
