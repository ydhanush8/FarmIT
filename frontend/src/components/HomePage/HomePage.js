import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="content-container">
        <h1>FarmIT - Home page</h1>
        <h3>Hello and welcome!</h3>
        <div className="btn-div">
          <button className="home-button" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="home-button" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
