import React, { useState, useRef, useEffect } from 'react';
import navLogo from '../../assets/navLogo.png'
import UserAvatar from '../ui/UseAvatar';
import { useNavigate } from 'react-router-dom';

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Guest';
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

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
    navigate('/');
  };

  return (
    <nav className="flex items-center justify-between px-4 md:px-8 py-1 bg-[#f0faf6] border-[#e1f6f0] shadow-lg ">
      {/* Logo + Welcome Text */}
      <div className="flex items-center gap-4">
        <img src={navLogo} alt="SplitMate Logo" className="h-10 w-auto" />
        <p className="text-lg font-medium text-[#2A806D] tracking-wide">
           <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2A806D] via-[#36a186] to-[#2A806D] drop-shadow-sm">SplitMate</span>
        </p>
      </div>

      {/* User Avatar & Dropdown */}
      <div className="relative flex items-center gap-3" ref={dropdownRef}>
        <UserAvatar name={username} size={35} />
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="text-sm sm:text-base font-medium text-gray-700 hover:text-[#2A806D] focus:outline-none"
        >
          {username} <span className="ml-1 text-sm">▼</span>
        </button>

        {dropdownOpen && (
          <ul className="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-md z-20 transition-all duration-200">
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#f0fdfa] hover:text-[#2A806D] transition"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default DashboardNavbar;
