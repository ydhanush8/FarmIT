import React, { useState, useEffect } from "react";
import Navbar from "../../Navbar/Navbar";
import API from "../../../API";
import "./AdminLoansDashboard.css";

const AdminLoansDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const response = await API.get("/admin/loans");
      setLoans(response.data);
    } catch (error) {
      console.error("Error fetching loans:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar UserType={"admin"} />
      <div className="admin-dashboard">
        <div className="dashboard-content">
          <h1>Admin Loans Dashboard</h1>
          {loading ? (
            <p className="loading-message">
              <strong>Loading loans...</strong>
            </p>
          ) : loans.length > 0 ? (
            <div className="loan-list">
              {loans.map((loan) => (
                <div key={loan._id} className="loan-card">
                  <h2>Farm: {loan.farm.name}</h2>
                  <p>
                    <strong>Amount:</strong> Rs {loan.amount}
                  </p>
                  <p>
                    <strong>Interest Rate:</strong> {loan.interestRate}%
                  </p>
                  <p>
                    <strong>Duration:</strong> {loan.duration} months
                  </p>
                  <p>
                    <strong>Status:</strong> {loan.status}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-loans">No loans found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminLoansDashboard;
