import React, { useState, useEffect } from "react";
import "./InvestorDashboard.css";
import Navbar from "../Navbar/Navbar";
import API from "../../API";

const InvestorDashboard = () => {
  const [investments, setInvestments] = useState([]);

  const getInvestments = async () => {
    try {
      const response = await API.get("/loans/my-investments");
      setInvestments(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching investments:", error);
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

          <div className="investment-list">
            {investments.length > 0 ? (
              investments.map((investment) => (
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
              ))
            ) : (
              <p className="no-investments">No investments found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestorDashboard;
