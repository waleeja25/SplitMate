import React, { useState } from "react";
import navLogo from "../../assets/navLogo.png";
import { NavLink } from "react-router-dom";
import "../../style/NavBar.css";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <NavLink to="/" className="logo-container">
        <img src={navLogo} alt="Logo" className="logo" />
        <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2A806D] via-[#36a186] to-[#2A806D] drop-shadow-sm">
          SplitMate
        </p>
      </NavLink>

      <div className={`nav-actions ${menuOpen ? "active" : ""}`}>
        <NavLink
          to="/login"
          className="text-transparent font-semibold bg-clip-text bg-gradient-to-r from-[#2A806D] via-[#36a186] to-[#2A806D] drop-shadow-sm hover:underline"
          onClick={() => setMenuOpen(false)}
        >
          Log in
        </NavLink>
        <NavLink
          to="/signup"
          className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-[#2A806D] via-[#36a186] to-[#2A806D] drop-shadow-sm hover:opacity-90"
          onClick={() => setMenuOpen(false)}
        >
          Sign up
        </NavLink>
      </div>

      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
      >
        <span className={menuOpen ? "bar open" : "bar"}></span>
        <span className={menuOpen ? "bar open" : "bar"}></span>
        <span className={menuOpen ? "bar open" : "bar"}></span>
      </button>
    </header>
  );
};

export default NavBar;
