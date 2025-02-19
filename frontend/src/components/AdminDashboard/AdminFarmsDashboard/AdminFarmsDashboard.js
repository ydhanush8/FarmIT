import React, { useState, useEffect } from "react";
import Navbar from "../../Navbar/Navbar";
import API from "../../../API";
import "./AdminFarmsDashboard.css";

const AdminFarmsDashboard = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    setLoading(true);
    try {
      const response = await API.get("/admin/farms");
      setFarms(response.data);
    } catch (error) {
      console.error("Error fetching farms:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar UserType={"admin"} />
      <div className="admin-dashboard">
        <div className="dashboard-content">
          <h1>Admin Farms Dashboard</h1>
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
                    alt="Farm"
                    className="farm-image"
                  />
                  <h2>{farm.name}</h2>
                  <p>
                    <strong>Farmer:</strong> {farm.farmer.firstName}{" "}
                    {farm.farmer.lastName}
                  </p>
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
                    <strong>Status:</strong> {farm.status}
                  </p>
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

export default AdminFarmsDashboard;
