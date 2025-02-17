import React, { useState, useEffect } from "react";
import "./FarmerDashboard.css";
import Navbar from "../../Navbar/Navbar";
import { Link } from "react-router-dom";
import API from "../../../API";

const FarmerDashboard = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFarms = async () => {
    setLoading(true);
    try {
      const response = await API.get("/farms/my-farms");
      setFarms(response.data);
    } catch (error) {
      console.error("Error fetching farms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFarms();
  }, []);

  return (
    <>
      <Navbar isInvestor={false} />
      <div className="farmer-dashboard">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1>Farmer Dashboard</h1>
            <Link to="/addFarm">
              <button className="add-farm-btn">Add Farm Land</button>
            </Link>
          </div>

          {loading ? (
            <p className="loading-message">Loading farms...</p>
          ) : farms.length > 0 ? (
            <div className="farm-list">
              {farms.map((farm) => (
                <div key={farm._id} className="farm-card">
                  <img
                    src={`http://localhost:3001/${farm.images[0]}`}
                    alt="Farm Land"
                    className="farm-image"
                  />
                  <h2 className="farm-name">{farm.name}</h2>
                  <p className="farm-description">{farm.description}</p>
                  <p>
                    <strong>Location:</strong> {farm.location}
                  </p>
                  <p>
                    <strong>Type:</strong> {farm.farmType}
                  </p>
                  <p>
                    <strong>Size:</strong> {farm.size} acres
                  </p>
                  <p>
                    <strong>Production Capacity:</strong>{" "}
                    {farm.productionCapacity} tons
                  </p>
                  <p>
                    <strong>Status:</strong> {farm.status}
                  </p>
                  <Link to={`/loanRequest/${farm._id}`}>
                    <button className="add-loan-btn">Request Loan</button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-farms">No farms found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default FarmerDashboard;
