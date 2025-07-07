import React from 'react'
import logo from '../assets/logo.png'
import { Link, NavLink } from 'react-router-dom';
import '../style/NavBar.css'


const NavBar = () => {
  return (
<header className="navbar">
  <NavLink to="/" className="logo-container">
    <img src={logo} alt="Logo" className="logo" />
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
