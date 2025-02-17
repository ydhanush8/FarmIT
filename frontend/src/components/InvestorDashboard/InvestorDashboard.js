import React, { useState, useEffect } from "react";
import "./InvestorDashboard.css";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import API from "../../API";

const InvestorDashboard = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(false);

  const getInvestments = async () => {
    setLoading(true);
    try {
      const response = await API.get("/loans/my-investments");
      setInvestments(response.data);
    } catch (error) {
      console.error("Error fetching investments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInvestments();
  }, []);

  return (
    <>
      <Navbar isInvestor={true} />
      <div className="investor-dashboard">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1>Investor Dashboard</h1>
          </div>

          {loading ? (
            <p className="loading-message">
              <strong>Loading investments...</strong>
            </p>
          ) : investments.length > 0 ? (
            <div className="investment-list">
              {investments.map((investment) => (
                <div key={investment._id} className="investment-card">
                  <img
                    src={`http://localhost:3001/${investment.farm.images[0]}`}
                    alt="Farm Land"
                    className="investment-image"
                  />
                  <h2 className="farm-name">{investment.farm.name}</h2>
                  <p className="farm-description">
                    {investment.farm.description}
                  </p>
                  <p>
                    <strong>Location:</strong> {investment.farm.location}
                  </p>
                  <p>
                    <strong>Investment Amount:</strong> Rs:{investment.amount}
                  </p>
                  <p>
                    <strong>Farmer:</strong> {investment.farm.farmer}
                  </p>
                  <p>
                    <strong>Status:</strong> {investment.status}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-investments">No investments found.</p>
          )}
        </div>
        <Link to={`/issue/investor`}>
          <button className="add-issue-btn">Issue?</button>
        </Link>
      </div>
    </>
  );
};

export default InvestorDashboard;
