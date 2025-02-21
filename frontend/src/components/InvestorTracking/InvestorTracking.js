import React, { useState, useEffect } from "react";
import "./InvestorTracking.css";
import Navbar from "../Navbar/Navbar";
import { Link } from "react-router-dom";
import API from "../../API";

const InvestorTracking = () => {
  const [investments, setInvestments] = useState([]);
  const [stats, setStats] = useState({
    totalInvested: 0,
    totalReturns: 0,
    activeInvestments: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const response = await API.get("/investments/tracking");
      setInvestments(response.data.investments);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching investment tracking data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  return (
    <>
      <Navbar UserType={"investor"} />
      <div className="investor-tracking">
        <div className="tracking-title">
          <h1>Investment Tracking</h1>
        </div>
        {loading ? (
          <p className="loading-message">Loading investment data...</p>
        ) : (
          <>
            <div className="stats-card">
              <p>
                <strong>Total Invested:</strong> Rs {stats.totalInvested}
              </p>
              <p>
                <strong>Total Returns:</strong> Rs {stats.totalReturns}
              </p>
              <p>
                <strong>Active Investments:</strong> {stats.activeInvestments}
              </p>
            </div>
            <div className="investment-tracking-list">
              {investments.length > 0 ? (
                investments.map((investment) => (
                  <div key={investment._id} className="investment-card">
                    <h2>Farm: {investment.farm.name}</h2>
                    <p>
                      <strong>Amount Invested:</strong> Rs {investment.amount}
                    </p>
                    <p>
                      <strong>Interest Rate:</strong> {investment.interestRate}%
                    </p>
                    <p>
                      <strong>Start Date:</strong>{" "}
                      {new Date(investment.startDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Status:</strong> {investment.status}
                    </p>
                    <p>
                      <strong>Returns:</strong> Rs {investment.returns}
                    </p>
                  </div>
                ))
              ) : (
                <p className="no-investments">No investments found.</p>
              )}
            </div>
          </>
        )}
      </div>
      <Link to={`/issue/investor`}>
        <button className="add-issue-btn">Issue?</button>
      </Link>
    </>
  );
};

export default InvestorTracking;
