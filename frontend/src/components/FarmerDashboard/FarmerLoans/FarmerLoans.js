import React, { useState, useEffect } from "react";
import Navbar from "../../Navbar/Navbar";
import API from "../../../API";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "./FarmerLoans.css";

const FarmerLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const response = await API.get("/loans/my-loans");
      setLoans(response.data);
    } catch (error) {
      console.error("Error fetching loans:", error);
      toast.error("Failed to load loans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <>
      <Navbar UserType={"farmer"} />
      <div className="farmer-loans">
        <div className="dashboard-content">
          <h1>My Loans</h1>
          {loading ? (
            <p className="loading-message">Loading loans...</p>
          ) : loans.length > 0 ? (
            <div className="loan-list">
              {loans.map((loan) => (
                <div key={loan._id} className="loan-card">
                  <h2>Farm: {loan.farm.name}</h2>
                  <p>
                    <strong>Amount:</strong> Rs {loan.amount}
                  </p>
                  <p>
                    <strong>Status:</strong> {loan.status}
                  </p>
                  <p>
                    <strong>Repayment Schedule:</strong>
                  </p>
                  <ul>
                    {loan.repaymentSchedule.map((payment, index) => (
                      <li key={index}>
                        <h3>
                          {new Date(payment.dueDate).toLocaleDateString()} - (
                          {payment.status})
                        </h3>
                        <strong>
                          {" "}
                          Rs:{" "}
                          <span className="payment-amount">
                            {payment.amount}
                          </span>
                        </strong>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-loans">No loans found.</p>
          )}
        </div>
      </div>
      <Link to={`/issue/farmer`}>
        <button className="add-issue-btn">Issue?</button>
      </Link>
    </>
  );
};

export default FarmerLoans;
