import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isInvestor }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">FarmIT</div>
      </div>
      <div className="navbar-middle">
        {isInvestor && (
          <>
            <Link to="/investorFeed" className="nav-link">
              Feed
            </Link>
            <Link to="/investorDashboard" className="nav-link">
              Dashboard
            </Link>
          </>
        )}
        {!isInvestor && (
          <>
            <Link to="/farmerDashboard" className="nav-link">
              Dashboard
            </Link>
          </>
        )}
      </div>
      <div className="navbar-right">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
