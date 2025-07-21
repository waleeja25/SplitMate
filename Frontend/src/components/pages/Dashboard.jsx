// import React from 'react'
// import DashboardNavbar from '../dashboard/DashboardNavbar';
// import {useNavigate } from 'react-router-dom';
// const Dashboard = () => {
//   const navigate = useNavigate();
//   function createGroup() {
//     navigate('/createGroup')
//   }
//   const user = localStorage.getItem('username');
//   function myFriends() {
//     navigate('/myFriends')
//   }

//   function myGroups() {
//     navigate('/myGroups');
//   }
//   function AddExpense() {
//     navigate('/addExpense');
//   }
//   function AllExpense() {
//     navigate('/allExpenses');
//   }
//   function SettleUp() {
//     navigate('/settleUp');
//   }
//   return (
//     <div>
//       <DashboardNavbar />
//       <div className="text-xl font-semibold">
//         Welcome {user}
//       </div>
//       <div className="m-12 p-8 border-2 border-black bg-white rounded-xl shadow-md">
//         <button onClick={createGroup} className="text-xl font-semibold">Create a Group</button>
//         <p className="text-gray-700">Content goes here.</p>
//       </div>

//       <div className="m-12 p-8 border-2 border-black bg-white rounded-xl shadow-md">
//         <button onClick={myFriends} className="text-xl font-semibold">My Friends</button>
//         <p className="text-gray-700">Content goes here.</p>
//       </div>

//       <div className="m-12 p-8 border-2 border-black bg-white rounded-xl shadow-md">
//         <button onClick={myGroups} className="text-xl font-semibold">My Groups</button>
//         <p className="text-gray-700">Content goes here.</p>
//       </div>

//       <div className="m-12 p-8 border-2 border-black bg-white rounded-xl shadow-md">
//         <button onClick={AddExpense} className="text-xl font-semibold">Add Expense</button>
//         <p className="text-gray-700">Content goes here.</p>
//       </div>

//       <div className="m-12 p-8 border-2 border-black bg-white rounded-xl shadow-md">
//         <button onClick={AllExpense} className="text-xl font-semibold">All Expenses</button>
//         <p className="text-gray-700">Content goes here.</p>
//       </div>

//       <div className="m-12 p-8 border-2 border-black bg-white rounded-xl shadow-md">
//         <button onClick={SettleUp} className="text-xl font-semibold">Settle up</button>
//         <p className="text-gray-700">Content goes here.</p>
//       </div>
//     </div>
//   );
// }

// export default Dashboard

import React from 'react';
import DashboardNavbar from '../dashboard/DashboardNavbar';
import { useNavigate } from 'react-router-dom';
import SettleUp from '../dashboard/SettleUp';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem('username');

  const routes = {
    createGroup: () => navigate('/createGroup'),
    myFriends: () => navigate('/myFriends'),
    myGroups: () => navigate('/myGroups'),
    addExpense: () => navigate('/addExpense'),
    allExpenses: () => navigate('/allExpenses'),
    settleUp: () => navigate('/settleUp'),
  };

  return (
    <div className="bg-[rgb(245,252,250)] min-h-screen">
      <DashboardNavbar />
      <div className="text-2xl font-bold text-center mt-8 text-[#2A806D]">Welcome {user}</div>

      <SettleUp />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-12">
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
            className="p-6 bg-white border border-[#B2E2D2] rounded-xl shadow-md hover:shadow-lg transition"
          >
            <button
              onClick={action}
              className="text-xl font-semibold text-[#2A806D] hover:underline"
            >
              {label}
            </button>
            <p className="text-[#4B4B4B] mt-2">Content goes here.</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
