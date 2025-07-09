import React from 'react'
import DashboardNavbar from './DashboardNavbar';
import { Outlet, useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const navigate = useNavigate();
  function createGroup() {
    navigate('/createGroup')
  }
  return (
    <div>
      <DashboardNavbar />
      <div className="m-12 p-8 border-2 border-black bg-white rounded-xl shadow-md">
        <button onClick={createGroup} className="text-xl font-semibold">Create a Group</button>
        <p className="text-gray-700">Content goes here.</p>
        
      </div>
    </div>
  );
}

export default Dashboard
