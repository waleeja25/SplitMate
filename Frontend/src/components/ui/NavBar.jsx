import React from 'react'
import navLogo from '../../assets/navLogo.png'
import { Link, NavLink } from 'react-router-dom';
import '../../style/NavBar.css'


const NavBar = () => {
  return (
<header className="navbar">
  <NavLink to="/" className="logo-container">
    <img src={navLogo} alt="Logo" className="logo" />
    <p className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2A806D] via-[#36a186] to-[#2A806D] drop-shadow-sm">SplitMate</p>
  </NavLink>
  <div className="nav-actions">
    <NavLink to="/login" className="text-transparent font-semibold bg-clip-text bg-gradient-to-r from-[#2A806D] via-[#36a186] to-[#2A806D] drop-shadow-sm hover:underline"
>
      Log in
    </NavLink>
    <NavLink to="/signup" className="signup-btn bg-gradient-to-r from-[#2A806D] via-[#36a186] to-[#2A806D] drop-shadow-sm">
      Sign up
    </NavLink>
  </div>
</header>

  )
}


export default NavBar
