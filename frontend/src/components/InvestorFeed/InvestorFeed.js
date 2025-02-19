import React, { useState, useEffect } from "react";
import "./InvestorFeed.css";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import API from "../../API";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const InvestorFeed = () => {
  const [loans, setLoans] = useState([]);
  const [investorId, setInvestorId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getLoans = async () => {
    setLoading(true);
    try {
      const response = await API.get("/loans/available");
      setLoans(response.data.loans);
      setInvestorId(response.data.investorId);
    } catch (error) {
      console.error("Error fetching farms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLoans();
  }, []);

  const acceptLoanRequest = async (loanAmount, loanId, farmerId) => {
    try {
      await API.post(`/loans/${loanId}/invest`, {
        amount: loanAmount,
        toUserId: farmerId,
        fromUserId: investorId,
      });

      toast.success("Loan amount sent successfully!");
      navigate("/investorDashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error submitting loan request"
      );
    }
  };

  return (
    <>
      <Navbar UserType={"investor"} />
      <div className="investor-feed">
        <div className="dashboard-title">
          <h1>Investor Feed</h1>
        </div>

        {loading ? (
          <p className="loading-message">
            <strong>Loading loan requests...</strong>
          </p>
        ) : (
          <div className="farm-list">
            {loans.length > 0 ? (
              loans.map((loan) => (
                <div key={loan._id} className="farm-card">
                  <img
                    src={`http://localhost:3001/${loan.farm.images}`}
                    alt="Farm Land Pictures"
                    className="farm-image"
                  />
                  <h2 className="farm-name">Status: {loan.status}</h2>
                  <p>
                    <strong>Amount:</strong> {loan.amount}
                  </p>
                  <p>
                    <strong>Requested Interest Rate:</strong>{" "}
                    {loan.interestRate}
                  </p>
                  <p>
                    <strong>Duration:</strong> {loan.duration}
                  </p>
                  <Link to="">
                    <button
                      className="interested-btn"
                      onClick={() =>
                        acceptLoanRequest(
                          loan.amount,
                          loan._id,
                          loan.farm.farmer
                        )
                      }
                    >
                      Interested
                    </button>
                  </Link>
                </div>
              ))
            ) : (
              <p className="no-farms">No farms available to fund.</p>
            )}
          </div>
        )}
        <Link to={`/issue/investor`}>
          <button className="add-issue-btn">Issue?</button>
        </Link>
      </div>
    </>
  );
};

export default InvestorFeed;
