import React, { useState, useEffect } from "react";
import "./FarmerDashboard.css";
import Navbar from "../../Navbar/Navbar";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../../API";

const FarmerDashboard = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [farmerId, setFarmerId] = useState("");

  const getFarms = async () => {
    setLoading(true);
    try {
      const response = await API.get("/farms/my-farms");
      setFarms(response.data.farms);
      setFarmerId(response.data.farmerId);
    } catch (error) {
      console.error("Error fetching farms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFarms();
  }, []);

  const repaymentAmount = async (amount, investorId, loanId) => {
    try {
      await API.post(`/loans/${loanId}/repay`, {
        amount: amount,
        toUserId: investorId,
        fromUserId: farmerId,
      });
      toast.success("Repayment amount sent successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error submitting loan request"
      );
    }
  };

  // TODO: Display loan info in the farmers dashboard that farmer has applied for his farm
  return (
    <>
      <Navbar UserType={"farmer"} />
      <div className="farmer-dashboard">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1>Farmer Dashboard</h1>
            <Link to="/addFarm">
              <button className="add-farm-btn">Add Farm Land</button>
            </Link>
          </div>

          {loading ? (
            <p className="loading-message">
              <strong>Loading farms...</strong>
            </p>
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
                  {farm.status === "active" ? (
                    <Link to={`/loanRequest/${farm._id}`}>
                      <button className="add-loan-btn">Request Loan</button>
                    </Link>
                  ) : (
                    <Link to="">
                      <button
                        className="add-loan-btn"
                        onClick={() =>
                          repaymentAmount(
                            farm.loan.repaymentSchedule[0].amount,
                            farm.loan.investors[0].investor,
                            farm.loan._id
                          )
                        }
                      >
                        Repay amount
                      </button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-farms">No farms found.</p>
          )}
        </div>
        <Link to={`/issue/farmer`}>
          <button className="add-issue-btn">Issue?</button>
        </Link>
      </div>
    </>
  );
};

export default FarmerDashboard;
