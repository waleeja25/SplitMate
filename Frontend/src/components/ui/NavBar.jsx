import React from 'react'
import navLogo from '../../assets/navLogo.png'
import { Link, NavLink } from 'react-router-dom';
import '../../style/NavBar.css'


const NavBar = () => {
  return (
<header className="navbar">
  <NavLink to="/" className="logo-container">
    <img src={navLogo} alt="Logo" className="logo" />
    <p className="brand-name ">SplitMate</p>
  </NavLink>
  <div className="nav-actions">
    <NavLink to="/login" className="login-link">
      Log in
    </NavLink>
    <NavLink to="/signup" className="signup-btn">
      Sign up
    </NavLink>
  </div>
</header>

  )
}


export default NavBar
