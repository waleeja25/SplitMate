import React, { useState, useRef, useEffect } from 'react';
import logo from '../assets/logo.png';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate= useNavigate(); 
  const username = localStorage.getItem('username') || 'Guest';
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  function stringToColor(string) {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 35,       
      height: 35,
      fontSize: 18,     
    },
    children: name[0].toUpperCase(),
  };
}


 useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/')
  };

  return (
    <div>
      <nav className="flex items-center justify-between px-6 py-2 shadow-md bg-white">
      
        <div className="flex items-center gap-4 ml-10">
          <img src={logo} alt="SplitMate Logo" className="h-12" />
          <p className="text-xl font-semibold text-gray-700">Welcome to SplitMate</p>
        </div>

        <div className="relative flex items-center gap-3 mr-12" ref={dropdownRef}>
          <Avatar {...stringAvatar(username)}
          
          />
          <button
            className="text-xl font-semibold text-gray-700 focus:outline-none"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {username} <span className="text-sm">▼</span>
          </button>

          {dropdownOpen && (
            <ul className="absolute top-full right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
