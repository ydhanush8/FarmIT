import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ UserType }) => {
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
        {UserType === "investor" && (
          <>
            <Link to="/investorFeed" className="nav-link">
              Feed
            </Link>
            <Link to="/investorDashboard" className="nav-link">
              Dashboard
            </Link>
          </>
        )}
        {UserType === "farmer" && (
          <>
            <Link to="/farmerDashboard" className="nav-link">
              Dashboard
            </Link>
            <Link to="/farmerLoans" className="nav-link">
              Loans
            </Link>
          </>
        )}
        {UserType === "admin" && (
          <>
            <Link to="/adminUsersDashboard" className="nav-link">
              Users
            </Link>
            <Link to="/adminFarmsDashboard" className="nav-link">
              Farms
            </Link>
            <Link to="/adminLoansDashboard" className="nav-link">
              Loans
            </Link>
            <Link to="/adminIssuesDashboard" className="nav-link">
              Issues
            </Link>
          </>
        )}
      </div>
      <div className="navbar-right">
        <button className="profile-btn">
          <Link to={"/userProfile"} className="profile-link-btn">
            Profile
          </Link>
        </button>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
